import React, {Component} from 'react';
import postApi from '../../utils/postAPI';

class NoteSelector extends Component {
  constructor(props) {
    super(props)
    this.state = {...props}
  }

  componentWillReceiveProps(props) {
    this.setState({...props})
  }

  render() {
    console.log("rendering")
      return (
      <select value={this.state.selected} className="form-control" onChange={this.state.onNoteSelected}>
        <option value={"new"} key={"new"}>Create New</option>
        {this.state.posts.map((element, index) => {
          return (
            <option value={element.id} key={element.id}>{element.title}</option>
          )
        })}
      </select>
    )
  }
}

export default NoteSelector;