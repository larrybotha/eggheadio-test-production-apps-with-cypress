import {arrayOf} from 'test-data-bot';
import {todoItemsBuilder} from '../fixtures/generators/todo-item';

const retryTwice = async () => {};

describe('Todo application with forced 404s', () => {
  beforeEach(() => {
    const numTodos = 3;
    const todoItems = todoItemsBuilder(numTodos);

    cy.wrap(todoItems).as('todoItems');
  });

  it('forces stubbing of endpoints', function() {
    /**
     * configure the Cypress server to force 404 errors when making requests to
     * endpoints
     *
     * These show up as logs in the test output, and help in indicating that an
     * endpoint hasn't been stubbed.
     *
     * This is useful when we are writing tests that do not interact with our actual
     * server
     */
    cy.server({force404: true});
    cy.route('/api/todos', '@todoItems').as('preload');
    cy.visit('/');
    cy.wait('@preload');

    /**
     * if this response were not stubbed, force404 above would show a 404 error in
     * the logs
     */
    cy.route('PUT', '/api/todos/1', 'ok').as('updateTodo');

    cy.queryAllByTestId(/todo-item/i)
      .first()
      .find('label')
      .dblclick();
    cy.queryByTestId('todo-edit-input')
      .clear()
      .type('something new{enter}');

    cy.wait('@updateTodo');
  });
});
