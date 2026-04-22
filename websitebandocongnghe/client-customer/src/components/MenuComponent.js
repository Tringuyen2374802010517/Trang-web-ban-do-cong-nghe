import axios from "axios";
import React, { Component } from "react";
import { Link } from "react-router-dom";

class MenuComponent extends Component {

  constructor(props){
    super(props);
    this.state = {
      categories: [],
      txtKeyword: ""
    }
  }

  componentDidMount(){
    axios.get("/api/customer/categories")   // 🔥 FIX DUY NHẤT
    .then(res=>{
      this.setState({categories: res.data})
    })
  }

  renderCategories(){
    return this.state.categories.map((item)=>(
      <Link
        key={item._id}
        to={"/product/category/"+item._id}
        style={styles.link}
        onMouseEnter={e=>e.target.style.color="#000"}
        onMouseLeave={e=>e.target.style.color="#666"}
      >
        {item.name.toUpperCase()}
      </Link>
    ))
  }

  handleInput(e){
    this.setState({txtKeyword: e.target.value})
  }

  btnSearchClick(e){
    e.preventDefault()
    window.location.href = "/product/search/"+this.state.txtKeyword
  }

  render(){
    return(
      <div style={styles.navbar}>

        <div style={styles.container}>

          <div style={styles.left}>

            <Link to="/home" style={styles.logo}>
              TECHDevices
            </Link>

            <div style={styles.categories}>

              <Link
                to="/home"
                style={styles.link}
                onMouseEnter={e=>e.target.style.color="#000"}
                onMouseLeave={e=>e.target.style.color="#666"}
              >
                Home
              </Link>

              {this.renderCategories()}

            </div>

          </div>

          <div style={styles.right}>

            <input
              type="text"
              placeholder="Search products..."
              value={this.state.txtKeyword}
              onChange={(e)=>this.handleInput(e)}
              style={styles.input}
            />

            <button
              onClick={(e)=>this.btnSearchClick(e)}
              style={styles.button}
            >
              Search
            </button>

          </div>

        </div>

      </div>
    )
  }

}

const styles = {

  navbar: {
    position: "sticky",
    top: 0,
    width:"100%",
    background:"#94AAD6",
    borderBottom:"1px solid #205AA7",
    zIndex:1000
  },

  container: {
    width:"100%",
    padding:"15px 50px",
    display:"flex",
    justifyContent:"space-between",
    alignItems:"center",
    boxSizing:"border-box",
    flexWrap:"wrap"
  },

  left: {
    display:"flex",
    alignItems:"center",
    gap:"20px"
  },

  logo: {
    fontSize:"20px",
    fontWeight:"bold",
    textDecoration:"none",
    color:"#000"
  },

  categories: {
    display:"flex",
    gap:"15px",
    alignItems:"center"
  },

  link: {
    textDecoration:"none",
    color:"#666",
    fontSize:"14px",
    transition:"0.3s"
  },

  right: {
    display:"flex",
    gap:"10px",
    alignItems:"center"
  },

  input: {
    padding:"8px 12px",
    borderRadius:"20px",
    border:"1px solid #ddd",
    outline:"none",
    width:"200px"
  },

  button: {
    padding:"8px 15px",
    borderRadius:"20px",
    border:"none",
    background:"#007aff",
    color:"#fff",
    cursor:"pointer",
    fontWeight:"bold",
    transition:"0.3s"
  }

};

export default MenuComponent;