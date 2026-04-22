import React, { Component } from 'react';
import MyContext from './MyContext';
import axios from 'axios';

class MyProvider extends Component {
  state = {
    token: localStorage.getItem('admin_token'),
    username: localStorage.getItem('admin_username')
  };

  componentDidMount() {
    axios.defaults.baseURL = '';   // 🔥 FIX DUY NHẤT

    axios.interceptors.request.use(config => {
      const token = localStorage.getItem('admin_token');

      if (token) {
        config.headers['Authorization'] = 'Bearer ' + token;
      }

      return config;
    });
  }

  setToken = token => {
    this.setState({ token });
    if (token) localStorage.setItem('admin_token', token);
    else localStorage.removeItem('admin_token');
  };

  setUsername = username => {
    this.setState({ username });
    if (username) localStorage.setItem('admin_username', username);
    else localStorage.removeItem('admin_username');
  };

  logout = () => {
    this.setState({ token: null, username: null });
    localStorage.clear();
  };

  render() {
    return (
      <MyContext.Provider value={{
        token: this.state.token,
        username: this.state.username,
        setToken: this.setToken,
        setUsername: this.setUsername,
        logout: this.logout
      }}>
        {this.props.children}
      </MyContext.Provider>
    );
  }
}

export default MyProvider;