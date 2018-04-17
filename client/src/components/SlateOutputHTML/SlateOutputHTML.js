import React, {Component} from 'react';
import Html from 'slate-html-serializer';
import { Value } from 'slate';
import serializeRules from '../InputForm/serialize-rules';
import defaultValue from './value.json';
import "./SlateOutputHTML.css";

/* State.Value to HTML serializer */
const html = new Html({ rules: serializeRules });

class SlateOutputHTML extends Component {
  state = {
    text: this.props.text,
    index: this.props.index
  }

  componentWillReceiveProps(props) {
    this.setState({
      text: props.text,
      index: props.index
    });
  }

  getHTML = (index, type) => {
    var data = {
      "object": "value",
      "document": {
        "object": "document",
        "data": {},
        "nodes": this.state[type][index]
      }
    }

  
    data = Value.fromJSON(data)
  
    return (
      <div className={type + '-output'}
        dangerouslySetInnerHTML={{__html: html.serialize(data, {sanitize: true})}}
      >
      </div>
    )
  }

  render() {
    return (
        <div autoFocus>
          {this.getHTML(this.state.index, 'text')}
        </div>
    )
  }
}

class SlateOutputCode extends Component {
  state = {
    code: this.props.code,
    index: this.props.index
  }

  componentWillReceiveProps(props) {
    this.setState({
      code: props.code,
      index: props.index
    })
  }

  getHTML = (index, type) => {
    var data = {
      "object": "value",
      "document": {
        "object": "document",
        "data": {},
        "nodes": this.state[type][index]
      }
    }
  
    data = Value.fromJSON(data)
  
    return (
      <div className={type + "-output"}
        dangerouslySetInnerHTML={{__html: html.serialize(data, {sanitize: true})}}
      >
      </div>
    )
  }

  render() {
    return (
      <div>
        {this.getHTML(this.state.index, 'code')}
      </div>
    )
  }
}

export {SlateOutputHTML, SlateOutputCode}