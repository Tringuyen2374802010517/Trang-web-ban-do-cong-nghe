import axios from "axios";
import React, { Component } from "react";
import { withRouter } from "../utils/withRouter";
import MyContext from "../contexts/MyContext";

class ProductDetailComponent extends Component {

  static contextType = MyContext;

  constructor(props){
    super(props);
    this.state={
      product: null,
      txtQuantity: 1,
      relatedProducts: []
    }
  }

  componentDidMount(){
    this.apiGetProduct();
    this.apiGetRelatedProducts();
  }

  // ✅ FIX: click sản phẩm khác vẫn load lại
  componentDidUpdate(prevProps){
    const prevID = prevProps.router.params.id;
    const currentID = this.props.router.params.id;

    if(prevID !== currentID){
      this.apiGetProduct();
      this.apiGetRelatedProducts();
      window.scrollTo(0, 0);
    }
  }

  apiGetProduct(){
    const id = this.props.router.params.id;

    axios
    .get("/api/customer/products/"+id)   // 🔥 FIX
    .then(res=>{
      this.setState({product: res.data})
    });
  }

  apiGetRelatedProducts(){
    axios
      .get("/api/customer/products")   // 🔥 FIX (bị sai http:///)
      .then(res=>{
        const all = res.data;

        const shuffled = all.sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, 5);

        this.setState({ relatedProducts: selected });
      });
  }

  formatPrice(price){
    return price?.toLocaleString('vi-VN') + "₫";
  }

  render(){

    const p = this.state.product;

    if(p==null){
      return <h2 style={{textAlign:"center"}}>Loading...</h2>
    }

    return(

      <div style={styles.wrapper}>

        <button
          onClick={()=>this.props.router.navigate(-1)}
          style={styles.backBtn}
        >
          ← Back
        </button>

        <div style={styles.card}>

          <div style={styles.left}>
            <img
              src={"/uploads/"+p.images[0]}   // 🔥 FIX
              alt=""
              style={styles.img}
            />
          </div>

          <div style={styles.right}>

            <h2 style={styles.name}>{p.name}</h2>

            <p style={styles.price}>
              {this.formatPrice(p.price)}
            </p>

            <p style={styles.text}>
              <b>Category:</b>{" "}
              {p.categories_id && p.categories_id.length > 0
                ? p.categories_id[0].name
                : ""}
            </p>

            <div style={styles.qtyBox}>
              <span><b>Quantity:</b></span>

              <input
                type="number"
                min="1"
                max="99"
                value={this.state.txtQuantity}
                onChange={(e)=>this.setState({txtQuantity: e.target.value})}
                style={styles.input}
              />
            </div>

            <button
              onClick={(e)=>this.btnAdd2CartClick(e)}
              style={styles.button}
              onMouseEnter={e=>e.target.style.background="#d32f2f"}
              onMouseLeave={e=>e.target.style.background="#ff4d4d"}
            >
              🛒 ADD TO CART
            </button>

          </div>

        </div>

        {/* SPEC */}
        <div style={styles.specBox}>

          <h2 style={styles.specTitle}>Product Specifications</h2>

          <table style={styles.table}>
            <tbody>

              <tr style={styles.row}>
                <td style={styles.label}>Name of product</td>
                <td style={styles.value}>{p.name}</td>
              </tr>

              <tr style={styles.row}>
                <td style={styles.label}>Price</td>
                <td style={styles.value}>{this.formatPrice(p.price)}</td>
              </tr>

              <tr style={styles.row}>
                <td style={styles.label}>Category</td>
                <td style={styles.value}>
                  {p.categories_id && p.categories_id.length > 0
                    ? p.categories_id[0].name
                    : ""}
                </td>
              </tr>

              <tr style={styles.row}>
                <td style={styles.label}>Status</td>
                <td style={styles.value}>In stock</td>
              </tr>

              <tr style={styles.row}>
                <td style={styles.label}>Brand from</td>
                <td style={styles.value}>{p.brand || "Updating"}</td>
              </tr>

              <tr style={styles.row}>
                <td style={styles.label}>Battery</td>
                <td style={styles.value}>{p.battery || "Updating"}</td>
              </tr>

              <tr style={styles.row}>
                <td style={styles.label}>Manufacture year</td>
                <td style={styles.value}>{p.year || "Updating"}</td>
              </tr>

              <tr style={styles.row}>
                <td style={styles.label}>Compatible</td>
                <td style={styles.value}>{p.compatible || "Updating"}</td>
              </tr>

              <tr style={styles.row}>
                <td style={styles.label}>Features</td>
                <td style={styles.value}>{p.feature || "Updating"}</td>
              </tr>

              <tr style={styles.row}>
                <td style={styles.label}>Port</td>
                <td style={styles.value}>{p.port || "Updating"}</td>
              </tr>

              <tr style={styles.row}>
                <td style={styles.label}>Size</td>
                <td style={styles.value}>{p.size || "Updating"}</td>
              </tr>

              <tr style={styles.row}>
                <td style={styles.label}>Weight</td>
                <td style={styles.value}>{p.weight || "Updating"}</td>
              </tr>

            </tbody>
          </table>

        </div>

        {/* RELATED */}
        <div style={styles.relatedBox}>

          <h2>You may also like</h2>

          <div style={styles.relatedGrid}>
            {this.state.relatedProducts.map((item, index)=>(
              <div
                key={index}
                style={styles.relatedCard}
                onClick={()=>this.props.router.navigate("/product/"+item._id)}
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
                  src={"/uploads/"+item.images[0]}   // 🔥 FIX
                  alt=""
                  style={styles.relatedImg}
                />

                <h4 style={styles.relatedName}>{item.name}</h4>

                <p style={styles.relatedPrice}>
                  {this.formatPrice(item.price)}
                </p>

              </div>
            ))}
          </div>

        </div>

      </div>

    )
  }

  btnAdd2CartClick(e){
    e.preventDefault();

    if(!this.context.token){
      const ok = window.confirm("Please log in before purchasing!");
      if(ok){
        this.props.router.navigate("/login");
      }
      return;
    }

    const product = this.state.product;
    const quantity = parseInt(this.state.txtQuantity);

    if(quantity){

      const mycart = [...this.context.mycart];

      const index = mycart.findIndex(
        x => x.product._id === product._id
      );

      if(index === -1){
        mycart.push({ product, quantity });
      }else{
        mycart[index].quantity += quantity;
      }

      this.context.setMycart(mycart);

      alert("🛒 Product added!");

    }else{
      alert("Enter quantity");
    }
  }

}

