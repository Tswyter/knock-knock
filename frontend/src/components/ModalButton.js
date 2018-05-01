import React, { Component } from 'react';

class ModalButton extends Component {
  
  render() {
    return (
      <button onClick={this.props.toggleModal}>
        {this.props.buttonText}
      </button>
    )
  }
}

export default ModalButton;