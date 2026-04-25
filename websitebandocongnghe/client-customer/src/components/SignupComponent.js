import axios from "axios";
import React, { Component } from "react";
import { withRouter } from "../utils/withRouter";

class SignupComponent extends Component {

  constructor(props) {
    super(props);
    this.state = {
      txtUsername: "",
      txtPassword: "",
      txtName: "",
      txtPhone: "",
      txtEmail: "",
      message: "",
      errors: {},
      loading: false,
      isSuccess: false
    };
  }

  validateField = (name, value) => {
    let errors = { ...this.state.errors };

    switch (name) {
      case "txtName":
        value.length < 8
          ? errors.name = "The name must be at least 8 characters long"
          : delete errors.name;
        break;

      case "txtPassword":
        value.length < 6 || !/[A-Za-z]/.test(value) || !/[0-9]/.test(value)
          ? errors.password = "The password must be at least 6 characters long and include both letters and numbers."
          : delete errors.password;
        break;

      case "txtPhone":
        !/^[0-9]{10}$/.test(value)
          ? errors.phone = "The phone number must be exactly 10 digits."
          : delete errors.phone;
        break;

      case "txtEmail":
        !/^\S+@\S+\.\S+$/.test(value)
          ? errors.email = "Email is invalid"
          : delete errors.email;
        break;

      case "txtUsername":
        !value
          ? errors.username = "Username is required"
          : delete errors.username;
        break;
    }

    this.setState({ errors });
  };

  handleInputChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
    this.validateField(name, value);
  };

  isFormValid = () => {
    return Object.keys(this.state.errors).length === 0 &&
      this.state.txtUsername &&
      this.state.txtPassword &&
      this.state.txtName &&
      this.state.txtPhone &&
      this.state.txtEmail;
  };

  btnSignupClick = (e) => {
    e.preventDefault();

    if (!this.isFormValid()) {
      this.setState({ message: "Please enter correct information!" });
      return;
    }

    this.setState({ loading: true });

    const account = {
      username: this.state.txtUsername,
      password: this.state.txtPassword,
      name: this.state.txtName,
      phone: this.state.txtPhone,
      email: this.state.txtEmail
    };

    axios.post("/api/customer/signup", account)  
      .then((res) => {

        const msg = res.data.message || "";

        this.setState({
          message: msg,
          loading: false,
          isSuccess: msg.toLowerCase().includes("success")
        });

      })
      .catch(() => {
        this.setState({
          message: "Server error",
          loading: false,
          isSuccess: false
        });
      });
  };

  goToLogin = () => {
    this.props.router.navigate("/login");
  };

  goToActive = () => {
    this.props.router.navigate("/active");
  };

  renderInput(label, name, type, placeholder, errorKey) {
    const hasError = this.state.errors[errorKey];

    return (
      <div style={styles.group}>
        <label>
          {label} <span style={styles.required}>*</span>
        </label>

        <input
          type={type}
          name={name}
          value={this.state[name]}
          placeholder={placeholder}
          onChange={this.handleInputChange}
          style={{
            ...styles.input,
            border: hasError
              ? "1px solid #ff3b30"
              : "1px solid #ddd"
          }}
        />

        {hasError && <div style={styles.error}>{hasError}</div>}
      </div>
    );
  }

  render() {
    return (
      <div style={styles.page}>

        <div style={styles.card}>

          <h2 style={styles.title}>Create Account</h2>

          <form onSubmit={this.btnSignupClick}>

            {this.renderInput("Username","txtUsername","text","Enter username...","username")}
            {this.renderInput("Password","txtPassword","password","At least 6 chars","password")}
            {this.renderInput("Name","txtName","text","Minimum 8 characters","name")}
            {this.renderInput("Phone","txtPhone","text","10 digits only","phone")}
            {this.renderInput("Email","txtEmail","text","example@gmail.com","email")}

            <button
              type="submit"
              disabled={!this.isFormValid() || this.state.loading}
              style={{
                ...styles.button,
                opacity: (!this.isFormValid() || this.state.loading) ? 0.6 : 1
              }}
            >
              {this.state.loading ? "Signing up..." : "SIGN UP"}
            </button>

          </form>

          {this.state.message && (
            <div style={{ marginTop: "20px", textAlign: "center" }}>
              <h3 style={{
                color: this.state.isSuccess ? "#34c759" : "#ff3b30"
              }}>
                {this.state.message}
              </h3>

              {this.state.isSuccess && (
                <p onClick={this.goToActive} style={styles.activeLink}>
                  Click here to activate your account. 
                </p>
              )}
            </div>
          )}

          <p style={{ marginTop:"20px", textAlign:"center" }}>
            You have an account?{" "}
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
  page:{
    height:"100vh",
    display:"flex",
    justifyContent:"center",
    alignItems:"flex-start",
    paddingTop:"120px",
    background:"#f5f7fa",
    fontFamily:"Poppins, sans-serif"
  },
  card:{
    width:"420px",
    background:"#ffffff",
    padding:"35px",
    borderRadius:"20px",
    color:"#000",
    boxShadow:"0 10px 30px rgba(0,0,0,0.1)"
  },
  title:{
    textAlign:"center",
    marginBottom:"20px"
  },
  group:{
    marginBottom:"15px",
    display:"flex",
    flexDirection:"column"
  },
  input:{
    marginTop:"5px",
    padding:"12px",
    borderRadius:"10px",
    outline:"none",
    background:"#fff",
    color:"#000",
    border:"1px solid #ddd"
  },
  error:{
    color:"#ff3b30",
    fontSize:"13px",
    marginTop:"4px"
  },
  required:{
    color:"#ff3b30",
    marginLeft:"4px"
  },
  button:{
    width:"100%",
    padding:"12px",
    background:"#007aff",
    border:"none",
    borderRadius:"10px",
    color:"#fff",
    cursor:"pointer"
  },
  link:{
    color:"#007aff",
    fontWeight:"bold",
    cursor:"pointer"
  },
  activeLink:{
    marginTop:"10px",
    color:"#007aff",
    fontWeight:"bold",
    cursor:"pointer",
    textDecoration:"underline"
  }
};

export default withRouter(SignupComponent);