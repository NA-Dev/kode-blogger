import React, {Component} from 'react';
import { Editor } from 'slate-react';
import { Value } from 'slate';
import { isKeyHotkey } from 'is-hotkey'
import PluginPrism from 'slate-prism';
import PluginEditCode from 'slate-edit-code'
import defaultValue from './value.json';
import Html from 'slate-html-serializer';
import serializeRules from './serialize-rules';
import axios from 'axios';
import NoteSelector from '../NoteSelector/NoteSelector';
import postApi from '../../utils/postAPI';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import SavePostIcon from '../Icons/SavePostIcon';
import ViewPostIcon from '../Icons/ViewPostIcon';
import "./InputForm.css";

/* State.Value to HTML serializer */
const html = new Html({ rules: serializeRules });

/* Plugins */
const plugin = PluginEditCode({
  onlyIn: node => node.type === 'code_block'
})
const plugins = [
  PluginPrism({
      onlyIn: node => node.type === 'code_block',
      getSyntax: node => node.data.get('syntax')
  }),
  plugin
];

/* Editor Defaults */
let DEFAULT_CODE_LANGUAGE = 'javascript'
const DEFAULT_NODE = 'paragraph'

/* Hotkeys */
const isBoldHotkey = isKeyHotkey('mod+b')
const isItalicHotkey = isKeyHotkey('mod+i')
const isUnderlinedHotkey = isKeyHotkey('mod+u')
const isCodeHotkey = isKeyHotkey('mod+`')

/**
 * Syntax Selector Component
 */

class GlobalCodeSyntaxSelector extends Component {
  state = {
    value: DEFAULT_CODE_LANGUAGE,
  }

  onChange = (event) => {
    this.setState({value: event.target.value})
    DEFAULT_CODE_LANGUAGE = event.target.value
  }

  render() {
    return (
      <div
      contentEditable={false}
      style={{ position: 'absolute', top: '0px', right: '5px' }}>
        <select value={this.state.value} onChange={this.onChange}>
          <option value="css">CSS</option>
          <option value="javascript">JavaScript</option>
          <option value="html">HTML</option>
        </select>
      </div>
    )
  }
}

/**
 * Code Block Component
 */

class CodeBlock extends Component {
  state = {
    syntax: DEFAULT_CODE_LANGUAGE
  }

  setSyntax = (event) => {
    if (event) {
      this.setState({syntax: event.target.value || DEFAULT_CODE_LANGUAGE})
      this.props.editor.change(c =>
        c.setNodeByKey(this.props.node.key, { data: { syntax: event.target.value || DEFAULT_CODE_LANGUAGE } })
      )
    } else {
      this.props.editor.change(c =>
        c.setNodeByKey(this.props.node.key, { data: { syntax: this.state.syntax } })
      )
    }
  }

  componentDidMount = (event) => {
    this.setSyntax()
  }

  render() {
    let syntax = this.state.syntax

    return (
      <div style={{ position: 'relative' }}>
        <pre className={"language-" + syntax + " code_block"}>
          <code className={"language-" + syntax} {...this.props.attributes}>{this.props.children}</code>
        </pre>
        <div
          contentEditable={false}
          style={{ position: 'absolute', top: '-8px', right: '5px' }}
        >
        </div>
      </div>
    )
  }
}

/**
 * Code Line Component
 */

class CodeLine extends Component {
  setSyntax = (syntax) => {
      this.props.editor.change(c =>
        c.setNodeByKey(this.props.node.key, {syntax})
      )
  }

  componentDidMount(props) {
    this.setSyntax(DEFAULT_CODE_LANGUAGE);
  }

  render() {
    return(
      <div data-syntax={DEFAULT_CODE_LANGUAGE} {...this.props.attributes}>{this.props.children}</div>
    )
  }
}

/**
 * Input Form Component
 */

class InputForm extends Component {
  initialValue = { 
    // value: html.deserialize(initialValue)
    value: Value.fromJSON(defaultValue),
    title: 'Untitled Note',
    noteId: "new"
  }

  state = {...this.initialValue, titles: [], showPreview: false}

  componentDidMount() {
    postApi.getActiveUserPosts().then(res => {
      this.setState({
        titles: res.data.map(element => ({id: element.id, title: element.title, body: element.body})) 
      }) 
    });
    if (this.props.match.params.id) {
      //Load note
      postApi.getById(this.props.match.params.id).then(res => {
        const val = Value.fromJSON(JSON.parse(res.data.body));
        this.setState({value: val, title: res.data.title, noteId: res.data.id});
      });
    }
  }

  onChange = ({ value }) => {
    this.setState({ value })
  }

  onTitleChange = (event) => {
    this.setState({title: event.target.value});
  }

