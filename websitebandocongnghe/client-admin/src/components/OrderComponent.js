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

  apiGetOrders() {
    const token = localStorage.getItem('admin_token');

    if (!token) {
      console.log("No token");
      return;
    }

    axios.get('/api/admin/orders', {
      headers: { 'x-access-token': token }
    })
      .then(res => {
        this.setState({ orders: res.data || [] });
      })
      .catch(err => console.error(err));
  }

  apiPutOrderStatus(id, status) {
    const token = localStorage.getItem('admin_token');

    axios.put(
      '/api/admin/orders/status/' + id,
      { status },
      { headers: { 'x-access-token': token } }
    ).then(() => this.apiGetOrders());
  }

  trItemClick(item) {
    this.setState({ order: item });
  }

  styles = {
    container: {
      padding: '30px',
      background: 'linear-gradient(135deg,#0f2027,#203a43,#2c5364)',
      minHeight: '100vh',
      color: '#fff'
    },
    card: {
      background: 'rgba(255,255,255,0.08)',
      backdropFilter: 'blur(10px)',
      borderRadius: '16px',
      padding: '20px',
      marginBottom: '20px'
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse'
    },
    th: {
      padding: '10px',
      background: 'rgba(255,255,255,0.1)'
    },
    td: {
      padding: '10px',
      borderTop: '1px solid rgba(255,255,255,0.1)'
    },
    badge: (status) => ({
      padding: '4px 10px',
      borderRadius: '10px',
      fontSize: '12px',
      background:
        status === 'PENDING'
          ? '#ffab00'
          : status === 'APPROVED'
          ? '#00c853'
          : '#d50000'
    }),
    action: {
      cursor: 'pointer',
      marginRight: '10px'
    },
    img: {
      width: '60px',
      height: '60px',
      borderRadius: '8px'
    }
  };

  render() {
    const { orders, order } = this.state;

    return (
      <div style={this.styles.container}>

        <div style={this.styles.card}>
          <h2>Orders</h2>

          <table style={this.styles.table}>
            <thead>
              <tr>
                <th style={this.styles.th}>Date</th>
                <th style={this.styles.th}>Customer</th>
                <th style={this.styles.th}>Phone</th>
                <th style={this.styles.th}>Total</th>
                <th style={this.styles.th}>Status</th>
                <th style={this.styles.th}>Action</th>
              </tr>
            </thead>

            <tbody>
              {orders.map(item => (
                <tr key={item._id}>
                  <td style={this.styles.td}>
                    {new Date(item.cdate).toLocaleString()}
                  </td>
                  <td style={this.styles.td}>{item.customer?.name}</td>
                  <td style={this.styles.td}>{item.customer?.phone}</td>
                  <td style={this.styles.td}>{item.total}</td>

                  <td style={this.styles.td}>
                    <span style={this.styles.badge(item.status)}>
                      {item.status}
                    </span>
                  </td>

                  <td style={this.styles.td}>
                    <span
                      style={{ ...this.styles.action, color: '#40c4ff' }}
                      onClick={() => this.trItemClick(item)}
                    >
                      DETAIL
                    </span>

                    {item.status === 'PENDING' && (
                      <>
                        <span
                          style={{ ...this.styles.action, color: '#00e676' }}
                          onClick={() =>
                            this.apiPutOrderStatus(item._id, 'APPROVED')
                          }
                        >
                          APPROVE
                        </span>

                        <span
                          style={{ ...this.styles.action, color: '#ff5252' }}
                          onClick={() =>
                            this.apiPutOrderStatus(item._id, 'CANCELED')
                          }
                        >
                          CANCEL
                        </span>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {order && (
          <div style={this.styles.card}>
            <h2>Order Detail</h2>

            <div style={{ marginBottom: '15px' }}>
              <p>
                <b>Hình thức:</b>{" "}
                {order.deliveryType === "delivery"
                  ? "Giao tận nơi"
                  : "Nhận tại cửa hàng"}
              </p>

              {order.deliveryType === "delivery" && order.address && (
                <p>
                  <b>Địa chỉ:</b> {order.address}
                </p>
              )}

              {order.deliveryType === "store" && order.selectedStore && (
                <p>
                  <b>Cửa hàng nhận:</b> {order.selectedStore}
                </p>
              )}

              <p>
                <b>Thanh toán:</b>{" "}
                {order.paymentMethod === "cod"
                  ? "Tiền mặt"
                  : "Chuyển khoản"}
              </p>

              {order.note && (
                <p>
                  <b>Ghi chú:</b> {order.note}
                </p>
              )}
            </div>

            <table style={this.styles.table}>
              <thead>
                <tr>
                  <th style={this.styles.th}>Product</th>
                  <th style={this.styles.th}>Image</th>
                  <th style={this.styles.th}>Price</th>
                  <th style={this.styles.th}>Qty</th>
                  <th style={this.styles.th}>Total</th>
                </tr>
              </thead>

              <tbody>
                {order.items.map((item, i) => (
                  <tr key={i}>
                    <td style={this.styles.td}>{item.product?.name}</td>

                    <td style={this.styles.td}>
                      <img
                        style={this.styles.img}
                        src={
                          item.product?.images?.length > 0
                            ? "/uploads/" + item.product.images[0]
                            : ""
                        }
                        alt=""
                      />
                    </td>

                    <td style={this.styles.td}>{item.product?.price}</td>
                    <td style={this.styles.td}>{item.quantity}</td>
                    <td style={this.styles.td}>
                      {item.product?.price * item.quantity}
                    </td>
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

export default Order;