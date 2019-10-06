const {todoItemsBuilder} = require('../generators/todo-item');

describe('Todo application', () => {
  beforeEach(() => {
    /**
     * clear the db bfeore each test run so that we have a clean slate to work
     * from
     */
    cy.task('db:seed', {todos: []});
  });

  it('seeds the database', function() {
    /**
     * assert db is empty
     */
    cy.task('db:snapshot', 'todos').should('be.empty');

    /**
     * assert db contains data
     *
     * It's not enough to assume that the data displayed in the UI comes from the
     * db. There may be caching, optimistic updates, etc. that don't highlight
     * when there are issues with a backend layer
     */
    const todos = todoItemsBuilder();
    cy.task('db:seed', {todos});
    cy.task('db:snapshot', 'todos').should('deep.equal', todos);

    /**
     * visit our app so we can see the output
     */
    cy.visit('/');
  });
});
