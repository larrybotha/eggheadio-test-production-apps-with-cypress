describe('Todo application', () => {
  it('loads the page', () => {
    cy.visit('/');

    cy.get('.todo-list li:nth-child(1)').should('have.text', 'Hello world');

    /**
     * This breakpoint will be hit before any assertions will be evaluted
     * because Cypress executes assertions asynchonously
     */
    debugger;

    cy.findByText(/hello world/i)
      .should('exist')
      .should('not.have.class', 'completed')
      .parent()
      .find('.toggle')
      .should('not.be.checked');

    /**
     * Use `then` to place a breakpoint
     *
     * .then receives a single argument; in this case, a jQyery object
     * containing the element we selected for
     */
    cy.findByText(/hello world/i).then(el => {
      debugger;
    });

    /**
     * Use `debug` to place a breakpoint
     *
     * Have Cypress abstract the debugger statement for us
     */
    cy.findByText(/hello world/i).debug();

    /**
     * Log information out
     *
     * We can use .log to add metadata to our output
     */
    cy.log('tests done!');

    /**
     * Run arbotrary code in Cypress using .wrap
     */
    cy.wrap(5).should('eq', 5);
  });
});
