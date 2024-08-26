import React, { useState } from 'react';
import { Box, Button, Typography, TextField, Stepper, Step, StepLabel, Radio, RadioGroup, FormControlLabel, FormGroup } from '@mui/material';
import { wizardQuestions } from '@/lib/constants';

const HelpRequestWizard = ({ onHelpRequestCreated }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [answers, setAnswers] = useState({});

  const steps = [...Object.keys(wizardQuestions), 'review'];

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSubmit = async () => {
    // Submit the help request data to the server

    console.log(answers);

    const response = await fetch('/api/jobs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(answers),
    });

    if (response.ok) {
      // Handle success (e.g., show a success message or redirect)
      console.log('Help request submitted successfully');
      onHelpRequestCreated();
    } else {
      // Handle error
      console.error('Failed to submit help request');
    }
  };

  const handleInputChange = (step, value) => {
    setAnswers((prev) => ({
      ...prev,
      [step]: value,
    }));
  };

  const getStepContent = (step) => {
    if (step === 'review') {
      return (
        <Box>
          <Typography variant="h6">Review your answers</Typography>
          {Object.keys(wizardQuestions).map((stepKey, index) => (
            <Box key={index} sx={{ mb: 2 }}>
              <Typography variant="subtitle1"><strong>{wizardQuestions[stepKey].question}</strong></Typography>
              {wizardQuestions[stepKey].answerType === 'multipleChoice' ? (
                <Typography variant="body1">{answers[stepKey]}</Typography>
              ) : (
                <Typography variant="body1">{answers[stepKey]}</Typography>
              )}
            </Box>
          ))}
        </Box>
      );
    }

    const { question, answerType, choices } = wizardQuestions[step];

    switch (answerType) {
      case 'multipleChoice':
        return (
          <Box>
            <Typography variant="h6">{question}</Typography>
            <RadioGroup
              value={answers[step] || ''}
              onChange={(e) => handleInputChange(step, e.target.value)}
            >
              {choices.map((choice, index) => (
                <FormControlLabel
                  key={index}
                  value={choice}
                  control={<Radio />}
                  label={choice}
                />
              ))}
            </RadioGroup>
          </Box>
        );
      case 'text':
        return (
          <Box>
            <Typography variant="h6">{question}</Typography>
            <TextField
              fullWidth
              variant="outlined"
              label="Your Answer"
              value={answers[step] || ''}
              onChange={(e) => handleInputChange(step, e.target.value)}
              margin="normal"
            />
          </Box>
        );
      default:
        return 'Unknown question type';
    }
  };

  return (
    <Box>
      <Stepper activeStep={activeStep}>
        {steps.map((step, index) => (
          <Step key={index}>
            <StepLabel>{step === 'review' ? 'Review & Submit' : `Step ${index + 1}`}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <Box sx={{ mt: 2, mb: 2 }}>
        {getStepContent(steps[activeStep])}
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button disabled={activeStep === 0} onClick={handleBack}>
          Back
        </Button>
        {activeStep === steps.length - 1 ? (
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Submit
          </Button>
        ) : (
          <Button variant="contained" color="primary" onClick={handleNext}>
            Next
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default HelpRequestWizard;
