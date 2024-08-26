// Function for handling GET requests
export async function GET(request: Request) {
  const { prisma } = await import('@/lib/prisma');

  try {
    const userId = request.headers.get('x-user-id');
    
    const notifications = await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        jobApplication: {
          include: {
            job: true,
            applicant: {
              select: { 
                firstName: true,
                lastName: true,
                id: true,
              }
            }
          },
        }
      },
    });

    return new Response(JSON.stringify(notifications), { status: 200 });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return new Response(JSON.stringify({ message: ["Something went wrong."] }), { status: 500 });
  }
}
