import React, {Component} from "react";
import { Link, Redirect } from 'react-router-dom'
import { Value } from 'slate';
import Drawer from '../Drawer/Drawer.js';
import axios from 'axios';
import postApi from '../../utils/postAPI';
import {SlateOutputHTML, SlateOutputCode} from '../SlateOutputHTML/SlateOutputHTML.js'
import defaultValue from '../InputForm/value.json';
import parseValue from './parse.js';
import CommentIcon from '../Icons/CommentIcon';
import NextIcon from '../Icons/NextIcon';
import PrevIcon from '../Icons/PrevIcon';
import "./DisplayPost.css";

class DisplayPost extends Component { 
  initialValue = {
    value: defaultValue,
    title: 'Untitled Note',
    noteId: "new",
    index: 0,
    code: [],
    text: [],
    comments: [],
    commentsHidden: true,
    errorRedirect: false
  }

  constructor(props) {
    super(props);
    this.state = { ...this.initialValue }
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
  }

  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);

    if (this.props.match.params.id) {
      //Load note
      postApi.getById(this.props.match.params.id).then(res => {
        const val = JSON.parse(res.data.body);
        this.setState({
          value: val, 
          title: res.data.title, 
          noteId: res.data.id
        }, ()=> {
          const {code, text} = parseValue(this.state.value.document.nodes);
          this.setState({ code, text });
        });
      }).catch(err => {
        this.setState({ errorRedirect: true });
      });

      //Load comments
      axios.get(`/notes/${this.props.match.params.id}`).then(res => {
        this.setState({comments: res.data});
      })

    } else {
      const {code, text} = parseValue(this.state.value.document.nodes);
      this.setState({ code, text });
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions);
  }
  
  updateWindowDimensions() {
    this.setState({ windowWidth: window.innerWidth, windowHeight: window.innerHeight });
  }

  handleClick(type) {
    let index = this.state.index
    if (type === 'next') {
      this.setState({index: index + 1})
    } else {
      this.setState({index: index - 1})
    }
  }

  onToggleCommentsClick = () => {
    this.setState({commentsHidden: !this.state.commentsHidden});
  }

  resizeHTML = (open) => {
    var width = "100%"
    var paddingBottom = "0px"

    if (open) {
      if (window.innerWidth < 800) {
        paddingBottom = "calc(45vh + 70px)"
      } else {
        width = "50%"
      }
    }

    this.setState({
      textWidth: width,
      textHeight: paddingBottom
    })
  }

  render() {
    let drawerPosition = (window.innerWidth < 800)? "bottom" : "right"
    let isFirst = this.state.index === 0
    let isLast = this.state.index === this.state.text.length - 1
    let style = {
      paddingBottom: this.state.textHeight,
      width: this.state.textWidth,
    }


    return(
      <div className="displayPost" style={style}>
        {this.state.errorRedirect ? <Redirect to="/404" /> : ''}
        <h2 style={{marginBottom: "25px"}}>
          <span id="recent-post-title">{this.state.title}</span>
          <span id="recent-post-curly">&#123;</span>
        </h2>
          <SlateOutputHTML text={this.state.text} index={this.state.index} />
        <h2 style={{marginTop: "25px"}}>

          <button className="btn btn-dark mr-2 prev-button" onClick={()=>this.handleClick('previous')} disabled={isFirst}><PrevIcon /><span className="button-spacing"></span></button>
          <Link to={`/addnote/${this.state.noteId}`}><button className="btn btn-outline-info mr-2 all-post-button"><CommentIcon /><span className="button-spacing">Add Comment</span></button></Link> 
          <button className="btn btn-dark mr-2 next-button" onClick={()=>this.handleClick('next')} disabled={isLast}><NextIcon /><span className="button-spacing"></span></button>
        </h2>
        {this.state.comments.length ? 
          <div>
            <h3>Comments</h3> 
            <button className="btn btn-dark all-post-button" onClick={this.onToggleCommentsClick}>{this.state.commentsHidden ? 'Show Comments' : 'Hide Comments'}</button>
          </div>
          : ''}
        <ul className="list-group">
        { this.state.commentsHidden ? '' :
          this.state.comments.map(comment => 
          <li className="list-group-item" key={comment.id} dangerouslySetInnerHTML={{__html: comment.content}}></li>)
        }
        </ul>
        <h2><span id="recent-post-curly-end">&#125;</span></h2>
        <Drawer position={drawerPosition} onToggleDrawer={this.resizeHTML}>
            <section style={{padding: 15}}>
              <SlateOutputCode code={this.state.code} index={this.state.index} />
            </section>
        </Drawer>
      </div>
    );
  }
}

export default DisplayPost;