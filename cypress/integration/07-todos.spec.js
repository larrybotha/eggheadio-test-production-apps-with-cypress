import {arrayOf} from 'test-data-bot';
import {todoItemsBuilder} from '../generators/todo-item';

describe('Todo application', () => {
  it('loads the page', () => {
    const numTodos = 3;
    const todoItems = todoItemsBuilder(numTodos);

    /**
     * cy.server allows us to mock out endpoints. This command alone doesn't
     * actually do anything, but it allows us to add endpoints to mock out
     */
    cy.server();

    /**
     * Mock the /api/todos endpoint, returning generated test data
     *
     * Alias the request so we can reference it later
     */
    cy.route('/api/todos', todoItems).as('get-todos');

    cy.visit('/');

    /**
     * Wait for our request to complete. On cy.route we can define delays to
     * simulate slow network conditions
     */
    cy.wait('@get-todos');

    /**
     * @testing-library allows one to use regexes to find elements by test id
     */
    cy.findAllByTestId(/^todo-item/).should('have.length', 3);
  });
});
