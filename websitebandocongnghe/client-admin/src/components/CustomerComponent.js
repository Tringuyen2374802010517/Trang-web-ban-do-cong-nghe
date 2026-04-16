import axios from 'axios';
import React, { Component } from 'react';
import MyContext from '../contexts/MyContext';

class Customer extends Component {
  static contextType = MyContext;

  constructor(props) {
    super(props);
    this.state = {
      customers: [],
      orders: [],
      order: null
    };
  }

  componentDidMount() {
    const token = localStorage.getItem('admin_token');

    if (token) {
      this.apiGetCustomers();
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.context.token &&
      this.state.customers.length === 0 &&
      prevState.customers.length === 0
    ) {
      this.apiGetCustomers();
    }
  }

  // ================= API =================
  apiGetCustomers = () => {
    const token = this.context.token || localStorage.getItem('admin_token');
    if (!token) return;

    const config = {
      headers: { 'x-access-token': token }
    };

    axios.get('/api/admin/customers', config)
      .then(res => {
        this.setState({ customers: res.data });
      })
      .catch(err => {
        console.error("GET CUSTOMERS ERROR:", err);
      });
  };

  apiGetOrdersByCustID = (cid) => {
    const token = this.context.token || localStorage.getItem('admin_token');
    if (!token) return;

    const config = {
      headers: { 'x-access-token': token }
    };

    axios.get('/api/admin/orders/customer/' + cid, config)
      .then(res => {
        this.setState({ orders: res.data });
      })
      .catch(err => {
        console.error("GET ORDERS ERROR:", err);
      });
  };

  apiPutCustomerDeactive = (id, token) => {
    const t = this.context.token || localStorage.getItem('admin_token');
    if (!t) return;

    const config = {
      headers: { 'x-access-token': t }
    };

    axios.put('/api/admin/customers/deactive/' + id, { token }, config)
      .then(res => {
        if (res.data) {
          this.apiGetCustomers();
        }
      })
      .catch(err => {
        console.error("DEACTIVE ERROR:", err);
      });
  };

  apiSendMail = (id) => {
    const token = this.context.token || localStorage.getItem('admin_token');
    if (!token) return;

    const config = {
      headers: { 'x-access-token': token }
    };

    axios.get('/api/admin/customers/sendmail/' + id, config)
      .then(res => {
        alert(res.data.message);
      })
      .catch(err => {
        console.error("SEND MAIL ERROR:", err);
      });
  };

  // ================= EVENT =================
  trCustomerClick = (item) => {
    this.setState({ orders: [], order: null });
    this.apiGetOrdersByCustID(item._id);
  };

  trOrderClick = (item) => {
    this.setState({ order: item });
  };

  // ================= RENDER =================
  render() {

    const customers = this.state.customers.map(item => (
      <tr key={item._id} onClick={() => this.trCustomerClick(item)}>
        <td>{item._id}</td>
        <td>{item.username}</td>
        <td>{item.name}</td>
        <td>{item.email}</td>
        <td>{item.active}</td>
        <td>
          {item.active === 0 ? (
            <span style={{color:'blue', cursor:'pointer'}}
              onClick={(e) => { e.stopPropagation(); this.apiSendMail(item._id); }}>
              EMAIL
            </span>
          ) : (
            <span style={{color:'red', cursor:'pointer'}}
              onClick={(e) => { e.stopPropagation(); this.apiPutCustomerDeactive(item._id, item.token); }}>
              DEACTIVE
            </span>
          )}
        </td>
      </tr>
    ));

    const orders = this.state.orders.map(item => (
      <tr key={item._id} onClick={() => this.trOrderClick(item)}>
        <td>{item._id}</td>
        <td>{new Date(item.cdate).toLocaleString()}</td>
        <td>{item.customer?.name}</td>
        <td>{item.customer?.phone}</td>
        <td>{item.total}</td>
        <td>{item.status}</td>
      </tr>
    ));

    return (
      <div>
        <h2>CUSTOMER LIST</h2>

        <table border="1">
          <thead>
            <tr>
              <th>ID</th>
              <th>Username</th>
              <th>Name</th>
              <th>Email</th>
              <th>Active</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>{customers}</tbody>
        </table>

        {/* ORDER LIST */}
        {this.state.orders.length > 0 && (
          <div>
            <h2>ORDER LIST</h2>
            <table border="1">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Date</th>
                  <th>Name</th>
                  <th>Phone</th>
                  <th>Total</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>{orders}</tbody>
            </table>
          </div>
        )}

        {/* ORDER DETAIL */}
        {this.state.order && (
          <div>
            <h2>ORDER DETAIL</h2>
            <table border="1">
              <thead>
                <tr>
                  <th>No.</th>
                  <th>Prod.ID</th>
                  <th>Prod.name</th>
                  <th>Image</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {this.state.order.items.map((item, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{item.product?._id}</td>
                    <td>{item.product?.name}</td>
                    <td>
                      <img
                        src={
                          item.product?.image
                            ? "http://localhost:3001/uploads/" + item.product.image
                            : item.product?.images && item.product.images.length > 0
                            ? "http://localhost:3001/uploads/" + item.product.images[0]
                            : ""
                        }
                        width="70"
                        height="70"
                        alt=""
                      />
                    </td>
                    <td>{item.product?.price}</td>
                    <td>{item.quantity}</td>
                    <td>{item.product?.price * item.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>
    );
  }
}

export default Customer;