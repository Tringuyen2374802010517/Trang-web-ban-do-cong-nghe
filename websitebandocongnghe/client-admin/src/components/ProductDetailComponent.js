import axios from 'axios';
import React, { Component } from 'react';
import MyContext from '../contexts/MyContext';

class ProductDetail extends Component {
  static contextType = MyContext;

  constructor(props) {
    super(props);
    this.state = {
      txtID: '',
      txtName: '',
      txtPrice: '',
      cmbCategory: '',
      fileImage: null,
      imagePreview: null,
      categories: [],

      // SPECIFICATIONS
      txtBattery: '',
      txtYear: '',
      txtCompatible: '',
      txtFeature: '',
      txtPort: '',
      txtSize: '',
      txtWeight: '',
      txtBrand: '',

      // VALIDATION
      errors: {}
    };
  }

  componentDidMount() {
    this.apiGetCategories();
  }

  componentDidUpdate(prevProps) {
    if (this.props.item !== prevProps.item && this.props.item) {
      const p = this.props.item;

      this.setState({
        txtID: p._id,
        txtName: p.name,
        txtPrice: p.price,

        cmbCategory:
          typeof p.categories_id?.[0] === 'object'
            ? p.categories_id[0]._id
            : p.categories_id?.[0] || '',

        fileImage: null,

        // FIX IMAGE
        imagePreview: p.images?.[0]
          ? `http://localhost:3001/uploads/${p.images[0].replace('uploads/', '')}`
          : null,

        // LOAD SPEC
        txtBattery: p.battery || '',
        txtYear: p.year || '',
        txtCompatible: p.compatible || '',
        txtFeature: p.feature || '',
        txtPort: p.port || '',
        txtSize: p.size || '',
        txtWeight: p.weight || '',
        txtBrand: p.brand || '',

        errors: {}
      });
    }
  }

  // =========================
  // VALIDATE
  // =========================
  validate = () => {
    const errors = {};

    if (!this.state.txtName.trim()) {
      errors.name = "Name is required";
    }

    if (!this.state.txtPrice) {
      errors.price = "Price is required";
    } else if (isNaN(this.state.txtPrice)) {
      errors.price = "Price must be a number";
    }

    if (!this.state.cmbCategory) {
      errors.category = "Please select category";
    }

    if (!this.state.txtBattery.trim()) {
      errors.battery = "Battery is required";
    }

    if (this.state.txtYear && isNaN(this.state.txtYear)) {
      errors.year = "Year must be a number";
    }

    this.setState({ errors });
    return Object.keys(errors).length === 0;
  };

  // =========================
  // GET CATEGORY
  // =========================
  apiGetCategories() {
    axios.get('/api/admin/categories', {
      headers: { Authorization: `Bearer ${this.context.token}` }
    })
      .then(res => {
        this.setState({ categories: res.data.categories || [] });
      })
      .catch(err => console.error(err));
  }

  // =========================
  // ADD
  // =========================
  btnAddNewClick = () => {

    if (!this.validate()) return;

    const formData = new FormData();

    formData.append('name', this.state.txtName);
    formData.append('price', parseFloat(this.state.txtPrice));
    formData.append('categories_id', this.state.cmbCategory);

    formData.append('battery', this.state.txtBattery);
    formData.append('year', this.state.txtYear);
    formData.append('compatible', this.state.txtCompatible);
    formData.append('feature', this.state.txtFeature);
    formData.append('port', this.state.txtPort);
    formData.append('size', this.state.txtSize);
    formData.append('weight', this.state.txtWeight);
    formData.append('brand', this.state.txtBrand);

    if (this.state.fileImage) {
      formData.append('image', this.state.fileImage);
    }

    axios.post('/api/admin/products', formData, {
      headers: { Authorization: `Bearer ${this.context.token}` }
    })
      .then(() => {
        alert('Add success');
        this.props.reload();
        this.resetForm();
      })
      .catch(() => alert('Add failed'));
  };

  // =========================
  // UPDATE
  // =========================
  btnUpdateClick = () => {

    if (!this.validate()) return;

    const formData = new FormData();

    formData.append('name', this.state.txtName);
    formData.append('price', parseFloat(this.state.txtPrice));
    formData.append('categories_id', this.state.cmbCategory);

    formData.append('battery', this.state.txtBattery);
    formData.append('year', this.state.txtYear);
    formData.append('compatible', this.state.txtCompatible);
    formData.append('feature', this.state.txtFeature);
    formData.append('port', this.state.txtPort);
    formData.append('size', this.state.txtSize);
    formData.append('weight', this.state.txtWeight);
    formData.append('brand', this.state.txtBrand);

    if (this.state.fileImage) {
      formData.append('image', this.state.fileImage);
    }

    axios.put(`/api/admin/products/${this.state.txtID}`, formData, {
      headers: { Authorization: `Bearer ${this.context.token}` }
    })
      .then((res) => {
        alert('Update success');

        const p = res.data.product;

        this.setState({
          txtBattery: p.battery || '',
          txtYear: p.year || '',
          txtCompatible: p.compatible || '',
          txtFeature: p.feature || '',
          txtPort: p.port || '',
          txtSize: p.size || '',
          txtWeight: p.weight || '',
          txtBrand: p.brand || ''
        });

        this.props.reload();
      })
      .catch(() => alert('Update failed'));
  };

