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

      txtBattery: '',
      txtYear: '',
      txtCompatible: '',
      txtFeature: '',
      txtPort: '',
      txtSize: '',
      txtWeight: '',
      txtBrand: '',

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

        imagePreview: p.images?.[0]
          ? `http://localhost:3001/uploads/${p.images[0]}`
          : null,

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

  // ================= VALIDATE =================
  validate = () => {
    const errors = {};

    if (!this.state.txtName.trim()) errors.name = "Name is required";
    if (!this.state.txtPrice) errors.price = "Price is required";
    else if (isNaN(this.state.txtPrice)) errors.price = "Must be number";

    if (!this.state.cmbCategory) errors.category = "Select category";
    if (!this.state.txtBattery.trim()) errors.battery = "Battery required";
    if (this.state.txtYear && isNaN(this.state.txtYear)) errors.year = "Must be number";

    this.setState({ errors });
    return Object.keys(errors).length === 0;
  };

  // ================= API =================
  apiGetCategories() {
    axios.get('/api/admin/categories', {
      headers: { Authorization: `Bearer ${this.context.token}` }
    })
      .then(res => {
        this.setState({ categories: res.data.categories || [] });
      });
  }

  btnAddNewClick = () => {
    if (!this.validate()) return;

    const formData = new FormData();

    formData.append('name', this.state.txtName);
    formData.append('price', this.state.txtPrice);
    formData.append('categories_id', this.state.cmbCategory);

    formData.append('battery', this.state.txtBattery);
    formData.append('year', this.state.txtYear);
    formData.append('compatible', this.state.txtCompatible);
    formData.append('feature', this.state.txtFeature);
    formData.append('port', this.state.txtPort);
    formData.append('size', this.state.txtSize);
    formData.append('weight', this.state.txtWeight);
    formData.append('brand', this.state.txtBrand);

    if (this.state.fileImage) formData.append('image', this.state.fileImage);

    axios.post('/api/admin/products', formData, {
      headers: { Authorization: `Bearer ${this.context.token}` }
    }).then(() => {
      alert('Add success');
      this.props.reload();
      this.resetForm();
    });
  };

  btnUpdateClick = () => {
    if (!this.validate()) return;

    const formData = new FormData();

    formData.append('name', this.state.txtName);
    formData.append('price', this.state.txtPrice);
    formData.append('categories_id', this.state.cmbCategory);

    formData.append('battery', this.state.txtBattery);
    formData.append('year', this.state.txtYear);
    formData.append('compatible', this.state.txtCompatible);
    formData.append('feature', this.state.txtFeature);
    formData.append('port', this.state.txtPort);
    formData.append('size', this.state.txtSize);
    formData.append('weight', this.state.txtWeight);
    formData.append('brand', this.state.txtBrand);

    if (this.state.fileImage) formData.append('image', this.state.fileImage);

    axios.put(`/api/admin/products/${this.state.txtID}`, formData, {
      headers: { Authorization: `Bearer ${this.context.token}` }
    }).then(() => {
      alert('Update success');
      this.props.reload();
    });
  };

  btnDeleteClick = () => {
    if (!window.confirm('Delete?')) return;

    axios.delete(`/api/admin/products/${this.state.txtID}`, {
      headers: { Authorization: `Bearer ${this.context.token}` }
    }).then(() => {
      alert('Delete success');
      this.props.reload();
      this.resetForm();
    });
  };

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

  // ================= STYLE =================
  styles = {
    input: { width: '100%', padding: '10px', marginBottom: '8px', borderRadius: '8px', border: 'none' },
    label: { fontSize: '13px', opacity: 0.9 },
    error: { color: '#ff5252', fontSize: '12px' },
    grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' },
    img: { width: '120px', borderRadius: '10px', marginTop: '10px' },
    btn: { padding: '10px', borderRadius: '8px', border: 'none', cursor: 'pointer', marginRight: '10px' },
    required: { color: '#ff5252', marginLeft: '4px' }
  };

  render() {
    return (
      <div>
        <p style={{ fontSize: '12px', color: '#ff8a80' }}>
          * Required fields
        </p>

        {/* NAME */}
        <p style={this.styles.label}>
          Name <span style={this.styles.required}>*</span>
        </p>
        <input style={this.styles.input}
          value={this.state.txtName}
          onChange={e => this.setState({ txtName: e.target.value })}
        />
        {this.state.errors.name && <div style={this.styles.error}>{this.state.errors.name}</div>}

        {/* PRICE */}
        <p style={this.styles.label}>
          Price <span style={this.styles.required}>*</span>
        </p>
        <input style={this.styles.input}
          value={this.state.txtPrice}
          onChange={e => this.setState({ txtPrice: e.target.value })}
        />
        {this.state.errors.price && <div style={this.styles.error}>{this.state.errors.price}</div>}

        {/* CATEGORY */}
        <p style={this.styles.label}>
          Category <span style={this.styles.required}>*</span>
        </p>
        <select style={this.styles.input}
          value={this.state.cmbCategory}
          onChange={e => this.setState({ cmbCategory: e.target.value })}
        >
          <option value="">Select</option>
          {this.state.categories.map(c => (
            <option key={c._id} value={c._id}>{c.name}</option>
          ))}
        </select>
        {this.state.errors.category && <div style={this.styles.error}>{this.state.errors.category}</div>}

        {/* IMAGE */}
        <p style={this.styles.label}>Image</p>
        <input type="file"
          onChange={e => {
            const file = e.target.files[0];
            this.setState({
              fileImage: file,
              imagePreview: URL.createObjectURL(file)
            });
          }}
        />

        {this.state.imagePreview && (
          <img src={this.state.imagePreview} style={this.styles.img} alt="" />
        )}

        {/* SPEC */}
        <h3>Specifications</h3>

        <div style={this.styles.grid}>
          <input style={this.styles.input} placeholder="Battery *"
            value={this.state.txtBattery}
            onChange={e => this.setState({ txtBattery: e.target.value })}
          />

          <input style={this.styles.input} placeholder="Year"
            value={this.state.txtYear}
            onChange={e => this.setState({ txtYear: e.target.value })}
          />

          <input style={this.styles.input} placeholder="Compatible"
            value={this.state.txtCompatible}
            onChange={e => this.setState({ txtCompatible: e.target.value })}
          />

          <input style={this.styles.input} placeholder="Feature"
            value={this.state.txtFeature}
            onChange={e => this.setState({ txtFeature: e.target.value })}
          />

          <input style={this.styles.input} placeholder="Port"
            value={this.state.txtPort}
            onChange={e => this.setState({ txtPort: e.target.value })}
          />

          <input style={this.styles.input} placeholder="Size"
            value={this.state.txtSize}
            onChange={e => this.setState({ txtSize: e.target.value })}
          />

          <input style={this.styles.input} placeholder="Weight"
            value={this.state.txtWeight}
            onChange={e => this.setState({ txtWeight: e.target.value })}
          />

          <input style={this.styles.input} placeholder="Brand"
            value={this.state.txtBrand}
            onChange={e => this.setState({ txtBrand: e.target.value })}
          />
        </div>

        <br />

        <button style={{ ...this.styles.btn, background: '#00c853', color: '#fff' }} onClick={this.btnAddNewClick}>ADD</button>
        <button style={{ ...this.styles.btn, background: '#ffab00' }} onClick={this.btnUpdateClick}>UPDATE</button>
        <button style={{ ...this.styles.btn, background: '#d50000', color: '#fff' }} onClick={this.btnDeleteClick}>DELETE</button>
      </div>
    );
  }
}

export default ProductDetail;