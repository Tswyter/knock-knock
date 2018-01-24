import React, { Component } from 'react';
import ModalButton from './ModalButton';

const logoVertical = 'https://cdn2.hubspot.net/hubfs/2524912/knock-knock--vertical.svg';

const heroStyles = {
  wrapper: {
    maxWidth: '724px',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'row'
  },
  textArea: {
    maxWidth: '50%'
  }
}

class Hero extends Component {
  render() {
    return (
      <section className="hero">
        <div className="hero__wrapper" style={heroStyles.wrapper}>
          <div className="hero__item" style={heroStyles.textArea}>
            <img src="./images/IMG_0352-edit2.png" alt="box" />
            <h1>{this.props.tagline}</h1>
            <p>Do you have what it takes to battle deceitful family and ghastly ghosts? Can you survive long enough to become the richest corpse?</p> 
            <p>To find out all you have to do is… <strong><em>Knock</em></strong>.</p>
            <h5>2 &ndash; 4 players | 15 &ndash; 60 minute playtime</h5>
            <ModalButton buttonText="Buy Now" toggleModal={this.props.toggleModal}/>
          </div>
          <div className="hero__item" style={heroStyles.textArea}>
            <img className="logo" src={logoVertical} alt="vertical logo" />
            {/*<ModalButton buttonText="Buy Later" toggleModal={this.props.toggleModal} />*/}
          </div>
        </div>
      </section>
    )
  }
}

export default Hero;