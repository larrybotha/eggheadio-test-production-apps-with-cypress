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

    /**
     * Find using `data-cy` attribute
     */
    cy.get('[data-cy=todo-item-3]')
      .should('exist')
      .should('not.have.class', 'completed')
      .find('.toggle')
      .should('not.be.checked');

    /**
     *  Use .contains
     */
    cy.contains('Hello world')
      .should('exist')
      .should('not.have.class', 'completed')
      .find('.toggle')
      .should('not.be.checked');

    /**
     * Find using data-testid with @testing-library
     */
    cy.findByTestId('todo-item-3')
      .should('exist')
      .should('not.have.class', 'completed')
      .find('.toggle')
      .should('not.be.checked');
  });
});
