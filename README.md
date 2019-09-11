# Test Production Ready Apps with Cypress

Notes and annotations for Egghead's [Test Production Ready Apps with Cypress](Test Production Ready Apps with Cypress) course.

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [1. Course Introduction: Test Production Ready Apps with Cypress](#1-course-introduction-test-production-ready-apps-with-cypress)
- [2. Install Cypress in a Production Application](#2-install-cypress-in-a-production-application)
- [3. Setup Your Cypress Dev Environment](#3-setup-your-cypress-dev-environment)
  - [Custom Typescript config for code hints](#custom-typescript-config-for-code-hints)

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
