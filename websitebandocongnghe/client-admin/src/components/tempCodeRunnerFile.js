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
      .catch(err => {
        console.error(err);
        this.setState({ products: [] });
      });
  }

  trItemClick(item) {
    this.setState({ itemSelected: item });
  }

  render() {
    const rows = this.state.products.map(item => (
      <tr
        key={item._id}
        onClick={() => this.trItemClick(item)}
        style={{ cursor: 'pointer' }}
      >
        <td>{item._id}</td>
        <td>{item.name}</td>
        <td>{item.price}</td>
        <td>{item.show ? 'Show' : 'Hide'}</td>

        {}
        <td>
          {item.categories_id?.map(c => c.name).join(', ')}
        </td>

        {}
        <td>
          {item.images?.length > 0 ? (
            <img
              src={`/uploads/${item.images[0]}`}   // 🔥 FIX DUY NHẤT
              width="80"
              alt="product"
            />
          ) : (
            'No image'
          )}
        </td>
      </tr>
    ));

    return (
      <div style={{ display: 'flex', width: '100%' }}>
        {/* LIST */}
        <div>
          <h2>PRODUCT LIST</h2>
          <table border="1">
            <tbody>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Price</th>
                <th>Status</th>
                <th>Categories</th>
                <th>Image</th>
              </tr>
              {rows}
            </tbody>
          </table>
        </div>

        {/* DETAIL */}
        <div style={{ marginLeft: 'auto' }}>
          <ProductDetail
            item={this.state.itemSelected}
            reload={() => this.apiGetProducts()}
          />
        </div>
      </div>
    );
  }
}

export default Product;