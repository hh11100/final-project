import { prisma } from "@/lib/prisma";
import { z } from 'zod';

// Define a schema for the 'id' parameter
const schema = z.object({
  id: z.string().min(1).refine(Boolean, {
    message: "Id parameter is required"
  })
});

// Function for handling GET requests
export async function PATCH(request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Validate the 'id' parameter using zod schema
    const validationResult = schema.safeParse(params);
    if (!validationResult.success) {
      const errors = validationResult.error.issues.map(issue => issue.message);
      return new Response(JSON.stringify({ message: errors }), { status: 400 });
    }

    // Proceed if validation is successful
    const { id } = validationResult.data;
    const userId = request.headers.get('x-user-id');
    
    // Update the notification
    const notification = await prisma.notification.update({
      where: { id },
      data: { read: true },
    });
    
    return new Response(JSON.stringify(notification), { status: 200 });
  } catch (error) {
    console.error('Error updating notification:', error);
    return new Response(JSON.stringify({ message: ["Something went wrong."] }), { status: 500 });
  }
}
