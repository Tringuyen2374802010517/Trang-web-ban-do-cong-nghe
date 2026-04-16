import React, { Component } from "react";
import axios from "axios";
import { withRouter } from "../utils/withRouter";
import MyContext from "../contexts/MyContext";

class LoginComponent extends Component {

  static contextType = MyContext;

  constructor(props) {
    super(props);
    this.state = {
      txtUsername: "",
      txtPassword: "",
      message: ""
    };
  }

  handleInputChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  btnLoginClick = (e) => {
    e.preventDefault();

    const account = {
      username: this.state.txtUsername,
      password: this.state.txtPassword
    };

    axios.post("http://localhost:3001/api/customer/login", account)

      .then(res => {
        const result = res.data;

        if (result.success === true) {

          localStorage.clear();

          localStorage.setItem("token", result.token);
          localStorage.setItem("customer", JSON.stringify(result.customer));

          this.context.setToken(result.token);
          this.context.setCustomer(result.customer);

          alert("Login success");
          this.props.router.navigate("/home");

        } else {

          let msg = result.message || "Acconut or password is not correct";

          if (msg.toLowerCase().includes("not found")) {
            msg = "Account does not exist";
          } else if (msg.toLowerCase().includes("password")) {
            msg = "Password is not correct";
          }

          this.setState({ message: msg });
        }
      })

      .catch(() => {
        this.setState({ message: "Cannot access server" });
      });
  };

  goToSignup = () => {
    this.props.router.navigate("/signup");
  };

  render() {

    return (
      <div style={styles.page}>

        <div style={styles.card}>

          <h2 style={styles.title}>LOGIN</h2>

          <form>

            <div style={styles.group}>
              <label>Username</label>
              <input
                type="text"
                name="txtUsername"
                value={this.state.txtUsername}
                placeholder="Enter your username..."
                onChange={this.handleInputChange}
                style={styles.input}
              />
            </div>

            <div style={styles.group}>
              <label>Password</label>
              <input
                type="password"
                name="txtPassword"
                value={this.state.txtPassword}
                placeholder="Enter your password..."
                onChange={this.handleInputChange}
                style={styles.input}
              />
            </div>

            <button
              type="button"
              onClick={this.btnLoginClick}
              style={styles.button}
            >
              LOGIN
            </button>

          </form>

          {this.state.message && (
            <h3 style={styles.error}>{this.state.message}</h3>
          )}

          <p style={{ marginTop: "20px" }}>
            You do not have any account?{" "}
            <span onClick={this.goToSignup} style={styles.link}>
              Register now.
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

  error: {
    marginTop: "20px",
    color: "#ff3b30",
    textAlign: "center"
  },

  link: {
    color: "#007aff",
    fontWeight: "bold",
    cursor: "pointer"
  }
};

export default withRouter(LoginComponent);