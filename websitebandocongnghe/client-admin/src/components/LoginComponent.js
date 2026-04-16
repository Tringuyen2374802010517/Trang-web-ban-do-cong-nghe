import axios from 'axios';
import React, { Component } from 'react';
import { Navigate } from 'react-router-dom';
import MyContext from '../contexts/MyContext';

class Login extends Component {
  static contextType = MyContext;

  state = {
    txtUsername: '',
    txtPassword: ''
  };

  btnLoginClick = async e => {
    e.preventDefault();

    const { txtUsername, txtPassword } = this.state;

    if (!txtUsername || !txtPassword) {
      alert('Please input username and password');
      return;
    }

    try {
      const res = await axios.post('/api/admin/login', {
        username: txtUsername,
        password: txtPassword
      });

      if (res.data.success) {
        this.context.setToken(res.data.token);
        this.context.setUsername(txtUsername);
      } else {
        alert(res.data.message);
      }
    } catch (err) {
      console.error(err);
      alert('Login failed');
    }
  };

  render() {
    if (this.context.token) {
      return <Navigate to="/admin" replace />;
    }

    return (
      <div className="login-container">
        <h2>ADMIN LOGIN</h2>
        <form>
          <input
            type="text"
            placeholder="Username"
            value={this.state.txtUsername}
            onChange={e => this.setState({ txtUsername: e.target.value })}
          />

          <input
            type="password"
            placeholder="Password"
            value={this.state.txtPassword}
            onChange={e => this.setState({ txtPassword: e.target.value })}
          />

          <br />
          <button onClick={this.btnLoginClick}>LOGIN</button>
        </form>
      </div>
    );
  }
}

export default Login;
