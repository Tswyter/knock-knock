import React, { Component } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="AppContainer">
        <div className="App">
          <Header />
          <Hero />
        </div>
        <div className="Details">
        </div>
      </div>
    );
  }
}

export default App;
