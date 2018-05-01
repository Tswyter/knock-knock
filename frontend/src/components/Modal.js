import React, { Component } from 'react';
import OrderForm from './OrderForm';
import { Elements, StripeProvider }  from 'react-stripe-elements';

// NEEDS TO BE UPDATED TO LIVE KEY
// const STRIPE_PUBLISHABLE = 'pk_test_acYpsKVm5y1UXmHcdvcdUXyK';
const STRIPE_PUBLISHABLE = 'pk_live_45Q0JAIT6HpONX1ZvPjjhlH8';

class Modal extends Component {
  render() {
    return (
      <div onClick={this.props.toggleModal} className={this.props.isOpen ? 'modalOpen modal-control' : 'modalClosed modal-control'}>
        <div className="modal-form">
          <StripeProvider apiKey={STRIPE_PUBLISHABLE}>
            <Elements>
              <OrderForm toggleModal={this.props.toggleModal} />
            </Elements>
          </StripeProvider>
        </div>
      </div>
    );
  }
}

export default Modal;
