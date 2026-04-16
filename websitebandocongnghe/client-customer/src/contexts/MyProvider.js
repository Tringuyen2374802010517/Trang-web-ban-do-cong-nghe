import React, { Component } from 'react';
import MyContext from './MyContext';
import axios from 'axios'; // 🔥 THÊM

class MyProvider extends Component {

  constructor(props) {
    super(props);

    this.state = {
      token: '',
      customer: null,
      mycart: [],

      // functions
      setToken: this.setToken,
      setCustomer: this.setCustomer,
      setMycart: this.setMycart
    };
  }

  componentDidMount() {

    // 🔥 SET BASE URL
    axios.defaults.baseURL = 'http://localhost:3001';

    // 🔥 INTERCEPTOR (QUAN TRỌNG NHẤT)
    axios.interceptors.request.use(config => {

      const token = localStorage.getItem("token");

      if (token) {
        config.headers['x-access-token'] = token; // 🔥 MATCH BACKEND
      }

      return config;
    });

    // ================= LOAD LOCAL =================
    let token = localStorage.getItem("token") || '';

    let customer = null;
    try {
      customer = JSON.parse(localStorage.getItem("customer"));
    } catch {
      customer = null;
    }

    let mycart = [];
    try {
      mycart = JSON.parse(localStorage.getItem("mycart")) || [];
    } catch {
      mycart = [];
    }

    if (token && customer) {
      this.setState({
        token: token,
        customer: customer
      });
    }

    this.setState({ mycart: mycart });
  }

  // ================= SET TOKEN =================
  setToken = (value) => {
    const cleanToken =
      typeof value === "string" ? value : value?.token;

    this.setState({ token: cleanToken });

    localStorage.setItem("token", cleanToken);
  }

  setCustomer = (value) => {
    this.setState({ customer: value });
    localStorage.setItem("customer", JSON.stringify(value));
  }

  setMycart = (value) => {

    const cart = value || [];

    this.setState({ mycart: cart });

    localStorage.setItem("mycart", JSON.stringify(cart));
  }

  render() {
    return (
      <MyContext.Provider value={this.state}>
        {this.props.children}
      </MyContext.Provider>
    );
  }
}

export default MyProvider;