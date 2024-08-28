/* eslint-disable */
const PrismaClient = require('@prisma/client').PrismaClient;

async function main() {
  const prisma = new PrismaClient();
  const bcrypt = require('bcrypt');

  // Delete all existing records
  await prisma.message.deleteMany({});
  await prisma.conversation.deleteMany({});
  await prisma.notification.deleteMany({});
  await prisma.jobApplication.deleteMany({});
  await prisma.job.deleteMany({});
  await prisma.user.deleteMany({});

  console.log('All existing records deleted.');

  const testPassword = await bcrypt.hash("password123", 10);

  // Create Users
  const userData = [
    { firstName: 'Gizi', lastName: 'Nagy', email: 'gizi.nagy@example.com', password: testPassword, accountType: 'seeker' },
    { firstName: 'Klari', lastName: 'Toth', email: 'klari.toth@example.com', password: testPassword, accountType: 'seeker' },
    { firstName: 'Margit', lastName: 'Kovacs', email: 'margit.kovacs@example.com', password: testPassword, accountType: 'seeker' },
    { firstName: 'John', lastName: 'Smith', email: 'john.smith@example.com', password: testPassword, accountType: 'helper' },
    { firstName: 'Mary', lastName: 'Brown', email: 'mary.brown@example.com', password: testPassword, accountType: 'helper' },
    { firstName: 'George', lastName: 'Wilson', email: 'george.wilson@example.com', password: testPassword, accountType: 'helper' },
  ];

  const createdUsers = await Promise.all(
    userData.map(user => prisma.user.create({ data: user }))
  );

  console.log('Users created:', createdUsers.length);

  // Create Jobs
  const jobData = [
    { title: 'Grocery Shopping Assistance', description: 'Help with grocery shopping for the week.', location: 'London, UK', typeOfHelp: 'Grocery Shopping', userId: createdUsers[0].id },
    { title: 'House Cleaning', description: 'Need help with general house cleaning.', location: 'Budapest, Hungary', typeOfHelp: 'House Cleaning', userId: createdUsers[1].id },
    { title: 'Transportation to Doctor', description: 'Need someone to drive me to a doctor\'s appointment.', location: 'Manchester, UK', typeOfHelp: 'Transportation', userId: createdUsers[2].id },
    { title: 'Yard Work', description: 'Assistance needed with mowing the lawn and trimming hedges.', location: 'Brighton, UK', typeOfHelp: 'Yard Work', userId: createdUsers[0].id },
    { title: 'Medication Pickup', description: 'Need someone to pick up my prescription from the pharmacy.', location: 'Debrecen, Hungary', typeOfHelp: 'Medication Pickup', userId: createdUsers[1].id },
    { title: 'Meal Preparation', description: 'Help needed with preparing meals for the week.', location: 'Bristol, UK', typeOfHelp: 'Meal Preparation', userId: createdUsers[2].id },
    { title: 'Companionship', description: 'Looking for someone to chat and spend time with.', location: 'Szeged, Hungary', typeOfHelp: 'Companionship', userId: createdUsers[0].id },
    { title: 'Home Maintenance', description: 'Assistance needed with minor home repairs.', location: 'Leeds, UK', typeOfHelp: 'Home Maintenance', userId: createdUsers[1].id },
    { title: 'Pet Care', description: 'Help with walking and feeding my dog.', location: 'Pécs, Hungary', typeOfHelp: 'Pet Care', userId: createdUsers[2].id },
    { title: 'Tech Support', description: 'Need help with setting up my new smartphone.', location: 'Oxford, UK', typeOfHelp: 'Tech Support', userId: createdUsers[0].id },
    { title: 'Gardening', description: 'Assistance needed with planting flowers and vegetables.', location: 'Cambridge, UK', typeOfHelp: 'Gardening', userId: createdUsers[1].id },
    { title: 'Organizing Closets', description: 'Help needed with decluttering and organizing closets.', location: 'Szeged, Hungary', typeOfHelp: 'Organizing', userId: createdUsers[2].id },
    { title: 'Laundry', description: 'Assistance needed with doing laundry and ironing clothes.', location: 'Liverpool, UK', typeOfHelp: 'Laundry', userId: createdUsers[0].id },
    { title: 'Dog Walking', description: 'Need someone to walk my dog twice a day.', location: 'London, UK', typeOfHelp: 'Pet Care', userId: createdUsers[1].id },
    { title: 'Exercise Assistance', description: 'Looking for someone to help with daily exercises.', location: 'Győr, Hungary', typeOfHelp: 'Exercise Assistance', userId: createdUsers[2].id },
  ];

  const createdJobs = await Promise.all(
    jobData.map(job => prisma.job.create({ data: job }))
  );
  
  console.log('Jobs created:', createdJobs.length);

  // Create Job Applications
  const jobApplicationsData = [
    { jobId: createdJobs[0].id, userId: createdUsers[3].id },
    { jobId: createdJobs[1].id, userId: createdUsers[4].id },
    { jobId: createdJobs[2].id, userId: createdUsers[5].id },
  ];

  const createdJobApplications = await Promise.all(
    jobApplicationsData.map(app => prisma.jobApplication.create({ data: app }))
  );

  console.log('Job Applications created:', createdJobApplications.length);

  // Create Notifications
  const notificationsData = [
    { message: 'Your job application has been received.', userId: createdUsers[3].id, jobApplicationId: createdJobApplications[0].id },
    { message: 'Your job application has been received.', userId: createdUsers[4].id, jobApplicationId: createdJobApplications[1].id },
    { message: 'Your job application has been received.', userId: createdUsers[5].id, jobApplicationId: createdJobApplications[2].id },
  ];

  const createdNotifications = await Promise.all(
    notificationsData.map(notif => prisma.notification.create({ data: notif }))
  );

  console.log('Notifications created:', createdNotifications.length);

  // Create Conversations
  const conversationsData = [
    { participants: { connect: [{ id: createdUsers[0].id }, { id: createdUsers[3].id }] }, jobApplicationId: createdJobApplications[0].id },
    { participants: { connect: [{ id: createdUsers[1].id }, { id: createdUsers[4].id }] }, jobApplicationId: createdJobApplications[1].id },
    { participants: { connect: [{ id: createdUsers[2].id }, { id: createdUsers[5].id }] }, jobApplicationId: createdJobApplications[2].id },
  ];

  const createdConversations = await Promise.all(
    conversationsData.map(conv => prisma.conversation.create({ data: conv }))
  );

  console.log('Conversations created:', createdConversations.length);

  // Create Messages
  const messagesData = [
    { body: 'Hi, I am interested in helping with your job.', senderId: createdUsers[3].id, conversationId: createdConversations[0].id },
    { body: 'Great, I look forward to working with you!', senderId: createdUsers[0].id, conversationId: createdConversations[0].id },
    { body: 'Hi, I am interested in helping with your job.', senderId: createdUsers[4].id, conversationId: createdConversations[1].id },
    { body: 'Great, I look forward to working with you!', senderId: createdUsers[1].id, conversationId: createdConversations[1].id },
    { body: 'Hi, I am interested in helping with your job.', senderId: createdUsers[5].id, conversationId: createdConversations[2].id },
    { body: 'Great, I look forward to working with you!', senderId: createdUsers[2].id, conversationId: createdConversations[2].id },
  ];

  const createdMessages = await Promise.all(
    messagesData.map(msg => prisma.message.create({ data: msg }))
  );

  console.log('Messages created:', createdMessages.length);

  await prisma.$disconnect();
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  });
