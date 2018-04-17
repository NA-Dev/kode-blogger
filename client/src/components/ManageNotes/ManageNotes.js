import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import postApi from '../../utils/postAPI';
import {Redirect} from 'react-router-dom'
import { confirmAlert } from 'react-confirm-alert';
import PostListItem from '../PostListItem/PostListItem';
import DeleteIcon from '../Icons/DeleteIcon';
import EditIcon from '../Icons/EditIcon';
import PublishIcon from '../Icons/PublishIcon';
import UnPublishIcon from '../Icons/UnPublishIcon';
import ViewPostIcon from '../Icons/ViewPostIcon';
import 'react-confirm-alert/src/react-confirm-alert.css';

class ManageProps extends Component {
  state = {
    posts: []
  }

  componentDidMount() {
    this.updatePosts();
  }

  updatePosts() {
    postApi.getActiveUserPosts().then(res => {
      this.setState({posts: res.data.map(note => {return {id: note.id, title: note.title, published: note.published, created: note.createdAt, updated: note.updatedAt}})})
    }); 
  }

  publishClicked = (id) => {
    confirmAlert({
      title: 'Publish?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => postApi.publishNote(id).then(this.updatePosts()) 
        },
        {
          label: 'Cancel'
        }
      ]
    });
  }

  unpublishClicked = (id) => {
    confirmAlert({
      title: 'Unpublish?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => postApi.unpublishNote(id).then(this.updatePosts())
        },
        {
          label: 'Cancel'
        }
      ]
    });
  }

  deleteClicked = (id) => {
    confirmAlert({
      title: 'Delete?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => postApi.deleteNote(id).then(this.updatePosts())
        },
        {
          label: 'Cancel'
        }
      ]
    });
    
  }
  
  render() {
    return (
    <div>
      <h2><span id="recent-post-title">my</span><span id="recent-post-title-second">Posts</span><span id="recent-post-curly">&#123;</span></h2>
      <ul className="list-group">
      {this.state.posts.length ?
      this.state.posts.map(post => {
        return (
          <PostListItem key={post.id} {...post}>
            <button className="btn btn-danger mr-3" onClick={() => this.deleteClicked(post.id)}><DeleteIcon /><span className="button-spacing">Delete</span></button>
            <Link to={`/input/${post.id}`} >
              <button className="btn btn-info mr-3"><EditIcon /><span className="button-spacing">Edit</span></button>
            </Link>
            {post.published ?
              <button className="btn btn-warning mr-3" onClick={() => this.unpublishClicked(post.id)}><UnPublishIcon /><span className="button-spacing">Unpublish</span></button>
              : 
              <button className="btn btn-success mr-3" onClick={() => this.publishClicked(post.id)}><PublishIcon /><span className="button-spacing">Publish</span></button>
            }
            <Link to={`/view/${post.id}`} >
            <button className="btn btn-success"><ViewPostIcon /><span className="button-spacing">View</span></button>
            </Link>
          </PostListItem>

        )
      })
      : <p>No Posts Created</p>}
      </ul>
      <h2><span id="recent-post-curly-end">&#125;</span></h2>
    </div>
    );
  }

}

export default ManageProps;