const styles = {

  wrapper: {
    width:"85%",
    margin:"30px auto",
    fontFamily:"Arial, sans-serif"
  },

  backBtn: {
    marginBottom:"15px",
    padding:"8px 16px",
    borderRadius:"8px",
    border:"1px solid #000",
    background:"#fff",
    cursor:"pointer"
  },

  card: {
    display:"flex",
    alignItems:"center",
    justifyContent:"center",
    gap:"50px",
    background:"#fff",
    padding:"30px",
    borderRadius:"15px",
    boxShadow:"0 10px 30px rgba(0,0,0,0.08)"
  },

  left: {
    flex:"1",
    display:"flex",
    justifyContent:"center"
  },

  right: {
    flex:"1",
    display:"flex",
    flexDirection:"column",
    justifyContent:"center",
    
  },

  img: {
    width:"320px",
    height:"320px",
    objectFit:"cover",
    borderRadius:"12px"
  },

  name: {
    fontSize:"24px",
    marginBottom:"10px"
  },

  price: {
    color:"#0071e3",
    fontWeight:"bold",
    fontSize:"28px"
  },

  text: {
    marginTop:"10px",
    color:"#555"
  },

  qtyBox: {
    marginTop:"15px",
    display:"flex",
    alignItems:"center",
    gap:"10px"
  },

  input: {
    width:"70px",
    padding:"6px"
  },

  button: {
    marginTop:"20px",
    padding:"8px 16px",
    background:"#ff4d4d",
    border:"none",
    color:"#fff",
    borderRadius:"6px",
    fontWeight:"bold",
    cursor:"pointer",
    width:"fit-content"
  },

  specBox: {
    marginTop:"30px",
    background:"#fff",
    padding:"25px",
    borderRadius:"15px",
    boxShadow:"0 8px 25px rgba(0,0,0,0.05)"
  },

  specTitle:{
    marginBottom:"15px",
    fontWeight:"600"
  },

  table: {
    width:"100%",
    borderCollapse:"collapse"
  },

  row:{
    borderBottom:"1px solid #eee"
  },

  label: {
    fontWeight:"bold",
    width:"220px",
    padding:"12px",
    background:"#f9f9f9"
  },

  value:{
    padding:"12px"
  },

  relatedBox: {
    marginTop: "40px"
  },

  relatedGrid: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center"
  },

  relatedCard: {
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

  relatedImg: {
    width:"180px",
    height:"180px",
    objectFit:"cover",
    borderRadius:"10px"
  },

  relatedName: {
    fontSize:"14px",
    marginTop:"10px",
    color:"#1d1d1f"
  },

  relatedPrice: {
    color:"#0071e3",
    fontWeight:"bold",
    marginTop:"5px"
  }

};

export default withRouter(ProductDetailComponent);