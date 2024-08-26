import { prisma } from '@/lib/prisma';

// Function for handling GET requests
export async function GET(req: Request) {
  try {
    const userId = req.headers.get('x-user-id');
    console.log(userId)

    // Fetch the count of unread notifications for the current user
    const unreadCount = await prisma.notification.count({
      where: {
        userId: userId,
        read: false,
      },
    });

    return new Response(JSON.stringify(unreadCount), { status: 200 });
  } catch (error) {
    console.error('Error fetching notifications count:', error);
    return new Response(JSON.stringify({ message: ["Something went wrong."] }), { status: 500 });
  }
}
