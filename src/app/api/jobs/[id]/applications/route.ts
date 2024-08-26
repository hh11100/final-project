import { prisma } from "@/lib/prisma";
import { z } from 'zod';

// Define a schema for the 'id' parameter
const idSchema = z.object({
  id: z.string().min(1).refine(Boolean, {
    message: "Job ID parameter is required",
  }),
});

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    // Validate the 'id' parameter using zod schema
    const idValidationResult = idSchema.safeParse(params);
    if (!idValidationResult.success) {
      const errors = idValidationResult.error.issues.map(issue => issue.message);
      return new Response(JSON.stringify({ message: errors }), { status: 400 });
    }

    const { id } = idValidationResult.data;
    const userId = request.headers.get('x-user-id');

    // Fetch all job applications for the given job ID
    const applications = await prisma.jobApplication.findFirst({
      where: { jobId: id, applicant: { id: userId } },
      orderBy: { appliedAt: 'desc' },
    });

    return new Response(JSON.stringify(applications), { status: 200 });
  } catch (error) {
    console.error('Error fetching applications:', error);
    return new Response(JSON.stringify({ message: ["Something went wrong."] }), { status: 500 });
  }
}
