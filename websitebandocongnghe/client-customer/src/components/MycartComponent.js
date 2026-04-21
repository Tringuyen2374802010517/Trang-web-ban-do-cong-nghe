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
      phone: "", // giữ nguyên nhưng không dùng
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

        {/* ================= MODAL ================= */}
        {this.state.showCheckout && (
          <div style={styles.overlay}>
            <div style={styles.modal}>

              <h2 style={styles.modalTitle}>THÔNG TIN ĐẶT HÀNG</h2>

              {/* DELIVERY */}
              <div style={styles.section}>
                <div style={styles.sectionTitle}>HÌNH THỨC GIAO HÀNG</div>

                <label style={styles.radio}>
                  <input
                    type="radio"
                    checked={this.state.deliveryType === "delivery"}
                    onChange={() => this.setState({ deliveryType: "delivery" })}
                  />
                  Giao hàng tận nơi
                </label>

                <label style={styles.radio}>
                  <input
                    type="radio"
                    checked={this.state.deliveryType === "store"}
                    onChange={() => this.setState({ deliveryType: "store" })}
                  />
                  Nhận hàng tại cửa hàng
                </label>
              </div>

              {/* DELIVERY FORM */}
              {this.state.deliveryType === "delivery" && (
                <>
                  <label style={styles.label}>
                    Địa chỉ <span style={styles.required}>*</span>
                  </label>
                  <input
                    style={styles.input}
                    value={this.state.address}
                    onChange={e => this.setState({ address: e.target.value })}
                  />
                </>
              )}

              {/* STORE */}
              {this.state.deliveryType === "store" && (
                <div style={styles.storeList}>
                  {[
                    "11 Trần Não, Thủ Đức",
                    "19 Đồng Khởi, Quận 1",
                    "3 Phan Đăng Lưu, Bình Thạnh",
                    "237 Khánh Hội, Quận 4"
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

              {/* NOTE */}
              <textarea
                style={styles.input}
                placeholder="Nhập yêu cầu"
                value={this.state.note}
                onChange={e => this.setState({ note: e.target.value })}
              />

              {/* PAYMENT */}
              <div style={styles.section}>
                <div style={styles.sectionTitle}>
                  PHƯƠNG THỨC THANH TOÁN <span style={styles.required}>*</span>
                </div>

                <select
                  style={styles.input}
                  value={this.state.paymentMethod}
                  onChange={e => this.setState({ paymentMethod: e.target.value })}
                >
                  <option value="">Chọn phương thức</option>
                  <option value="cod">Thanh toán tiền mặt</option>
                  <option value="bank">Chuyển khoản</option>
                </select>
              </div>

              {/* QR */}
              {this.state.paymentMethod === "bank" && (
                <div style={styles.qrBox}>
                  <p>Quét mã để thanh toán</p>
                  <img
                    src="/IMG_3856.jpeg"
                    style={styles.qr}
                    alt=""
                  />
                </div>
              )}

              {/* BUTTON */}
              <div style={styles.modalActions}>
                <button
                  style={styles.cancelBtn}
                  onClick={() => this.setState({ showCheckout: false })}
                >
                  Hủy
                </button>

                <button
                  style={styles.confirmBtn}
                  onClick={() => this.handleConfirmCheckout()}
                >
                  Đặt hàng
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    );
  }

  handleConfirmCheckout() {

    if (this.state.deliveryType === "delivery") {
      if (!this.state.address) {
        alert("Vui lòng nhập địa chỉ!");
        return;
      }
    }

    if (this.state.deliveryType === "store") {
      if (!this.state.selectedStore) {
        alert("Chọn cửa hàng!");
        return;
      }
    }

    if (!this.state.paymentMethod) {
      alert("Chọn phương thức thanh toán!");
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
          alert("🎉 Đặt hàng thành công!");
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

const styles = {
  container: {
    width: "95%",
    maxWidth: "1200px",
    margin: "40px auto",
    padding: "30px",
    background: "#fff",
    borderRadius: "16px",
    boxShadow: "0 15px 40px rgba(0,0,0,0.1)"
  },

  backBtn: {
    marginBottom:"20px",
    padding:"10px 18px",
    borderRadius:"10px",
    border:"1px solid #ddd",
    background:"#fff",
    cursor:"pointer"
  },

  title: {
    textAlign: "center",
    marginBottom: "30px",
    fontSize: "28px",
    fontWeight: "700"
  },

  table: {
    width: "100%",
    borderCollapse: "separate",
    borderSpacing: "0 10px"
  },

  header: {
    background: "#f5f5f5",
    height: "50px"
  },

  row: {
    textAlign: "center",
    background: "#fff",
    boxShadow: "0 5px 15px rgba(0,0,0,0.05)"
  },

  name: {
    fontWeight: "600"
  },

  img: {
    width: "70px",
    height: "70px",
    borderRadius: "10px",
    objectFit: "cover"
  },

  qty: {
    background: "#eee",
    padding: "6px 12px",
    borderRadius: "12px"
  },

  amount: {
    fontWeight: "700",
    color: "#e53935"
  },

  removeBtn: {
    background: "#ff4d4d",
    border: "none",
    color: "white",
    padding: "8px 14px",
    borderRadius: "8px",
    cursor: "pointer"
  },

  checkoutBtn: {
    background: "linear-gradient(135deg,#4CAF50,#2e7d32)",
    color: "white",
    padding: "14px 26px",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer"
  },

  disabledBtn: {
    background: "#ccc",
    cursor: "not-allowed"
  },

  footer: {
    marginTop: "30px",
    display: "flex",
    justifyContent: "space-between"
  },

  total: {
    color: "#e53935",
    fontWeight: "700"
  },

  empty: {
    textAlign: "center",
    padding: "40px"
  },

  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0,0,0,0.6)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },

  modal: {
    background: "#fff",
    padding: "25px",
    borderRadius: "16px",
    width: "100%",
    maxWidth: "820px",
    maxHeight: "70vh",   // 🔥 GIỚI HẠN CHIỀU CAO
  overflowY: "auto" 
  },

  modalTitle: {
    fontWeight: "700",
    marginBottom: "20px",
    fontSize: "22px"
  },

  section: {
    marginBottom: "15px"
  },

  sectionTitle: {
    fontWeight: "600",
    marginBottom: "8px"
  },

  radio: {
    display: "block",
    marginBottom: "5px"
  },

  storeList: {
    border: "1px solid #eee",
    padding: "10px",
    borderRadius: "8px",
    marginBottom: "10px"
  },

  storeItem: {
    display: "block",
    marginBottom: "6px"
  },

  label: {
    fontWeight: "600",
    display: "block",
    marginBottom: "5px"
  },

  required: {
    color: "red"
  },

  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "15px",
    borderRadius: "8px",
    border: "1px solid #ccc"
  },

  qrBox: {
    textAlign: "center",
    margin: "15px 0"
  },

  qr: {
    width: "260px",
    borderRadius: "12px"
  },

  modalActions: {
    display: "flex",
    justifyContent: "space-between"
  },

  cancelBtn: {
    background: "#ccc",
    padding: "10px 16px",
    border: "none",
    borderRadius: "8px"
  },

  confirmBtn: {
    background: "#4CAF50",
    color: "#fff",
    padding: "10px 16px",
    border: "none",
    borderRadius: "8px"
  }
};

export default withRouter(Mycart);