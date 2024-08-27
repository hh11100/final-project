// cypress/e2e/logout.cy.js

describe('Logout Page', () => {
  beforeEach(() => {
    // Programmatically set cookies to simulate a logged-in state
    cy.setCookie('token', 'dummyToken');
    cy.setCookie('userId', 'dummyUserId');
    
    // Visit the logout page
    cy.visit('localhost:3000/logout');
  });

  it('should clear the token and userId cookies', () => {
    // Wait for the cookies to be cleared
    cy.wait(1000); // Adjust the wait time if necessary

    // Assert that the cookies are cleared
    cy.getCookie('token').should('not.exist');
    cy.getCookie('userId').should('not.exist');
  });

  it('should redirect to the login page', () => {
    // Assert that the URL is now the login page
    cy.url().should('include', '/login');
  });

  it('should display the "Logging out..." message', () => {
    // Check if the "Logging out..." message is visible
    cy.contains('Logging out...').should('be.visible');
  });
});
