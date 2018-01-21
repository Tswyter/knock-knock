import React from 'react';
import { Elements, StripeProvider } from 'react-stripe-elements';
import CheckoutForm from './CheckoutForm';

import STRIPE_PUBLISHABLE from '../constants/stripe';

class StripeCheckout extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: ''
    }
  }
  componentWillMount() {
    console.log(this.props);
    this.setState(state => { return { modal: 'closed' } });
  }
  componentDidMount() {
    console.log('Ready to take orders!', this.state);
  }
  toggleModal(e) {
    const modal = document.querySelector('.modal');
    if (modal.classList.contains('active') && e.target.classList.contains('modal')) {
      modal.classList.remove('active');
    } else {
      modal.classList.add('active');
    }
  }
  render() {
    return (
      <div>
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
          <button onClick={this.toggleModal}>
            Buy Now
          </button>
          <a href="#learn-more">Learn More</a>
        </div>
        <div className="modal" onClick={this.toggleModal}>
          <div className="modal__content" style={{ maxWidth: '500px', padding: '20px', backgroundColor: '#FFF', margin: '50px auto'  }}>
            <StripeProvider apiKey={STRIPE_PUBLISHABLE}>
              <Elements>
                <CheckoutForm />
              </Elements>
            </StripeProvider>
            <div className="thank-you">
              Thanks for your order! :) 
            </div>
            <div className="error">
              Ooops there was an error!
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default StripeCheckout;