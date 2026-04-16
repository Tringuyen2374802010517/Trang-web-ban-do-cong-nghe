import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import MyContext from '../contexts/MyContext';

class Menu extends Component {
  static contextType = MyContext;

  logout = () => {
    this.context.setToken('');
    this.context.setUsername('');
  };

  render() {
    return (
      <div className="border-bottom">
        <ul className="menu">
          <li><Link to="/admin/home">HOME</Link></li>
          <li><Link to="/admin/category">CATEGORY</Link></li>
          <li><Link to="/admin/product">PRODUCT</Link></li>
          <li><Link to="/admin/order">ORDER</Link></li>
          <li><Link to="/admin/customer">CUSTOMER</Link></li>
        </ul>

        <div className="float-right">
          Hello <b>{this.context.username}</b> |{' '}
          <Link to="/admin" onClick={this.logout}>Logout</Link>
        </div>

        <div className="float-clear"></div>
      </div>
    );
  }
}

export default Menu;
