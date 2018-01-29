import axios from 'axios';

const PAYMENT_SERVER_URL = 'https://murmuring-reef-98489.herokuapp.com/';

const customers = {
  get: (tokenEmail, data) => 
    axios.get(`${PAYMENT_SERVER_URL}customers/customer?email=${tokenEmail}`, data)
      .then(customer => customer.data)
      .catch(err => console.log(err))
  ,
  create: data => {

    console.log(`CREATING CUSTOMER ${data.email}`, data);
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

export default customers;