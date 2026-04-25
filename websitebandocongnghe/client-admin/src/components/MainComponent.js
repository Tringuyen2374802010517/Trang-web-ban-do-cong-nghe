import React, { Component } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MyContext from '../contexts/MyContext';

import Menu from './MenuComponent';
import Home from './HomeComponent';
import Category from './CategoryComponent';
import Product from './ProductComponent';
import Order from './OrderComponent';
import Customer from './CustomerComponent';

class Main extends Component {
  static contextType = MyContext;

  render() {
    if (!this.context.token) {
      return <Navigate to="/" replace />;
    }

    const styles = {
      container: {
        display: 'flex',
        height: '100vh',
        background: 'linear-gradient(135deg,#0f2027,#203a43,#2c5364)',
        fontFamily: 'Segoe UI'
      },

      // ❌ BỎ width cố định
      sidebar: {
        background: 'rgba(255,255,255,0.08)',
        backdropFilter: 'blur(10px)',
        borderRight: '1px solid rgba(255,255,255,0.1)',
        transition: '0.3s'
      },

      content: {
        flex: 1,
        padding: '20px',
        overflowY: 'auto',
        color: '#fff'
      }
    };

    return (
      <div style={styles.container}>
        {}
        <div style={styles.sidebar}>
          <Menu />
        </div>

        {}
        <div style={styles.content}>
          <Routes>
            <Route path="home" element={<Home />} />
            <Route path="category" element={<Category />} />
            <Route path="product" element={<Product />} />
            <Route path="order" element={<Order />} />
            <Route path="customer" element={<Customer />} />

            <Route path="*" element={<Navigate to="home" />} />
          </Routes>
        </div>
      </div>
    );
  }
}

export default Main;