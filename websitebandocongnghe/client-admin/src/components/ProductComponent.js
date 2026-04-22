import axios from 'axios';
import React, { Component } from 'react';
import MyContext from '../contexts/MyContext';
import ProductDetail from './ProductDetailComponent';

class Product extends Component {
  static contextType = MyContext;

  constructor(props) {
    super(props);
    this.state = {
      products: [],
      itemSelected: null
    };
  }

  componentDidMount() {
    this.apiGetProducts();
  }

  apiGetProducts() {
    axios
      .get('/api/admin/products', {
        headers: {
          Authorization: `Bearer ${this.context.token}`
        }
      })
      .then(res => {
        this.setState({ products: res.data.products || [] });
      })
      .catch(() => {
        this.setState({ products: [] });
      });
  }

  trItemClick(item) {
    this.setState({ itemSelected: item });
  }

  // ================= STYLE =================
  styles = {
    container: {
      display: 'flex',
      gap: '20px',
      padding: '20px',
      background: 'linear-gradient(135deg,#0f2027,#203a43,#2c5364)',
      minHeight: '100vh',
      color: '#fff'
    },

    left: {
      flex: 2,
      background: 'rgba(255,255,255,0.08)',
      backdropFilter: 'blur(10px)',
      borderRadius: '16px',
      padding: '20px'
    },

    right: {
      flex: 1,
      background: 'rgba(255,255,255,0.08)',
      backdropFilter: 'blur(10px)',
      borderRadius: '16px',
      padding: '20px'
    },

    table: {
      width: '100%',
      borderCollapse: 'collapse'
    },

    th: {
      padding: '10px',
      background: 'rgba(255,255,255,0.1)',
      textAlign: 'left'
    },

    td: {
      padding: '10px',
      borderTop: '1px solid rgba(255,255,255,0.1)',
      cursor: 'pointer'
    },

    img: {
      width: '70px',
      height: '70px',
      borderRadius: '8px',
      objectFit: 'cover'
    },

    badge: (show) => ({
      padding: '4px 10px',
      borderRadius: '10px',
      fontSize: '12px',
      background: show ? '#00c853' : '#d50000'
    }),

    rowSelected: {
      background: 'rgba(255,255,255,0.2)'
    }
  };

  render() {
    const { products, itemSelected } = this.state;

    const rows = products.map(item => (
      <tr
        key={item._id}
        onClick={() => this.trItemClick(item)}
        style={{
          ...(itemSelected?._id === item._id
            ? this.styles.rowSelected
            : {})
        }}
      >
        <td style={this.styles.td}>{item.name}</td>
        <td style={this.styles.td}>{item.price}</td>

        <td style={this.styles.td}>
          <span style={this.styles.badge(item.show)}>
            {item.show ? 'SHOW' : 'HIDE'}
          </span>
        </td>

        <td style={this.styles.td}>
          {item.categories_id?.map(c => c.name).join(', ')}
        </td>

        <td style={this.styles.td}>
          {item.images?.length > 0 ? (
            <img
              style={this.styles.img}
              src={`http://localhost:3001/uploads/${item.images[0]}`}
              alt=""
            />
          ) : (
            'No image'
          )}
        </td>
      </tr>
    ));

    return (
      <div style={this.styles.container}>
        {/* LIST */}
        <div style={this.styles.left}>
          <h2>Product List </h2>

          <table style={this.styles.table}>
            <thead>
              <tr>
                <th style={this.styles.th}>Name</th>
                <th style={this.styles.th}>Price</th>
                <th style={this.styles.th}>Status</th>
                <th style={this.styles.th}>Categories</th>
                <th style={this.styles.th}>Image</th>
              </tr>
            </thead>

            <tbody>{rows}</tbody>
          </table>
        </div>

        {/* DETAIL */}
        <div style={this.styles.right}>
          <h2>Product Detail</h2>

          <ProductDetail
            item={itemSelected}
            reload={() => this.apiGetProducts()}
          />
        </div>
      </div>
    );
  }
}

export default Product;