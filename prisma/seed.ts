/* eslint-disable */
const PrismaClient = require('@prisma/client').PrismaClient;

async function main() {
  const prisma = new PrismaClient();
  // Create Users
  const userData = [
    { firstName: 'Alice', lastName: 'Smith', email: 'alice.smith@example.com', password: 'password123', accountType: 'seeker' },
    { firstName: 'Bob', lastName: 'Johnson', email: 'bob.johnson@example.com', password: 'password123', accountType: 'seeker' },
    { firstName: 'Clara', lastName: 'Williams', email: 'clara.williams@example.com', password: 'password123', accountType: 'seeker' },
    { firstName: 'David', lastName: 'Brown', email: 'david.brown@example.com', password: 'password123', accountType: 'helper' },
    { firstName: 'Emma', lastName: 'Jones', email: 'emma.jones@example.com', password: 'password123', accountType: 'helper' },
    { firstName: 'Frank', lastName: 'Garcia', email: 'frank.garcia@example.com', password: 'password123', accountType: 'helper' },
  ];

  const createdUsers = await Promise.all(
    userData.map(user => prisma.user.create({ data: user }))
  );

  console.log('Users created:', createdUsers.length);

  // Create Jobs
  const jobData = [
    { title: 'Grocery Shopping Assistance', description: 'Help with grocery shopping for the week.', location: 'New York, NY', typeOfHelp: 'Grocery Shopping', userId: createdUsers[0].id },
    { title: 'House Cleaning', description: 'Need help with general house cleaning.', location: 'Los Angeles, CA', typeOfHelp: 'House Cleaning', userId: createdUsers[1].id },
    { title: 'Transportation to Doctor', description: 'Need someone to drive me to a doctor\'s appointment.', location: 'Chicago, IL', typeOfHelp: 'Transportation', userId: createdUsers[2].id },
    { title: 'Yard Work', description: 'Assistance needed with mowing the lawn and trimming hedges.', location: 'Boston, MA', typeOfHelp: 'Yard Work', userId: createdUsers[0].id },
    { title: 'Medication Pickup', description: 'Need someone to pick up my prescription from the pharmacy.', location: 'San Francisco, CA', typeOfHelp: 'Medication Pickup', userId: createdUsers[1].id },
    { title: 'Meal Preparation', description: 'Help needed with preparing meals for the week.', location: 'Dallas, TX', typeOfHelp: 'Meal Preparation', userId: createdUsers[2].id },
    { title: 'Companionship', description: 'Looking for someone to chat and spend time with.', location: 'Seattle, WA', typeOfHelp: 'Companionship', userId: createdUsers[0].id },
    { title: 'Home Maintenance', description: 'Assistance needed with minor home repairs.', location: 'Austin, TX', typeOfHelp: 'Home Maintenance', userId: createdUsers[1].id },
    { title: 'Pet Care', description: 'Help with walking and feeding my dog.', location: 'Miami, FL', typeOfHelp: 'Pet Care', userId: createdUsers[2].id },
    { title: 'Tech Support', description: 'Need help with setting up my new smartphone.', location: 'Denver, CO', typeOfHelp: 'Tech Support', userId: createdUsers[0].id },
    { title: 'Gardening', description: 'Assistance needed with planting flowers and vegetables.', location: 'Portland, OR', typeOfHelp: 'Gardening', userId: createdUsers[1].id },
    { title: 'Organizing Closets', description: 'Help needed with decluttering and organizing closets.', location: 'Phoenix, AZ', typeOfHelp: 'Organizing', userId: createdUsers[2].id },
    { title: 'Laundry', description: 'Assistance needed with doing laundry and ironing clothes.', location: 'Philadelphia, PA', typeOfHelp: 'Laundry', userId: createdUsers[0].id },
    { title: 'Dog Walking', description: 'Need someone to walk my dog twice a day.', location: 'San Diego, CA', typeOfHelp: 'Pet Care', userId: createdUsers[1].id },
    { title: 'Exercise Assistance', description: 'Looking for someone to help with daily exercises.', location: 'San Jose, CA', typeOfHelp: 'Exercise Assistance', userId: createdUsers[2].id },
  ];

  const createdJobs = await prisma.job.createMany({ data: jobData });
  console.log('Jobs created:', createdJobs.count);

  await prisma.$disconnect();
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
