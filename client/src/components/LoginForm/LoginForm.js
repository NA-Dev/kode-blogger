import React, {Component} from 'react';
import axios from 'axios';
import './LoginForm.css';
import LoginUnlockedIcon from '../Icons/LoginUnlockedIcon';

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
      if (err.response) {
        this.setState({message: err.response.data.message});
      }
    });
  }

  render() {
    return (
      <div className="row">
        <div className="bg-dark p-5 col-md-6 offset-md-3 mt-5 border border-dark rounded" id="loginContainer">
        <div id="logoSignup"><span className="logoOne"> 
        kode</span><span className="logoTwo">Blogger</span>
        </div>
          <h3 className="text-light font-weight-bold">Log In</h3>

            {this.state.message ? <p className="alert alert-primary">{this.state.message}</p> : ''}
          <form className="mt-0" autoComplete="on">
            <div className="form-group">
              <label className="text-light" htmlFor="username">Username</label>
              <input type="text" name="username" autoComplete="username" onChange={this.handleFormInput} value={this.state.username} />
            </div>
            <div className="form-group">
              <label className="text-light" htmlFor="password">Password</label>
              <input type="password" name="password" autoComplete="current-password" onChange={this.handleFormInput} value={this.state.password} />
            </div>
            <button className="btn btn-outline-light all-post-button" type="submit" onClick={this.onFormSubmit}><LoginUnlockedIcon /><span className="button-spacing">Login</span></button>
          </form>
        </div>
      </div>
    )
  }
}

export default LoginForm;