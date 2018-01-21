import React, { Component } from 'react';
import OrderForm from './OrderForm';
import { Elements, StripeProvider }  from 'react-stripe-elements';

const STRIPE_PUBLISHABLE = 'pk_test_acYpsKVm5y1UXmHcdvcdUXyK';

// import './style.css';

const modalBackground = {
  position: 'fixed',
  backgroundColor: 'rgba(0,0,0,0.2)',
  width: '100vw',
  height: '100vh'
};

const modalCard = {
  backgroundColor: 'white',
  padding: '20px',
  maxWidth: '600px',
  margin: '50px auto'
};

const PAYMENT_SERVER_URL = 'http://localhost:8080/';

class Modal extends Component {
  constructor(props) {
    super(props);

    this.formSubmit = this.formSubmit.bind(this);
  }

  render() {
    return (
      <div style={modalBackground} className={this.props.isOpen ? 'modalOpen modal-control' : 'modalClosed modal-control'} onClick={this.props.toggleModal}>
        <div style={modalCard}>
          <StripeProvider apiKey={STRIPE_PUBLISHABLE}>
            <Elements>
              <OrderForm />
            </Elements>
          </StripeProvider>
        </div>
      </div>
    );
  }
}

export default Modal;
