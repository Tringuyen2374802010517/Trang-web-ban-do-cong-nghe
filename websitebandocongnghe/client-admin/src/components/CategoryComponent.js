import axios from 'axios';
import React, { Component } from 'react';
import MyContext from '../contexts/MyContext';

class Category extends Component {
  static contextType = MyContext;

  constructor(props) {
    super(props);
    this.state = {
      categories: [],
      itemSelected: null,
      txtName: ''
    };
  }

  componentDidMount() {
    this.apiGetCategories();
  }

  // ================= API =================

  apiGetCategories() {
    axios
      .get('/api/admin/categories') // ✅ không cần truyền token nữa (đã có interceptor)
      .then(res => {
        console.log("CATEGORIES:", res.data);

        // 🔥 FIX QUAN TRỌNG
        this.setState({ categories: res.data.categories });
      })
      .catch(err => console.error("GET ERROR:", err));
  }

  apiAddCategory() {
    axios
      .post('/api/admin/categories', {
        name: this.state.txtName
      })
      .then(() => {
        this.setState({ txtName: '' });
        this.apiGetCategories();
      })
      .catch(err => console.error("ADD ERROR:", err));
  }

  apiUpdateCategory() {
    if (!this.state.itemSelected) return;

    axios
      .put(`/api/admin/categories/${this.state.itemSelected._id}`, {
        name: this.state.txtName
      })
      .then(() => this.apiGetCategories())
      .catch(err => console.error("UPDATE ERROR:", err));
  }

  apiDeleteCategory() {
    if (!this.state.itemSelected) return;

    axios
      .delete(`/api/admin/categories/${this.state.itemSelected._id}`)
      .then(() => this.apiGetCategories())
      .catch(err => console.error("DELETE ERROR:", err));
  }

  // ================= RENDER =================

  render() {
    const { categories, itemSelected, txtName } = this.state;

    const rows = Array.isArray(categories)
      ? categories.map(item => (
          <tr
            key={item._id}
            className={itemSelected?._id === item._id ? 'selected' : ''}
            onClick={() =>
              this.setState({ itemSelected: item, txtName: item.name })
            }
          >
            <td>{item._id}</td>
            <td>{item.name}</td>
          </tr>
        ))
      : null;

    return (
      <div>
        <h2>CATEGORY</h2>

        <table border="1">
          <tbody>
            <tr>
              <th>ID</th>
              <th>Name</th>
            </tr>
            {rows}
          </tbody>
        </table>

        <br />

        <input
          value={txtName}
          onChange={e => this.setState({ txtName: e.target.value })}
          placeholder="Category name"
        />

        <br /><br />

        <button onClick={() => this.apiAddCategory()}>ADD</button>
        <button onClick={() => this.apiUpdateCategory()}>UPDATE</button>
        <button onClick={() => this.apiDeleteCategory()}>DELETE</button>
      </div>
    );
  }
}

export default Category;