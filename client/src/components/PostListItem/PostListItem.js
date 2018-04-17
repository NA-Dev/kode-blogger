import React from 'react';
import "./PostListItem.css";


const PostListItem = ({title, id, created, updated, children}) => (
    <div className="post-list-container">
      <div key={id}>
        <div id="home-post-list-block">
          <div className="home-post-list-title-container">
            <span id="home-post-list-title">{title}</span>
          </div>
          <div className="row">
            <div className="col-12 ml-auto">
              {created ? <p>Created {new Date(created).toLocaleDateString()}</p> : ''}
              {updated ? <p>Modified {new Date(updated).toLocaleDateString()}</p> : ''}
            </div>
          </div>
          <div className="row">
            <div className="col-12 text-center">
              {children}
            </div>  
          </div>
        </div>       
      </div>
    </div>
)

export default PostListItem;