import { z } from 'zod';

// Define a schema for the 'id' parameter
const schema = z.object({
  id: z.string().min(1).refine(Boolean, {
    message: "Id parameter is required"
  })
});

// Function for handling GET requests
export async function GET(request: Request,
  { params }: { params: { id: string } }
) {
  const { prisma } = await import('@/lib/prisma');

  try {
    // Validate the 'id' parameter using zod schema
    const validationResult = schema.safeParse(params);
    if (!validationResult.success) {
      const errors = validationResult.error.issues.map(issue => issue.message);
      return new Response(JSON.stringify({ message: errors }), { status: 400 });
    }

    // Proceed if validation is successful
    const { id } = validationResult.data;
    
    const conversation = await prisma.conversation.findUnique({
      where: { id },
      include: {
        messages: {
          orderBy: { sentAt: 'asc' },
          include: {
            sender: {
              select: { firstName: true, lastName: true },
            },
          },
        },
        participants: {
          select: { firstName: true, lastName: true, email: true },
        },
      },
    });

    if (!conversation) {
      return new Response(JSON.stringify({ message: ["Conversation not found."] }), { status: 404 });
    }

    return new Response(JSON.stringify(conversation), { status: 200 });
  } catch (error) {
    console.error('Error fetching conversation:', error);
    return new Response(JSON.stringify({ message: ["Something went wrong."] }), { status: 500 });
  }
}
