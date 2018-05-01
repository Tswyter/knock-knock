import React, { Component } from 'react';
import Input from './Input';

export default class AddressInputs extends Component {
  render() {
    return (
      <section className={this.props.type + '-address'}>
        <div className="input-row">
          <Input type="text" placeholder="Address 1" name="Address Line 1" handleChange={this.props.handleInput} id={`order${this.props.type}Address1`} />
          <Input type="text" placeholder="Address 2" name="Address Line 2" handleChange={this.props.handleInput} id={`order${this.props.type}Address2`} />
        </div>
        <div className="input-row">
          <Input type="text" placeholder="City" name="City" handleChange={this.props.handleInput} id={`order${this.props.type}City`} />
          <Input type="text" placeholder="State" name="State" handleChange={this.props.handleInput} id={`order${this.props.type}State`} />
          <Input type="text" placeholder="01234" name="Zip Code" handleChange={this.props.handleInput} id={`order${this.props.type}Zip`} />
        </div>
      </section>
    )
  }
}