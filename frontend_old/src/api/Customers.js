import axios from 'axios';
import PAYMENT_SERVER_URL from '../constants/server';

export const customers = {
  get: (tokenEmail, data) => 
    axios.get(`${PAYMENT_SERVER_URL}customers/customer?email=${tokenEmail}`, data)
      .then(customer => customer.data)
      .catch(err => console.log(err))
  ,
  create: data => {
    console.log(`CREATING CUSTOMER ${data.email}`);
    return axios.post(`${PAYMENT_SERVER_URL}create_customer`, data)
      .then(customer => customer.data)
      .catch(err => console.log(err))
  },
  update: data => 
    axios.put(`${PAYMENT_SERVER_URL}update_customer`, data)
      .then(customer => customer.data)
      .catch(err => console.log(err))
  ,
  delete: data => 
    axios.delete(`${PAYMENT_SERVER_URL}delete_customer`, data)
      .then(customer => customer.data)
      .catch(err => console.log(err))
};