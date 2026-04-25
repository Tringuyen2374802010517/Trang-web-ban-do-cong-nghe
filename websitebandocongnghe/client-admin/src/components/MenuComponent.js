import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import MyContext from '../contexts/MyContext';

class Menu extends Component {
  static contextType = MyContext;

  constructor(props) {
    super(props);
    this.state = {
      collapsed: false
    };
  }

  logout = () => {
    this.context.setToken('');
    this.context.setUsername('');
  };

  toggleMenu = () => {
    this.setState({ collapsed: !this.state.collapsed });
  };

  render() {
    const { collapsed } = this.state;

    const styles = {
      container: {
        height: '100vh',
        width: collapsed ? '80px' : '240px',
        transition: '0.3s',
        padding: '20px',
        color: '#fff',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
      },

      title: {
        fontSize: collapsed ? '16px' : '22px',
        fontWeight: 'bold',
        marginBottom: '20px'
      },

      menu: {
        listStyle: 'none',
        padding: 0
      },

      item: {
        marginBottom: '10px'
      },

      link: {
        textDecoration: 'none',
        color: '#ccc',
        padding: '10px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        borderRadius: '8px'
      },

      activeLink: {
        background: 'rgba(255,255,255,0.2)',
        color: '#fff'
      },

      icon: {
        fontSize: '18px'
      },

      text: {
        display: collapsed ? 'none' : 'inline'
      },

      toggleBtn: {
        cursor: 'pointer',
        marginBottom: '20px',
        fontSize: '20px'
      },

      userBox: {
        borderTop: '1px solid rgba(255,255,255,0.2)',
        paddingTop: '10px'
      },

      logout: {
        color: '#ff5252',
        cursor: 'pointer',
        display: collapsed ? 'none' : 'block',
        marginTop: '10px'
      }
    };

    return (
      <div style={styles.container}>
        <div>
          {}
          <div style={styles.toggleBtn} onClick={this.toggleMenu}>
            ☰
          </div>

          <div style={styles.title}>
            {collapsed ? '' : 'ADMIN'}
          </div>

          <ul style={styles.menu}>
            <li style={styles.item}>
              <NavLink
                to="/admin/home"
                style={({ isActive }) => ({
                  ...styles.link,
                  ...(isActive ? styles.activeLink : {})
                })}
              >
                <span style={styles.text}>Home</span>
              </NavLink>
            </li>

            <li style={styles.item}>
              <NavLink
                to="/admin/category"
                style={({ isActive }) => ({
                  ...styles.link,
                  ...(isActive ? styles.activeLink : {})
                })}
              >
                <span style={styles.text}>Category</span>
              </NavLink>
            </li>

            <li style={styles.item}>
              <NavLink
                to="/admin/product"
                style={({ isActive }) => ({
                  ...styles.link,
                  ...(isActive ? styles.activeLink : {})
                })}
              >
                <span style={styles.text}>Product</span>
              </NavLink>
            </li>

            <li style={styles.item}>
              <NavLink
                to="/admin/order"
                style={({ isActive }) => ({
                  ...styles.link,
                  ...(isActive ? styles.activeLink : {})
                })}
              >
                <span style={styles.text}>Order</span>
              </NavLink>
            </li>

            <li style={styles.item}>
              <NavLink
                to="/admin/customer"
                style={({ isActive }) => ({
                  ...styles.link,
                  ...(isActive ? styles.activeLink : {})
                })}
              >
                <span style={styles.text}>Customer</span>
              </NavLink>
            </li>
          </ul>
        </div>

        {}
        <div style={styles.userBox}>
          {!collapsed && (
            <div>
              Hello <b>{this.context.username}</b>
            </div>
          )}

          <span style={styles.logout} onClick={this.logout}>
            Logout
          </span>
        </div>
      </div>
    );
  }
}

export default Menu;