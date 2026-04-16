import axios from "axios";
import React, { Component } from "react";

class HomeComponent extends Component {

  constructor(props){
    super(props);
    this.state = {
      newproducts: [],
      hotproducts: [],
      currentIndex: 0,
      sliding: false,
      showBanner: false
    };
  }

  componentDidMount(){
    axios.get("http://localhost:3001/api/customer/products/new")
    .then(res => {
      this.setState({ newproducts: res.data });
    });

    axios.get("http://localhost:3001/api/customer/products/hot")
    .then(res => {
      this.setState({ hotproducts: res.data });
    });

    this.interval = setInterval(() => {
      if(this.state.newproducts.length > 0){

        this.setState({ sliding: true });

        setTimeout(() => {
          this.setState(prev => ({
            currentIndex: (prev.currentIndex + 1) % prev.newproducts.length,
            sliding: false
          }));
        }, 270); // delay nhỏ để tạo cảm giác inertia

      }
    }, 3000); // chậm hơn → “thở”

    window.addEventListener("scroll", this.handleScroll);
  }

  componentWillUnmount(){
    clearInterval(this.interval);
    window.removeEventListener("scroll", this.handleScroll);
  }

  handleScroll = () => {
    if(window.scrollY > 300){
      this.setState({ showBanner: true });
    }
  };

  formatPrice(price){
    return price?.toLocaleString('vi-VN') + "₫";
  }

  renderProduct(item){
    return (
      <div
        key={item._id}
        onClick={()=>window.location="/product/"+item._id}
        style={styles.card}
        onMouseEnter={e=>{
          e.currentTarget.style.transform="translateY(-6px)";
          e.currentTarget.style.boxShadow="0 10px 25px rgba(0,0,0,0.1)";
        }}
        onMouseLeave={e=>{
          e.currentTarget.style.transform="translateY(0)";
          e.currentTarget.style.boxShadow="0 4px 12px rgba(0,0,0,0.05)";
        }}
      >
        <img
          src={"http://localhost:3001/uploads/"+item.images[0]}
          alt=""
          style={styles.image}
        />
        <h4 style={styles.name}>{item.name}</h4>
      </div>
    );
  }

  render(){
    const { newproducts, hotproducts, currentIndex, sliding, showBanner } = this.state;

    const current = newproducts[currentIndex];

    return(
      <div style={styles.container}>

        <h2 style={styles.title}>NEW PRODUCTS</h2>

        {current && (
          <div style={styles.slider}>

            <div
              style={{
                ...styles.sliderContent,
                transform: sliding
                  ? "translateX(-60px) scale(0.96)"
                  : "translateX(0) scale(1)",
                opacity: sliding ? 0 : 1
              }}
              onClick={()=>window.location="/product/"+current._id}
            >
              <img
                src={"http://localhost:3001/uploads/"+current.images[0]}
                alt=""
                style={styles.sliderImage}
              />

              <h3
                style={{
                  ...styles.sliderName,
                  opacity: sliding ? 0 : 1,
                  transform: sliding ? "translateY(10px)" : "translateY(0)"
                }}
              >
                {current.name}
              </h3>
            </div>

          </div>
        )}

        {showBanner && (
          <div style={styles.banner}>
            🔥 SALE 50% - Limited Time Offer 🔥
          </div>
        )}

        <h2 style={styles.title}>HOT PRODUCTS</h2>

        <div style={styles.grid}>
          {hotproducts.map(item => this.renderProduct(item))}
        </div>

      </div>
    );
  }
}

const styles = {

  container:{
    width:"95%",
    margin:"auto",
    fontFamily:"-apple-system, BlinkMacSystemFont, sans-serif",
    background:"#f5f5f7",
    minHeight:"100vh",
    borderRadius:"15px"
  },

  title:{
    textAlign:"center",
    marginTop:"40px",
    marginBottom:"20px",
    color:"#1d1d1f",
    fontWeight:"600"
  },

  slider:{
    position:"relative",
    height:"380px",
    background:"#fff",
    borderRadius:"20px",
    overflow:"hidden",
    display:"flex",
    justifyContent:"center",
    alignItems:"center",
    boxShadow:"0 4px 20px rgba(0,0,0,0.05)"
  },

  sliderContent:{
    textAlign:"center",
    cursor:"pointer",
    transition:"all 1.4s cubic-bezier(0.22, 1, 0.36, 1)"
  },

  sliderImage:{
    width:"300px",
    height:"300px",
    objectFit:"cover",
    borderRadius:"15px",
    transition:"all 1.4s cubic-bezier(0.22, 1, 0.36, 1)"
  },

  sliderName:{
    marginTop:"15px",
    color:"#1d1d1f",
    fontWeight:"500",
    transition:"all 1.6s cubic-bezier(0.22, 1, 0.36, 1)"
  },

  grid:{
    display:"flex",
    flexWrap:"wrap",
    justifyContent:"center"
  },

  card:{
    width:"220px",
    margin:"12px",
    padding:"15px",
    background:"#fff",
    borderRadius:"15px",
    textAlign:"center",
    cursor:"pointer",
    transition:"0.3s",
    boxShadow:"0 4px 12px rgba(0,0,0,0.05)"
  },

  image:{
    width:"180px",
    height:"180px",
    objectFit:"cover",
    borderRadius:"10px"
  },

  name:{
    fontSize:"14px",
    marginTop:"10px",
    color:"#1d1d1f"
  },

  banner:{
    marginTop:"40px",
    padding:"20px",
    textAlign:"center",
    background:"#0071e3",
    color:"#fff",
    borderRadius:"15px",
    fontWeight:"bold",
    fontSize:"18px"
  }

};

export default HomeComponent;