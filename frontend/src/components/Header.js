import React, { Component } from 'react';

class Header extends Component {
  render() {
    return (
      <header>
        <div className="logo">
          {this.props.name}
        </div>
      </header>
    )
  }
}

export default Header;