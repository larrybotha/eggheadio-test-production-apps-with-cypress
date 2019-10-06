import {arrayOf} from 'test-data-bot';
import {todoItemsBuilder} from '../generators/todo-item';

const retryTwice = async () => {};

describe('Todo application with network retries', () => {
  beforeEach(() => {
    const numTodos = 3;
    const todoItems = todoItemsBuilder(numTodos);

    cy.wrap(todoItems).as('todoItems');
  });

  context.only('Todo creation retries', function() {
    it('retries 3 times', function() {
      /**
       * start server
       * stub response
       * visit route
       * await response
       */
      cy.server();
      cy.route('/api/todos', '@todoItems').as('preload');
      cy.visit('/');
      cy.wait('@preload');

      /**
       * stub todos endpoint, returning 5xx
       * execute a request by adding a todo using the {enter} special character sequence
       * await the response
       */
      cy.stubApiTodosEndpoint({method: 'POST', response: '', status: 500}).as(
        'createTodo1'
      );
      cy.queryByTestId('new-todo').type('3rd todo{enter}');
      cy.wait('@createTodo1');

      /**
       * stub the retry that our saga will attempt
       * await the response
       */
      cy.stubApiTodosEndpoint({method: 'POST', response: '', status: 500}).as(
        'createTodo2'
      );
      cy.wait('@createTodo2');

      /**
       * stub the succsss response so we can assert on it
       * await the response
       */
      cy.stubApiTodosEndpoint({method: 'POST', response: '', status: 201}).as(
        'createTodo3'
      );
      cy.wait('@createTodo3');

      /**
       * assert that if the 3rd request succeeds, we have the new item in our list
       */
      cy.queryByTestId('todo-list')
        .children()
        .should('have.length', 4);
    });

    it('fails after 3 unnsuccessful attempts', function() {
      /**
       * follow the same sequence as above, until we get to stubbing the 3rd response
       */
      cy.server();
      cy.route('/api/todos', '@todoItems').as('preload');
      cy.visit('/');
      cy.wait('@preload');

      cy.stubApiTodosEndpoint({method: 'POST', response: '', status: 500}).as(
        'createTodo1'
      );
      cy.queryByTestId('new-todo').type('3rd todo{enter}');
      cy.wait('@createTodo1');

      cy.stubApiTodosEndpoint({method: 'POST', response: '', status: 500}).as(
        'createTodo2'
      );
      cy.wait('@createTodo2');

      /**
       * stub the 3rd request with another server error
       */
      cy.stubApiTodosEndpoint({method: 'POST', response: '', status: 500}).as(
        'createTodo3'
      );

      /**
       * assert that the newly created element is not in the list
       */
      cy.queryByTestId('todo-list')
        .children()
        .should('have.length', 3);
    });
  });
});
