import '@testing-library/cypress/add-commands';
import _ from 'lodash';
// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

Cypress.Commands.add('getStoreState', stateProp => {
  const log = Cypress.log({name: 'getStoreState'});
  const logState = state => {
    log.set({
      // Cypress logs output
      message: JSON.stringify(state),
      // devtools console output
      consoleProps: () => state,
    });

    /**
     * Return the state so that we can continue chaining on it
     */
    return state;
  };

  return (
    cy
      .window({log: false})
      /**
       * Don't use `its` and `invoke` because we can't supress their logs
       */
      // .its('store')
      // .invoke('getState')

      /**
       * Instead, retrieve the store directly from the window
       */
      .then($window => $window.store.getState())
      .then(state => {
        if (stateProp) {
          return cy
            .wrap(state, {log: false})
            .its(stateProp)
            .then(logState);
        } else {
          return cy.wrap(state, {log: false}).then(logState);
        }
      })
  );
});

/**
 * Create a child command for filtering on previous values in a chain.
 *
 * Setting prevSubject: true indicates to Cypress that this is a child command
 */
// Cypress.Commands.add(
//   'lo_filter',
//   {prevSubject: true},
//   (subject, predicateFn) => {
//     const result = _.filter(subject, predicateFn);

/**
 * Add logs for our custom command
 */
//     Cypress.log({
//       name: 'lo_filter',
//       message: JSON.stringify(result),
//       consoleProps: () => result,
//     });

//     return result;
//   }
// );

/**
 * Wrap all of lodash's methods
 */
const loMethods = _.functions(_).map(fnName => `lo_${fnName}`);

loMethods.forEach(loMethodName => {
  const methodName = loMethodName.replace(/^lo_/, '');

  Cypress.Commands.add(
    loMethodName,
    {prevSubject: true},
    (subject, fn, ...args) => {
      const result = _[methodName](subject, fn, ...args);
      console.log('result', result);

      Cypress.log({
        name: loMethodName,
        message: JSON.stringify(result),
        consoleProps: () => result,
      });

      return result;
    }
  );
});
