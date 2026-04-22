import axios from "axios";
import React, { Component } from "react";

class HomeComponent extends Component {

  constructor(props){
    super(props);
    this.state = {
      newproducts: [],
      hotproducts: [],
      currentIndex: 0,
      sliding: false
    };
  }

  componentDidMount(){
    axios.get("/api/customer/products/new") 
    .then(res => {
      this.setState({ newproducts: res.data });
    });

    axios.get("/api/customer/products/hot") 
    .then(res => {
      this.setState({ hotproducts: res.data });
    });

    this.interval = setInterval(() => {
      if(this.state.newproducts.length > 0){
        this.setState({ sliding: true });

        setTimeout(() => {
          this.setState(prev => ({
            currentIndex: (prev.currentIndex + 1) % Math.min(6, prev.newproducts.length),
            sliding: false
          }));
        }, 270);
      }
    }, 3000);

    window.addEventListener("scroll", this.handleScroll);

    setTimeout(() => {
      document.querySelectorAll(".cinema").forEach(el => {
        el.classList.remove("show");
      });
      this.handleScroll();
    }, 100);
  }

  componentWillUnmount(){
    clearInterval(this.interval);
    window.removeEventListener("scroll", this.handleScroll);
  }

  handleScroll = () => {
    const elements = document.querySelectorAll(".cinema");

    elements.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight - 100) {
        el.classList.add("show");
      }
    });
  };

  formatPrice(price){
    return price?.toLocaleString("vi-VN") + "₫";
  }

  renderProduct(item){
    return (
      <div
        key={item._id}
        onClick={()=>window.location="/product/"+item._id}
        style={styles.card}
        className="product-card"
      >
        <div style={styles.imageBox}>
          <img
            src={"/uploads/"+item.images[0]}
            alt=""
            style={styles.image}
          />
        </div>

        <h4 style={styles.name}>{item.name}</h4>

        <p style={styles.price}>
          {this.formatPrice(item.price)}
        </p>
      </div>
    );
  }

  render(){
    const { newproducts, hotproducts, currentIndex, sliding } = this.state;
    const list = newproducts.slice(0,6);
    const current = list[currentIndex];

    return(
      <div style={styles.container}>

        {/* BANNER */}
        <div style={styles.banner}>
          <img src="/4.jpg" style={styles.bannerImage} alt="" />
        </div>

        {/* SLIDER */}
        {current && (
          <div style={styles.slider}>
            <div style={styles.sliderHeader}>NEW PRODUCTS</div>

            <div
              style={{
                ...styles.sliderContent,
                transform: sliding ? "translateX(-60px) scale(0.96)" : "translateX(0) scale(1)",
                opacity: sliding ? 0 : 1
              }}
              onClick={()=>window.location="/product/"+current._id}
            >
              <img
                src={"/uploads/"+current.images[0]} 
                alt=""
                style={styles.sliderImage}
              />
              <h3 style={styles.sliderName}>{current.name}</h3>
            </div>
          </div>
        )}

        {/* HOT PRODUCTS */}
        <h2 style={styles.title}>HOT PRODUCTS</h2>

        <div style={styles.grid}>
          {hotproducts.map(item => this.renderProduct(item))}
        </div>

        {/*GALLERY BACKGROUND ĐEN*/}
        <div style={{ background: "#000" }}>
          {/* Video1 */}
          <div className="cinema" style={styles.fullSection}>
            <video src="/clip1.mp4" className="cinema-img" autoPlay loop muted playsInline/>
            <div className="cinema-text1">Amazing Product</div>
          </div>

          {/* VIDEO2 */}
          <div className="cinema" style={styles.fullSection}>
            <video src="/clip2.mp4" className="cinema-img" autoPlay loop muted playsInline/>
            <div className="cinema-text2">Premium Quality</div>
          </div>

          {/* HÌNH */}
          <div className="cinema last" style={styles.fullSection}>
            <img src="/3.jpg" className="cinema-img" alt="" />
            <div className="cinema-text3">Next Generation</div>
          </div>

          {/* Video3 */}
          <div className="cinema" style={styles.fullSection}>
            <video src="/clip3.mp4" className="cinema-img" autoPlay loop muted playsInline/>
            <div className="cinema-text4">Extremely Big
            </div>
          </div>

          {/* Video4 */}
          <div className="cinema" style={styles.fullSection}>
            <video src="/clip4.mp4" className="cinema-img" autoPlay loop muted playsInline/>
            <div className="cinema-text5">Absolute Cinema</div>
          </div>

          {/* Video5 */}
          <div className="cinema" style={styles.fullSection}>
            <video src="/clip5.mp4" className="cinema-img" autoPlay loop muted playsInline/>
          </div>

        </div>

        {/* FOOTER */}
        <div style={styles.footer}>
          <div style={styles.footerTop}>
            <div style={styles.footerCol}>
              <b>Shopping</b>
              <p>MacBook</p>
              <p>iPhone</p>
              <p>iPad</p>
              <p>AirPods</p>
              <p>Apple Watch</p>
            </div>

            <div style={styles.footerCol}>
              <b>Account</b>
              <p>Apple ID</p>
              <p>iCloud</p>
            </div>

            <div style={styles.footerCol}>
              <b>Supporting</b>
              <p>Help</p>
              <p>Connect</p>
            </div>

            <div style={styles.footerCol}>
              <b>About us</b>
              <p>Introduction</p>
              <p>Recruitment</p>
            </div>
          </div>

          <div style={styles.footerBottom}>
            © 2026 TECHDevices
          </div>
        </div>

        {/* CSS */}
        <style>
          {`
            .cinema {
              opacity: 0;
              transform: translateY(80px);
              transition: all 1s ease;
              position: relative;
              overflow: hidden;
            }

            .cinema.show {
              opacity: 1;
              transform: translateY(0);
            }

            .cinema-img {
              width: 100%;
              height: 100%;
              object-fit: contain;
              background: #000;
            }

            /* 🔥 CHỈ SỬA CHỖ NÀY */
            .cinema-text1 {
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              color: white;
              font-size: 50px;
              font-weight: bold;
              text-shadow: 0 5px 20px rgba(0,0,0,0.7);
            }
            .cinema-text2 {
              position: absolute;
              top: 50%;
              left: 90%;
              transform: translate(-50%, -50%);
              color: white;
              font-size: 50px;
              font-weight: bold;
              text-shadow: 0 5px 20px rgba(0,0,0,0.7);
            }
            .cinema-text3 {
              position: absolute;
              top: 25%;
              left: 80%;
              transform: translate(-50%, -50%);
              color: white;
              font-size:50px;
              font-weight: bold;
              text-shadow: 0 5px 20px rgba(0,0,0,0.7);
            }
            .cinema-text4 {
              position: absolute;
              top: 30%;
              left: 15%;
              transform: translate(-50%, -50%);
              color: white;
              font-size: 50px;
              font-weight: bold;
              text-shadow: 0 5px 20px rgba(0,0,0,0.7);
            }
            .cinema-text5 {
              position: absolute;
              top: 80%;
              left: 50%;
              transform: translate(-50%, -50%);
              color: white;
              font-size: 50px;
              font-weight: bold;
              text-shadow: 0 5px 20px rgba(0,0,0,0.7);
            }

            .cinema.last::after {
              content: "";
              position: absolute;
              bottom: 0;
              width: 100%;
              height: 80px;
              background: linear-gradient(to top, rgba(0,0,0,0.7), transparent);
              z-index: 2;
            }

            .product-card:hover {
              transform: translateY(-10px);
              box-shadow: 0 18px 40px rgba(0,0,0,0.15);
            }

            .product-card:hover img {
              transform: scale(1.05);
            }
          `}
        </style>

      </div>
    );
  }
}

