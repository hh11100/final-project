import { z } from 'zod';

// Define the schema for validating the incoming POST request data
const conversationsSchema = z.object({
  participantIds: z.array(z.string()), // List of user IDs who will participate in the conversation
  jobApplicationId: z.string(), // Optional job ID to associate with the conversation
});

export async function POST(req: Request) {
  const { prisma } = await import('@/lib/prisma');

  try {
    const body = await req.json();
    const userId = req.headers.get('x-user-id');

    // Validate the incoming data against the schema
    let parsedData;
    try {
      parsedData = conversationsSchema.parse(body);
    } catch (error) {
      const errors = (error as any).errors.map((err: any) => err.message);
      return new Response(JSON.stringify({ message: errors }), { status: 400 });
    }

    const jobApplication = await prisma.jobApplication.findFirst({
      where: {
        id: parsedData.jobApplicationId
      },
      select: {
        applicant: {
          select: {
            firstName: true,
            lastName: true,
          }
        }
      }
    });


    // Ensure the job application exists and belongs to the current user
    if (parsedData.jobApplicationId && !jobApplication) {
      return new Response(JSON.stringify({ message: "Job application not found." }), { status: 404 });
    }

    const currentUser = await prisma.user.findUnique({
      where: {
        id: userId
      }
    });

    const initialMessage = `${currentUser.firstName} ${currentUser.lastName} has initiated a conversation.`;

    // Ensure the userId exists
    if (!userId) {
      return new Response(JSON.stringify({ message: "User ID is required." }), { status: 400 });
    }

    // Create a new conversation
    const newConversation = await prisma.conversation.create({
      data: {
        jobApplication: parsedData.jobApplicationId ? { connect: { id: parsedData.jobApplicationId } } : undefined,
        participants: {
          connect: [...parsedData.participantIds.map((id) => ({ id })), { id: userId }],
        },
        messages: {
          create: {
            body: initialMessage,
            sender: { connect: { id: userId } },
          },
        },
      },
    });

    // Return the newly created conversation's ID
    return new Response(JSON.stringify({ conversationId: newConversation.id }), { status: 201 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: ["Something went wrong."] }), { status: 500 });
  }
}

export async function GET(req: Request) {
  const { prisma } = await import('@/lib/prisma');
  
  try {
    const userId = req.headers.get('x-user-id');

    // Ensure the userId exists
    if (!userId) {
      return new Response(JSON.stringify({ message: "User ID is required." }), { status: 400 });
    }

    // Fetch all conversations where the current user is a participant
    const conversations = await prisma.conversation.findMany({
      where: {
        participants: {
          some: {
            id: userId,
          },
        },
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
          orderBy: {
            sentAt: 'asc', // Sort messages by sent time
          },
          include: {
            sender: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
        jobApplication: {
          select: {
            id: true,
            job: {
              select: {
                title: true,
              },
            },
            applicant: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        }
      },
    });

    // Generate titles for each conversation
    const conversationsWithTitle = conversations.map((conversation) => {
      let title = '';
      if (conversation.jobApplication) {
        title = `Job application: ${conversation.jobApplication.job.title} @ ${conversation.jobApplication.applicant.firstName} ${conversation.jobApplication.applicant.lastName}`;
      } else {
        title = conversation.participants
          .filter((participant) => participant.id !== userId)
          .map((participant) => `${participant.firstName} ${participant.lastName}`)
          .join(', ');
      }

      return {
        ...conversation,
        title,
      };
    });

    // Return the conversations with titles in the response
    return new Response(JSON.stringify(conversationsWithTitle), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: "Something went wrong." }), { status: 500 });
  }
}
