import _ from 'lodash';
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
     * This won't work because of Cypress' async nature
     *
     * throws "TypeError: Cannot read property 'should' of undefined"
     */
    // _.filter(cy.getStoreState('todos'), todo => todo.id === 1).should(
    //   'deep.equal',
    //   todoItems[0]
    // );

    /**
     * Instead, we need to use Cypress' chaining to get the value we want
     */
    cy.getStoreState('todos')
      .then(todos => _.filter(todos, todo => todo.id === 1))
      .should('deep.equal', _.filter(todoItems, todo => todo.id === 1));

    /**
     * We can abstract away the filtering logic by using a custom command defined in
     * suppoer/commands.js
     */
    cy.getStoreState('todos')
      .lo_filter(todo => todo.id === 1)
      .should('deep.equal', _.filter(todoItems, todo => todo.id === 1));

    cy.findAllByTestId(/^todo-item/).should('have.length', numTodos);
  });
});
