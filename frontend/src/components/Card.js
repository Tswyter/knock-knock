import React, { Component } from 'react';
import ModalButton from './ModalButton';

const logoVertical = 'https://cdn2.hubspot.net/hubfs/2524912/knock-knock--horizontal.svg';

const images = [
  {
    src: 'https://cdn2.hubspot.net/hubfs/2524912/kk-bg-1.jpg',
    alt: ''
  },
  {
    src: 'https://cdn2.hubspot.net/hubfs/2524912/knock-knock/kk-2.jpg',
    alt: ''
  },
  {
    src: 'https://cdn2.hubspot.net/hubfs/2524912/knock-knock/kk-3.jpg',
    alt: ''
  },
  {
    src: 'https://cdn2.hubspot.net/hubfs/2524912/knock-knock/kk-4.jpg',
    alt: ''
  }
];

export default class Card extends Component {
  render() {
    return (
      <div className="hero__item">
        <div className="hero__text-container">
          <img src={logoVertical} alt="box" width="300" height="200" />
          <h1>{this.props.tagline}</h1>
          <p>2-4 estranged family members will take turns flipping over cards representing doors in a haunted mansion searching for their inheritance.</p>
          <p>Doors which hide fearsome Ghosts, abundant fortunes, and twists and turns you'll never see coming. Work together while you deceive your fellow players.</p>
          <p><strong>Can you survive long enough to become the richest corpse?</strong></p>
          <h5>For All Ages | 2 &ndash; 4 players | 15 &ndash; 60 minute playtime</h5>
          <div className="hero__button">
            <div>
              <ModalButton buttonText="Buy Now" toggleModal={this.props.toggleModal} />
              {/*<p>Now Available!</p>*/}
            </div>
            <a target="_blank" rel="noopener noreferrer" href="https://knockknockcards.com/rules/knock-knock-rule-booklet.pdf" style={{ padding: '15px', alignSelf: 'flex-start', fontSize: '1em' }}>Rule Book</a>
          </div>
          <div className="mobile-images">
            <ul>
              <li><img src={images[0].src} alt={images[0].alt} /></li>
              <li><img src={images[1].src} alt={images[1].alt} /></li>
              <li><img src={images[2].src} alt={images[2].alt} /></li>
              <li><img src={images[3].src} alt={images[3].alt} /></li>
            </ul>
          </div>
        </div>
      </div>
    )
  }
}