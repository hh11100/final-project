// cypress/e2e/login.cy.js

describe('Login Page', () => {
  beforeEach(() => {
    // Visit the login page before each test
    cy.visit('localhost:3000/login');
  });

  it('should display the login form correctly', () => {
    // Check if the form fields and buttons are rendered
    cy.get('input[name="email"]').should('be.visible');
    cy.get('input[name="password"]').should('be.visible');
    cy.get('button[type="submit"]').should('contain', 'Sign In');
  });

  it('should display error messages from the server', () => {
    // Stub the API request to simulate a login failure
    cy.intercept('POST', '/api/users/login', {
      statusCode: 401,
      body: {
        message: ['Invalid email or password'],
      },
    });

    // Fill out the form
    cy.get('input[name="email"]').type('john.doe@example.com');
    cy.get('input[name="password"]').type('wrongpassword');

    // Submit the form
    cy.get('button[type="submit"]').click();

    // Check for server-side error messages
    cy.contains('Invalid email or password').should('be.visible');
  });

  it('should navigate to the signup page when clicking "Don\'t have an account? Sign Up"', () => {
    // Click the signup link
    cy.contains("Don't have an account? Sign Up").click();

    // Check if redirected to the signup page
    cy.url().should('include', '/signup');
  });
});
