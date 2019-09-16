import React from 'react';
import {render} from 'react-dom';
import {createStore, applyMiddleware} from 'redux';
import createSagaMiddleware from 'redux-saga';
import {Provider} from 'react-redux';
import {rootSaga} from './sagas/TodoSagas';
import App from './components/App';
import reducer from './reducers';
import 'todomvc-app-css/index.css';

const sagaMiddleware = createSagaMiddleware();
const store = createStore(reducer, applyMiddleware(sagaMiddleware));
sagaMiddleware.run(rootSaga);

/**
 * Cypress exposes itself on window, allowing us to determine if our files are
 * being run in the context of Cypress or not
 *
 * Knowing we're in the context of Cypress, we can expose our store on the
 * global context, after which we can assert on our store from within Cypress
 *
 * see 08-todos.spec.js
 */
if (window.Cypress) {
  window.store = store;
}

render(
  <Provider store={store}>
    <App store={store} />
  </Provider>,
  document.getElementById('root')
);
