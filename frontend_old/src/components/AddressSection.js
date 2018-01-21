import React from 'react';
import { CardNumberElement, CardExpiryElement, CardCVCElement, PostalCodeElement } from 'react-stripe-elements';

import '../css/CheckoutForm.css';

class AddressSection extends React.Component {
  componentWillMount() {
    
  }
  toggleBilling(e) {
    const currentData = e.target.parentNode.querySelectorAll('input');
    if (e.target.checked) {
      document.querySelector('.shipping').classList.add('hidden');
      console.log('CHECKED', e.target);
      currentData.forEach(input => {
        if (input.name.indexOf('shipping_') !== 0) {
          const subStr = input.name.substring('shipping_'.length);
          const matchedField = document.querySelector(`[name="${subStr}"]`);
          if (matchedField !== null) {
            matchedField.value = input.value;
          }
        }
      });
    } else {
      document.querySelector('.shipping').classList.remove('hidden');
    }
    // const addressData = currentData.map(input => input.name.indexOf('address_') > 0 ? input : null);
    // addressData.forEach(input => document.querySelector(`.billing ${input.name}`).value = input.value);
  }

  render() {
    return (
      <section className="address" style={{ display: 'flex', flexDirection: 'column', fontFamily: 'Helvetica' }}>
        <input className="input" name="name" type="text" placeholder="Name" required />
        <input className="input" name="email" type="email" placeholder="Email Address" required />
        <h2>Billing Information</h2>
        <div className="billing">
          <div className="card-info">
            <CardNumberElement className="card-number input" />
            <CardExpiryElement className="card-expiry input" />
            <CardCVCElement className="card-cvc input" />
          </div>
          <label>
            <input className="input" name="address_country" type="hidden" value="US" style={{ display: 'none' }}/>
            <input className="input" name="address_line1" type="text" placeholder="Street" required />
          </label>
          <label style={{ display: 'flex', flexDirection: 'row', width: '100%' }}>
            <input className="input" name="address_city" type="text" placeholder="City" required />
            <input className="input" name="address_state" type="text" placeholder="State" required />
            <PostalCodeElement className="card-zip input" />
          </label>
        </div>
        <h5>$25.00 + $5.00 <small>S/H</small></h5>
        <h3>Total: $30.00</h3>
        <h2>Shipping Address</h2>
        <input onChange={this.toggleBilling} type="checkbox" id="difShipping" />
        <label htmlFor="difShipping">Same as billing address</label>
        <div className="shipping">
          <label>
            <input className="input"  name="shipping_address_country" type="hidden" value="US" style={{ display: 'none' }}/>
            <input className="input"  name="shipping_address_line1" type="text" placeholder="House/Apartment # and Street" />
          </label>
          <label style={{ display: 'flex', flexDirection: 'row', width: '100%' }}>
            <input className="input"  name="shipping_address_city" type="text" placeholder="City" />
            <input className="input"  name="shipping_address_state" type="text" placeholder="State" />
            <input className="input"  name="shipping_address_postal_code" type="text" placeholder="Zip Code" />
          </label>
        </div>
      </section>
    );
  }
};

export default AddressSection;