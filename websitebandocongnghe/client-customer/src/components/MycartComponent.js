import React, { Component } from 'react';
import MyContext from '../contexts/MyContext';
import CartUtil from '../utils/CartUtil';
import axios from 'axios';
import { withRouter } from '../utils/withRouter';

class Mycart extends Component {
  static contextType = MyContext;

  constructor(props) {
    super(props);
    this.state = {
      showCheckout: false,
      phone: "", 
      address: "",
      note: "",
      deliveryType: "delivery",
      paymentMethod: "",
      selectedStore: ""
    };
  }

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
            >
              Remove
            </button>
          </td>
        </tr>
      );
    });

    return (
      <div style={styles.container}>

        <button
          style={styles.backBtn}
          onClick={() => this.props.router.navigate(-1)}
        >
          ← Back
        </button>

        <h2 style={styles.title}>My Shopping Cart</h2>

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
            style={{
              ...styles.checkoutBtn,
              ...(cart.length === 0 ? styles.disabledBtn : {})
            }}
            disabled={cart.length === 0}
            onClick={() => this.setState({ showCheckout: true })}
          >
            Checkout
          </button>
        </div>

        {this.state.showCheckout && (
          <div style={styles.overlay}>
            <div style={styles.modal}>

              <h2 style={styles.modalTitle}>ORDER INFORMATION</h2>

              <div style={styles.section}>
                <div style={styles.sectionTitle}>DELIVERY METHOD</div>

                <label style={styles.radio}>
                  <input
                    type="radio"
                    checked={this.state.deliveryType === "delivery"}
                    onChange={() => this.setState({ deliveryType: "delivery" })}
                  />
                  Home delivery
                </label>

                <label style={styles.radio}>
                  <input
                    type="radio"
                    checked={this.state.deliveryType === "store"}
                    onChange={() => this.setState({ deliveryType: "store" })}
                  />
                  Pickup at store
                </label>
              </div>

              {this.state.deliveryType === "delivery" && (
                <>
                  <label style={styles.label}>
                    Address <span style={styles.required}>*</span>
                  </label>
                  <input
                    style={styles.input}
                    value={this.state.address}
                    onChange={e => this.setState({ address: e.target.value })}
                  />
                </>
              )}

              {this.state.deliveryType === "store" && (
                <div style={styles.storeList}>
                  {[
                    "11 Tran Nao, Thu Duc",
                    "19 Dong Khoi, District 1",
                    "3 Phan Dang Luu, Binh Thanh",
                    "237 Khanh Hoi, District 4"
                  ].map((s, i) => (
                    <label key={i} style={styles.storeItem}>
                      <input
                        type="radio"
                        checked={this.state.selectedStore === s}
                        onChange={() => this.setState({ selectedStore: s })}
                      />
                      {s}
                    </label>
                  ))}
                </div>
              )}

              <textarea
                style={styles.input}
                placeholder="Enter your note"
                value={this.state.note}
                onChange={e => this.setState({ note: e.target.value })}
              />

              <div style={styles.section}>
                <div style={styles.sectionTitle}>
                  PAYMENT METHOD <span style={styles.required}>*</span>
                </div>

                <select
                  style={styles.input}
                  value={this.state.paymentMethod}
                  onChange={e => this.setState({ paymentMethod: e.target.value })}
                >
                  <option value="">Select method</option>
                  <option value="cod">Cash</option>
                  <option value="bank">Bank transfer</option>
                </select>
              </div>

              {this.state.paymentMethod === "bank" && (
                <div style={styles.qrBox}>
                  <p>Scan QR to pay</p>
                  <img src="/IMG_3856.jpeg" style={styles.qr} alt="" />
                </div>
              )}

              <div style={styles.modalActions}>
                <button
                  style={styles.cancelBtn}
                  onClick={() => this.setState({ showCheckout: false })}
                >
                  Cancel
                </button>

                <button
                  style={styles.confirmBtn}
                  onClick={() => this.handleConfirmCheckout()}
                >
                  Place Order
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    );
  }

  handleConfirmCheckout() {

    if (this.state.deliveryType === "delivery" && !this.state.address) {
      alert("Please enter address!");
      return;
    }

    if (this.state.deliveryType === "store" && !this.state.selectedStore) {
      alert("Please select store!");
      return;
    }

    if (!this.state.paymentMethod) {
      alert("Please choose payment method!");
      return;
    }

    const total = CartUtil.getTotal(this.context.mycart);

    const items = this.context.mycart.map(item => ({
      product: item.product?._id,
      quantity: item.quantity
    }));

    this.setState({ showCheckout: false });

    this.apiCheckout(total, items);
  }

  lnkRemoveClick(id) {
    const mycart = [...this.context.mycart];
    const index = mycart.findIndex(x => x.product._id === id);

    if (index !== -1) {
      mycart.splice(index, 1);
      this.context.setMycart(mycart);
    }
  }

  apiCheckout(total, items) {

    const body = {
      total: total,
      items: items,
      address: this.state.address,
      deliveryType: this.state.deliveryType,
      selectedStore: this.state.selectedStore,
      paymentMethod: this.state.paymentMethod,
      note: this.state.note 
    };

    const config = {
      headers: {
        Authorization: `Bearer ${this.context.token}`
      }
    };

    axios.post('http://localhost:3001/api/customer/checkout', body, config)
      .then(res => {

        if (res.data.success) {
          alert("🎉 Order placed successfully!");
          this.context.setMycart([]);
          this.props.router.navigate('/myorders')
        } else {
          alert("❌ " + (res.data.message || "Checkout failed"));
        }

      })
      .catch(err => {
        alert("❌ Server error");
      });
  }
}

