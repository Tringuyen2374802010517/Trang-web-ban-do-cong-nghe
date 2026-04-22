import axios from "axios";
import React, { Component } from "react";
import { withRouter } from "../utils/withRouter";

class ProductComponent extends Component {

  constructor(props){
    super(props);
    this.state={
      products:[],
      originalProducts:[],
      showFilter:false
    }
  }

  componentDidMount(){
    this.apiGetProducts();
  }

  componentDidUpdate(prevProps){
    if(prevProps.router.location.pathname !== this.props.router.location.pathname){
      this.apiGetProducts();
    }
  }

  apiGetProducts(){
    const cid = this.props.router.params.cid;
    const keyword = this.props.router.params.keyword;

    if(cid){
      axios.get("/api/customer/products/category/"+cid)   // 🔥 FIX
      .then(res=>{
        this.setState({
          products: res.data,
          originalProducts: res.data
        })
      })
    }

    if(keyword){
      axios.get("/api/customer/products/search/"+keyword) // 🔥 FIX
      .then(res=>{
        this.setState({
          products: res.data,
          originalProducts: res.data
        })
      })
    }
  }

  formatPrice(price){
    return price?.toLocaleString('vi-VN') + "₫";
  }

  sortProducts(type){
    let sorted = [...this.state.products];
    if(type === "asc") sorted.sort((a,b)=>a.price - b.price);
    if(type === "desc") sorted.sort((a,b)=>b.price - a.price);

    this.setState({products: sorted, showFilter:false});
  }

  filterByPrice(type){
    let filtered = [...this.state.originalProducts];

    if(type === "under20") filtered = filtered.filter(p => p.price < 20000000);
    if(type === "20to40") filtered = filtered.filter(p => p.price >= 20000000 && p.price <= 40000000);
    if(type === "over40") filtered = filtered.filter(p => p.price > 40000000);

    this.setState({products: filtered, showFilter:false});
  }

  resetFilter(){
    this.setState({
      products: this.state.originalProducts,
      showFilter:false
    });
  }

  renderProducts(){
    return this.state.products.map((item)=>(
      <div
        key={item._id}
        onClick={()=>this.props.router.navigate("/product/"+item._id)}
        style={styles.card}
        className="product-card"
      >
        <div style={styles.imageBox}>
          <img
            src={"/uploads/"+item.images[0]}   // 🔥 FIX
            alt=""
            style={styles.image}
          />
        </div>

        <h4 style={styles.name}>{item.name}</h4>

        <p style={styles.price}>
          {this.formatPrice(item.price)}
        </p>
      </div>
    ))
  }

  render(){
    return(
      <div>

        <div style={styles.wrapper}>

          <h2 style={styles.title}>PRODUCTS</h2>

          <div style={styles.filterWrap}>

            <button
              onClick={()=>this.setState({showFilter: !this.state.showFilter})}
              style={styles.filterBtn}
            >
              ⚙ Filter
            </button>

            {this.state.showFilter && (
              <div style={styles.dropdown}>

                <div style={styles.groupTitle}>Sort</div>

                <div onClick={()=>this.sortProducts("asc")} style={styles.option}>
                  ↑ Price: Low → High
                </div>

                <div onClick={()=>this.sortProducts("desc")} style={styles.option}>
                  ↓ Price: High → Low
                </div>

                <div style={styles.groupTitle}>Filter by price</div>

                <div onClick={()=>this.filterByPrice("under20")} style={styles.option}>
                  Under 20 triệu
                </div>

                <div onClick={()=>this.filterByPrice("20to40")} style={styles.option}>
                  20 → 40 triệu
                </div>

                <div onClick={()=>this.filterByPrice("over40")} style={styles.option}>
                  Over 40 triệu
                </div>

                <div onClick={()=>this.resetFilter()} style={styles.reset}>
                  Reset
                </div>

              </div>
            )}

          </div>

          <div style={styles.grid}>
            {this.renderProducts()}
          </div>

        </div>

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
              <b>Aount us</b>
              <p>Introduction</p>
              <p>Recruitment</p>
            </div>
          </div>

          <div style={styles.footerBottom}>
            © 2026 TECHDevices
          </div>
        </div>

        <style>
          {`
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
    )
  }
}

const styles = {

  wrapper:{
    width:"90%",
    margin:"auto",
    fontFamily:"-apple-system, BlinkMacSystemFont, sans-serif"
  },

  title:{
    textAlign:"center",
    margin:"30px 0",
    fontSize:"26px"
  },

  filterWrap:{
    position:"relative",
    marginBottom:"25px"
  },

  filterBtn:{
    padding:"10px 20px",
    borderRadius:"12px",
    border:"none",
    background:"linear-gradient(135deg,#0071e3,#0051a3)",
    color:"#fff",
    cursor:"pointer",
    fontWeight:"bold"
  },

  dropdown:{
    position:"absolute",
    top:"40px",
    left:"0",
    background:"#fff",
    borderRadius:"16px",
    boxShadow:"0 15px 40px rgba(0,0,0,0.2)",
    minWidth:"260px",
    overflow:"hidden",
    zIndex:999
  },

  groupTitle:{
    padding:"12px 18px",
    fontWeight:"bold",
    background:"#f7f7f7"
  },

  option:{
    padding:"12px 18px",
    cursor:"pointer"
  },

  reset:{
    padding:"12px 18px",
    color:"red",
    fontWeight:"bold",
    cursor:"pointer"
  },

  grid:{
    display:"grid",
    gridTemplateColumns:"repeat(auto-fit, minmax(250px, 1fr))",
    gap:"25px",
    padding:"0 20px"
  },

  card:{
    background:"#fff",
    borderRadius:"20px",
    padding:"20px",
    textAlign:"center",
    cursor:"pointer",
    transition:"all 0.4s ease",
    boxShadow:"0 6px 20px rgba(0,0,0,0.06)"
  },

  imageBox:{
    height:"200px",
    display:"flex",
    alignItems:"center",
    justifyContent:"center"
  },

  image:{
    maxWidth:"100%",
    maxHeight:"100%",
    objectFit:"contain",
    transition:"0.4s"
  },

  name:{ marginTop:"10px", fontWeight:"600" },

  price:{ color:"#1976d2", fontWeight:"bold" },

  footer:{
    width:"100%",
    background:"#f5f5f7",
    padding:"40px 20px",
    borderTop:"1px solid #ddd",
    marginTop:"60px"
  },

  footerTop:{
    display:"flex",
    justifyContent:"center",
    gap:"70px",
    flexWrap:"wrap"
  },

  footerCol:{ minWidth:"150px" },

  footerBottom:{
    textAlign:"center",
    marginTop:"20px",
    fontSize:"13px"
  }
};

export default withRouter(ProductComponent);