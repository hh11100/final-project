import { createJobPost } from '@/lib/openai'
import { wizardQuestions } from '@/lib/constants';

export async function POST(req: Request) {
  const { answers } = await req.json();

  const data = await createJobPost(wizardQuestions, answers);
   
  return Response.json({ data })
}
