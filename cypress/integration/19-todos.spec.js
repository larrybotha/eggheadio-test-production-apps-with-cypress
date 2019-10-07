const {todoItemsBuilder} = require('../generators/todo-item');

describe('Todo application', () => {
  beforeEach(() => {
    cy.task('db:seed', {todos: []});
  });

  it('full end-to-end test', function() {
    const todoText = 'foo';
    const todos = todoItemsBuilder();

    /**
     * assert that our db contains no items
     */
    cy.task('db:snapshot', 'todos').should('be.empty');

    /**
     * start the server so that we can spy on requests
     */
    cy.server();

    /**
     * seed the db
     */
    cy.task('db:seed', {todos});

    /**
     * assert that our db was in fact populated
     */
    cy.task('db:snapshot', 'todos').should('deep.equal', todos);

    /**
     * spy on GET requests to /api/todos
     */
    cy.route({
      method: 'GET',
      url: '/api/todos',
    }).as('getTodos');

    /**
     * visit our app
     */
    cy.visit('/');

    /**
     * assert that the store contains no todos when the page first loads
     */
    cy.getStoreState('todos').should('be.empty');

    /**
     * assert that the response body of the request for getting todos contains our
     * todos
     */
    cy.wait('@getTodos')
      .its('response.body')
      .should('deep.equal', todos);

    /**
     * assert that the store has been populated with those todos
     */
    cy.getStoreState('todos').should('deep.equal', todos);

    /**
     * assert that the UI has been populated with those todos
     */
    cy.findByTestId('todo-list')
      .children()
      .should('have.length', todos.length);
  });
});
