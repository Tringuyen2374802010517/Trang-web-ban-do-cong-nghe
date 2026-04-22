import React, { Component } from "react";
import axios from "axios";
import MyContext from "../contexts/MyContext";

class MyProfileComponent extends Component {

  static contextType = MyContext;

  constructor(props){
    super(props);

    this.state = {
      _id: "",
      txtUsername: "",
      txtPassword: "",
      txtName: "",
      txtPhone: "",
      txtEmail: "",
      errors: {} // 🔥 THÊM
    };
  }

  componentDidMount(){
    const customer = this.context.customer;

    if(customer){
      this.setState({
        _id: customer._id,
        txtUsername: customer.username,
        txtPassword: customer.password,
        txtName: customer.name,
        txtPhone: customer.phone,
        txtEmail: customer.email
      });
    }
  }

  // 🔥 VALIDATE GIỐNG SIGNUP
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
    }

    this.setState({ errors });
  };

  handleInputChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
    this.validateField(name, value);
  };

  isFormValid = () => {
    return Object.keys(this.state.errors).length === 0;
  };

  render(){
    return(

      <div style={styles.page}>

        <div style={styles.card}>

          <h2 style={styles.title}>My Profile</h2>

          {/* Username */}
          <div style={styles.group}>
            <label>Username</label>
            <input
              value={this.state.txtUsername}
              readOnly
              style={styles.inputDisabled}
            />
          </div>

          {/* Password */}
          <div style={styles.group}>
            <label>Password</label>
            <input
              type="password"
              name="txtPassword"
              value={this.state.txtPassword}
              onChange={this.handleInputChange}
              style={{
                ...styles.input,
                border: this.state.errors.password ? "1px solid red" : "1px solid #ccc"
              }}
            />
            {this.state.errors.password && <div style={styles.error}>{this.state.errors.password}</div>}
          </div>

          {/* Name */}
          <div style={styles.group}>
            <label>Name</label>
            <input
              name="txtName"
              value={this.state.txtName}
              onChange={this.handleInputChange}
              style={{
                ...styles.input,
                border: this.state.errors.name ? "1px solid red" : "1px solid #ccc"
              }}
            />
            {this.state.errors.name && <div style={styles.error}>{this.state.errors.name}</div>}
          </div>

          {/* Phone */}
          <div style={styles.group}>
            <label>Phone</label>
            <input
              name="txtPhone"
              value={this.state.txtPhone}
              onChange={this.handleInputChange}
              style={{
                ...styles.input,
                border: this.state.errors.phone ? "1px solid red" : "1px solid #ccc"
              }}
            />
            {this.state.errors.phone && <div style={styles.error}>{this.state.errors.phone}</div>}
          </div>

          {/* Email */}
          <div style={styles.group}>
            <label>Email</label>
            <input
              name="txtEmail"
              value={this.state.txtEmail}
              onChange={this.handleInputChange}
              style={{
                ...styles.input,
                border: this.state.errors.email ? "1px solid red" : "1px solid #ccc"
              }}
            />
            {this.state.errors.email && <div style={styles.error}>{this.state.errors.email}</div>}
          </div>

          {/* Button */}
          <button
            onClick={()=>this.btnUpdateClick()}
            disabled={!this.isFormValid()} // 🔥 disable nếu sai
            style={{
              ...styles.button,
              opacity: !this.isFormValid() ? 0.6 : 1
            }}
            onMouseEnter={e=>e.target.style.background="#1976d2"}
            onMouseLeave={e=>e.target.style.background="#2196f3"}
          >
            UPDATE PROFILE
          </button>

        </div>

      </div>
    )
  }

  // ================= UPDATE =================
  btnUpdateClick(){

    if(!this.isFormValid()){
      alert("Please enter correct information!");
      return;
    }

    const token = this.context.token || localStorage.getItem("token");

    if(!token){
      alert("Please login again");
      return;
    }

    const config = {
      headers: {
        Authorization: "Bearer " + token
      }
    };

    const body = {
      username: this.state.txtUsername,
      password: this.state.txtPassword,
      name: this.state.txtName,
      phone: this.state.txtPhone,
      email: this.state.txtEmail
    };

    axios.put(
      "/api/customer/customers/" + this.state._id,
      body,
      config
    )
    .then(res => {

      const result = res.data;

      if(result){

        alert("Update successful!");

        this.setState({
          txtUsername: result.username,
          txtPassword: result.password,
          txtName: result.name,
          txtPhone: result.phone,
          txtEmail: result.email
        });

        this.context.setCustomer(result);
        localStorage.setItem("customer", JSON.stringify(result));
      }

    })
    .catch(err => {
      console.error("UPDATE ERROR:", err);
      alert("Update failed!");
    });

  }

}

/* ===== STYLE ===== */
const styles = {

  page: {
  height: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "flex-start",
  paddingTop: "120px",
  background: "#f5f6fa",
  fontFamily: "Arial, sans-serif"
  },

  card: {
    width:"400px",
    background:"#fff",
    padding:"30px",
    borderRadius:"15px",
    boxShadow:"0 10px 30px rgba(0,0,0,0.1)"
  },

  title: {
    textAlign:"center",
    marginBottom:"25px"
  },

  group: {
    marginBottom:"15px",
    display:"flex",
    flexDirection:"column"
  },

  input: {
    marginTop:"5px",
    padding:"10px",
    borderRadius:"8px",
    border:"1px solid #ccc",
    outline:"none"
  },

  inputDisabled: {
    marginTop:"5px",
    padding:"10px",
    borderRadius:"8px",
    border:"1px solid #ddd",
    background:"#eee"
  },

  error: {
    color:"red",
    fontSize:"13px",
    marginTop:"4px"
  },

  button: {
    width:"100%",
    padding:"12px",
    background:"#2196f3",
    color:"#fff",
    border:"none",
    borderRadius:"8px",
    fontWeight:"bold",
    cursor:"pointer",
    marginTop:"10px",
    transition:"0.3s"
  }

};

export default MyProfileComponent;