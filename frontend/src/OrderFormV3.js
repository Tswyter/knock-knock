import React, { Component } from 'react';
import { CardNumberElement, CardExpiryElement, CardCVCElement, PostalCodeElement, injectStripe } from 'react-stripe-elements';
import Input from './Input';

import orders from './api/orders';

import './style.css';

class OrderForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orderStatus: 'takingOrder',
      orderMessage: '',
      quantity: 1,
      price: 30,
      shippingCheckbox: false,
      orderBillingAddress2: ''
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
        break;
      case 'success':
        this.setState({
          orderStatus: 'success',
          orderMessage: res.message
        });
        break;
      case 'error':
        res.message = res.message === 'Network Error' ? 'Something went wrong. Please try again later.' : res.message ;
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

    const data = {
      customer: {
        email: this.state.orderBillingEmail,
        name: this.state.orderBillingName,
        billing: {
          name: this.state.orderBillingName,
          email: this.state.orderBillingEmail,
          address: {
            address_line1: this.state.orderBillingAddress1,
            address_line2: this.state.orderBillingAddress2.length > 0 ? this.state.orderBillingAddress2 : '',
            address_city: this.state.orderBillingCity,
            address_state: this.state.orderBillingState,
            address_country: 'usa',
            address_postal_code: this.state.orderBillingZip
          }
        },
        shipping: {
          name: this.state.shippingCheckbox ? this.state.orderShippingName : this.state.orderBillingName,
          address: {
            line1: this.state.shippingCheckbox ? this.state.orderShippingAddress1 : this.state.orderBillingAddress1,
            line2: this.state.shippingCheckbox ? this.state.orderShippingAddress2 : this.state.orderBillingAddress2.length > 0 ? this.state.orderBillingAddress2 : '',
            city: this.state.shippingCheckbox ? this.state.orderShippingCity : this.state.orderBillingCity,
            state: this.state.shippingCheckbox ? this.state.orderShippingState : this.state.orderBillingState,
            postal_code: this.state.shippingCheckbox ? this.state.orderShippingZip : this.state.orderBillingZip,
            country: 'USA',
          }
        }
      },
      order: {
        sku: 'sku_Bxh1tdSriZTLaj',
        quantity: this.state.quantity,
        amount: this.state.quantity * 3000
      }
    }

    this.props.stripe.createToken({
      address_line1: data.customer.billing.address.address_line1,
      address_line2: data.customer.billing.address.address_line2,
      address_city: data.customer.billing.address.address_city,
      address_state: data.customer.billing.address.address_state,
      address_country: data.customer.billing.address.address_country,
      name: data.customer.billing.name,
      email: data.customer.email
    }).then(token => {
      data['token'] = token.token;
      console.log('validate this!', data);
      console.log('Is there full billing and shipping info?');
      orders.process(data)
        .then(status => {
          this.submissionResponse({
            status: status.statusCode === 200 ? 'success' : 'error',
            message: status.message ? status.message : `Thank you for your purchase! You will recieve an email of with your receipt at ${this.state.orderBillingEmail}.`
          })
        });
    }).catch(err => console.log(err));
  }

  handleQuantity(e) {
    this.setState({ quantity: e.target.value });
  }

  handleInput(field, value) {
    console.log(field, value);
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
                  <p>Do you have what it takes to battle deceitful family and ghastly ghosts? Can you survive long enough to become the richest corpse?
To find out all you have to do is…knock!</p>
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
                <h4 style={{ marginTop: '15px' }}>{this.state.quantity} for ${(this.state.price * this.state.quantity) - 1}.99</h4>
                <p style={{ margin: '0' }}><small><em>Free Shipping</em></small></p>
                
              </div>
            </li>
          </ul>
        </div>
        <div className={this.state.orderStatus === 'takingOrder' ? 'billing-info on' : 'billing-info off'}>
          <form onSubmit={this.formSubmit}>
            <h3>Card Info</h3>
            <div className="input-row card-info">
              <label className="stripe-card" style={{ flexGrow: '1' }}>
                Card Number *
                <CardNumberElement className="input" required />
              </label>
              <label className="stripe-expiration" style={{ flexGrow: '1' }}>
                Expiration * 
                <CardExpiryElement className="input" required />
              </label>
              <label className="stripe-ccv" style={{ flexGrow: '1' }}>
                Security Code *
                <CardCVCElement className="input" required />
              </label>
              <label className="stripe-postal-code" style={{ flexGrow: '1' }}>
                Zip Code *
                <PostalCodeElement className="input" required />
              </label>
            </div>
            <h3 style={{ marginTop: '30px', borderTop: '2px solid #ededed', paddingTop: '30px' }}>Billing Info</h3>
            <p style={{ color: 'red' }}>{this.state.orderMessage}</p>
            <div className="input-row">
              <Input name="Name" id="orderBillingName" type="text" placeholder="name" handleChange={this.handleInput} required />
              <Input name="Email" id="orderBillingEmail" type="email" placeholder="Email Address" handleChange={this.handleInput} required />
              {/*<input type="text" placeholder="name" onChange={e => this.handleInput('orderBillingName', e.target.value)} required />*/}
              {/*<input type="email" placeholder="Email Address" onChange={e => this.handleInput('orderBillingEmail', e.target.value)} required />*/}
            </div>
            <div className="input-row">
              <Input type="text" placeholder="Address 1" name="Address Line 1" handleChange={this.handleInput} id="orderBillingAddress1" required />
              {/*<input type="text" placeholder="Address 1" onChange={e => this.handleInput('orderBillingAddress1', e.target.value)} required />*/}
              <Input type="text" placeholder="Address 2" name="Address Line 2" handleChange={this.handleInput} id="orderBillingAddress2" />
            </div>
            <div className="input-row">
              <Input type="text" placeholder="City" name="City" handleChange={this.handleInput} id="orderBillingCity" required />
              <Input type="text" placeholder="State" name="State" handleChange={this.handleInput} id="orderBillingState" required />
              <Input type="text" placeholder="01234" name="Zip Code" handleChange={this.handleInput} id="orderBillingZip" required />
              {/*<PostalCodeElement style={ { maxWidth: '100px' } }  className="input billingZip" name="billingZip" onChange={e => this.handleInput('orderBillingZip', e.value)} required />*/}
            </div>
            <div className="shipping-details">
              <h3>Shipping Info</h3>
              <input type="checkbox" defaultChecked={this.state.shippingCheckbox} id="shippingCheckbox" onChange={e => this.handleInput('shippingCheckbox', e.target.checked )} />
              <label htmlFor="shippingCheckbox">
                Same as Billing Address
              </label>
              <div className="shipping-info">
                <div className="input-row">
                  <Input name="Name" id="orderShippingName" type="text" placeholder="name" handleChange={this.handleInput} />
                  {/*<Input name="Email" id="orderBilllingEmail" type="email" placeholder="Email Address" handleChange={this.handleInput} />*/}
                  {/*<input type="text" placeholder="name" onChange={e => this.handleInput('orderBillingName', e.target.value)} required />*/}
                  {/*<input type="email" placeholder="Email Address" onChange={e => this.handleInput('orderBillingEmail', e.target.value)} required />*/}
                </div>
                <div className="input-row">
                  <Input type="text" placeholder="Address 1" name="Address Line 1" handleChange={this.handleInput} id="orderShippingAddress1" />
                  {/*<input type="text" placeholder="Address 1" onChange={e => this.handleInput('orderBillingAddress1', e.target.value)} required />*/}
                  <Input type="text" placeholder="Address 2" name="Address Line 2" handleChange={this.handleInput} id="orderShippingAddress2" />
                </div>
                <div className="input-row">
                  <Input type="text" placeholder="City" name="City" handleChange={this.handleInput} id="orderShippingCity" />
                  <Input type="text" placeholder="State" name="State" handleChange={this.handleInput} id="orderShippingState" />
                  <Input type="text" placeholder="01234" name="Zip Code" handleChange={this.handleInput} id="orderShippingZip" />
                  {/*<PostalCodeElement style={ { maxWidth: '100px' } }  className="input billingZip" name="billingZip" onChange={e => this.handleInput('orderBillingZip', e.value)} required />*/}
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