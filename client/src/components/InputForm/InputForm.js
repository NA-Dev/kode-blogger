import React, {Component} from 'react';
import {Editor, EditorState} from 'draft-js';
import "./InputForm.css";

class InputForm extends Component {
  constructor(props) {
    super(props);
    this.state = { editorState: EditorState.createEmpty() };
    this.onChange = editorState => this.setState({ editorState });
  }
  render() {
    return (
      <div id="content">
        <h1>Draft.js Editor</h1>
        <div className="editor">
          <Editor
            className="inputForm"
            editorState={this.state.editorState}
            onChange={this.onChange}
          />
        </div>
      </div>
    );
  }
}

export default InputForm;