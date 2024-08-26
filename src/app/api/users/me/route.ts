import { z } from 'zod';

// GET function to retrieve basic user information
export async function GET(req: Request) {
  const { prisma } = await import('@/lib/prisma');

  try {
    const userId = req.headers.get('x-user-id');

    // Fetch the user from the database using the ID from the header
    const user = await prisma.user.findUnique({
      where: { id: userId as string },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        accountType: true, // Add any other fields you want to expose
      },
    });

    if (!user) {
      return new Response(JSON.stringify({ message: "User not found." }), { status: 404 });
    }

    // Return the user's basic information
    return new Response(JSON.stringify(user), { status: 200 });
  } catch (error) {
    console.error("Error fetching user info:", error);
    return new Response(JSON.stringify({ message: "Something went wrong." }), { status: 500 });
  }
}

const updateUserSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().email().optional(), // Ensure email is a valid email address
});

export async function PATCH(request: Request) {
  const { prisma } = await import('@/lib/prisma');

  try {
    const userId = request.headers.get('x-user-id');

    console.log('User ID:', userId);

    if (!userId) {
      return new Response(JSON.stringify({ message: "User ID is required." }), { status: 400 });
    }

    const body = await request.json();
    let parsedData;

    try {
      parsedData = updateUserSchema.parse(body);
    } catch (error) {
      const errors = (error as any).errors.map((err: any) => err.message);
      return new Response(JSON.stringify({ message: errors }), { status: 400 });
    }

    // Update the user in the database
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        firstName: parsedData.firstName,
        lastName: parsedData.lastName,
        email: parsedData.email,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        accountType: true, // Include any fields you want to return
      },
    });

    // Return the updated user data
    return new Response(JSON.stringify(updatedUser), { status: 200 });
  } catch (error) {
    console.error("Error updating user info:", error);
    return new Response(JSON.stringify({ message: "Something went wrong." }), { status: 500 });
  }
}
