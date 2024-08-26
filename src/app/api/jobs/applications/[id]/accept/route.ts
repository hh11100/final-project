import { z } from 'zod';

// Define a schema for the 'id' parameter
const idSchema = z.object({
  id: z.string().min(1).refine(Boolean, {
    message: "Application ID parameter is required",
  }),
});

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const { prisma } = await import('@/lib/prisma');

  try {
    // Validate the 'id' parameter using zod schema
    const idValidationResult = idSchema.safeParse(params);
    if (!idValidationResult.success) {
      const errors = idValidationResult.error.issues.map(issue => issue.message);
      return new Response(JSON.stringify({ message: errors }), { status: 400 });
    }

    const { id: applicationId } = idValidationResult.data;
    const userId = request.headers.get('x-user-id');

    // Change the status of the job application to 'accepted'
    const application = await prisma.jobApplication.update({
      where: { id: applicationId },
      data: { status: 'accepted' },
      include: { applicant: true, job: true },
    });

    // Change the status of other applications for the same job to 'closed'
    await prisma.jobApplication.updateMany({
      where: { jobId: application.jobId, id: { not: applicationId } },
      data: { status: 'closed' },
    });

    // Create a new notification for the applicant
    await prisma.notification.create({
      data: {
        user: {
          connect: { id: application.applicant.id },
        },
        message: `Your application for the job "${application.job.title}" has been accepted.`,
        type: 'job_application',
        jobApplication: {
          connect: { id: application.id },
        }
      },
    });

    return new Response(JSON.stringify({ message: "OK" }), { status: 200 });
  } catch (error) {
    console.error('Error fetching applications:', error);
    return new Response(JSON.stringify({ message: ["Something went wrong."] }), { status: 500 });
  }
}
