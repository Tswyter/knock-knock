import React, { Component } from 'react';
import { CardNumberElement, CardExpiryElement, CardCVCElement, PostalCodeElement, injectStripe } from 'react-stripe-elements';
import Script from 'react-load-script';

import customers from '../api/customers';
import orders from '../api/orders';

import './style.css';

class OrderForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      difShipping: true
    };
    this.toggleShipping = this.toggleShipping.bind(this);
    this.formSubmit = this.formSubmit.bind(this);
  }

  toggleShipping(e) {
    this.state.difShipping 
      ? this.setState({ difShipping: false }) 
      : this.setState({ difShipping: true });
  }

  formSubmit(e) {
    e.preventDefault();
    const formData = [].slice.call(e.target.querySelectorAll('input'));
    const difShipping = formData.filter(input => input.type === 'checkbox')[0].checked;
    const dataFields = formData.filter(input => input.type === 'text' || input.type === 'email');
    const shipSwitch = difShipping ? 'shipping' : 'billing';

    const shippingAddress = {
      line1: dataFields.find(input => input.name === shipSwitch + 'Line1').value,
      line2: dataFields.find(input => input.name === shipSwitch + 'Line2').value,
      city: dataFields.find(input => input.name === shipSwitch + 'City').value,
      state: dataFields.find(input => input.name === shipSwitch + 'State').value,
      postal_code: dataFields.find(input => input.name === shipSwitch + 'Zip').value,
      country: 'USA'
    };
    
    const apiObjects = {
      token: {
        address_line1: dataFields.find(input => input.name === 'billingLine1').value,
        address_city: dataFields.find(input => input.name === 'billingCity').value,
        address_state: dataFields.find(input => input.name === 'billingState').value,
        address_country: 'usa',
        name: dataFields.find(input => input.name === 'billingName').value,
        email: dataFields.find(input => input.name === 'email').value
      },
      customer: {
        description: '',
        email: dataFields.find(input => input.name === 'email' 
          ? input.value 
          : console.log('no email found')),
        source: '',
        shipping: {
          address: shippingAddress
        }
      },
      order: {
        currency: 'USD',
        customer: '',
        email: dataFields.find(input => input.name === 'email' 
          ? input.value 
          : console.log('no email found')),
        items: [
          {
            type: 'sku',
            description: '',
            currency: 'USD',
            parent: 'sku_Bxh1tdSriZTLaj',
            quantity: 1,
            amount: 3000
          }
        ],
        shipping: {
          address: shippingAddress,
          name: dataFields.find(input => input.name === shipSwitch + 'Name').value
        }
      }
    };
    console.log(apiObjects.token);
    this.props.stripe.createToken(apiObjects.token)
      .then(token => {
        const data = token.token;

        customers.get(dataFields.find(input => input.name === 'email').value)
          .then(customer => {
            if (!customer.err) {
              apiObjects.order['customer'] = customer.id;
              orders.create(apiObjects.order)
                .then(order => {
                  orders.charge(order.id,{ customer: customer.id })
                    .then(charge => console.log('CHARGE', charge))
                    .catch(err => console.log(err));
                })
                .catch(err => console.log(err));
            } else {
              apiObjects.customer['source'] = data.id;
              customers.create(apiObjects.customer);
            }        
          })
          .catch(err => console.log(err));
      })
      .catch(err => console.log(err));
  }

  render() {
    return (
      <form onSubmit={this.formSubmit} id="orderForm">
        <h2>Billing Info</h2>
        <input type="text" placeholder="name" name="billingName" className="input" value="taylor" required />
        <input type="email" placeholder="email" name="email" className="input" value="testymctester@testingtests.com" required />
        <div className="cardInfo">
          <CardNumberElement className="cardNumber input" required />
          <CardExpiryElement className="cardExp input" required />
          <CardCVCElement className="cardCVC input" required />
        </div>
        <div className="billingAddress">
          <input type="text" placeholder="Street Address" name="billingLine1" className="input" value="90 hartshorn st." required />
          <input type="text" placeholder="Street Address Line 2" name="billingLine2" className="input"  />
          <input type="text" placeholder="City" name="billingCity" className="input" value="reading" required />
          <input type="text" placeholder="State" name="billingState" className="input" value="MA" required />
          <input type="text" placeholder="Zip" name="billingZip" className="input" value="01867" required />
        </div>
        <h2>Shipping Info</h2>
        <input type="checkbox" id="difShipping" onChange={this.toggleShipping} />
        <label htmlFor="difShipping">
          Same as Billing
        </label>
        <div className={this.state.difShipping ? 'shippingAddress on' : 'shippingAddress off'}>
          <input type="text" placeholder="name" name="shippingName" className="input" value="someone else" />
          <input type="text" placeholder="Street Address" name="shippingLine1" className="input" value="3231 washington st." />
          <input type="text" placeholder="City" name="shippingCity" className="input" value="jamaica plain" />
          <input type="text" placeholder="State" name="shippingState" className="input" value="Massachusetts" />
          <input type="text" placeholder="Zip" name="shippingZip" className="input" value="02198" />
        </div>
        <input type="submit" value="submit" />
      </form>
    )
  }
}

export default injectStripe(OrderForm);