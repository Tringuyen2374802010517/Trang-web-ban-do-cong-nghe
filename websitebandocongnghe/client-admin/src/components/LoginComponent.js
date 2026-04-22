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
      alert('Login failed');
    }
  };

  render() {
    if (this.context.token) {
      return <Navigate to="/admin" replace />;
    }

    const styles = {
      container: {
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #0f2027, #203a43, #2c5364)',
        fontFamily: 'Segoe UI'
      },

      card: {
        background: 'rgba(255,255,255,0.08)',
        backdropFilter: 'blur(12px)',
        padding: '40px',
        borderRadius: '20px',
        width: '350px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
        color: '#fff',
        textAlign: 'center',
        animation: 'fadeIn 0.8s ease'
      },

      title: {
        marginBottom: '20px'
      },

      input: {
        width: '100%',
        padding: '12px',
        marginBottom: '15px',
        borderRadius: '10px',
        border: 'none',
        outline: 'none'
      },

      button: {
        width: '100%',
        padding: '12px',
        borderRadius: '10px',
        border: 'none',
        background: '#00c853',
        color: '#fff',
        fontWeight: 'bold',
        cursor: 'pointer',
        transition: '0.3s'
      }
    };

    return (
      <div style={styles.container}>
        <style>
          {`
            @keyframes fadeIn {
              from { opacity: 0; transform: translateY(20px); }
              to { opacity: 1; transform: translateY(0); }
            }
          `}
        </style>

        <div style={styles.card}>
          <h2 style={styles.title}>🔐 Admin Login</h2>

          <form>
            <input
              style={styles.input}
              type="text"
              placeholder="Username"
              value={this.state.txtUsername}
              onChange={e => this.setState({ txtUsername: e.target.value })}
            />

            <input
              style={styles.input}
              type="password"
              placeholder="Password"
              value={this.state.txtPassword}
              onChange={e => this.setState({ txtPassword: e.target.value })}
            />

            <button style={styles.button} onClick={this.btnLoginClick}>
              LOGIN
            </button>
          </form>
        </div>
      </div>
    );
  }
}

export default Login;