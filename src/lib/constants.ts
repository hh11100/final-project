export const wizardQuestions = {
  'typeOfHelp': {
    'question': 'Which of the following describes the services you need?',
    'answerType': 'multipleChoice',
    'choices': [
      'Personal Care',
      'Health Care',
      'Housekeeping',
      'Transportation',
      'Companionship',
      'Other'
    ],
  },
  'frequency': {
    'question': 'How often do you need these services?',
    'answerType': 'multipleChoice',
    'choices': [
      'Daily',
      'Several times a week',
      'Weekly',
      'Occasionally',
      'Once',
    ],
  },
  'description': {
    'question': "Please describe how you'd like the services to be delivered. For example, if you chose 'Personal Care', do you need help with bathing, dressing, grooming, or something else?",
    'answerType': 'text',
  },
  'location': {
    'question': "To match you with local service providers, could you please share your zip code or city?",
    'answerType': 'text',
  },
  'mobilityRestrictions': {
    'question': "Do you have any mobility restrictions I should be aware of to better tailor our services to your needs?",
    'answerType': 'multipleChoice',
    'choices': [
      'No',
      'Some difficulty (e.g., uses a cane or walker)',
      'Wheelchair bound',
      'Bedridden'
    ],
  },
  'startTiming': {
    'question': "How soon do you need the services to start?",
    'answerType': 'multipleChoice',
    'choices': [
      'Immediately',
      'Within the next week',
      'Within the next month',
      "I'm just exploring options right now"
    ],
  },
  'additionalInfo': {
    'question': "Is there anything else you'd like to share with us to help us find the best match for you?",
    'answerType': 'text',
  },
}