// ... GIỮ NGUYÊN TOÀN BỘ CODE PHÍA TRÊN

const styles = {

  container:{ width:"95%", maxWidth:"1200px", margin:"40px auto", padding:"30px", background:"#fff", borderRadius:"16px", boxShadow:"0 15px 40px rgba(0,0,0,0.1)" },

  backBtn:{ marginBottom:"20px", padding:"10px 18px", borderRadius:"10px", border:"1px solid #ddd", background:"#fff", cursor:"pointer" },

  title:{ textAlign:"center", marginBottom:"30px", fontSize:"28px", fontWeight:"700" },

  table:{ width:"100%", borderCollapse:"separate", borderSpacing:"0 10px" },

  header:{ background:"#f5f5f5", height:"50px" },

  row:{ textAlign:"center", background:"#fff", boxShadow:"0 5px 15px rgba(0,0,0,0.05)", transition:"0.2s" },

  name:{ fontWeight:"600" },

  img:{ width:"70px", height:"70px", borderRadius:"10px", objectFit:"cover" },

  qty:{ background:"#eee", padding:"6px 12px", borderRadius:"12px" },

  amount:{ fontWeight:"700", color:"#e53935" },

  /* 🔥 REMOVE BUTTON (SHOPEE STYLE) */
  removeBtn:{ 
    background:"#ff4d4d", 
    border:"none", 
    color:"white", 
    padding:"8px 14px", 
    borderRadius:"8px", 
    cursor:"pointer",
    transition:"0.2s"
  },

  /* 🔥 CHECKOUT = SAME SIZE */
  checkoutBtn:{ 
    background:"linear-gradient(135deg,#4CAF50,#2e7d32)", 
    color:"white", 
    padding:"8px 14px",     // giống remove
    border:"none", 
    borderRadius:"8px",     // giống remove
    cursor:"pointer",
    fontSize:"14px",
    fontWeight:"500",
    transition:"0.2s"
  },

  disabledBtn:{ background:"#ccc", cursor:"not-allowed" },

  footer:{ marginTop:"30px", display:"flex", justifyContent:"space-between", alignItems:"center" },

  total:{ color:"#e53935", fontWeight:"700", fontSize:"18px" },

  empty:{ textAlign:"center", padding:"40px", opacity:0.5, color:"#999", fontSize:"18px" },

  overlay:{ position:"fixed", top:0, left:0, width:"100%", height:"100%", background:"rgba(0,0,0,0.6)", display:"flex", justifyContent:"center", alignItems:"center" },

  modal:{ background:"#fff", padding:"25px", borderRadius:"16px", width:"100%", maxWidth:"820px", maxHeight:"70vh", overflowY:"auto" },

  modalTitle:{ fontWeight:"700", marginBottom:"20px", fontSize:"22px" },

  section:{ marginBottom:"15px" },

  sectionTitle:{ fontWeight:"600", marginBottom:"8px" },

  radio:{ display:"block", marginBottom:"5px" },

  storeList:{ border:"1px solid #eee", padding:"10px", borderRadius:"8px", marginBottom:"10px" },

  storeItem:{ display:"block", marginBottom:"6px" },

  label:{ fontWeight:"600", display:"block", marginBottom:"5px" },

  required:{ color:"red" },

  input:{ width:"100%", padding:"10px", marginBottom:"15px", borderRadius:"8px", border:"1px solid #ccc" },

  qrBox:{ textAlign:"center", margin:"15px 0" },

  qr:{ width:"260px", borderRadius:"12px" },

  modalActions:{ display:"flex", justifyContent:"space-between" },

  cancelBtn:{ background:"#ccc", padding:"10px 16px", border:"none", borderRadius:"8px", cursor:"pointer" },

  confirmBtn:{ background:"#4CAF50", color:"#fff", padding:"10px 16px", border:"none", borderRadius:"8px", cursor:"pointer" }
};

export default withRouter(Mycart);