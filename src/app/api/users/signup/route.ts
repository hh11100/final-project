import { prisma } from "@/lib/prisma";
import { z } from 'zod';

const schema = z.object({
  email: z.string().email().transform((email) => email.toLowerCase()),  // Normalize email case
  password: z.string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .max(100)
    // .refine((pwd) => /[a-z]/.test(pwd), { message: "Password must contain at least one lowercase letter" })
    // .refine((pwd) => /[A-Z]/.test(pwd), { message: "Password must contain at least one uppercase letter" })
    .refine((pwd) => /[0-9]/.test(pwd), { message: "Password must contain at least one number" }),
    // .refine((pwd) => /[!@#$%^&*(),.?":{}|<>]/.test(pwd), { message: "Password must contain at least one special character" }),
  firstName: z.string()
    .min(1, { message: "First name cannot be empty" })
    .max(50, { message: "First name cannot exceed 50 characters" })
    .regex(/^[a-zA-Z]+$/, { message: "First name can only contain alphabetic characters" }),
  lastName: z.string()
    .min(1, { message: "Last name cannot be empty" })
    .max(50, { message: "Last name cannot exceed 50 characters" })
    .regex(/^[a-zA-Z]+$/, { message: "Last name can only contain alphabetic characters" }),
  accountType: z.string()
});

export async function POST(req: Request) {
  try {
    const data = await req.json();
    let parsedData;

    try {
      parsedData = schema.parse(data);
    } catch(error) {
      let errors = error.errors.map((err) => err.message);
      return Response.json({ message: errors }, { status: 400 });
    }

    const { email, password, firstName, lastName, accountType } = parsedData;

    const result = await prisma.user.create({
      data: {
        email,
        password,
        firstName,
        lastName,
        accountType,
      },
    });

    console.log(result);
    
    return Response.json({ data });
  } catch (error) {
    console.error(error);
    return Response.json({ message: ["Something went wrong."] }, { status: 400 });
  }
  
}
