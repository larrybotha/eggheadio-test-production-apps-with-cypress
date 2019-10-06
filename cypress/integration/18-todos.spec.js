const {todoItemsBuilder} = require('../generators/todo-item');

describe('Todo application', () => {
  beforeEach(() => {
    cy.task('db:seed', {todos: []});
  });

  it('asserts on XHR requests', function() {
    const todoText = 'foo';

    /**
     * start the Cypress server so that we can use cy.route later
     */
    cy.server();

    cy.visit('/');

    /**
     * spy on the the route where requests are made to create todos, and alias the
     * spied request
     *
     * because we don't provide a response body, the request goes through to our
     * server
     */
    cy.route({
      method: 'POST',
      url: '/api/todos',
    }).as('createTodoRequest');

    /**
     * type some text
     */
    cy.findByTestId('new-todo').type(`${todoText}{enter}`);

    /**
     * wait for the request to complete, and then assert on the response from our
     * server
     *
     */
    cy.wait('@createTodoRequest').then(xhr => {
      const {response, status} = xhr;

      cy.wrap(response.body).should('have.property', 'text', todoText);
      cy.wrap(status).should('equal', 201);
    });
  });
});
