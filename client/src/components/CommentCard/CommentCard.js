import React from "react";


const CommentCard = props => (
  <div  className="card">
    <h3>{props.title}</h3>
    <h3>{props.author}</h3>
    <h3>{props.body}</h3>
  </div>
);

export default ImageCard;