  onKeyDown = (event, change) => {
    let mark

    if (isBoldHotkey(event)) {
      mark = 'bold'
    } else if (isItalicHotkey(event)) {
      mark = 'italic'
    } else if (isUnderlinedHotkey(event)) {
      mark = 'underlined'
    } else if (isCodeHotkey(event)) {
      mark = 'code'
    } else {
      mark = null;
    } 
    
    if (mark) {
      event.preventDefault()
      change.toggleMark(mark)
    }
  }

  /* Handle DB Save */
  onSaveClick = event => {
    if (this.state.noteId === this.initialValue.noteId) {
      let valueString = JSON.stringify(this.state.value.toJSON());
      valueString = valueString.replace(/("type":"code_line","isVoid":false,"data":{})/g, `"type":"code_line","isVoid":false,"data":{"syntax":"${DEFAULT_CODE_LANGUAGE}"}`);
      valueString = valueString.replace(/("type":"code_block","isVoid":false,"data":{})/g, `"type":"code_block","isVoid":false,"data":{"syntax":"${DEFAULT_CODE_LANGUAGE}"}`);
      postApi.createPost({title: this.state.title, jsonBody: valueString})
      .then((data)=> {
        this.setState({ 
          noteId: data.data.id
        }, ()=> {
          confirmAlert({
            title: `New post created. Publish in "My Posts"`,
            buttons: [
              {
                label: 'OK'
              }
            ]
          });
        })
      });
    } else {
      let valueString = JSON.stringify(this.state.value.toJSON());
      valueString = valueString.replace(/("type":"code_line","isVoid":false,"data":{})/g, `"type":"code_line","isVoid":false,"data":{"syntax":"${DEFAULT_CODE_LANGUAGE}"}`);
      valueString = valueString.replace(/("type":"code_block","isVoid":false,"data":{})/g, `"type":"code_block","isVoid":false,"data":{"syntax":"${DEFAULT_CODE_LANGUAGE}"}`);
      postApi.updatePost(this.state.noteId, {jsonBody: valueString, title: this.state.title})
      .then((data)=> {
        this.setState({
          noteId: data.data.id
        })
        confirmAlert({
          title: `Post updated.`,
          buttons: [
            {
              label: 'OK'
            }
          ]
        });
      });
    }
    //Update note titles due to save action possibly changing a title
    postApi.getActiveUserPosts().then(res => {
      this.setState({
        titles: res.data.map(element => ({id: element.id, title: element.title, body: element.body})),
      }, console.log("Titles added")) 
    });
  }

  /* Handle DB Retrieval */
  onNoteSelected = event => {
    if (event.target.value === this.initialValue.noteId) {
      this.setState({...this.initialValue})
    }

    postApi.getById(event.target.value).then(res => {
      if (res.data) {
        this.setState(
          {
            value: Value.fromJSON(JSON.parse(res.data.body)), 
            noteId: res.data.id,
            title: res.data.title
          }
        )
      }
    })
  }

  onPreviewClicked = () => {
    this.setState({showPreview: !this.state.showPreview});
  }

 /*----- Toolbar Functions -----*/

  onToggleCode = (event) => {
    event.preventDefault()
    const value = this.state.value;

    this.onChange(
      plugin.changes.toggleCodeBlock(value.change(), DEFAULT_NODE).focus()
    );
  };

  hasMark = type => {
    const { value } = this.state
    return value.activeMarks.some(mark => mark.type===type)
  }

  hasBlock = type => {
    const { value } = this.state
    if (type==="code_block") type="code_line"
    return value.blocks.some(node => node.type===type)
  }

  onClickMark = (event, type) => {
    event.preventDefault()
    const { value } = this.state
    const change = value.change().toggleMark(type)
    this.onChange(change)
  }

  onClickBlock = (event, type) => {
    event.preventDefault()
    const { value } = this.state
    const change = value.change()
    const { document } = value

    if (type==='bulleted-list' || type==='numbered-list') {
      // Handle the extra wrapping required for list buttons.
      const isList = this.hasBlock('list-item')
      const isType = value.blocks.some(block => {
        return !!document.getClosest(block.key, parent => parent.type===type)
      })

      if (isList && isType) {
        change
          .setBlocks(DEFAULT_NODE)
          .unwrapBlock('bulleted-list')
          .unwrapBlock('numbered-list')
      } else if (isList) {
        change
          .unwrapBlock('bulleted-list')
          .unwrapBlock('numbered-list')
          .wrapBlock(type)
      } else {
        change.setBlocks('list-item').wrapBlock(type)
      }

    } else if (type==="code_block") {
      this.onToggleCode(event)
      return

    } else {
      // Handle everything but list buttons
      const isActive = this.hasBlock(type)
      const isList = this.hasBlock('list-item')

      if (isList) {
        change
          .setBlocks(isActive ? DEFAULT_NODE : type)
          .unwrapBlock('bulleted-list')
          .unwrapBlock('numbered-list')
      } else {
        change.setBlocks(isActive ? DEFAULT_NODE : type)
      }
    }
    
    this.onChange(change)
  }

