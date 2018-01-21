import React from 'react';
import axios from 'axios';
import StripeCheckout from 'react-stripe-checkout';

import STRIPE_PUBLISHABLE from '../constants/stripe';
import PAYMENT_SERVER_URL from '../constants/server';

const CURRENCY = 'USD';

const fromDollarToCent = amount => amount * 100;

const sku = {
  get: data => 
    axios.get(`${PAYMENT_SERVER_URL}skus`, data)
      .then(sku => sku.data)
      .catch(err => console.log(err))
};

const orders = {
  create: data => 
    axios.post(`${PAYMENT_SERVER_URL}create_order`, data)
      .then(order => order.data)
      .catch(err => console.log(err))
  ,
  update: data => 
    axios.put(`${PAYMENT_SERVER_URL}update_order`, data)
      .then(order => order.data)
      .catch(err => console.log(err))
  ,
  delete: data => 
    axios.delete(`${PAYMENT_SERVER_URL}delete_order`, data)
      .then(order => order.data)
      .catch(err => console.log(err))
  ,
  charge: (orderId, data) => {
    console.log(`Paying order ${orderId}`);
    return axios.post(`${PAYMENT_SERVER_URL}charge_order?order=${orderId}`, data)
      .then(charge => charge.data)
      .catch(err => console.log(err));
  }
};

const customers = {
  get: (tokenEmail, data) => 
    axios.get(`${PAYMENT_SERVER_URL}customers/customer?email=${tokenEmail}`, data)
      .then(customer => customer.data)
      .catch(err => console.log(err))
  ,
  create: data => {
    console.log(`CREATING CUSTOMER ${data.email}`);
    return axios.post(`${PAYMENT_SERVER_URL}create_customer`, data)
      .then(customer => customer.data)
      .catch(err => console.log(err))
  },
  update: data => 
    axios.put(`${PAYMENT_SERVER_URL}update_customer`, data)
      .then(customer => customer.data)
      .catch(err => console.log(err))
  ,
  delete: data => 
    axios.delete(`${PAYMENT_SERVER_URL}delete_customer`, data)
      .then(customer => customer.data)
      .catch(err => console.log(err))
};

const onToken = (amount, description) => token => {
  console.log(token.email, token.id, token);
  customers.get(token.email)
    .then(customer => {
      if (!customer.err) {
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
          shipping: {
            address: {
              line1: token.card.address_line1,
              line2: token.card.address_line2,
              city: token.card.address_city,
              state: token.card.address_state,
              postal_code: token.card.address_zip,
              country: token.card.address_country 
            },
            name: token.card.name
          }
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
          email: token.email,
          source: token.id,
          shipping: {
            address: {
              line1: token.card.address_line1,
              line2: token.card.address_line2,
              city: token.card.address_city,
              state: token.card.address_state,
              postal_code: token.card.address_zip,
              country: token.card.address_country
            },
            name: token.card.name
          }
        })
        .then(customer => {
          console.log('CUSTOMER', customer);
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
            shipping: {
              address: {
                line1: token.card.address_line1,
                line2: token.card.address_line2,
                city: token.card.address_city,
                state: token.card.address_state,
                postal_code: token.card.address_zip,
                country: token.card.address_country 
              },
              name: token.card.name
            }
          })
          .then(order => {
            orders.charge(order.id, { customer: customer.id })
          })
          .catch(err => console.log(err));
        })
        .catch(err => console.log(err));
      }
    })
    .catch(err => console.log(err));
    
}
  // check if customer exists
  // if so:
    // If not already attached, attach payment method to customer
    // create new order with SKU and customer attached
    // pay order (should this happen manually when Brian sends the package?)
  // if not: 
    // create new customer (capture payment details)
    // create new order with SKU and new customer attached
    // pay order



const Checkout = ({ name, description, amount }) => 
  <StripeCheckout
    name={name}
    description={description}
    amount={fromDollarToCent(amount)}
    token={onToken(amount, description)}
    currency={CURRENCY}
    shippingAddress
    billingAddress
    stripeKey={STRIPE_PUBLISHABLE}
  >
    <button className="btn btn-primary">
      Buy Now
    </button>
  </StripeCheckout>

export default Checkout;