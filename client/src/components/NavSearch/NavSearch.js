import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {Redirect} from 'react-router-dom';
import { withRouter } from 'react-router-dom';

import SearcgIcon from '../Icons/SearchIcon';

class NavSearch extends Component {
  state = {searchString: ""}

  onSearchInput = (event) => {
    this.setState({searchString: event.target.value});
  }

  render() {
    return (
      <li className="nav-item ml-auto">
      <form className="form-inline my-0">
        <input onChange={this.onSearchInput} value={this.searchString} className="form-control ml-2" type="search" placeholder="Search" aria-label="Search" />
        <Link className="ml-auto" to={`/search/${this.state.searchString}`}>
        <button className="btn btn-outline-light search-nav" type="submit"><SearcgIcon /><span className="search-button-spacing">Search</span></button>
        </Link>
      </form>
      </li>);
  }
}

export default NavSearch;