  /*----- Render Functions -----*/

  render() {
    return (
      <div>
        <div className="row">
          <NoteSelector selected={this.state.noteId} newId={this.initialValue.noteId} onNoteSelected={this.onNoteSelected} posts={this.state.titles} />
        </div>
        <div className="text-center">
          <button className="btn btn-secondary m-2 save-post-button" onClick={this.onSaveClick}><SavePostIcon /><span className="button-spacing">Save</span></button>
          <form action={`/view/${this.state.noteId}`} method="get" target="_blank">
            <button className="btn btn-secondary m-2 preview-post-button" disabled={this.state.noteId === "new"}>
              <ViewPostIcon />
              <span className="button-spacing">
                {this.state.noteId === "new"? "Save to Preview" : "Open Preview"}
              </span>
            </button>
          </form>
        </div>
        <div className="row">
          <div className={'input-form col-md-12'}>
            <input value={this.state.title} onChange={this.onTitleChange} type="text" placeholder={this.initialValue.title} />
            {this.renderToolbar()}
            {this.renderEditor()}
          </div>
        </div>
      </div>
    )
  }

  renderOutput() {

  }

  renderEditor = () => {
    return (
      <div className="editor">
        <Editor
          placeholder="Enter some rich text..."
          value={this.state.value}
          onChange={this.onChange}
          onKeyDown={this.onKeyDown}
          renderNode={this.renderNode}
          renderMark={this.renderMark}
          plugins={plugins}
          spellCheck
          autoFocus
        />
      </div>
    )
  }

  renderToolbar = () => {
    return (
      <div className="menu" style={{ position: 'relative'}}>
        <div className="toolbar">
            {this.renderMarkButton('bold', 'format_bold')}
            {this.renderMarkButton('italic', 'format_italic')}
            {this.renderMarkButton('underlined', 'format_underlined')}
            {this.renderMarkButton('code', 'code')}
            {this.renderBlockButton('heading-one', 'looks_one')}
            {this.renderBlockButton('heading-two', 'looks_two')}
            {this.renderBlockButton('block-quote', 'format_quote')}
            {this.renderBlockButton('numbered-list', 'format_list_numbered')}
            {this.renderBlockButton('bulleted-list', 'format_list_bulleted')}
            {this.renderBlockButton('code_block', 'code')}
        </div>
        <GlobalCodeSyntaxSelector />
      </div>
    )
  }

  renderMarkButton = (type, icon) => {
    const isActive = this.hasMark(type)
    const onMouseDown = event => this.onClickMark(event, type)

    return (
      // eslint-disable-next-line react/jsx-no-bind
      <span className="button" onMouseDown={onMouseDown} data-active={isActive}>
        <span className="material-icons">{icon}</span>
      </span>
    )
  }

  renderBlockButton = (type, icon) => {
    const isActive = this.hasBlock(type)
    const onMouseDown = event => this.onClickBlock(event, type)

    return (
      // eslint-disable-next-line react/jsx-no-bind
      <span className="button" onMouseDown={onMouseDown} data-type={type} data-active={isActive}>
        <span className="material-icons">{icon}</span>
      </span>
    )
  }

  renderNode = props => {
    const { attributes, children, node } = props
    switch (node.type) {
      case 'block-quote':
        return <blockquote {...attributes}>{children}</blockquote>
      case 'bulleted-list':
        return <ul {...attributes}>{children}</ul>
      case 'heading-one':
        return <h1 {...attributes}>{children}</h1>
      case 'heading-two':
        return <h2 {...attributes}>{children}</h2>
      case 'list-item':
        return <li {...attributes}>{children}</li>
      case 'numbered-list':
        return <ol {...attributes}>{children}</ol>
      case 'code_block':
        return <CodeBlock {...props} />
      case 'code_line':
        return <CodeLine {...props} />;
      case 'paragraph':
        return <p {...attributes}>{children}</p>
      default:
        return null
    }
  }

  renderMark = props => {
    const { children, mark } = props
    switch (mark.type) {
      case 'bold':
        return <strong>{children}</strong>
      case 'code':
        return <code>{children}</code>
      case 'italic':
        return <em>{children}</em>
      case 'underlined':
        return <u>{children}</u>
      case 'comment':
        return <span style={{ opacity: '0.33' }}>{children}</span>
      case 'keyword':
        return <span style={{ fontWeight: 'bold' }}>{children}</span>
      case 'tag':
        return <span style={{ fontWeight: 'bold' }}>{children}</span>
      case 'punctuation':
        return <span style={{ opacity: '0.75' }}>{children}</span>
        default:
          return null
    }
  }
}

/**
 * Export.
 */

export default InputForm