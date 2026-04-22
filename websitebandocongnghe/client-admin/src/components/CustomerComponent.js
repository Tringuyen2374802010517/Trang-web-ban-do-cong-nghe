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
    const token = localStorage.getItem('admin_token');

    if (!token) return;

    axios.get('/api/admin/customers', {
      headers: { Authorization: 'Bearer ' + token }
    })
    .then(res => {
      this.setState({ customers: res.data });
    })
    .catch(err => console.error(err));
  };

  apiGetOrdersByCustID = (cid) => {
    const token = localStorage.getItem('admin_token');

    axios.get('/api/admin/orders/customer/' + cid, {
      headers: { Authorization: 'Bearer ' + token }
    })
    .then(res => {
      this.setState({ orders: res.data });
    })
    .catch(err => console.error(err));
  };

  apiPutCustomerDeactive = (id) => {
    const token = localStorage.getItem('admin_token');

    axios.put('/api/admin/customers/deactive/' + id, {}, {
      headers: { Authorization: 'Bearer ' + token }
    })
    .then(() => this.apiGetCustomers())
    .catch(err => console.error(err));
  };

  apiSendMail = (id) => {
    const token = localStorage.getItem('admin_token');

    axios.get('/api/admin/customers/sendmail/' + id, {
      headers: { Authorization: 'Bearer ' + token }
    })
    .then(res => alert(res.data.message))
    .catch(err => console.error(err));
  };

  // ================= EVENT =================
  trCustomerClick = (item) => {
    this.setState({ orders: [], order: null });
    this.apiGetOrdersByCustID(item._id);
  };

  trOrderClick = (item) => {
    this.setState({ order: item });
  };

  // ================= UI STYLE =================
  styles = {
    container: {
      padding: '30px',
      background: 'linear-gradient(135deg,#0f2027,#203a43,#2c5364)',
      minHeight: '100vh',
      color: '#fff',
      fontFamily: 'Segoe UI'
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
      background: 'rgba(255,255,255,0.1)',
      textAlign: 'left'
    },

    td: {
      padding: '10px',
      borderTop: '1px solid rgba(255,255,255,0.1)',
      cursor: 'pointer'
    },

    badgeActive: {
      color: '#00e676',
      fontWeight: 'bold'
    },

    badgeInactive: {
      color: '#ff5252',
      fontWeight: 'bold'
    },

    actionBlue: {
      color: '#40c4ff',
      cursor: 'pointer'
    },

    actionRed: {
      color: '#ff5252',
      cursor: 'pointer'
    },

    img: {
      width: '60px',
      height: '60px',
      borderRadius: '8px'
    }
  };

  render() {
    const { customers, orders, order } = this.state;

    return (
      <div style={this.styles.container}>

        {/* CUSTOMER */}
        <div style={this.styles.card}>
          <h2>Customers</h2>

          <table style={this.styles.table}>
            <thead>
              <tr>
                <th style={this.styles.th}>ID</th>
                <th style={this.styles.th}>Username</th>
                <th style={this.styles.th}>Name</th>
                <th style={this.styles.th}>Email</th>
                <th style={this.styles.th}>Status</th>
                <th style={this.styles.th}>Action</th>
              </tr>
            </thead>

            <tbody>
              {customers.map(item => (
                <tr key={item._id} onClick={() => this.trCustomerClick(item)}>
                  <td style={this.styles.td}>{item._id}</td>
                  <td style={this.styles.td}>{item.username}</td>
                  <td style={this.styles.td}>{item.name}</td>
                  <td style={this.styles.td}>{item.email}</td>

                  <td style={this.styles.td}>
                    {item.active === 1
                      ? <span style={this.styles.badgeActive}>ACTIVE</span>
                      : <span style={this.styles.badgeInactive}>INACTIVE</span>}
                  </td>

                  <td style={this.styles.td}>
                    {item.active === 0 ? (
                      <span
                        style={this.styles.actionBlue}
                        onClick={(e) => {
                          e.stopPropagation();
                          this.apiSendMail(item._id);
                        }}>
                        EMAIL
                      </span>
                    ) : (
                      <span
                        style={this.styles.actionRed}
                        onClick={(e) => {
                          e.stopPropagation();
                          this.apiPutCustomerDeactive(item._id);
                        }}>
                        DEACTIVE
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ORDERS */}
        {orders.length > 0 && (
          <div style={this.styles.card}>
            <h2>Orders</h2>

            <table style={this.styles.table}>
              <thead>
                <tr>
                  <th style={this.styles.th}>ID</th>
                  <th style={this.styles.th}>Date</th>
                  <th style={this.styles.th}>Name</th>
                  <th style={this.styles.th}>Phone</th>
                  <th style={this.styles.th}>Total</th>
                  <th style={this.styles.th}>Status</th>
                </tr>
              </thead>

              <tbody>
                {orders.map(item => (
                  <tr key={item._id} onClick={() => this.trOrderClick(item)}>
                    <td style={this.styles.td}>{item._id}</td>
                    <td style={this.styles.td}>{new Date(item.cdate).toLocaleString()}</td>
                    <td style={this.styles.td}>{item.customer?.name}</td>
                    <td style={this.styles.td}>{item.customer?.phone}</td>
                    <td style={this.styles.td}>
                      {item.total?.toLocaleString('vi-VN')}₫
                    </td>
                    <td style={this.styles.td}>{item.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ORDER DETAIL */}
        {order && (
          <div style={this.styles.card}>
            <h2>Order Detail</h2>

            <table style={this.styles.table}>
              <thead>
                <tr>
                  <th style={this.styles.th}>No.</th>
                  <th style={this.styles.th}>Prod.ID</th>
                  <th style={this.styles.th}>Prod.name</th>
                  <th style={this.styles.th}>Image</th>
                  <th style={this.styles.th}>Price</th>
                  <th style={this.styles.th}>Quantity</th>
                  <th style={this.styles.th}>Amount</th>
                </tr>
              </thead>

              <tbody>
                {order.items.map((item, index) => (
                  <tr key={index}>
                    <td style={this.styles.td}>{index + 1}</td>
                    <td style={this.styles.td}>{item.product?._id}</td>
                    <td style={this.styles.td}>{item.product?.name}</td>

                    <td style={this.styles.td}>
                      <img
                        style={this.styles.img}
                        src={
                          item.product?.image
                            ? "/uploads/" + item.product.image
                            : item.product?.images?.length > 0
                            ? "/uploads/" + item.product.images[0]
                            : ""
                        }
                        alt=""
                      />
                    </td>

                    <td style={this.styles.td}>
                      {item.product?.price?.toLocaleString('vi-VN')}₫
                    </td>
                    <td style={this.styles.td}>{item.quantity}</td>
                    <td style={this.styles.td}>
                      {(item.product?.price * item.quantity)?.toLocaleString('vi-VN')}₫
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

export default Customer;