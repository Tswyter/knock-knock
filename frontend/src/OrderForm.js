import React, { Component } from 'react';
import { CardNumberElement, CardExpiryElement, CardCVCElement, PostalCodeElement, injectStripe } from 'react-stripe-elements';

import customers from './api/customers';
import orders from './api/orders';

import './style.css';

class OrderForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      difShipping: true,
      orderStatus: 'takingOrder',
      orderMessage: ''
    };
    this.toggleShipping = this.toggleShipping.bind(this);
    this.formSubmit = this.formSubmit.bind(this);
    this.submissionResponse = this.submissionResponse.bind(this);
  }

  toggleShipping(e) {
    this.state.difShipping 
      ? this.setState({ difShipping: false }) 
      : this.setState({ difShipping: true });
  }

  submissionResponse(res) {
    console.log('Submission message: ', res.message);
    res.status === 'processing'
      ? this.setState({ 
          orderStatus: 'processing',
          orderMessage: res.message
        })
      : res.status === 'success'
        ? this.setState({
            orderStatus: 'success',
            orderMessage: res.message
          })
        : res.status === 'error' 
          ? this.setState({
              orderStatus: 'error',
              orderMessage: res.message
            })
          : this.setState({
            orderStatus: 'takingOrder',
            orderMessage: res.message
          });
  }

  chargeOrder(order, data) {
    const { id: token } = data;
    orders.charge(order.id, token, data)
      .then(charge => {
      console.log('CHARGE', charge, charge.status);
      
      if (charge.status === 'paid') {
        this.submissionResponse({
          status: 'success',
          message: 'Paying your order with the credit card provided! You should recieve an email soon at ' + data.email
        });
      } else {
        this.submissionResponse({
          status: 'error',
          message: charge.message ? charge.message : 'Something went wrong when charging your card. Please try again later!'
        });
      }

    })
    .catch(err => console.log(err));
  }

  formSubmit(e) {
    e.preventDefault();
    const formData = [].slice.call(e.target.querySelectorAll('.input'));
    const difShipping = formData.filter(input => input.type === 'checkbox')[0].checked;
    const dataFields = formData.filter(input => input.type === 'text' || input.type === 'email');
    const shipSwitch = difShipping ? 'billing' : 'shipping';

    const shippingAddress = {
      address: {
        line1: dataFields.find(input => input.classList.contains(shipSwitch + 'Line1')).value,
        line2: dataFields.find(input => input.classList.contains(shipSwitch + 'Line2')).value,
        city: dataFields.find(input => input.classList.contains(shipSwitch + 'City')).value,
        state: dataFields.find(input => input.classList.contains(shipSwitch + 'State')).value,
        postal_code: formData.find(input => {
          return input.classList.contains(shipSwitch + 'Zip');
        }).value,
        country: 'USA'
      },
      name: dataFields.find(input => input.classList.contains(shipSwitch + 'Name')).value
    };
    
    const apiObjects = {
      token: {
        address_line1: dataFields.find(input => input.classList.contains('billingLine1')).value,
        address_city: dataFields.find(input => input.classList.contains('billingCity')).value,
        address_state: dataFields.find(input => input.classList.contains('billingState')).value,
        address_country: 'usa',
        name: dataFields.find(input => input.classList.contains('billingName')).value,
        email: dataFields.find(input => input.classList.contains('email')).value
      },
      customer: {
        description: 'Knock Knock - The Reluctant Co-Op Card Game',
        email: dataFields.find(input => input.classList.contains('email')).value,
        source: '',
        shipping: shippingAddress
      },
      order: {
        currency: 'USD',
        customer: '',
        email: dataFields.find(input => input.classList.contains('email')).value,
        items: [
          {
            type: 'sku',
            description: 'Knock Knock - The Reluctant Co-Op Card Game',
            currency: 'USD',
            parent: 'sku_Bxh1tdSriZTLaj',
            quantity: 1,
            amount: 3000
          }
        ],
        shipping: shippingAddress
      }
    };
    this.props.stripe.createToken(apiObjects.token)
      .then(token => {
        console.log('TOKEN', token);
        const data = token.token;
        customers.get(data.email)
          .then(customer => {
            console.log('CUSTOMER', customer);
            if (!customer.err && customer.sources.total_count > 0) {
              this.submissionResponse({
                status: 'processing',
                message: 'Customer found!'
              });
              apiObjects.order.customer = customer.id;
              orders.create(apiObjects.order)
                .then(order => {
                  console.log('ORDER', order);
                  if (order.status === 'created') {
                    this.submissionResponse({
                      status: 'processing',
                      message: `Order created!`
                    });
                    this.chargeOrder(order, data);
                  } else {
                    this.submissionResponse({
                      status: 'error',
                      message: order.code === 'out_of_inventory' ? 'Oops, looks like we are out of inventory. Please sign up for email updates!' : order.message ? order.message : 'Something went wrong when creating your order. Please try again later!'
                    });
                  }
                });
            } else {
              apiObjects.customer.source = data.id;
              customers.create(apiObjects.customer)
                .then(customer => {
                  this.submissionResponse({
                    status: 'processing',
                    message: 'Customer created!'
                  });
                  apiObjects.order.customer = customer.id;
                  orders.create(apiObjects.order)
                    .then(order => {
                      if (!order.err) {
                        console.log('ORDER', order, token);
                        this.submissionResponse({
                          status: 'processing',
                          message: 'Order created!'
                        });
                        this.chargeOrder(order, data);
                      } else {
                        this.submissionResponse({
                          status: 'error',
                          message: order.message ? order.message : 'Something went wrong creating your order.'
                        });
                      }
                    })
                })
                .catch(err => this.submissionResponse({
                  status: 'error',
                  message: 'Issue creating a customer.'
                }));
            }        
          })
          .catch(err => this.submissionResponse({
            status: 'error',
            message: 'Oh no!'
          }));
      })
      .catch(err => {
        console.log(err);
        this.submissionResponse({
          status: 'error',
          message: 'Something went wrong!'
        });
        setTimeout(() => this.submissionResponse({ status: 'takingOrder', message: 'There was something wrong with the form. Try again!' }), 2000);
      });
  }

  render() {
    return (
      <div>
        <form onSubmit={this.formSubmit} id="orderForm" className={this.state.orderStatus === 'takingOrder' ? 'on' : 'off'}>
          <h2>Billing Info</h2>
          {this.state.orderStatus === 'takingOrder' ? <p>{this.state.orderMessage}</p> : ''}
          <div className="horizontalInputs">
            <input type="text" placeholder="name" name="billingName" className="input billingName" required />
            <input type="email" placeholder="email" name="email" className="input email" required />
          </div>
          <div className="cardInfo">
            <CardNumberElement className="cardNumber input" required />
            <CardExpiryElement className="cardExp input" required />
            <CardCVCElement className="cardCVC input" required />
          </div>
          <div className="billingAddress">
            <div className="horizontalInputs">
              <input type="text" placeholder="Street Address" name="billingLine1" className="input billingLine1" required />
              <input type="text" placeholder="Street Address Line 2" name="billingLine2" className="input billingLine2"  />
            </div>
            <div className="horizontalInputs">
              <input type="text" placeholder="City" name="billingCity" className="input billingCity" required />
              <input type="text" placeholder="State" name="billingState" className="input billingState" required />
            
              <PostalCodeElement style={ { minWidth: '100px' } }  className="input billingZip" name="billingZip" required />
            </div>
          </div>
          <h2>Shipping Info</h2>
          <input type="checkbox" id="difShipping" className="input" onChange={this.toggleShipping} />

          <label htmlFor="difShipping">
            Same as Billing
          </label>
          <div className={this.state.difShipping ? 'shippingAddress on' : 'shippingAddress off'}>
            <input type="text" placeholder="name" name="shippingName" className="input shippingName" />
            <div className="horizontalInputs">
              <input type="text" placeholder="Street Address" name="shippingLine1" className="input shippingLine1" />
              <input type="text" placeholder="Street Address" name="shippingLine2" className="input shippingLine2" />
            </div>
            <div className="horizontalInputs">
              <input type="text" placeholder="City" name="shippingCity" className="input shippingCity" />
              <input type="text" placeholder="State" name="shippingState" className="input shippingState" />
              <input type="text" placeholder="Zip" name="shippingZip" className="input shippingZip" />
            </div>
          </div>
          <input type="submit" defaultValue="Submit Payment" />
        </form>
        <div className={this.state.orderStatus === 'error' ? 'error on' : 'error off'}>
          {this.state.orderMessage}
        </div>
        <div className={this.state.orderStatus === 'processing'  ? 'processing on' : 'processing off'}>
          {this.state.orderMessage}
        </div>
        <div className={this.state.orderStatus === 'success'  ? 'success on' : 'success off'}>
          {this.state.orderMessage}
        </div>
      </div>
    )
  }
}

export default injectStripe(OrderForm);