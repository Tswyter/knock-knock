import axios from 'axios';

const PAYMENT_SERVER_URL = 'https://murmuring-reef-98489.herokuapp.com/';
// const PAYMENT_SERVER_URL = '//localhost:8080/';

const orders = {
  process: (data) => {
    return axios.post(`${PAYMENT_SERVER_URL}order`, data)
      .then(order => order.data)
      .catch(err => err);
  }
};

export default orders;