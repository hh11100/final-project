import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const userId = request.headers.get('x-user-id');

    // Ensure the userId exists
    if (!userId) {
      return new Response(JSON.stringify({ message: "User ID is required." }), { status: 400 });
    }

    // Fetch all job applications for the current user
    const applications = await prisma.jobApplication.findMany({
      where: { applicant: { id: userId } },
      orderBy: { appliedAt: 'desc' },
      include: {
        job: {
          select: {
            id: true,
            title: true,
            location: true,
            typeOfHelp: true,
          },
        }
      }
    });

    return new Response(JSON.stringify(applications), { status: 200 });
  } catch (error) {
    console.error('Error fetching applications:', error);
    return new Response(JSON.stringify({ message: ["Something went wrong."] }), { status: 500 });
  }
}
