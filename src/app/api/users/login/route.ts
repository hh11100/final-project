import { z } from 'zod';
import { SignJWT } from 'jose';
import { nanoid } from 'nanoid';
import { TextEncoder } from 'util';
import bcrypt from 'bcrypt';

const schema = z.object({
  email: z.string().email().transform((email) => email.toLowerCase()),
  password: z.string(),
});

export async function POST(req: Request) {
  const { prisma } = await import('@/lib/prisma');

  try {
    const data = await req.json();
    let parsedData;

    try {
      parsedData = schema.parse(data);
    } catch (error: any) {
      const errors = error.errors.map((err: any) => err.message);
      return new Response(JSON.stringify({ message: errors }), { status: 400 });
    }

    const { email, password } = parsedData;

    // Fetch the user by email
    const user = await prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (!user) {
      return new Response(JSON.stringify({ message: ["Invalid email or password."] }), { status: 400 });
    }

    // Compare the provided password with the hashed password in the database
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return new Response(JSON.stringify({ message: ["Invalid email or password."] }), { status: 400 });
    }

    // Generate a JWT token using `jose`
    const token = await new SignJWT({ id: user.id, email: user.email })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('1h')
      .setJti(nanoid()) // Unique token ID
      .sign(new TextEncoder().encode(process.env.JWT_SECRET));

    console.log('User logged in:', user.email);
    console.log('JWT token:', token);

    return new Response(JSON.stringify({
      data: {
        id: user.id,
        email: user.email,
        token, // Return the JWT token
      },
    }), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: ["Something went wrong."] }), { status: 500 });
  }
}