const styles = {
  container:{ width:"100%", background:"#f5f5f7" },
  title:{ textAlign:"center", margin:"40px 0", fontSize:"28px", fontWeight:"600" },
  banner:{ width:"100%" },
  bannerImage:{ width:"100%", height:"365px", objectFit:"cover", borderRadius:"20px" },
  slider:{ height:"460px", background:"#fff", display:"flex", flexDirection:"column", alignItems:"center", paddingTop:"10px" },
  sliderHeader:{ fontSize:"30px", fontWeight:"bold", marginBottom:"20px" },
  sliderContent:{ textAlign:"center", transition:"1s" },
  sliderImage:{ width:"300px", height:"300px", objectFit:"cover", borderRadius:"20px" },
  sliderName:{ marginTop:"15px" },
  grid:{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(250px, 1fr))", gap:"25px", padding:"0 20px" },
  card:{ background:"#fff", borderRadius:"20px", padding:"20px", textAlign:"center", cursor:"pointer", transition:"all 0.4s ease", boxShadow:"0 6px 20px rgba(0,0,0,0.06)" },
  imageBox:{ height:"200px", display:"flex", alignItems:"center", justifyContent:"center" },
  image:{ maxWidth:"100%", maxHeight:"100%", objectFit:"contain", transition:"0.4s" },
  name:{ marginTop:"10px", fontWeight:"600" },
  price:{ color:"#1976d2", fontWeight:"bold" },
  fullSection:{ width:"100%", height:"100vh", position:"relative" },
  footer:{ background:"#646466", padding:"40px 20px", borderTop:"1px solid #646466", marginTop:"0px" },
  footerTop:{ display:"flex", justifyContent:"center", gap:"70px", flexWrap:"wrap" },
  footerCol:{ minWidth:"150px" },
  footerBottom:{ textAlign:"center", marginTop:"20px", fontSize:"13px" }
};

export default HomeComponent;