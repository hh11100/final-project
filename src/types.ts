export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  accountType: string;
}

export interface Job {
  id: string;
  title: string;
  description: string;
  datePosted: string;
  location: string;
  typeOfHelp: string;
  frequency: string;
  specificNeeds: string;
  serviceLocation: string;
  mobilityRestrictions: string;
  startTiming: string;
  additionalInfo: string;
  specialInstructions: string;
  status: string;
  postedBy: User;
  userId: string;
  applications: JobApplication[];
}

export interface JobApplication {
  id: string;
  jobId: string;
  userId: string;
  job: Job;
  applicant: User;
  status: string;
  appliedAt: string;
  notifications: Notification[];
}

export interface Notification {
  id: string;
  jobApplication: JobApplication;
  read: boolean;
  createdAt: string;
}

export interface Conversation {
  id: string;
  participants: User[];
  messages: Message[];
  jobApplication: JobApplication;
  jobApplicationId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  body: string;
  senderId: string;
  sender: User;
  conversationId: string;
  conversation: Conversation;
  sentAt: string;
}
