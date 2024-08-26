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
  postedBy: User;
}

export interface JobApplication {
  id: string;
  job: Job;
  applicant: User;
}

export interface Notification {
  id: string;
  jobApplication: JobApplication;
  read: boolean;
  createdAt: string;
}
