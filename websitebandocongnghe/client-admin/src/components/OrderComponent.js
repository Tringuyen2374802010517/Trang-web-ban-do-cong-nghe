import axios from 'axios';
import React, { Component } from 'react';
import MyContext from '../contexts/MyContext';

class Order extends Component {
  static contextType = MyContext;

  constructor(props) {
    super(props);
    this.state = {
      orders: [],
      order: null
    };
  }

  componentDidMount() {
    this.apiGetOrders();
  }

  // ================= API =================

  apiGetOrders() {
    const token = this.context.token;

    axios.get('/api/admin/orders', {
      headers: { 'x-access-token': token }
    })
      .then(res => {
        console.log("ORDERS:", res.data);
        this.setState({ orders: res.data || [] });
      })
      .catch(err => console.error(err));
  }

  apiPutOrderStatus(id, status) {
    const token = this.context.token;

    axios.put(
      '/api/admin/orders/status/' + id,
      { status },
      { headers: { 'x-access-token': token } }
    )
      .then(res => {
        if (res.data) {
          this.apiGetOrders();
        } else {
          alert("FAILED");
        }
      })
      .catch(err => console.error(err));
  }

  // ================= EVENT =================

  trItemClick(item) {
    this.setState({ order: item });
  }

  lnkApproveClick(id) {
    this.apiPutOrderStatus(id, 'APPROVED');
  }

  lnkCancelClick(id) {
    this.apiPutOrderStatus(id, 'CANCELED');
  }

  // ================= RENDER =================

  render() {

    const orders = Array.isArray(this.state.orders)
      ? this.state.orders.map(item => (
        <tr key={item._id}>
          <td>{item._id}</td>
          <td>{new Date(item.cdate).toLocaleString()}</td>
          <td>{item.customer?.name}</td>
          <td>{item.customer?.phone}</td>
          <td>{item.total}</td>
          <td>{item.status}</td>
          <td>
            <span
              onClick={() => this.trItemClick(item)}
              style={{ cursor: 'pointer', color: 'blue' }}
            >
              DETAIL
            </span>

            {item.status === 'PENDING' && (
              <>
                {" | "}
                <span
                  onClick={() => this.lnkApproveClick(item._id)}
                  style={{ cursor: 'pointer', color: 'green' }}
                >
                  APPROVE
                </span>
                {" | "}
                <span
                  onClick={() => this.lnkCancelClick(item._id)}
                  style={{ cursor: 'pointer', color: 'red' }}
                >
                  CANCEL
                </span>
              </>
            )}
          </td>
        </tr>
      ))
      : [];

    const items = this.state.order && this.state.order.items
      ? this.state.order.items.map((item, index) => (
        <tr key={index}>
          <td>{index + 1}</td>
          <td>{item.product?._id}</td>
          <td>{item.product?.name}</td>
          <td>
            {item.product?.images?.length > 0 && (
              <img
                src={"http://localhost:3001/uploads/" + item.product.images[0]} // ✅ FIX Ở ĐÂY
                width="70"
                height="70"
                alt=""
              />
            )}
          </td>
          <td>{item.product?.price}</td>
          <td>{item.quantity}</td>
          <td>{item.product?.price * item.quantity}</td>
        </tr>
      ))
      : null;

    return (
      <div>
        <h2>ORDER LIST</h2>

        <table border="1" cellPadding="5" cellSpacing="0">
          <thead>
            <tr>
              <th>ID</th>
              <th>Date</th>
              <th>Name</th>
              <th>Phone</th>
              <th>Total</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {orders}
          </tbody>
        </table>

        {this.state.order && (
          <>
            <h2>ORDER DETAIL</h2>
            <table border="1" cellPadding="5" cellSpacing="0">
              <thead>
                <tr>
                  <th>No</th>
                  <th>Product ID</th>
                  <th>Name</th>
                  <th>Image</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {items}
              </tbody>
            </table>
          </>
        )}
      </div>
    );
  }
}

export default Order;