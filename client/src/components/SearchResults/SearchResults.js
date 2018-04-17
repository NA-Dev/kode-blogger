import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import PostListItem from '../PostListItem/PostListItem';
import postApi from '../../utils/postAPI';
import {Redirect} from 'react-router-dom';


class SearchResults extends Component {

  constructor(props) {
    super(props)

    this.state = { results: [], searchString: "", redirect: "" } 
    this.props.history.listen((event) => {
      if (event.pathname.indexOf('search') !== -1) {
        let searchString = event.pathname.substring(8, event.pathname.length);
        this.doSearch(searchString);
        this.setState({searchString});
      }
    }); 
  }

  componentDidMount() {
    if (this.props.match.params.search) {
      this.setState({searchString: this.props.match.params.search});
      this.doSearch(this.props.match.params.search);
    }
  }

  doSearch(searchString) {
    postApi.searchByTitle(searchString).then(data =>{
      this.setState({results: data.data});
    })
  }

  onSearchChanged = (event) => {
    this.setState({searchString: event.target.value});
  }

  onSearchSubmit = (event) => {
    event.preventDefault();
    this.doSearch(this.state.searchString);
  }

  render() {
    return (
      <div>
        <h2><span id="recent-post-title">search</span><span id="recent-post-curly">&#123;</span></h2>
        <form style={{width: "100%"}} className="form-inline d-flex justify-content-center mb-5">
          <input style={{width: "60%"}} className="form-control" type="text" 
            value={this.state.searchString} 
            onChange={this.onSearchChanged}/>
          <button className="btn btn-outline-success ml-2" type="submit" onClick={this.onSearchSubmit}>Search</button>
        </form>
      <ul className="list-group text-center">
      {this.state.results.length ? 
        this.state.results.map(result => 
        <Link to={`/view/${result.id}`}>
        <PostListItem key={result.id} {...result} />
        </Link>
        ) 
        : <div className="text-center">No Results</div>}
      </ul>
      <h2><span id="recent-post-curly-end">&#125;</span></h2>
      </div>
    ) 
  }
}

export default SearchResults;