import React, {Component} from "react";
import postAPI from '../../utils/postAPI';
import {Redirect} from 'react-router-dom';
import PostListItem from '../PostListItem/PostListItem';
import ViewPostIcon from '../Icons/ViewPostIcon';
import "./AllPosts.css";


class AllPosts extends Component {
  state = {
    posts: [],
    redirect: ''
  };

  componentDidMount = () => {
    postAPI.getAll()
    .then(res => {
      this.setState({ posts: res.data.map(note  => {return {id: note.id, title: note.title, published: note.published, created: note.createdAt, updated: note.updatedAt}})});
    })
    .catch(err => {
      console.log(err);
    });
  };

  viewPost = (id) => {
    this.setState({redirect: <Redirect to={`/posts/${id}`} /> })
  }

  render() {
    return (
    <div>
      {this.state.redirect ? this.state.redirect : ''}
      <h2><span id="recent-post-title">all</span><span id="recent-post-title-second">Posts</span><span id="recent-post-curly">&#123;</span></h2>
      <ul className="list-group">
      {this.state.posts.length ?
      this.state.posts.map(note => {
        return (
          <PostListItem key={note.id} {...note}>
            <button className="btn btn-outline-dark view-post-button" type="button" onClick={() => this.viewPost(note.id)}><ViewPostIcon  /><span className="button-spacing">View Post</span></button>
          </PostListItem>
        )
      })
      :<p> No posts yet, check back soon!</p>}
    </ul>
    <h2><span id="recent-post-curly-end">&#125;</span></h2>
  </div>
    );
}
}
export default AllPosts;
