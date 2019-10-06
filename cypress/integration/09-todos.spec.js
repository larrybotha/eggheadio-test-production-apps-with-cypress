import {arrayOf} from 'test-data-bot';
import {todoItemsBuilder} from '../generators/todo-item';

describe('Todo application', () => {
  it('loads the page', async () => {
    const numTodos = 3;
    const todoItems = todoItemsBuilder(numTodos);

    cy.server();
    cy.route('/api/todos', todoItems).as('get-todos');

    cy.visit('/');
    cy.wait('@get-todos');

    /**
     * This sequence of commands is cumberson, so what we can benefit from
     * moving this to a custom command in Cypress
     */
    cy.window()
      .then($window => console.log($window.store))
      .its('store')
      .invoke('getState')
      .should('deep.equal', {todos: todoItems, visibilityFilter: 'show_all'});

    /**
     * Use our custom command to retrieve the store
     */
    cy.getStoreState('todos').should('deep.equal', todoItems);

    cy.findAllByTestId(/^todo-item/).should('have.length', numTodos);
  });
});
