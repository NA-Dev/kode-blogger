import React, {Component} from 'react';
import axios from 'axios';
import './SignupForm.css';
import SignupIcon from '../Icons/SignupIcon';

class SignupForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: "",
      password: "",
      password2: "",
      email: "",
      passwordInvalid: false,
      emailInvalid: false,
      signupSubmitted: false
    }
    
    this.handleFormInput = this.handleFormInput.bind(this);
  }

  handleFormInput(event) {
    const {name, value} = event.target;
    this.setState({[name]: value}, () => this.validateField(name, value));
  }

  validateField(fieldName, value) {
    let passwordInvalid = this.state.passwordInvalid;
    let emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    switch(fieldName) {
      case 'password':
      case 'password2':
        if (value === this.state.password && value === this.state.password2) {
          this.setState({passwordInvalid: false});
        } else {
          this.setState({passwordInvalid: true});
        }
      break;
      case 'email':
        if (emailRegex.test(value)) {
          this.setState({emailInvalid: false});
        } else {
          this.setState({emailInvalid: true});
        }
      break;
      default:
      break;
    }
  }

  onFormSubmit = (event) => {
    event.preventDefault();
    if (!this.state.emailInvalid && !this.state.passwordInvalid) {
      axios.post('/users/signup', {
        username: this.state.username,
        password: this.state.password,
        email: this.state.email
      }).then((res) => this.setState({
        username: "",
        email: "",
        password: "",
        password2: "",
        signupSubmitted: true
      }));
    }
  }

  render() {
    return (
      <div className="bg-dark p-5 col-md-6 offset-md-3 mt-5 border border-dark rounded" id="signupContainer">
        <div id="logoSignup"><span className="logoOne"> 
        kode</span><span className="logoTwo">Blogger</span>
        </div>
        <h3 className="text-light font-weight-bold">Sign Up</h3>
        <form className="mt-0" autoComplete="on">
          <div>
            {this.state.signupSubmitted ? <p className="alert alert-success">Sign-up complete! Check your email to verify your account. </p> : ''}
            {this.state.passwordInvalid ? <p className="alert alert-primary">Passwords do not match!</p> : ''}
            {this.state.emailInvalid ? <p className="alert alert-primary">Email is not valid</p> : ''}
          </div>
          <div className="form-group">
            <label className="text-light" htmlFor="username">Username</label>
            <input type="text" name="username" autoComplete="username" onChange={this.handleFormInput} value={this.state.username} />
          </div>
          <div className="form-group">
            <label className="text-light" htmlFor="email">Email</label>
            <input className={this.state.emailInvalid ? 'invalid' : ''} type="email" name="email" onChange={this.handleFormInput} value={this.state.email} />
          </div>
          <div className="form-group">
            <label className="text-light" htmlFor="password">Password</label>
            <input className={this.state.passwordInvalid ? 'invalid' : ''} 
              type="password" 
              name="password" autoComplete="new-password" 
              onChange={this.handleFormInput} value={this.state.password} />
          </div>
          <div className="form-group">
            <label className="text-light" htmlFor="password2">Confirm Password</label>
            <input className={this.state.passwordInvalid ? 'invalid' : ''} 
              type="password" name="password2" autoComplete="new-password" 
              onChange={this.handleFormInput} 
              value={this.state.password2} />
          </div>
          <button type="submit" className="btn btn-outline-light all-post-button" onClick={this.onFormSubmit}><SignupIcon /><span className="button-spacing">Sign Up</span></button>
        </form>
      </div>
    )
  }
}

export default SignupForm;