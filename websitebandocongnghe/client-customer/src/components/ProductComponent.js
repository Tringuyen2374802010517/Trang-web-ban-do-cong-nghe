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
      axios.get("http://localhost:3001/api/customer/products/category/"+cid)
      .then(res=>{
        this.setState({
          products: res.data,
          originalProducts: res.data
        })
      })
    }

    if(keyword){
      axios.get("http://localhost:3001/api/customer/products/search/"+keyword)
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
        onMouseEnter={e=>{
          e.currentTarget.style.transform="translateY(-8px)";
          e.currentTarget.style.boxShadow="0 20px 40px rgba(0,0,0,0.12)";
        }}
        onMouseLeave={e=>{
          e.currentTarget.style.transform="translateY(0)";
          e.currentTarget.style.boxShadow="0 8px 20px rgba(0,0,0,0.08)";
        }}
      >
        <img
          src={"http://localhost:3001/uploads/"+item.images[0]}
          alt=""
          style={styles.img}
        />

        <h4 style={styles.name}>{item.name}</h4>

        <p style={styles.price}>
          {this.formatPrice(item.price)}
        </p>
      </div>
    ))
  }

  render(){
    return(
      <div style={styles.wrapper}>

        <h2 style={styles.title}>PRODUCTS</h2>

        {/* FILTER */}
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

        {/* GRID */}
        <div style={styles.grid}>
          {this.renderProducts()}
        </div>

      </div>
    )
  }
}

const styles = {

  wrapper:{
    width:"92%",
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
    cursor:"pointer",
    transition:"0.2s"
  },

  reset:{
    padding:"12px 18px",
    color:"red",
    fontWeight:"bold",
    cursor:"pointer"
  },

  grid:{
    display:"flex",
    flexWrap:"wrap",
    justifyContent:"center"
  },

  card:{
    width:"230px",
    margin:"12px",
    padding:"18px",
    background:"#fff",
    borderRadius:"18px",
    textAlign:"center",
    cursor:"pointer",
    transition:"0.3s",
    boxShadow:"0 8px 20px rgba(0,0,0,0.08)"
  },

  img:{
    width:"190px",
    height:"190px",
    objectFit:"cover",
    borderRadius:"12px"
  },

  name:{
    fontSize:"14px",
    marginTop:"10px",
    minHeight:"40px"
  },

  price:{
    color:"#0071e3",
    fontWeight:"bold",
    marginTop:"5px"
  }

};

export default withRouter(ProductComponent);