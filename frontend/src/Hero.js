import React, { Component } from 'react';
import Card from './Card';

class Hero extends Component {
  render() {
    return (
      <section className="hero">
        <div className="hero__wrapper">
          <Card toggleModal={this.props.toggleModal} tagline="The Reluctant Co-Op Card Game" />
        </div>
      </section>
    )
  }
}

export default Hero;