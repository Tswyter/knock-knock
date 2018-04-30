import React, { Component } from 'react';

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

export default class Slider extends Component {
  constructor(props) {
    super(props);

    this.state = {
      slideIndex: 0
    };
  }
  slide(slideIndex) {
    if (slideIndex + 1 >= images.length) {
      return 0;
    } else {
      return slideIndex + 1;
    }
  }
  componentDidMount() {
    setInterval(() => {
      this.setState({ slideIndex: this.slide(this.state.slideIndex) })
    }, 5000);
  }
  componentWillUnmount() {
    this.setState({ slideIndex: 0 });
  }
  render() {
    return (
      <div className="slider">
        <img src={images[this.state.slideIndex].src} alt={images[this.state.slideIndex].alt}></img>
      </div>
    );
  }
}