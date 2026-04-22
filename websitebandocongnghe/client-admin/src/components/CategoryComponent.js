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
    axios.get('/api/admin/categories')
      .then(res => {
        this.setState({ categories: res.data.categories });
      })
      .catch(err => console.error(err));
  }

  apiAddCategory() {
    axios.post('/api/admin/categories', {
      name: this.state.txtName
    }).then(() => {
      this.setState({ txtName: '' });
      this.apiGetCategories();
    });
  }

  apiUpdateCategory() {
    if (!this.state.itemSelected) return;

    axios.put(`/api/admin/categories/${this.state.itemSelected._id}`, {
      name: this.state.txtName
    }).then(() => this.apiGetCategories());
  }

  apiDeleteCategory() {
    if (!this.state.itemSelected) return;

    axios.delete(`/api/admin/categories/${this.state.itemSelected._id}`)
      .then(() => this.apiGetCategories());
  }

  // ================= RENDER =================

  render() {
    const { categories, itemSelected, txtName } = this.state;

    const styles = {
      container: {
        padding: '40px',
        background: 'linear-gradient(135deg, #0f2027, #203a43, #2c5364)',
        minHeight: '100vh',
        color: '#fff',
        fontFamily: 'Segoe UI'
      },

      card: {
        background: 'rgba(255,255,255,0.08)',
        backdropFilter: 'blur(12px)',
        borderRadius: '16px',
        padding: '30px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
      },

      title: {
        fontSize: '28px',
        marginBottom: '20px'
      },

      table: {
        width: '100%',
        borderCollapse: 'collapse',
        marginBottom: '20px'
      },

      th: {
        padding: '12px',
        background: 'rgba(255,255,255,0.1)',
        textAlign: 'left'
      },

      td: {
        padding: '12px',
        borderTop: '1px solid rgba(255,255,255,0.1)',
        cursor: 'pointer'
      },

      input: {
        padding: '10px',
        width: '100%',
        borderRadius: '8px',
        border: 'none',
        outline: 'none',
        marginBottom: '20px'
      },

      button: {
        padding: '10px 20px',
        marginRight: '10px',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontWeight: 'bold'
      },

      addBtn: {
        background: '#00c853',
        color: '#fff'
      },

      updateBtn: {
        background: '#ffab00',
        color: '#000'
      },

      deleteBtn: {
        background: '#d50000',
        color: '#fff'
      }
    };

    const rows = Array.isArray(categories)
      ? categories.map(item => (
          <tr
            key={item._id}
            style={{
              background:
                itemSelected?._id === item._id
                  ? 'rgba(255,255,255,0.2)'
                  : 'transparent'
            }}
            onClick={() =>
              this.setState({ itemSelected: item, txtName: item.name })
            }
          >
            <td style={styles.td}>{item._id}</td>
            <td style={styles.td}>{item.name}</td>
          </tr>
        ))
      : null;

    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <h2 style={styles.title}>Category Management</h2>

          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>ID</th>
                <th style={styles.th}>Name</th>
              </tr>
            </thead>
            <tbody>{rows}</tbody>
          </table>

          <input
            style={styles.input}
            value={txtName}
            onChange={e => this.setState({ txtName: e.target.value })}
            placeholder="Enter category name..."
          />

          <div>
            <button
              style={{ ...styles.button, ...styles.addBtn }}
              onClick={() => this.apiAddCategory()}
            >
              ADD
            </button>

            <button
              style={{ ...styles.button, ...styles.updateBtn }}
              onClick={() => this.apiUpdateCategory()}
            >
              UPDATE
            </button>

            <button
              style={{ ...styles.button, ...styles.deleteBtn }}
              onClick={() => this.apiDeleteCategory()}
            >
              DELETE
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default Category;