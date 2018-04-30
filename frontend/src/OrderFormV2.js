import React, { Component } from 'react';
import { CardNumberElement, CardExpiryElement, CardCVCElement, PostalCodeElement, injectStripe } from 'react-stripe-elements';

import customers from './api/customers';
import orders from './api/orders';

import './style.css';

class OrderForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orderStatus: 'takingOrder',
      orderMessage: '',
      quantity: 1,
      price: 30
    };
    
    this.formSubmit = this.formSubmit.bind(this);
    this.submissionResponse = this.submissionResponse.bind(this);
    this.handleQuantity = this.handleQuantity.bind(this);
    this.handleInput = this.handleInput.bind(this);
  }

  submissionResponse(res) {
    console.log('Submission message: ', res.message);
    switch (res.status) {
      case 'processing':
        this.setState({ 
          orderStatus: 'processing',
          orderMessage: res.message
        });
        setTimeout(() => {
          this.setState({
            orderStatus: 'takingOrder'
          });
        }, 2500);
        break;
      case 'success':
        this.setState({
          orderStatus: 'success',
          orderMessage: res.message
        });
        break;
      case 'error':
        this.setState({
          orderStatus: 'error',
          orderMessage: res.message
        });
        setTimeout(() => {
          this.setState({
            orderStatus: 'takingOrder'
          });
        }, 2500);
        break;
      default: 
        this.setState({
          orderStatus: 'takingOrder',
          orderMessage: res.message
        });
        break;
    }
  }

  formSubmit(e) {
    e.preventDefault();
    this.submissionResponse({
      status: 'processing',
      message: 'Processing your order...'
    });

    const apiObjects = {
      token: {
        address_line1: this.state.orderBillingAddress1,
        address_line2: this.state.orderBillingAddress2,
        address_city: this.state.orderBillingCity,
        address_state: this.state.orderBillingState,
        address_country: 'usa',
        name: this.state.orderBillingName,
        email: this.state.orderBillingEmail
      },
      customer: {
        description: 'Knock Knock - The Reluctant Co-Op Card Game',
        email: this.state.orderBillingEmail,
        source: '',
        shipping: {
          address: {
            line1: !this.state.shippingCheckbox ? this.state.orderShippingAddress1 : this.state.orderBillingAddress1,
            line2: !this.state.shippingCheckbox ? this.state.orderShippingAddress2 : this.state.orderBillingAddress2,
            city: !this.state.shippingCheckbox ? this.state.orderShippingCity : this.state.orderBillingCity,
            state: !this.state.shippingCheckbox ? this.state.orderShippingState : this.state.orderBillingState,
            postal_code: !this.state.shippingCheckbox ? this.state.orderShippingZip : this.state.orderBillingZip,
            country: 'USA',
          },
          name: !this.state.shippingCheckbox ? this.state.orderShippingName : this.state.orderBillingName
        }
      },
      order: {
        currency: 'USD',
        email: this.state.orderBillingEmail,
        items: [
          {
            type: 'sku',
            description: 'Knock Knock - The Reluctant Co-Op Card Game',
            currency: 'USD',
            parent: 'sku_Bxh1tdSriZTLaj',
            quantity: this.state.quantity,
            amount: this.state.quantity * 3000
          }
        ],
        shipping: {
          address: {
            line1: !this.state.shippingCheckbox ? this.state.orderShippingAddress1 : this.state.orderBillingAddress1,
            line2: !this.state.shippingCheckbox ? this.state.orderShippingAddress2 : this.state.orderBillingAddress2,
            city: !this.state.shippingCheckbox ? this.state.orderShippingCity : this.state.orderBillingCity,
            state: !this.state.shippingCheckbox ? this.state.orderShippingState : this.state.orderBillingState,
            postal_code: !this.state.shippingCheckbox ? this.state.orderShippingZip : this.state.orderBillingZip,
            country: 'USA',
          },
          name: !this.state.shippingCheckbox ? this.state.orderShippingName : this.state.orderBillingName
        }
      },
      shipping: {
        address: {
          line1: !this.state.shippingCheckbox ? this.state.orderShippingAddress1 : this.state.orderBillingAddress1,
          line2: !this.state.shippingCheckbox ? this.state.orderShippingAddress2 : this.state.orderBillingAddress2,
          city: !this.state.shippingCheckbox ? this.state.orderShippingCity : this.state.orderBillingCity,
          state: !this.state.shippingCheckbox ? this.state.orderShippingState : this.state.orderBillingState,
          postal_code: !this.state.shippingCheckbox ? this.state.orderShippingZip : this.state.orderBillingZip,
          country: 'USA',
        },
        name: !this.state.shippingCheckbox ? this.state.orderShippingName : this.state.orderBillingName
      }
    };
    // look into createSource instead if the customer isn't found.
    customers.get(this.state.orderBillingEmail)
      .then(customer => {
        if (!customer.err) {
          // create new source based on data.
          this.props.stripe.createToken(apiObjects.token)
            .then(source => console.log('source', source))
            .catch(err => console.error(err));
        } else {
          this.props.stripe.createToken(apiObjects.token)
            .then(token => console.log('token', token))
            .catch(err => console.error(err));
        }
      })


    // this.props.stripe.createToken(apiObjects.token)
    //   .then(token => {

    //     // If token created:
    //     if (!token.error) {
    //       customers.get(this.state.orderBillingEmail)
    //         .then(customer => {
    //           // if customer exists
    //           if (!customer.err) {
    //             console.log('CUSTOMER: ', customer);
    //             this.submissionResponse({
    //               status: 'processing',
    //               message: 'Customer Found! Processing order...'
    //             });
    //             orders.create({
    //               currency: 'USD',
    //               email: this.state.orderBillingEmail,
    //               customer: customer.id,
    //               items: [
    //                 {
    //                   type: 'sku',
    //                   description: 'Knock Knock - The Reluctant Co-Op Card Game',
    //                   currency: 'USD',
    //                   parent: 'sku_Bxh1tdSriZTLaj',
    //                   quantity: this.state.quantity,
    //                   amount: this.state.quantity * 3000
    //                 }
    //               ],
    //               shipping: {
    //                 address: {
    //                   line1: !this.state.shippingCheckbox ? this.state.orderShippingAddress1 : this.state.orderBillingAddress1,
    //                   line2: !this.state.shippingCheckbox ? this.state.orderShippingAddress2 : this.state.orderBillingAddress2,
    //                   city: !this.state.shippingCheckbox ? this.state.orderShippingCity : this.state.orderBillingCity,
    //                   state: !this.state.shippingCheckbox ? this.state.orderShippingState : this.state.orderBillingState,
    //                   postal_code: !this.state.shippingCheckbox ? this.state.orderShippingZip : this.state.orderBillingZip,
    //                   country: 'USA',
    //                 },
    //                 name: !this.state.shippingCheckbox ? this.state.orderShippingName : this.state.orderBillingName
    //               }
    //             })
    //               .then(order => {
    //                 this.submissionResponse({
    //                   status: 'processing',
    //                   message: 'Charging order...'
    //                 });
    //                 const customerSourceMatch = customer.sources.data.find(card => card.last4 === token.token.card.last4);
    //                 console.log(customerSourceMatch);
    //                 const paymethod = customer.sources.total_count > 0 && typeof(customerSourceMatch) !== 'undefined' ? customer.id : token.token.id;
    //                 orders.charge(order.id, paymethod, order)
    //                   .then(charge => {
    //                     this.submissionResponse({
    //                       status: 'success',
    //                       message: 'Thank you for your purchase!'
    //                     });
    //                   });
    //               }).catch(err => this.submissionResponse({ status: 'error', message: 'Something went wrong processing your order. Please try again later!' }))

    //           // if customer doesn't exist
    //           } else {
    //             this.submissionResponse({
    //               status: 'processing',
    //               message: 'Processing new customer...'
    //             });
    //             apiObjects.customer['source'] = token.token.id;
    //             customers.create(apiObjects.customer)
    //               .then(customer => {
    //                 this.submissionResponse({
    //                   status: 'processing',
    //                   message: 'Processing order for customer...'
    //                 })
    //                 apiObjects.order['customer'] = customer.id;
    //                 orders.create(apiObjects.order)
    //                   .then(order => {
    //                     this.submissionResponse({
    //                       status: 'processing',
    //                       message: 'Paying order...'
    //                     });
    //                     orders.charge(order.id, customer.id, order)
    //                       .then(charge => this.submissionResponse({ status: 'success', message: 'Thank you for your purchse!' }))
    //                   }).catch(err => this.submissionResponse({ status: 'error', message: 'Something went wrong charging your order. Please try again later!' }));
    //               }).catch(err => this.submissionResponse({ status: 'error', message: 'Something went wrong creating a customer for this order. Please try again later!' }));
    //           }
    //         }).catch(err => this.submissionResponse({ status: 'error', message: 'Something went wrong when checking for the customer. Please try again later!'}));
          
    //     // if token not created: 
    //     } else {
    //       this.submissionResponse({
    //         status: 'error',
    //         message: token.error.message
    //       })
    //     }
    //   }).catch(err => this.submissionResponse({ status: 'error', message: 'Something went wrong! Please try again later.'}));
  }

  handleQuantity(e) {
    this.setState({ quantity: e.target.value });
  }

  handleInput(field, value) {
    this.setState({ [field]: value });
  }

  render() {
    return (
      <div>
        <h3>Pre-Order Today</h3>
        <p>Knock Knock will ship out on May 1st.</p>
        <div className="product-info">
          <ul>
            <li>
              <div className="product-info__details">
                <div className="product-info__image">
                  <img src="https://www.knockknockcards.com/images/IMG_0352-edit2.png" alt="#" />
                </div>
                <div className="product-info__text">
                  <h2>Knock Knock Card Game</h2>
                  <p>Brief description about this being the base game</p>
                </div>
              </div>
              <div className={this.state.orderStatus === 'takingOrder' ? 'product-info__pricing on' : 'product-info__pricing off'}>
                <p style={{ marginBottom: '0'}}>Quantity</p>
                <select onChange={this.handleQuantity}>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                  <option value="6">6</option>
                  <option value="7">7</option>
                  <option value="8">8</option>
                  <option value="9">9</option>
                  <option value="10">10</option>
                </select>
                <h4 style={{ marginTop: '15px' }}>{this.state.quantity} for ${this.state.price * this.state.quantity}.00</h4>
                <p style={{ margin: '0' }}><small>Free Shipping</small></p>
                
              </div>
            </li>
          </ul>
        </div>
        <div className={this.state.orderStatus === 'takingOrder' ? 'billing-info on' : 'billing-info off'}>
          <h3>Billing Info</h3>
          <p style={{ color: 'red' }}>{this.state.orderMessage}</p>
          <form onSubmit={this.formSubmit}>
            <div className="input-row">
              <input type="text" placeholder="name" onChange={e => this.handleInput('orderBillingName', e.target.value)} />
              <input type="email" placeholder="Email Address" onChange={e => this.handleInput('orderBillingEmail', e.target.value)} />
            </div>
            <div className="input-row card-info">
              <CardNumberElement className="stripe-card input" required />
              <CardExpiryElement className="stripe-expiration input" required />
              <CardCVCElement className="stripe-ccv input" required />
            </div>
            <div className="input-row">
              <input type="text" placeholder="Address 1" onChange={e => this.handleInput('orderBillingAddress1', e.target.value)} />
              <input type="text" placeholder="Address 2" onChange={e => this.handleInput('orderBillingAddress2', e.target.value)} />
            </div>
            <div className="input-row">
              <input type="text" placeholder="City" onChange={e => this.handleInput('orderBillingCity', e.target.value)} />
              <input type="text" placeholder="State" onChange={e => this.handleInput('orderBillingState', e.target.value)} />
              <PostalCodeElement style={ { maxWidth: '100px' } }  className="input billingZip" name="billingZip" onChange={e => this.handleInput('orderBillingZip', e.value)} required />
            </div>
            <div className="shipping-details">
              <h3>Shipping Info</h3>
              <input type="checkbox" id="shippingCheckbox" onChange={e => this.handleInput('shippingCheckbox', e.target.checked )} />
              <label htmlFor="shippingCheckbox">
                Same as Billing Address {this.state.shippingCheckbox}
              </label>
              <div className="shipping-info">
                <div className="input-row">
                  <input type="text" placeholder="name" onChange={e => this.handleInput('orderShippingName', e.target.value)} />
                </div>
                <div className="input-row">
                  <input type="text" placeholder="Address 1" onChange={e => this.handleInput('orderShippingAddress1', e.target.value)} />
                  <input type="text" placeholder="Address 2" onChange={e => this.handleInput('orderShippingAddress2', e.target.value)} />
                </div>
                <div className="input-row">
                  <input type="text" placeholder="City" onChange={e => this.handleInput('orderShippingCity', e.target.value)} />
                  <input type="text" placeholder="State" onChange={e => this.handleInput('orderShippingState', e.target.value)} />
                  <input type="text" placeholder="Zip" onChange={e => this.handleInput('orderShippingZip', e.target.value)} />
                </div>
              </div>
            </div>
            <input type="submit" value="Submit" />
          </form>
        </div>
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