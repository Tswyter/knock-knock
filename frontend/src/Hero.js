import React, { Component } from 'react';
import ModalButton from './ModalButton';

const logoVertical = 'https://cdn2.hubspot.net/hubfs/2524912/knock-knock--horizontal.svg';

const heroStyles = {
  wrapper: {
    maxWidth: '100%',
    margin: '0 0 0 auto',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  sidebar: {
    maxWidth: '26vw',
    backgroundColor: '#FFF',
    padding: '0 40px'
  }
}

class Hero extends Component {
  render() {
    return (
      <section className="hero">
        <div className="hero__wrapper" style={heroStyles.wrapper}>
          <div className="hero__item" style={heroStyles.sidebar}>
            <div class="hero__text-container">
              <img src={logoVertical} alt="box" width="300" style={ { marginBottom: '20px' } } />
              <h1>{this.props.tagline}</h1>
              <p>Knock Knock is an independently made, funded and handcrafted Boston based game in it's first run. Each copy is built by hand and delivered to you by the creators. Buy now to secure this limited edition version.</p>
              <h5>2 &ndash; 4 players | 15 &ndash; 60 minute playtime</h5>
              <ModalButton buttonText="Buy Now" toggleModal={this.props.toggleModal}/>
            </div>
          </div>
          {/*<div className="hero__item" style={heroStyles.textArea}>
            <img className="logo" src={logoVertical} alt="vertical logo" />
            <ModalButton buttonText="Buy Later" toggleModal={this.props.toggleModal} />
          </div>*/}
        </div>
      </section>
    )
  }
}

export default Hero;