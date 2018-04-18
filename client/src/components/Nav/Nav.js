import React from "react";
import "./Nav.css";
import LoginNav from '../LoginNav/LoginNav';
import NavSearch from '../NavSearch/NavSearch';
import { Link } from 'react-router-dom'
import MyPostIcon from '../Icons/MyPostIcon';
import NewPostIcon from '../Icons/NewPostIcon';
import AllPostIcon from '../Icons/AllPostIcon';
import SearchIcon from '../Icons/SearchIcon';
import UserIcon from '../Icons/UserIcon';



const Nav = (props) => (
  <div className="container-flex">
  <nav className="navbar navbar-expand-xl navbar-custom mb-3">
    <Link to="/" className="navbar-brand"> 
    <span className="logoOne"> 
      kode</span><span className="logoTwo">Blogger</span></Link>
    <button className="navbar-toggler navbar-dark" type="button" data-toggle="collapse" data-target="#navbarTogglerDemo02" aria-controls="navbarTogglerDemo02" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
    </button>
    <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
      {props.loggedIn ? 
      <ul className="navbar-nav ml-auto mt-2 mt-md-0">        
        <li className="nav-item active ml-auto">
          <Link to="/view/all"><button className="btn  btn-sm btn-outline-light all-post-nav" type="button"><AllPostIcon /><span className="nav-button-spacing">All Posts</span></button></Link>
        </li>
        <li className="nav-item active ml-auto">
          <Link to="/manageNotes"><button className="btn btn-sm  btn-outline-light my-post-nav" type="button"><MyPostIcon /><span className="nav-button-spacing">My Posts</span></button></Link>
        </li>
        <li className="nav-item ml-auto">
          <Link to="/input"><button className="btn  btn-sm btn-outline-light ml-auto new-post-nav" type="button"><NewPostIcon /><span className="nav-button-spacing">+ Post</span></button></Link></li>
        <NavSearch />
        <LoginNav {...props}/>
      </ul>
      : 
      <ul className="navbar-nav ml-auto mt-2 mt-md-0">
        <li className="nav-item active ml-auto">
          <Link to="/view/all"><button className="btn  btn-sm btn-outline-light all-post-nav" type="button"><AllPostIcon /><span className="nav-button-spacing">All Posts</span></button></Link>
        </li>
        <NavSearch />
        <LoginNav {...props}/>
      </ul>}

    </div>
  </nav>
  </div>
);


export default Nav;



