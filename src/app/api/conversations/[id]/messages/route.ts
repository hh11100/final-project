import { z } from 'zod';

// Define a schema for the 'id' parameter
const idSchema = z.object({
  id: z.string().min(1).refine(Boolean, {
    message: "Job ID parameter is required",
  }),
});

// Define a schema for the request body
const messageSchema = z.object({
  body: z.string().min(1, "Message body cannot be empty"),
});

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const { prisma } = await import('@/lib/prisma');

  try {
    // Validate the 'id' parameter
    const idValidationResult = idSchema.safeParse(params);
    if (!idValidationResult.success) {
      const errors = idValidationResult.error.issues.map(issue => issue.message);
      return new Response(JSON.stringify({ message: errors }), { status: 400 });
    }

    const { id } = idValidationResult.data;
    const userId = request.headers.get('x-user-id');

    // Ensure the userId exists
    if (!userId) {
      return new Response(JSON.stringify({ message: "User ID is required." }), { status: 400 });
    }

    // Validate the request body
    const body = await request.json();
    const messageValidationResult = messageSchema.safeParse(body);
    if (!messageValidationResult.success) {
      const errors = messageValidationResult.error.issues.map(issue => issue.message);
      return new Response(JSON.stringify({ message: errors }), { status: 400 });
    }

    const { body: messageBody } = messageValidationResult.data;

    // Ensure the user is a participant in the conversation
    const conversation = await prisma.conversation.findFirst({
      where: {
        id,
        participants: { some: { id: userId } },
      },
    });

    if (!conversation) {
      return new Response(JSON.stringify({ message: "Conversation not found or access denied." }), { status: 404 });
    }

    // Create a new message
    const newMessage = await prisma.message.create({
      data: {
        body: messageBody,
        sender: { connect: { id: userId } },
        conversation: { connect: { id } },
        sentAt: new Date(),
      },
      select: {
        id: true,
        body: true,
        sender: {
          select: { id: true, firstName: true, lastName: true },
        },
        sentAt: true,
      },
    });

    return new Response(JSON.stringify(newMessage), { status: 201 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: "Something went wrong." }), { status: 500 });
  }
}

// Define a schema for the query parameters
const querySchema = z.object({
  lastMessageId: z.string().optional(),
  lastTimestamp: z.string().optional(),
});

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { prisma } = await import('@/lib/prisma');
  
  try {
    // Validate the 'id' parameter using zod schema
    const idValidationResult = idSchema.safeParse(params);
    if (!idValidationResult.success) {
      const errors = idValidationResult.error.issues.map(issue => issue.message);
      return new Response(JSON.stringify({ message: errors }), { status: 400 });
    }

    const { id } = idValidationResult.data;
    const userId = request.headers.get('x-user-id');

    // Ensure the userId exists
    if (!userId) {
      return new Response(JSON.stringify({ message: "User ID is required." }), { status: 400 });
    }

    // Parse the query parameters for lastMessageId and lastTimestamp
    const url = new URL(request.url);
    const queryValidationResult = querySchema.safeParse(Object.fromEntries(url.searchParams.entries()));

    if (!queryValidationResult.success) {
      const errors = queryValidationResult.error.issues.map(issue => issue.message);
      return new Response(JSON.stringify({ message: errors }), { status: 400 });
    }

    const { lastMessageId, lastTimestamp } = queryValidationResult.data;

    // Fetch the conversation where the current user is a participant
    const conversation = await prisma.conversation.findFirst({
      where: {
        id,
        participants: { some: { id: userId } },
      },
      include: {
        participants: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          }
        },
        messages: {
          where: {
            ...(lastMessageId ? { id: { gt: lastMessageId } } : {}),
            ...(lastTimestamp ? { sentAt: { gt: new Date(lastTimestamp) } } : {}),
          },
          select: {
            id: true,
            body: true,
            sender: {
              select: { id: true, firstName: true, lastName: true },
            },
            sentAt: true,
          },
          orderBy: { sentAt: 'asc' }
        },
      },
    });

    // Check if conversation exists and user has access
    if (!conversation) {
      return new Response(JSON.stringify({ message: "Conversation not found or access denied." }), { status: 404 });
    }

    return new Response(JSON.stringify(conversation), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: "Something went wrong." }), { status: 500 });
  }
}