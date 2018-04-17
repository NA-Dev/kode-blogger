import React, {Component} from 'react';
import postApi from '../../utils/postAPI';

const NoteSelector = (props) => (
      <select className="form-control" onChange={props.onNoteSelected}>
        <option value="new" key={0}>Create New</option>
        {props.posts.map((element, index) => {
          return (
            <option value={element.id} key={index}>{element.title}</option>
          )
        })}
      </select>
    )


export default NoteSelector;