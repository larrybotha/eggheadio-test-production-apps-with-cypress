# Test Production Ready Apps with Cypress

Notes and annotations for Egghead's [Test Production Ready Apps with Cypress](Test Production Ready Apps with Cypress) course.

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [1. Course Introduction: Test Production Ready Apps with Cypress](#1-course-introduction-test-production-ready-apps-with-cypress)
- [2. Install Cypress in a Production Application](#2-install-cypress-in-a-production-application)
- [3. Setup Your Cypress Dev Environment](#3-setup-your-cypress-dev-environment)
  - [Custom Typescript config for code hints](#custom-typescript-config-for-code-hints)
  - [Cypress project configs](#cypress-project-configs)
- [4. Write Your First Cypress Integration Test](#4-write-your-first-cypress-integration-test)
  - [Using `@testing-library/cypress`](#using-testing-librarycypress)
- [5. Use the Most Robust Selector for Cypress Tests](#5-use-the-most-robust-selector-for-cypress-tests)
- [6. Debug and Log with Cypress](#6-debug-and-log-with-cypress)
  - [Debugging](#debugging)
  - [Logging](#logging)
  - [Running arbitrary code](#running-arbitrary-code)
- [7. Mock Your Backend with Cypress](#7-mock-your-backend-with-cypress)
  - [`cy.server`](#cyserver)
  - [Using `cy.route` to mock endpoints](#using-cyroute-to-mock-endpoints)
  - [Inspecting requests and responses](#inspecting-requests-and-responses)
- [8. Assert on Your Redux Store with Cypress](#8-assert-on-your-redux-store-with-cypress)
- [9. Create Custom Cypress Commands](#9-create-custom-cypress-commands)
  - [Suppressing commands inside a custom command](#suppressing-commands-inside-a-custom-command)
  - [Logging state to the console in a custom command](#logging-state-to-the-console-in-a-custom-command)
  - [User-defined state in the console](#user-defined-state-in-the-console)
- [10. Wrap External Libraries with Cypress](#10-wrap-external-libraries-with-cypress)
  - [Wrapping an entire library](#wrapping-an-entire-library)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## 1. Course Introduction: Test Production Ready Apps with Cypress

End-to-end testing has a reputation of being flaky and unreliable, with tests
having to be written in such a way that _sleeps_ and waiting are required for
DOM nodes to be evaluated.

Cypress addresses these issues, and more. Cypress is a paradigm shift in in
end-to-end testing.

With Cypress one can test every layer of the stack:

- database
- api
- asynchronous requests
- UI
- frontend stores

Cypress allows this in addition to features such as time travel.

## 2. Install Cypress in a Production Application

```bash
$ npm i -D cypress
```

With Cypress installed, we can run the GUI:

```bash
$ $(npm bin)/cypress open
```

This will open the GUI, and, if Cypress has not been run in the project, create
a number of files and folders to prepare your tests and allow you to evaluate a
few examples of Cypress tests against the Cypress website.

```bash
cypress
├── fixtures
│   └── example.json
├── integration
│   └── examples
│       ├── actions.spec.js
│       ├── aliasing.spec.js
│       ├── assertions.spec.js
│       ├── connectors.spec.js
│       ├── cookies.spec.js
│       ├── cypress_api.spec.js
│       ├── files.spec.js
│       ├── local_storage.spec.js
│       ├── location.spec.js
│       ├── misc.spec.js
│       ├── navigation.spec.js
│       ├── network_requests.spec.js
│       ├── querying.spec.js
│       ├── spies_stubs_clocks.spec.js
│       ├── traversal.spec.js
│       ├── utilities.spec.js
│       ├── viewport.spec.js
│       ├── waiting.spec.js
│       └── window.spec.js
├── plugins
│   └── index.js
└── support
    ├── commands.js
    └── index.js
```

This also demonstrates that Cypress can be run against both local and remote
applications.

## 3. Setup Your Cypress Dev Environment

### Custom Typescript config for code hints

The example Cypress test files include a triple-slash directive for
intelli-sense in VSCode.

```javascript
/// <reference types="Cypress" />
```

This doesn't help in Vim, but we can rename specs to `.ts`, and omni-completion
will kick in (given you have the correct plugins).

This doesn't mean that the triple-slash directive can be removed, however, as
your project may not be configured for Typescript, or for Typescript to find
Cypress definitions.

To address this, a `tsconfig.json` can be added to the root of of the `cypress/`
folder indicating to Typescript where to find definitions for Cypress:

```json
{
  "compilerOptions": {
    "allowJs": true,
    "baseUrl": "../node_modules",
    "types": ["cypress"]
  },
  "include": ["**/*.*"]
}
```

Now it's safe to remove the triple-slash directive and benefit from
omni-completion / intelli-sense.

### Cypress project configs

Cypress has many configurable settings that can be managed via a `cypress.json`
in the root of one's project. One such setting is the `baseUrl` for requests:

```json
{
  "baseUrl": "http://localhost:5000"
}
```

## 4. Write Your First Cypress Integration Test

Let's start from scratch with our own spec: [todos.spec.ts](./cypress/integration/todos.spec.ts)

The first thing to do is to get Cypress to visit our application:

```javascript
describe('My application', () => {
  /**
   * Visit the index page of our application at the url defined in cypress.json
   */
  cy.visit('/')
})
```

We then `get` elements using Cypress' chained method:

```javascript
describe('My application', () => {
  cy.visit('/')
  cy.get('.todo-list li:nth-child(1)')
    .should('have.text', 'hello world');
})
```

Cypress uses jQuery under the hood, so we can use CSS selectors to get our
elements. Assertions are then chained using `.should([assertionName], [valueToAsssert])`.

We can also open Chrome's devtools, click on an assertion in the main window,
and then view details about that assertion in the devtools console.

### Using `@testing-library/cypress`

We can improve on these assertions by using [`@testing-library/cypress`](https://testing-library.com/docs/cypress-testing-library/intro).

To get `@testing-library/cypress`'s helper commands, we need to first install
the library:

```bash
$ npm install -D @testing-library/cypress
```

and then extend Cypress' commands:

```javascript
# cypress/support/commands.js
import '@testing-library/cypress/add-commands';
```

and then, if using Typescript, add `@testing-library`s types:

```json
{
  "compilerOptions": {
    "allowJs": true,
    "baseUrl": "../node_modules",
    "types": ["cypress", "@types/testing-library__cypress"]
  },
  "include": ["**/*.*"]
}
```

Now we have access to a number of `@testing-library/dom` commands to easily get
elements.

Instead of looking for elements using brittle CSS selectors, we can instead get
elements by how they appear to users:

```javascript
describe('My application', () => {
  cy.visit('/')

  cy.findByText(/hello world/i)
    .should('exist');
})
```

When Cypress is unable to find an element it waits (4500ms by default) for the
element to change, after which it will throw an error.

This eliminates having to write code that sleeps or waits for the DOM to change
with Cypress.

We can continue chaining assertions, too:

```javascript
  cy.findByText(/hello world/i)
    .should('exist')
    .should('not.have.class', 'completed')
    .parent()
    .find('.toggle')
    .should('not.be.checked')
```

Assertions are run one after the other

## 5. Use the Most Robust Selector for Cypress Tests

[todos.spec.ts](./cypress/integration/todos.spec.ts)

Querying elements by CSS selectors is brittle for the following reasons:

- if the DOM structure changes, our tests fails
- if the classes on the elements we're targeting fail, our tests may fail if
    they depend on those classes

To address this we can do one of the following:

- add a `data-cy` attribute to elements and target them using `cy.get`:

    ```javascript
    # TodoItem.js
      // ...
      <li
        data-cy={`todo-item-${todo.id}`}
        className={classnames({
          completed: todo.completed,
          editing: this.state.editing,
        })}>
      // ...
    ```

    ```javascript
    # todo.spec.ts
    // ...
    cy.get('[data-cy=todo-item-3]')
      .should('exist')
      .should('not.have.class', 'completed')
      .find('.toggle')
      .should('not.be.checked');
    // ...
    ```
- use Cypress' `.contains` matcher:

    ```javascript
    # todo.spec.ts
    // ...
    cy.contains('Hello world')
      .should('exist')
      .should('not.have.class', 'completed')
      .find('.toggle')
      .should('not.be.checked');
    // ...
    ```

- add a `data-testid` attribute to elements and target them using
    `@testing-library/cypress`'s `findById` command:

    ```javascript
    # TodoItem.js
      // ...
      <li
        data-testid={`todo-item-${todo.id}`}
        className={classnames({
          completed: todo.completed,
          editing: this.state.editing,
        })}>
      // ...
    ```


    ```javascript
    # todo.spec.ts
    // ...
    cy.findByTestId('todo-item-3')
      .should('exist')
      .should('not.have.class', 'completed')
      .find('.toggle')
      .should('not.be.checked');
    // ...
    ```

- get elements by text, rather than relying on ids:

    ```javascript
    # todo.spec.ts
    // ...
    cy.findByText(/hello world/i)
      .should('exist')
      .should('not.have.class', 'completed')
      .parent()
      .find('.toggle')
      .should('not.be.checked');
    // ...
    ```

    This is the most reliable way to get elements, and encourages getting
    elements from the perspective of what users experience.

Getting elements via a regex match is the most reliable option, followed by
adding a test id attribute to the element.

## 6. Debug and Log with Cypress

[06-todos.spec.ts](./cypress/integration/06-todos.spec.ts)

### Debugging

Cypress executes queries asynchonously, so a `debugger` statement in the middle of
a bunch of assertions is going to be hit before any of the assertions run:

```javascript
cy.get('.some-element')
  .should('have.class', 'my-class')

// the debugger will hit this line before running the previous assertion
debugger;

cy.get('.some-other-element')
  .should('exist')
```

Internally, Cypress' assertions can be thought of as an array of tasks that will
be run sequentially, and asynchronously. A mental model of what's going on above
could be:

```javascript
/**
 * evaluate assertions, building an array
 *
 * i.e. [visit, get, should, findByText, should, should, parent, find, should]
 */
cy.visit('/');

cy.get('.todo-list li:nth-child(1)').should('have.text', 'Hello world');

cy.findByText(/hello world/i)
  .should('exist')
  .should('not.have.class', 'completed')
  .parent()
  .find('.toggle')
  .should('not.be.checked');
```

Once Cypress has evaluated the full test, it will start popping executions off
the list until all tests have run, or there is a failing assertion.

What we need is to be able to place `debugger` statements within this
asynchronous execution, and this can be done in a few ways:

- using `then` within chains:

    ```javascript
    cy.get('.some-element')
      .then($el => // do stuff with element)
    ```

    In this case we get a jQuery object wrapping the element we selected. If,
    howeever, we chained `.then` on `cy.visit(/some-url)` we'd get the `window`.
    `.then`'s arguments are contextual.

- using Cypress' `.debug()` chained command:

    ```javascript
    cy.get('.some-element')
      .debug()
    ```

    This allows us to rely on Cypress to drop a breakpoint for us with the same
    context as if we had used `.then()`.

### Logging

We can log additional information out in our tests:

```javascript
cy.log('about to load page');
cy.visit('/');
```

### Running arbitrary code

Arbitrary code can also be run by using the `.wrap` command:

```javascript
cy.wrap(5).should('eq', 5)
```

## 7. Mock Your Backend with Cypress

[07-todos.spec.js](./cypress/integration/07-todos.spec.js)

We can see that Cypress is using the data in our backend by updating a todo item
in the UI, and then evaluating the tests in Cypress.

We don't want our tests running on development data - tests need to isolated
from development.

There are two options here:

1. stub out every endpoint being tested
2. create a separate connection with interactions completely isolated from the
   dev environment

We'll go with the first in this example.

### `cy.server`

To allow for endpoints to mocked out, we need to indicate to Cypress that we
want a mock server. To do this, we use the `cy.server` command:

```javascript
cy.server()
```

This doesn't do any mocking or stubbing; `cy.server` simply allows us to add
mocks where we want, otherwise requests will pass through to our actual server.

`cy.server` also allows us to spy on network requests and routes.

### Using `cy.route` to mock endpoints

By inspecting the logs of our spec, we can see that Cypress is making an XHR
request to `/api/todos`:

```
TEST
  VISIT /
  (XHR) GET 200 /api/todos
```

We can mock out the request:

```javascript
cy.route('/api/todos', // data to respond with)
```

Let's generate data using [`test-data-bot`](https://github.com/jackfranklin/test-data-bot):

```javascript
// cypress/fixtures/generators/todo-items.js
const {arrayOf, bool, build, fake, incrementingId} = require('test-data-bot');

const todoItemBuilder = build('Todo Item').fields({
  completed: bool(),
  id: incrementingId(),
  text: fake(f => f.lorem.words(3)),
});

const todoItemsBuilder = (n = 3) => {
  const builder = build('Todo Items')
    .fields({array: arrayOf(todoItemBuilder, n)})
    .map(({array}) => array);

  return builder();
};

module.exports = {todoItemsBuilder};
```

Now we can generate data for every mocked endpoint:

```javascript
// 07-todos.spec.js
import {arrayOf} from 'test-data-bot';
import {todoItemsBuilder} from '../fixtures/generators/todo-item';

// ...
  cy.server()

  cy.route('/api/todos', todoItemsBuilder(3))
    .as('get-todos');

  cy.wait('@get-todos');

  cy.findAllByTestId(/^todo-item/).should('have.length', 3);
// ...
```

We define an alias using `cy.route(...).as('[alias-name]')` for the mocked request,
and then wait for the request to respond using `cy.wait('@[alias-name]')`.

`cy.route` allows one to define [options](https://docs.cypress.io/api/commands/route.html#Options)
to the mocked endpoint, such as delays, forcing 404s, setting headers, and method.

### Inspecting requests and responses

Clicking on the XHR request in the Cypress logs while dev tools is open will
reveal request and response data for the request.

## 8. Assert on Your Redux Store with Cypress

- [08-todos.spec.js](./cypress/integration/08-todos.spec.js)
- [src/index.js](./src/index.js)

At the moment we're only evaluating the interface of our app, but it could be
useful to assert on the internals. e.g. we may want to assert that a redux store
contains the values we expect.

To do this, we need our app to be aware of Cypress so that we can provide
information to Cypress that we can assert on within tests.

Cypress exposes itself on the `window` object, which we can then use to
determine whether we're in the context of Cypress or not, and if so, assign
values in our app to the window so that Cypress has access to them:

```javascript
// src/index.js

// ...

if (window.Cypress) {
  window.store = store;
}

// ...
```

Now, in our tests we can access `window` via Cypress' `cy.window` method:

```javascript
cy.window().then($window => console.log($window.store))
// => redux store we exposed
```

Cypress allows us to get objects on `window` via `.its`, and allows us to execute
functions using `.invoke`:

```javascript
// invoke store.getState so we can assert on the store
cy.window()
  .its('store')
  .invoke('getState')
  .then(state => {
    console.log(state);

    retur state;
  })
  .should('deep.equal', {todos: todoItems, visibilityFilter: 'show_all'});
```

## 9. Create Custom Cypress Commands

- [09-todos.spec.js](./cypress/integration/09-todos.spec.js)
- [cypress/support/commands.js](./cypress/support/commands.js)

Getting the store in the previous lesson would be tedious if we had to use the
same sequence of commands in multiple places. To address this, Cypress allows
one to create custom commands that can be chained like Cypress' native commands.

There are 3 types of commands that can be created in Cypress:

- parent commands: commands that start a chain of assertions. Parent commands
    ignore any commands that appear before them in a chain
- child commands: commands that follow a parent command or another child command
- dual commands: commands that can be either at the beginning of a chain or in
    the middle

We can simplify the redux store command by creating a parent command in
`cypress/support/commands.js`:

```javascript
# cypress/support/commands.js
Cypress.Cammands.add('getStoreState', () => {
  return cy.window()
    .its('store')
    .invoke('getState')
})
```

### Suppressing commands inside a custom command

Currently, despite having our custom command, all the internals of the command
are still output. i.e. we can see the `ITS` and `INVOKE` logs in Cypress'
output. It'd be convenient if we can suppress these, and show a more meaningful
message.

Cypress allows one to create a custom log using `Cypress.log`:

```javascript
const log = Cypress.log({name: 'myLogName'}); // => writes MYLOGNAME to Cypress log
```

Many Cypress commands can also have their log output suppressed:

```javascript
// suppress output of `cy.window` log
cy.window({log: false});
```

Commmands such as `its` and `invoke`, however, can't be suppressed. In this
case we can forego their usage so that we don't have to deal with their logs at
all. We cam do this by chaining on `cy.window` with then to explicitly return
the state from the store:

```javascript
const log = Cypress.log({name: 'getStoreState'});

cy.window().then($window => $window.store.getState());
```

### Logging state to the console in a custom command

We've suppressed native logs and added a custom log to our custom command, but
we don't have access to the store in our logs in the dev tools console.

Cypress allows one to modify logs within chains and define what is output to the
console:

```javascript
cy.window({log: false})
  .then($window => $window.store.getState())
  .then(state => {
    log.set({
      // print out a stringified version of our state in the Cypress logs
      message: JSON.stringify(state),
      // return the store's state to be output in the console
      consoleProps: () => {
        return state;
      }
    })

    return state;
  })
```

Now, by clicking on our `GETSTORESTATE` log in the Cypress output, we can
inspect the store's state in the dev tools console.

### User-defined state in the console

It's plausible that we could end up logging a massive state object to the
console which may end up being tedious to traverse.

To make this more user friendly, we can accept a property name in our custom
command definition that can be used to return specific properties in our state:

```javascript
Cypress.Commands.add('getStoreState', stateProp => {
  const log = Cypress.log({name: 'getStoreState'});
  const logState = state => {
    log.set({
      message: JSON.stringify(state),
      consoleProps: () => state,
    });

    return state;
  };

  return (
    cy
      .window({log: false})
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
```

## 10. Wrap External Libraries with Cypress

[10-todos.spec.js](./cypress/integration/10-todos.spec.js)

Because of Cypress' async nature, simply importing a library and attempting to
use it won't work:

```javascript
import _ from 'lodash';

// ...
  // _.filter is not available
  _.filter(cy.getStoreState('todos'), todo => todo.id === 1);
// ...
```

Instead, we can use Cypress' chaining to filter on items once Cypress has access
to them:

```javascript
// ...

    cy.getStoreState('todos')
      .then(todos => _.filter(todos, todo => todo.id === 1))
      .should('deep.equal', _.filter(todoItems, todo => todo.id === 1));

// ...
```

We can abtract this by creating another custom command. If we attempt to use
`.filter` for our custom command, we'll get an error, so we'll use `lo_filter`
instead:

```javascript
# cypress/support/commands.js

import lodash from 'lodash';

// ...
/**
 * {prevSubject: true} instructs Cypress to treat this command as a child
 * command, passing in the previous subject for us to operate on
 */
Cypress.Commands.add('lo_filter', {prevSubject: true}, (subject, predicateFn) =>
  _.filter(subject, predicateFn)
);
```

### Wrapping an entire library

What if we wanted all of `lodash` available to us?

We can generate our commands as follows:

```javascript
// cypress/support/commands.js

const loMethodsNames = _.functions(_).map(fnName => `lo_${fnName}`)

loMethodsNames.forEach(loMethodName => {
  const realName = loMethodName.replace(/^lo_/, '');

  Cypress.Commands.add(loMethodName, {prevSubject: true}, (subject, fn, ...args) => {
    const result = _[realName](subject, fn, ...args);

    Cypress.log({
      name: loMethodName,
      message: JSON.stringify(result),
      consoleProps: () => result,
    })

    return result;
  })
})
```

We now have every function in `lodash` available as a chainable `lo_[functionName]`
in Cypress.
