import { prisma } from "@/lib/prisma";
import { z } from 'zod';

// Define the schema for validating the incoming POST request data
const jobSchema = z.object({
  title: z.string().optional(), // Added title, optional field
  description: z.string(),
  location: z.string(),
  typeOfHelp: z.string(),
  frequency: z.string().default('Once'), // Added frequency with a default value
  specificNeeds: z.string().optional(),  // Added specificNeeds, optional field
  mobilityRestrictions: z.string().optional(), // Added mobilityRestrictions, optional field
  startTiming: z.string().default('Immediately'), // Added startTiming with a default value
  additionalInfo: z.string().optional(), // Added additionalInfo, optional field
});

const searchSchema = z.object({
  search: z.string().optional(),
  currentUser: z.boolean().optional(),
});

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const search = url.searchParams.get('search') || '';
    const currentUser = url.searchParams.get('currentUser') === 'true';
    console.log(currentUser);

    let parsedData;
    try {
      parsedData = searchSchema.parse({ search, currentUser });
    } catch (error) {
      const errors = (error as any).errors.map((err: any) => err.message);
      return new Response(JSON.stringify({ message: errors }), { status: 400 });
    }

    const jobs = await prisma.job.findMany({
      where: {
        OR: [
          { title: { contains: parsedData.search } },
          { description: { contains: parsedData.search } },
          { location: { contains: parsedData.search } },
          { typeOfHelp: { contains: parsedData.search } },
        ],
        postedBy: parsedData.currentUser ? { id: req.headers.get('x-user-id') } : undefined,
      },
      include: { postedBy: {
        select: { firstName: true, lastName: true, id: true },
      }
    },
    });

    return new Response(JSON.stringify(jobs), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: ["Something went wrong."] }), { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const userId = req.headers.get('x-user-id');

    let parsedData;
    try {
      parsedData = jobSchema.parse(body);
    } catch (error) {
      const errors = (error as any).errors.map((err: any) => err.message);
      return new Response(JSON.stringify({ message: errors }), { status: 400 });
    }


    if (parsedData.title === undefined) {
      parsedData.title = `${parsedData.typeOfHelp} request in ${parsedData.location}`;
    }

    const newJob = await prisma.job.create({
      data: {
        title: parsedData.title,
        description: parsedData.description,
        location: parsedData.location,
        typeOfHelp: parsedData.typeOfHelp,
        frequency: parsedData.frequency,
        mobilityRestrictions: parsedData.mobilityRestrictions,
        startTiming: parsedData.startTiming,
        additionalInfo: parsedData.additionalInfo,
        postedBy: { connect: { id: userId } },
      },
    });

    return new Response(JSON.stringify(newJob), { status: 201 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: ["Something went wrong."] }), { status: 500 });
  }
}
