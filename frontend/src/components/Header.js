import React, { Component } from 'react';

const logoHorizontal = 'https://cdn2.hubspot.net/hubfs/2524912/knock-knock--horizontal.svg';

class Header extends Component {
  render() {
    return (
      <header className="App-header">
        <div className="logo-name">
          <img src={logoHorizontal} className="App-logo" alt="logo" />
        </div>
      </header>
    );
  }
}

export default Header;

