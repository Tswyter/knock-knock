import axios from 'axios';

const PAYMENT_SERVER_URL = 'https://murmuring-reef-98489.herokuapp.com/';


const orders = {
  create: data => 
    axios.post(`${PAYMENT_SERVER_URL}create_order`, data)
      .then(order => order.data)
      .catch(err => err)
  ,
  update: data => 
    axios.put(`${PAYMENT_SERVER_URL}update_order`, data)
      .then(order => order.data)
      .catch(err => err)
  ,
  delete: data => 
    axios.delete(`${PAYMENT_SERVER_URL}delete_order`, data)
      .then(order => order.data)
      .catch(err => err)
  ,
  charge: (orderId, sourceId, data) => {
    console.log(orderId, sourceId);
    return axios.post(`${PAYMENT_SERVER_URL}charge_order?order=${orderId}&source=${sourceId}`, data)
      .then(charge => charge.data)
      .catch(err => err);
  }
};

export default orders;