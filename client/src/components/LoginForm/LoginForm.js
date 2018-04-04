import React, {Component} from 'react';

import axios from 'axios';

class LoginForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: "",
      password: "",
      message: ""
    }

    this.handleFormInput = this.handleFormInput.bind(this);
  }

  handleFormInput(event) {
    const {name, value} = event.target;
    this.setState({[name]: value});
  }

  onFormSubmit = (event) => {
    event.preventDefault();
    axios.post('/users/login', {
      username: this.state.username,
      password: this.state.password 
    }).then((res) => {
      this.props.userLoggedIn(JSON.parse(res.config.data).username);
    }).catch(err => {
      this.setState({message: err.response.data.message});
    });
  }

  render() {
    return (
        <form>
        {this.state.message ? <p>{this.state.message}</p> : ''}
        <input type="text" name="username" onChange={this.handleFormInput} value={this.state.username} />
        <input type="password" name="password" onChange={this.handleFormInput} value={this.state.password} />
        <button type="submit" onClick={this.onFormSubmit}>Login</button>
        </form>
    )
  }
}

export default LoginForm;