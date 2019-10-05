import React from 'react';
import Header from '../containers/Header';
import MainSection from '../containers/MainSection';

window.REACT_APP_API_URL = process.env.REACT_APP_API_URL;

class App extends React.Component {
  componentDidMount() {
    this.props.store.dispatch({type: 'FETCH_TODOS'});
  }

  render() {
    return (
      <div>
        <Header />
        <MainSection />
      </div>
    );
  }
}

export default App;
