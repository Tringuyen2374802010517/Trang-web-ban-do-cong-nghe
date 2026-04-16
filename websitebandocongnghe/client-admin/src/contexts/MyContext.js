import React, { Component } from 'react';

const MyContext = React.createContext();

class MyProvider extends Component {
  state = {
    token: '',
    username: ''
  };

  setToken = (token, username) => {
    this.setState({ token, username });
  };

  render() {
    return (
      <MyContext.Provider
        value={{
          token: this.state.token,
          username: this.state.username,
          setToken: this.setToken
        }}
      >
        {this.props.children}
      </MyContext.Provider>
    );
  }
}

export { MyProvider };
export default MyContext;
