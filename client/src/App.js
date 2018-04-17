import React, { Component } from "react";
import {Switch, Route, Redirect, BrowserRouter} from 'react-router-dom';
import axios from 'axios';
import Wrapper from "./components/Wrapper/Wrapper";
import Home from "./components/Home/Home";
import Nav from "./components/Nav/Nav";
import LoginForm from "./components/LoginForm/LoginForm";
import SignupForm from './components/SignupForm/SignupForm';
import InputForm from "./components/InputForm/InputForm";
import AllPosts from "./components/AllPosts/AllPosts";
import ManageNotes from './components/ManageNotes/ManageNotes';
import VerifyEmail from './components/VerifyEmail/VerifyEmail';
import PasswordResetRequest from './components/PasswordResetRequest/PasswordResetRequest';
import PasswordResetForm from './components/PasswordResetForm/PasswordResetForm';
import Note from "./components/Note/Note";
import NoMatch from "./components/NoMatch/NoMatch";
import DisplayPost from "./components/DisplayPost/DisplayPost";
import SearchResults from './components/SearchResults/SearchResults';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: false,
      username: ''
    }
  }

  componentDidMount() {
    axios.get('/users/loggedIn')
    .then( res => {
      this.setState({loggedIn: true, username: res.data.username})
    })
    .catch(err => this.setState({loggedIn: false})); 
  }

  userLoggedIn = (username) => {
    this.setState({loggedIn: true, username});
  }

  logOut = () => {
    axios.get('/users/logout')
    .then( res => {
      this.setState({loggedIn: false})
    });
  }

  render() {
    return (
      <BrowserRouter>
        <Wrapper>
          <Nav loggedIn={this.state.loggedIn} username={this.state.username} logOut={this.logOut}/>  
          <div className="container-fluid">
          <Switch>
            <Route exact path="/" component={Home}  />
            <Route exact path="/login"
              render={() => this.state.loggedIn ? 
              <Redirect to="/input" /> 
              : <LoginForm userLoggedIn={this.userLoggedIn}/>}/>
            <Route exact path="/signup" component={SignupForm} />
            <Route path="/verify/:username/:token" component={VerifyEmail} />
            <Route exact path="/resetPassword" component={PasswordResetRequest} />
            <Route path="/reset/:username/:token" component={PasswordResetForm} />
            <Route exact path="/addnote/:articleId" component={Note} />
            <Route exact path="/posts/all" component={AllPosts} />
            <Route exact path="/posts/:id?" component={DisplayPost} />
            <Route exact path="/manageNotes" component={ManageNotes} />
            <Route path="/search/:search?" component={SearchResults} />
              {this.state.loggedIn ? <Route path="/input/:id?" component={InputForm} /> : <Route path="/input/:id?" render={() => <LoginForm userLoggedIn={this.userLoggedIn}/>}/>}
            <Route component={NoMatch} />
          </Switch>
          </div>
        </Wrapper>
      </BrowserRouter>
    );
  }
}

export default App;
