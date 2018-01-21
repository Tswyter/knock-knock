import React, { Component } from 'react';
import StripeCheckout from './StripeCheckout';

const logoVertical = 'https://cdn2.hubspot.net/hubfs/2524912/knock-knock--vertical.svg';

class Hero extends Component {
  render() {
    return (
      <section className="hero">
        <div className="hero__wrapper">
          <div className="hero__item">
            <img src="./images/IMG_0352-edit2.png" alt="box" />
            <h1>The Reluctant Co-Op Card Game</h1>
            <p>Do you have what it takes to battle deceitful family and ghastly ghosts? Can you survive long enough to become the richest corpse?</p> 
            <p>To find out all you have to do is… <strong><em>Knock</em></strong>.</p>
            <h5>2 &ndash; 4 players | 15 &ndash; 60 minute playtime</h5>
            <StripeCheckout
              name={'Knock Knock'}
              description={'The Reluctant Co-Op Card Game'}
              amount={25}
            />
          </div>
          <div className="hero__item">
            <img className="logo" src={logoVertical} alt="vertical logo" />
          </div>
        </div>
      </section>
    )
  }
}

export default Hero;