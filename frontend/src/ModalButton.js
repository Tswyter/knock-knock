import React, { Component } from 'react';

const buttonStyle = {
  padding: '15px',
  background: 'black',
  color: 'white',
  display: 'block',
  border: '0',
  marginTop: '20px',
  borderRadius: '3px'
};

class ModalButton extends Component {
  
  render() {
    return (
      <button style={buttonStyle} onClick={this.props.toggleModal}>
        {this.props.buttonText}
      </button>
    )
  }
}

export default ModalButton;