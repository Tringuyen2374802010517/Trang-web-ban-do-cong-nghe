import React, { Component } from "react";
import { Link } from "react-router-dom";
import MyContext from "../contexts/MyContext";

class InformComponent extends Component {

  static contextType = MyContext;

  render(){

    return(

      <div style={{
        position:"sticky", 
        top:"60px",
        width:"100%",
        background:"#426EB4",
        padding:"12px 5%",
        color:"#000",
        fontFamily:"Arial, sans-serif",
        display:"flex",
        justifyContent:"space-between",
        alignItems:"center",
        boxShadow:"0 2px 10px rgba(0,0,0,0.05)",
        boxSizing:"border-box",
        borderBottom:"1px solid #e5e5e5",
        zIndex:999
      }}>

        <div>

          {this.context.token === "" ?

            <div style={{display:"flex", gap:"15px"}}>

              <Link to="/login" style={styles.link}>
                Login
              </Link>

              <Link to="/signup" style={styles.link}>
                Sign-up
              </Link>

              <Link to="/active" style={styles.link}>
                Active
              </Link>

            </div>

          :

            <div style={{display:"flex", gap:"15px", alignItems:"center"}}>

              <span>
                Hello <b style={{color:"#FFFBD1"}}>
                  {this.context.customer.name}
                </b>
              </span>

              <Link
                to="/home"
                onClick={()=>this.lnkLogoutClick()}
                style={styles.link}
              >
                Logout
              </Link>

              <Link to="/myprofile" style={styles.link}>
                My profile
              </Link>

              <Link to="/myorders" style={styles.link}>
                My orders
              </Link>

            </div>

          }

        </div>

        <div>

          <Link
            to="/mycart"
            style={{
              ...styles.link,
              background:"#83C75D",
              padding:"7px 15px",
              borderRadius:"10px",
              fontWeight:"bold",
              color:"#fff"
            }}
          >
            Shopping Cart: {this.context.mycart.length} Products
          </Link>

        </div>

      </div>

    )
  }

  lnkLogoutClick(){
    this.context.setToken("");
    this.context.setCustomer(null);
    this.context.setMycart([]);
  }

}

const styles = {
  link: {
    color:"#333",
    textDecoration:"none",
    fontSize:"14px",
    transition:"0.3s"
  }
};

export default InformComponent;