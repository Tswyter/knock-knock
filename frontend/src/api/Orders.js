import axios from 'axios';
import PAYMENT_SERVER_URL from '../constants/server';

export const orders = {
  create: data => 
    axios.post(`${PAYMENT_SERVER_URL}create_order`, data)
      .then(order => order.data)
      .catch(err => console.log(err))
  ,
  update: data => 
    axios.put(`${PAYMENT_SERVER_URL}update_order`, data)
      .then(order => order.data)
      .catch(err => console.log(err))
  ,
  delete: data => 
    axios.delete(`${PAYMENT_SERVER_URL}delete_order`, data)
      .then(order => order.data)
      .catch(err => console.log(err))
  ,
  charge: (orderId, data) => {
    console.log(`Paying order ${orderId}`);
    return axios.post(`${PAYMENT_SERVER_URL}charge_order?order=${orderId}`, data)
      .then(charge => charge.data)
      .catch(err => console.log(err));
  }
};