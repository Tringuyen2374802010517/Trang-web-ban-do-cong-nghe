import React, { Component } from 'react';
import MyContext from '../contexts/MyContext';
import CartUtil from '../utils/CartUtil';
import axios from 'axios';
import { withRouter } from '../utils/withRouter';

class Mycart extends Component {
  static contextType = MyContext;

  render() {
    const cart = this.context.mycart || [];

    const rows = cart.map((item, index) => {
      const p = item.product;

      const img =
        p.images && p.images.length > 0
          ? "http://localhost:3001/uploads/" + p.images[0]
          : "";

      const category =
        p.categories_id && p.categories_id.length > 0
          ? p.categories_id[0].name
          : "";

      return (
        <tr key={p._id} style={styles.row}>
          <td>{index + 1}</td>
          <td style={styles.name}>{p.name}</td>
          <td>{category}</td>

          <td>
            {img && <img src={img} style={styles.img} alt="" />}
          </td>

          <td style={styles.price}>
            {p.price.toLocaleString()}₫
          </td>

          <td>
            <span style={styles.qty}>{item.quantity}</span>
          </td>

          <td style={styles.amount}>
            {(p.price * item.quantity).toLocaleString()}₫
          </td>

          <td>
            <button
              style={styles.removeBtn}
              onClick={() => this.lnkRemoveClick(p._id)}
              onMouseEnter={e=>e.target.style.background="#d32f2f"}
              onMouseLeave={e=>e.target.style.background="#ff4d4d"}
            >
              Remove
            </button>
          </td>
        </tr>
      );
    });

    return (
      <div style={styles.container}>

        {/* ✅ NÚT BACK */}
        <button
          style={styles.backBtn}
          onClick={() => this.props.router.navigate(-1)}
          onMouseEnter={e=>e.target.style.background="#eee"}
          onMouseLeave={e=>e.target.style.background="#fff"}
        >
          ← Back
        </button>

        <h2 style={styles.title}>🛒 My Shopping Cart</h2>

        {cart.length === 0 ? (
          <div style={styles.empty}>
            <p>Your shopping cart is empty.</p>
          </div>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr style={styles.header}>
                <th>#</th>
                <th>Name</th>
                <th>Category</th>
                <th>Image</th>
                <th>Price</th>
                <th>Qty</th>
                <th>Amount</th>
                <th></th>
              </tr>
            </thead>
            <tbody>{rows}</tbody>
          </table>
        )}

        <div style={styles.footer}>
          <h3 style={styles.total}>
            Total: {CartUtil.getTotal(cart).toLocaleString()}₫
          </h3>

          <button
            style={styles.checkoutBtn}
            onClick={() => this.lnkCheckoutClick()}
            onMouseEnter={e=>e.target.style.background="#2e7d32"}
            onMouseLeave={e=>e.target.style.background="#4CAF50"}
          >
            Checkout
          </button>
        </div>
      </div>
    );
  }

  lnkRemoveClick(id) {
    const mycart = [...this.context.mycart];
    const index = mycart.findIndex(x => x.product._id === id);

    if (index !== -1) {
      mycart.splice(index, 1);
      this.context.setMycart(mycart);
    }
  }

  lnkCheckoutClick() {
    if (window.confirm("Xác nhận đặt hàng?")) {

      const total = CartUtil.getTotal(this.context.mycart);

      const items = this.context.mycart.map(item => ({
        product: item.product?._id,
        quantity: item.quantity
      }));

      if (this.context.customer) {
        this.apiCheckout(total, items);
      } else {
        this.props.router.navigate('/login')
      }
    }
  }

  apiCheckout(total, items) {

    const body = {
      total: total,
      items: items
    };

    const config = {
      headers: {
        Authorization: `Bearer ${this.context.token}`
      }
    };

    axios.post('http://localhost:3001/api/customer/checkout', body, config)
      .then(res => {

        if (res.data.success) {
          alert("🎉 Đặt hàng thành công!");
          this.context.setMycart([]);
          this.props.router.navigate('/myorders')
        } else {
          alert("❌ " + (res.data.message || "Checkout failed"));
        }

      })
      .catch(err => {

        const msg =
          err.response?.data?.message ||
          err.message ||
          "Server error";

        alert("❌ " + msg);
      });
  }
}

/* ================= STYLE ================= */
const styles = {

  container: {
    width: "90%",
    margin: "30px auto",
    padding: "25px",
    background: "#fff",
    borderRadius: "15px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.08)"
  },

  backBtn: {
    marginBottom:"15px",
    padding:"8px 16px",
    borderRadius:"8px",
    border:"1px solid #000",
    background:"#fff",
    cursor:"pointer",
    fontWeight:"bold",
    transition:"0.3s"
  },

  title: {
    textAlign: "center",
    marginBottom: "25px",
    fontSize: "24px"
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

  price: {
    color: "#555"
  },

  qty: {
    padding: "4px 10px",
    background: "#eee",
    borderRadius: "10px"
  },

  amount: {
    fontWeight: "bold",
    color: "#e53935"
  },

  removeBtn: {
    background: "#ff4d4d",
    border: "none",
    color: "white",
    padding: "6px 12px",
    borderRadius: "6px",
    cursor: "pointer",
    transition: "0.3s"
  },

  checkoutBtn: {
    background: "#4CAF50",
    color: "white",
    padding: "12px 20px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
    transition: "0.3s"
  },

  footer: {
    marginTop: "25px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },

  total: {
    color: "#e53935"
  },

  empty: {
    textAlign: "center",
    padding: "30px",
    color: "#777"
  }

};

export default withRouter(Mycart);