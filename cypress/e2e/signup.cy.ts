describe('Sign Up Page', () => {
  beforeEach(() => {
    // Visit the signup page before each test
    cy.visit('localhost:3000/signup');
  });

  it('should display the signup form correctly', () => {
    // Check if all fields are rendered
    cy.get('input[name="firstName"]').should('be.visible');
    cy.get('input[name="lastName"]').should('be.visible');
    cy.get('input[name="email"]').should('be.visible');
    cy.get('input[name="password"]').should('be.visible');
    cy.get('button[type="submit"]').should('contain', 'Sign Up');
  });

  it('should successfully submit the form', () => {
    // Fill out the form
    cy.get('input[name="firstName"]').type('John');
    cy.get('input[name="lastName"]').type('Doe');
    cy.get('input[name="email"]').type('john.doe@example.com');
    cy.get('input[name="password"]').type('password123');
    cy.get('input[value="seeker"]').check();

    // Submit the form
    cy.get('button[type="submit"]').click();

    // Check if redirected to the dashboard or some success page
    cy.url().should('include', '/login'); // Assuming successful sign-up redirects to the dashboard
  });

  it('should display error messages from the server', () => {
    // Stub the API request to simulate server errors
    cy.intercept('POST', '/api/users/signup', {
      statusCode: 400,
      body: {
        message: ['Email is already in use', 'Password must be at least 8 characters'],
      },
    });

    // Fill out the form
    cy.get('input[name="firstName"]').type('John');
    cy.get('input[name="lastName"]').type('Doe');
    cy.get('input[name="email"]').type('john.doe@example.com');
    cy.get('input[name="password"]').type('pass');
    cy.get('input[value="seeker"]').check();

    // Submit the form
    cy.get('button[type="submit"]').click();

    // Check for server-side error messages
    cy.contains('Email is already in use').should('be.visible');
    cy.contains('Password must be at least 8 characters').should('be.visible');
  });

  it('should navigate to the login page when clicking "Already have an account? Sign in"', () => {
    // Click the login link
    cy.contains('Already have an account? Sign in').click();

    // Check if redirected to the login page
    cy.url().should('include', '/login');
  });
});
