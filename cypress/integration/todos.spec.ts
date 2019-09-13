describe('Todo application', () => {
  it('loads the page', () => {
    cy.visit('/');
    cy.get('.todo-list li:nth-child(1)').should('have.text', 'Hello world');

    cy.findByText(/hello world/i)
      .should('exist')
      .should('not.have.class', 'completed')
      .parent()
      .find('.toggle')
      .should('not.be.checked');
  });
});
