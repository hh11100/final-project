import OpenAI from 'openai';

export const openai = new OpenAI({
  apiKey: process.env['OPENAI_API_KEY'],
});

export async function createJobPost(questions, answers) {
  const completion = await openai.chat.completions.create({
    messages: [
      { 
      role: "system", content: `You are a background service in a web platform where elderly people can seek help in various tasks. You get an input of questions and answers provided by the user. Your task is to return a job posting description which will be used on the website and shown to the helpers, those who seek to help.
      
      Examples:
      
      I am an elderly person in need of a dependable and friendly driver for local errands and appointments. The job involves driving me to medical appointments, grocery shopping, and other necessary trips. You must have a valid driver's license, a clean driving record, and a courteous attitude. Flexible hours, approximately 10-15 hours per week. 

      I am an elderly homeowner looking for help with yard maintenance. Tasks include mowing the lawn, trimming hedges, weeding flower beds, and general garden upkeep. Experience in gardening and landscaping is preferred, along with a reliable and hardworking nature. Work is needed bi-weekly or as required. 

      I am an elderly individual seeking assistance with meal preparation. Duties include planning and cooking healthy meals, grocery shopping, and kitchen cleanup. Applicants should have experience in cooking nutritious meals and a friendly, caring personality. Flexible hours, ideally a few times a week. 

      I am an elderly person in need of a skilled handyman for various small repairs and maintenance tasks around my home. Jobs include fixing leaky faucets, painting, minor carpentry, and general upkeep. Experience and a reliable, trustworthy demeanor are essential. Hours are flexible and as needed. 

      I am an elderly individual looking for a friendly and reliable companion to join me on afternoon walks. The role involves providing companionship, ensuring safety, and enjoying pleasant conversation during our walks. No special skills required, just a kind and patient nature. Flexible hours, approximately 1-2 hours a day, a few times a week.

      ---

      Other rules:
      - The job posting should be clear, concise, and informative.
      - It should include the type of service needed, the tasks involved, any requirements or preferences, and the expected hours.
      - It must not include any personal information or details that could identify the user.
      - It should be written in a professional and welcoming tone.
      - It must not be discriminatory or exclude any potential helpers.
      - Don't start with "I am an elderly person" or similar phrases. Instead, use a generic description of the service needed.

      ---

      You must follow the same format and provide a job posting description based on the input questions and answers.
      `
      },
      {
        role: "user",
        content: `Questions: ${JSON.stringify(questions)}, Answers: ${JSON.stringify(answers)}`
      }
    ],
    model: "gpt-4o",
  });

  console.log(completion.choices[0].message.content);
}
