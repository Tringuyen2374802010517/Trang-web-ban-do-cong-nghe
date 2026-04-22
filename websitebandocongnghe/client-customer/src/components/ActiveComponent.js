import React, { Component } from "react";
import axios from "axios";
import { withRouter } from "../utils/withRouter";

class ActiveComponent extends Component {

  constructor(props) {
    super(props);
    this.state = {
      txtID: "",
      txtToken: "",
      message: ""
    };
  }

  componentDidMount() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    const token = params.get("token");

    if (id && token) {
      this.setState({
        txtID: id,
        txtToken: token
      }, () => {
        this.btnActiveClick(new Event("submit"));
      });
    }
  }

  handleInputChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  btnActiveClick = (e) => {
    if (e) e.preventDefault();

    if (!this.state.txtID || !this.state.txtToken) {
      this.setState({ message: "Invalid input" });
      return;
    }

    const account = {
      id: this.state.txtID,
      token: this.state.txtToken
    };

    axios.post("/api/customer/active", account)   // 🔥 FIX DUY NHẤT

      .then((res) => {
        if (res.data && res.data.success === true) {
          this.setState({
            message: "Activation success"
          });
        } else {
          this.setState({
            message: "Invalid ID or token"
          });
        }
      })

      .catch(() => {
        this.setState({ message: "Server error" });
      });
  };

  goToLogin = () => {
    this.props.router.navigate("/login");
  };

  render() {

    return (
      <div style={styles.page}>

        <div style={styles.card}>

          <h2 style={styles.title}>Activate Account</h2>

          <form onSubmit={this.btnActiveClick}>

            <div style={styles.group}>
              <label>ID</label>
              <input
                type="text"
                name="txtID"
                value={this.state.txtID}
                placeholder="Enter your ID..."
                onChange={this.handleInputChange}
                style={styles.input}
              />
            </div>

            <div style={styles.group}>
              <label>Token</label>
              <input
                type="text"
                name="txtToken"
                value={this.state.txtToken}
                placeholder="Enter activation token..."
                onChange={this.handleInputChange}
                style={styles.input}
              />
            </div>

            <button type="submit" style={styles.button}>
              ACTIVE
            </button>

          </form>

          {this.state.message && (
            <h3 style={{
              marginTop: "20px",
              color: this.state.message.toLowerCase().includes("success")
                ? "#34c759"
                : "#ff3b30",
              textAlign: "center"
            }}>
              {this.state.message}
            </h3>
          )}

          <p style={{ marginTop: "20px" }}>
            Get back to{" "}
            <span onClick={this.goToLogin} style={styles.link}>
              Log In.
            </span>
          </p>

        </div>

      </div>
    );
  }
}

const styles = {
  page: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    paddingTop: "120px",
    background: "#f5f7fa",
    fontFamily: "'Poppins', sans-serif"
  },

  card: {
    width: "400px",
    background: "#ffffff",
    padding: "35px",
    borderRadius: "20px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
    color: "#000"
  },

  title: {
    textAlign: "center",
    marginBottom: "25px"
  },

  group: {
    marginBottom: "18px",
    display: "flex",
    flexDirection: "column"
  },

  input: {
    marginTop: "5px",
    padding: "12px",
    borderRadius: "10px",
    border: "1px solid #ddd",
    background: "#ffffff",
    color: "#000",
    outline: "none"
  },

  button: {
    width: "100%",
    padding: "12px",
    background: "#007aff",
    border: "none",
    borderRadius: "10px",
    color: "#fff",
    fontWeight: "bold",
    cursor: "pointer",
    marginTop: "10px"
  },

  link: {
    color: "#007aff",
    fontWeight: "bold",
    cursor: "pointer"
  }
};

export default withRouter(ActiveComponent);