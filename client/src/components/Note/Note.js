import React, {Component} from 'react';
import { Editor } from '@tinymce/tinymce-react';
import tinymce from 'tinymce';
import 'tinymce/themes/modern';
import 'tinymce/plugins/wordcount';
import 'tinymce/plugins/table';
import "./Note.css";


class App extends Component {
  content = " ";
  
  constructor() {
    super();
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleEditorChange = (e) => {
    this.content = e.target.getContent();
  }

  handleSubmit(event) {
    event.preventDefault();
    // let data = tinymce.get('textbody').getContent()
    console.log(this.content)
    fetch('/posts', {
      method: 'POST',
      body: JSON.stringify({
        content: this.content
      }),
      headers: {
        'content-type': 'application/json'
      }
    });
  }
    
  

  
  render() {
    
    return (

        
      <div>
        <h2><span id="recent-post-title">add</span><span id="recent-post-title-second">Comment</span><span id="recent-post-curly">&#123;</span></h2>
          <form onSubmit={this.handleSubmit.bind(this)}>
              <Editor
          id="textbody"
          initialValue="<p>Add a comment</p>"
          init={{
            plugins: 'link image code',
            toolbar: 'undo redo | bold italic | alignleft aligncenter alignright | code'
          }}
          onChange={this.handleEditorChange.bind(this)}
              />
              <button className="btn btn-outline-primary mt-2" type="submit">Submit</button>
          </form>
        <h2><span id="recent-post-curly-end">&#125;</span></h2>
      </div>
      
    );
  }

}


export default App;