import React, { Component } from 'react';
import axios from 'axios';
import { Navigate } from 'react-router-dom';
import MyContext from '../contexts/MyContext';

class Myorders extends Component {
  static contextType = MyContext;

  constructor(props) {
    super(props);
    this.state = {
      orders: [],
      order: null
    };
  }

  componentDidMount() {
    if (this.context.customer && this.context.token) {
      const cid = this.context.customer._id;
      this.apiGetOrdersByCustID(cid);
    }
  }

  render() {
    if (!this.context.token) {
      return <Navigate replace to="/login" />;
    }

    const selectedOrder = this.state.order || this.state.orders[0];

    const orders = this.state.orders.map((item) => {

      const customer = this.context.customer || {};
      const isSelected = selectedOrder && selectedOrder._id === item._id;

      return (
        <tr
          key={item._id}
          style={{
            ...styles.row,
            background: isSelected ? "#e3f2fd" : "#fff"
          }}
          onClick={() => this.trItemClick(item)}
        >
          <td>{item._id}</td>
          <td>{new Date(item.cdate).toLocaleString()}</td>
          <td>{customer.name || 'N/A'}</td>
          <td>{customer.phone || ''}</td>

          <td style={styles.total}>
            {item.total?.toLocaleString()}₫
          </td>

          <td style={{
            color: item.status === 'APPROVED' ? '#2e7d32' : '#f57c00',
            fontWeight: 'bold'
          }}>
            {item.status}
          </td>
        </tr>
      );
    });

    let items = null;

    if (selectedOrder) {
      items = selectedOrder.items.map((item, index) => {

        const p = item.product || {};

        const img =
          p.images && p.images.length > 0
            ? "http://localhost:3001/uploads/" + p.images[0]
            : "";

        return (
          <tr key={index} style={styles.row}>
            <td>{index + 1}</td>
            <td>{p._id}</td>
            <td style={styles.name}>{p.name}</td>

            <td>
              {img && <img src={img} style={styles.img} alt="" />}
            </td>

            <td>{p.price?.toLocaleString()}₫</td>
            <td>
              <span style={styles.qty}>{item.quantity}</span>
            </td>

            <td style={styles.amount}>
              {(p.price * item.quantity)?.toLocaleString()}₫
            </td>
          </tr>
        );
      });
    }

    return (
      <div style={styles.container}>

        {/* ORDER LIST */}
        <h2 style={styles.title}>📦 Order List</h2>

        <table style={styles.table}>
          <thead>
            <tr style={styles.header}>
              <th>ID</th>
              <th>Creation date</th>
              <th>Customer</th>
              <th>Phone</th>
              <th>Total</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>{orders}</tbody>
        </table>

        {/* ORDER DETAIL */}
        {selectedOrder && (
          <div style={{ marginTop: "35px" }}>

            <h2 style={styles.title}>🧾 Order Detail</h2>

            <table style={styles.table}>
              <thead>
                <tr style={styles.header}>
                  <th>No.</th>
                  <th>Prod.ID</th>
                  <th>Product</th>
                  <th>Image</th>
                  <th>Price</th>
                  <th>Qty</th>
                  <th>Amount</th>
                </tr>
              </thead>

              <tbody>{items}</tbody>
            </table>

          </div>
        )}

      </div>
    );
  }

  trItemClick(item) {
    this.setState({ order: item });
  }

  apiGetOrdersByCustID(cid) {
    const token = this.context.token?.trim();

    const config = {
      headers: {
        Authorization: "Bearer " + token
      }
    };

    axios.get('http://localhost:3001/api/customer/orders/customer/' + cid, config)
      .then(res => {
        this.setState({
          orders: res.data,
          order: res.data[0]
        });
      })
      .catch(err => {
        console.error("ORDERS ERROR:", err);
      });
  }
}

/* ===== STYLE ===== */
const styles = {

  container: {
    width: "90%",
    margin: "30px auto",
    padding: "25px",
    background: "#fff",
    borderRadius: "15px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.08)"
  },

  title: {
    textAlign: "center",
    marginBottom: "20px",
    fontSize: "22px"
  },

  table: {
    width: "100%",
    borderCollapse: "collapse"
  },

  header: {
    background: "linear-gradient(45deg, #4CAF50, #2e7d32)",
    color: "white",
    height: "45px"
  },

  row: {
    textAlign: "center",
    borderBottom: "1px solid #eee",
    cursor: "pointer",
    transition: "0.2s"
  },

  name: {
    fontWeight: "bold",
    color: "#333"
  },

  img: {
    width: "60px",
    height: "60px",
    borderRadius: "8px",
    objectFit: "cover"
  },

  qty: {
    background: "#eee",
    padding: "4px 10px",
    borderRadius: "10px"
  },

  amount: {
    fontWeight: "bold",
    color: "#e53935"
  },

  total: {
    fontWeight: "bold",
    color: "#1976d2"
  }

};

export default Myorders;