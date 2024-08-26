describe('My First Test', () => {
  it('Visits the app root url', () => {
    cy.visit('localhost:3000/login');
    cy.contains('Sign in');
  });
});
