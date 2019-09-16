import {arrayOf} from 'test-data-bot';
import {todoItemsBuilder} from '../fixtures/generators/todo-item';

describe('Todo application', () => {
  it('loads the page', async () => {
    const numTodos = 3;
    const todoItems = todoItemsBuilder(numTodos);

    cy.server();
    cy.route('/api/todos', todoItems).as('get-todos');

    cy.visit('/');
    cy.wait('@get-todos');

    /**
     * We have access to window as a promise via cy.window
     *
     * When the promise resolves, we have access to a jQuery object containing
     * the window, and we can evaluate our store
     */
    cy.window()
      .then($window => console.log($window.store))

      /**
       * To get access to properties on the window, Cypress allows one to chain using
       * `its`
       *
       * If the property we expect has another property that is a function, we can
       * execute that function using the `invoke` method on the chain
       *
       * `invoke` returns a promise, and we can assert on the resolved value
       */
      .its('store')
      .invoke('getState')
      .then(state => {
        console.log(state);

        return state;
      })
      .should('deep.equal', {todos: todoItems, visibilityFilter: 'show_all'});

    cy.findAllByTestId(/^todo-item/).should('have.length', numTodos);
  });
});
