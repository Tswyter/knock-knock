import React, { Component } from 'react';
import { render } from 'react-dom';
// import Header from './Header';
import Hero from './components/Hero';
import Modal from './components/Modal';
import Slider from './components/Slider';
import './styles/style.css';

class App extends Component {
  constructor() {
    super();
    this.state = {
      name: 'Knock Knock',
      company: 'Knock Knock Cards',
      tagline: 'The Reluctant Co-Op Card Game',
      modal: false
    };

    this.toggleModal = this.toggleModal.bind(this);
  }

  toggleModal(e) {
    if (this.state.modal && e.target.classList.contains('modal-control')) {
      this.setState({ modal: false });
      document.body.classList.remove('freeze');
    } else {
      this.setState({ modal: true });
      document.body.classList.add('freeze');
    }
    return this.state.modal;
  }

  render() {
    return (
      <div id="myCanvas">
        <Modal isOpen={this.state.modal} toggleModal={this.toggleModal} />
        <Hero name={this.state.name} tagline={this.state.tagline} toggleModal={this.toggleModal} />
        <Slider />
      </div>
    );
  }
}

render(<App />, document.getElementById('root'));
