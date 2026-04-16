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
        alert('OK');
        this.props.reload();
      });
  };

  update = e => {
    e.preventDefault();
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.put(`/api/admin/categories/${this.state.txtID}`,
      { name: this.state.txtName }, config)
      .then(() => {
        alert('OK');
        this.props.reload();
      });
  };

  delete = e => {
    e.preventDefault();
    if (!window.confirm('ARE YOU SURE?')) return;
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.delete(`/api/admin/categories/${this.state.txtID}`, config)
      .then(() => {
        alert('OK');
        this.props.reload();
      });
  };

  render() {
    return (
      <div>
        <h2>CATEGORY DETAIL</h2>
        ID <input value={this.state.txtID} readOnly /><br/>
        Name <input value={this.state.txtName}
          onChange={e => this.setState({ txtName: e.target.value })} /><br/>

        <button onClick={this.add}>ADD NEW</button>
        <button onClick={this.update}>UPDATE</button>
        <button onClick={this.delete}>DELETE</button>
      </div>
    );
  }
}

export default CategoryDetail;
