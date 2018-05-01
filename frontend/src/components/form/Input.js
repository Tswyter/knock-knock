import React, { Component } from 'react';

export default class Input extends Component {
  render() {
    return (
      <label htmlFor={this.props.id} style={{ display: 'flex', flexDirection: 'column', textAlign: 'left', flexGrow: '1' }}>
        {`${this.props.name} ${this.props.required ? '*' : ''}`}
        <input id={this.props.id} type={this.props.type} name={this.props.name} value={this.props.value} placeholder={this.props.placeholder} onChange={e => this.props.handleChange(this.props.id, e.target.value)} required={this.props.required} />
      </label>
    )
  }
}