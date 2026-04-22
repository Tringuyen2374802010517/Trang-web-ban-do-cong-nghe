import axios from 'axios';
import React, { Component } from 'react';
import MyContext from '../contexts/MyContext';

class CategoryDetail extends Component {
  static contextType = MyContext;

  state = { txtID: '', txtName: '' };

  componentDidUpdate(prevProps) {
    if (this.props.item !== prevProps.item && this.props.item) {
      this.setState({
        txtID: this.props.item._id,
        txtName: this.props.item.name
      });
    }
  }

  add = e => {
    e.preventDefault();
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.post('/api/admin/categories', { name: this.state.txtName }, config)
      .then(() => {
        alert('Added successfully!');
        this.props.reload();
      });
  };

  update = e => {
    e.preventDefault();
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.put(`/api/admin/categories/${this.state.txtID}`,
      { name: this.state.txtName }, config)
      .then(() => {
        alert('Updated successfully!');
        this.props.reload();
      });
  };

  delete = e => {
    e.preventDefault();
    if (!window.confirm('ARE YOU SURE?')) return;
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.delete(`/api/admin/categories/${this.state.txtID}`, config)
      .then(() => {
        alert('Deleted successfully!');
        this.props.reload();
      });
  };

  render() {
    const styles = {
      container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f2027, #203a43, #2c5364)',
        fontFamily: 'Segoe UI',
        color: '#fff'
      },

      card: {
        background: 'rgba(255,255,255,0.08)',
        backdropFilter: 'blur(12px)',
        padding: '40px',
        borderRadius: '20px',
        width: '400px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
      },

      title: {
        textAlign: 'center',
        marginBottom: '25px'
      },

      label: {
        fontSize: '14px',
        marginBottom: '5px',
        display: 'block'
      },

      input: {
        width: '100%',
        padding: '10px',
        borderRadius: '8px',
        border: 'none',
        marginBottom: '15px',
        outline: 'none'
      },

      button: {
        padding: '10px',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontWeight: 'bold',
        width: '100%',
        marginTop: '10px'
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

    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <h2 style={styles.title}>📂 Category Detail</h2>

          <label style={styles.label}>ID</label>
          <input
            style={styles.input}
            value={this.state.txtID}
            readOnly
          />

          <label style={styles.label}>Name</label>
          <input
            style={styles.input}
            value={this.state.txtName}
            onChange={e => this.setState({ txtName: e.target.value })}
            placeholder="Enter category name..."
          />

          <button
            style={{ ...styles.button, ...styles.addBtn }}
            onClick={this.add}
          >
            ADD NEW
          </button>

          <button
            style={{ ...styles.button, ...styles.updateBtn }}
            onClick={this.update}
          >
            UPDATE
          </button>

          <button
            style={{ ...styles.button, ...styles.deleteBtn }}
            onClick={this.delete}
          >
            DELETE
          </button>
        </div>
      </div>
    );
  }
}

export default CategoryDetail;