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
      txtEmail: ""
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

  render(){
    return(

      <div style={styles.page}>

        <div style={styles.card}>

          <h2 style={styles.title}>👤 My Profile</h2>

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
              value={this.state.txtPassword}
              onChange={(e)=>this.setState({txtPassword:e.target.value})}
              style={styles.input}
            />
          </div>

          {/* Name */}
          <div style={styles.group}>
            <label>Name</label>
            <input
              value={this.state.txtName}
              onChange={(e)=>this.setState({txtName:e.target.value})}
              style={styles.input}
            />
          </div>

          {/* Phone */}
          <div style={styles.group}>
            <label>Phone</label>
            <input
              value={this.state.txtPhone}
              onChange={(e)=>this.setState({txtPhone:e.target.value})}
              style={styles.input}
            />
          </div>

          {/* Email */}
          <div style={styles.group}>
            <label>Email</label>
            <input
              value={this.state.txtEmail}
              onChange={(e)=>this.setState({txtEmail:e.target.value})}
              style={styles.input}
            />
          </div>

          {/* Button */}
          <button
            onClick={()=>this.btnUpdateClick()}
            style={styles.button}
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

    const token = this.context.token || localStorage.getItem("token");

    if(!token){
      alert("Please login again");
      return;
    }

    // 🔥 FIX TOKEN HEADER (QUAN TRỌNG NHẤT)
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

        // 🔥 update context + localStorage
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
    display:"flex",
    justifyContent:"center",
    alignItems:"center",
    minHeight:"80vh",
    background:"#f5f6fa",
    fontFamily:"Arial, sans-serif"
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