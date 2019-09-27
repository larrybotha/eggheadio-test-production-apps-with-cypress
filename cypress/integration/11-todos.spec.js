import _ from 'lodash';
import {arrayOf} from 'test-data-bot';

describe('Todo application with fixtures callback', () => {
  it('loads the page', async () => {
    cy.server();

    /**
     * Load shared fdata from a fixture using a callback
     */
    cy.fixture('todos/all.json').then(todos => {
      cy.route('/api/todos', todos).as('get-todos');

      cy.visit('/');
      cy.wait('@get-todos');

      cy.getStoreState('todos')
        .lo_find(todo => todo.id === 1)
        .lo_pick('text')
        .should(
          'deep.equal',
          _.pick(_.find(todos, todo => todo.id === 1), 'text')
        );
    });
  });
});

describe('Todo application with fixtures as alias', () => {
  /**
   * use `before` to load the fixture, and assign it an alias
   */
  before(() => {
    cy.fixture('todos/all.json').as('preloadedTodos');
  });

  /**
   * Use a functionn declaration instead of a fat arrow since we need our test to
   * have access to Cypress' `this` within the scope of the test
   */
  it('asserts on fixtures preloaded via a `before` statement', async function() {
    cy.server();

    /**
     * load the todos via the alias
     */
    cy.route('/api/todos', '@preloadedTodos').as('get-todos');

    cy.visit('/');
    cy.wait('@get-todos');

    cy.getStoreState('todos')
      .lo_find(todo => todo.id === 1)
      .lo_pick('text')
      .should(
        'deep.equal',
        /**
         * referennce the todos via `this`
         */
        _.pick(_.find(this.preloadedTodos, todo => todo.id === 1), 'text')
      );
  });
});