  // =========================
  // DELETE
  // =========================
  btnDeleteClick = () => {
    if (!window.confirm('Delete this product?')) return;

    axios.delete(`/api/admin/products/${this.state.txtID}`, {
      headers: { Authorization: `Bearer ${this.context.token}` }
    })
      .then(() => {
        alert('Delete success');
        this.props.reload();
        this.resetForm();
      })
      .catch(() => alert('Delete failed'));
  };

  // =========================
  // RESET
  // =========================
  resetForm() {
    this.setState({
      txtID: '',
      txtName: '',
      txtPrice: '',
      cmbCategory: '',
      fileImage: null,
      imagePreview: null,

      txtBattery: '',
      txtYear: '',
      txtCompatible: '',
      txtFeature: '',
      txtPort: '',
      txtSize: '',
      txtWeight: '',
      txtBrand: '',

      errors: {}
    });
  }

  // =========================
  // RENDER
  // =========================
  render() {
    return (
      <div style={{ minWidth: '320px' }}>
        <h2>PRODUCT DETAIL</h2>

        <p>ID</p>
        <input value={this.state.txtID} readOnly />

        <p>Name</p>
        <input
          value={this.state.txtName}
          onChange={e => this.setState({ txtName: e.target.value })}
        />
        {this.state.errors.name && <div style={{ color: 'red' }}>{this.state.errors.name}</div>}

        <p>Price</p>
        <input
          value={this.state.txtPrice}
          onChange={e => this.setState({ txtPrice: e.target.value })}
        />
        {this.state.errors.price && <div style={{ color: 'red' }}>{this.state.errors.price}</div>}

        <p>Image</p>
        <input
          type="file"
          accept="image/*"
          onChange={e => {
            const file = e.target.files[0];
            if (file) {
              this.setState({
                fileImage: file,
                imagePreview: URL.createObjectURL(file)
              });
            }
          }}
        />

        {this.state.imagePreview && (
          <img src={this.state.imagePreview} width="150" alt="preview" />
        )}

        <p>Category</p>
        <select
          value={this.state.cmbCategory}
          onChange={e => this.setState({ cmbCategory: e.target.value })}
        >
          <option value="">-- Select Category --</option>
          {this.state.categories.map(c => (
            <option key={c._id} value={c._id}>{c.name}</option>
          ))}
        </select>
        {this.state.errors.category && <div style={{ color: 'red' }}>{this.state.errors.category}</div>}

        <hr />
        <h3>📊 Product Specifications</h3>

        <table style={{ width: '100%' }}>
          <tbody>
            <tr>
              <td>Battery</td>
              <td>
                <input value={this.state.txtBattery} onChange={e => this.setState({ txtBattery: e.target.value })} />
                {this.state.errors.battery && <div style={{ color: 'red' }}>{this.state.errors.battery}</div>}
              </td>
            </tr>

            <tr>
              <td>Year</td>
              <td>
                <input value={this.state.txtYear} onChange={e => this.setState({ txtYear: e.target.value })} />
                {this.state.errors.year && <div style={{ color: 'red' }}>{this.state.errors.year}</div>}
              </td>
            </tr>

            <tr>
              <td>Compatible</td>
              <td><input value={this.state.txtCompatible} onChange={e => this.setState({ txtCompatible: e.target.value })} /></td>
            </tr>

            <tr>
              <td>Feature</td>
              <td><input value={this.state.txtFeature} onChange={e => this.setState({ txtFeature: e.target.value })} /></td>
            </tr>

            <tr>
              <td>Port</td>
              <td><input value={this.state.txtPort} onChange={e => this.setState({ txtPort: e.target.value })} /></td>
            </tr>

            <tr>
              <td>Size</td>
              <td><input value={this.state.txtSize} onChange={e => this.setState({ txtSize: e.target.value })} /></td>
            </tr>

            <tr>
              <td>Weight</td>
              <td><input value={this.state.txtWeight} onChange={e => this.setState({ txtWeight: e.target.value })} /></td>
            </tr>

            <tr>
              <td>Brand</td>
              <td><input value={this.state.txtBrand} onChange={e => this.setState({ txtBrand: e.target.value })} /></td>
            </tr>
          </tbody>
        </table>

        <br />

        <button onClick={this.btnAddNewClick}>ADD NEW</button>
        <button onClick={this.btnUpdateClick}>UPDATE</button>
        <button onClick={this.btnDeleteClick}>DELETE</button>
      </div>
    );
  }
}

export default ProductDetail;