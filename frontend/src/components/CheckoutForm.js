import React from 'react';
import { injectStripe } from 'react-stripe-elements';
import { customers } from '../api/Customers';
import { orders } from '../api/Orders';

import '../css/CheckoutForm.css';
import AddressSection from './AddressSection';

const CURRENCY = 'USD';

const fromDollarToCent = amount => amount * 100;

const amount = 30;
const description = "The Reluctant Co-Op Card Game";

class CheckoutForm extends React.Component {
  constructor(props) {
    super(props);
    const state = {
      customer: {

      },
      order: {

      }
    }
  }
  handleSubmit = (ev) => {
    ev.preventDefault();
    const inputs = ev.target.querySelectorAll('input');
    const finalData = {
      token: {},
      shipping: {}
    };
    const isCheckbox = (input) => input.getAttribute('type') === 'checkbox';
    // const shippingCheck = inputs.find(isCheckbox);
    inputs.forEach(input => {
      return input.name !== '' && !input.name.indexOf('shipping') > 0 && input.value !== ''
        ? finalData['shipping'][input.name] = input.value
        : input.name.indexOf('shipping') 
          ? finalData['token'][input.name] = input.value 
            : false;
    })
      

    const shippingData = {};
    console.log(finalData);
    this.setState({ customer: finalData });
    console.log(this.state);
    // if billing and shipping are not the same
    // - Send billing address from Token
    // - Send shiping address from shipping fields
    // if they are the same
    // - Send both addresses from Token
    console.log(this.props);
    this.props.stripe.createToken(finalData.token)
    .then(token => {
      // console.log(`Recieved Stripe token: `, token);
      const data = token.token;
      
      customers.get(data.email)
        .then(customer => {
          if (!customer.err) {
            console.log(`${data.email} is an existing customer! Creating new order.`)
            orders.create({
              currency: CURRENCY,
              customer: customer.id,
              email: customer.email,
              items: [
                {
                  type: 'sku',
                  description,
                  currency: CURRENCY,
                  parent: 'sku_Bxh1tdSriZTLaj',
                  quantity: 1,
                  amount: fromDollarToCent(amount)
                }
              ],
              shipping: shippingData
            })
            .then(order => {
              orders.charge(order.id, {
                customer: customer.id
              })
              .then(charge => console.log('CHARGE', charge))
              .catch(err => console.log(err));
            })
            .catch(err => console.log(err));

          } else {
            console.log('No Customer Found! Creating customer');
            customers.create({
              description,
              email: data.email,
              source: data.id,
              metadata: {
                billing: {
                  address: {
                    line1: data.card.address_line1,
                    line2: data.card.address_line2,
                    city: data.card.address_city,
                    state: data.card.address_state,
                    postal_code: data.card.address_zip,
                    country: data.card.address_country
                  }
                }
              },
              shipping: shippingData
            })
            .then(customer => {
              // console.log('CUSTOMER', customer);
              console.log(`Creating new order for ${customer.email}`);
              orders.create({
                currency: CURRENCY,
                customer: customer.id,
                email: customer.email,
                items: [
                  {
                    type: 'sku',
                    description,
                    currency: CURRENCY,
                    parent: 'sku_Bxh1tdSriZTLaj',
                    quantity: 1,
                    amount: fromDollarToCent(amount)
                  }
                ],
                shipping: shippingData
              })
              .then(order => {
                orders.charge(order.id, { customer: customer.id })
                .then(data => {
                  console.log('Success! Order Paid!');
                  document.querySelector('.modal.active').classList.add('thanks');
                  setTimeout(() => {
                    document.querySelector('.modal.active').classList.remove('active', 'thanks');
                  }, 3000);
                })
                .catch(err => {
                  document.querySelector('.modal.active').classList.add('error');

                });

              })
              .catch(err => console.log(err));
            })
            .catch(err => console.log(err));
          }
        })
        .catch(err => console.log(err));
    });
  }

  

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <h2>Buy Now</h2>
        <p>Please fill out the order form below</p>
        <AddressSection />
        <button>Confirm order</button>
      </form>
    );
  }
};


export default injectStripe(CheckoutForm);