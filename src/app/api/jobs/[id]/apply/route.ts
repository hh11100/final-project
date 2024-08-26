import { z } from 'zod';

// Define a schema for the request body
const applicationSchema = z.object({
  coverLetter: z.string().optional(),
});

// Define a schema for the 'id' parameter
const idSchema = z.object({
  id: z.string().min(1).refine(Boolean, {
    message: "Job ID parameter is required",
  }),
});

// Function for handling POST requests
export async function POST(request: Request, { params }: { params: { id: string } }) {
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

    // Validate the request body using zod schema
    const body = await request.json();
    const applicationValidationResult = applicationSchema.safeParse(body);
    if (!applicationValidationResult.success) {
      const errors = applicationValidationResult.error.issues.map(issue => issue.message);
      return new Response(JSON.stringify({ message: errors }), { status: 400 });
    }

    const { coverLetter } = applicationValidationResult.data;

    // Check if the job exists
    const job = await prisma.job.findUnique({
      where: { id },
    });

    if (!job) {
      return new Response(JSON.stringify({ message: ["Job not found."] }), { status: 404 });
    }

    // Create a new job application
    const application = await prisma.jobApplication.create({
      data: {
        jobId: id,
        userId: userId,
        status: 'pending',
        appliedAt: new Date(),
      },
    });

    await prisma.notification.create({
      data: {
        userId: job.userId,
        type: 'application',
        message: `New application received for the job "${job.title}"`,
        read: false,
        jobApplicationId: application.id,
      },
    });

    return new Response(JSON.stringify({ message: 'Application submitted successfully!', application }), { status: 200 });
  } catch (error) {
    console.error('Error submitting application:', error);
    return new Response(JSON.stringify({ message: ["Something went wrong."] }), { status: 500 });
  }
}
