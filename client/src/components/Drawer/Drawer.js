import React, {Component} from 'react';
import ReactDrawer from 'react-drawer';

/* if you using webpack, should not apply identity to this css */
import './Drawer.css';
 
class Drawer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      position: props.position,
      noOverlay: true,
    };
    this.toggleDrawer = this.toggleDrawer.bind(this);
    this.closeDrawer = this.closeDrawer.bind(this);
    this.onDrawerClose = this.onDrawerClose.bind(this);
    this.setPosition = this.setPosition.bind(this);
    this.setNoOverlay = this.setNoOverlay.bind(this);
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
  }

  componentWillReceiveProps(props){
    this.setState({
      position: props.position
    })
  }

  componentDidMount(){
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);

    this.setState({open: true}, ()=>this.props.onToggleDrawer(this.state.open));
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions);
  } 

  updateWindowDimensions() {
    this.setState({ windowWidth: window.innerWidth, windowHeight: window.innerHeight }, ()=>this.props.onToggleDrawer(this.state.open));
  }

  setPosition(e) {
    this.setState({position: e.target.value});
  }
  setNoOverlay(e) {
    this.setState({noOverlay: e.target.checked});
  }
  toggleDrawer() {
    this.setState({open: !this.state.open}, ()=>this.props.onToggleDrawer(this.state.open));
  }
  closeDrawer() {
    this.setState({open: false});
  }
  onDrawerClose() {
    this.setState({open: false});
  }
  render() {
    return (
      <div>
        <div>
        <button
            className="btn btn-secondary"
            id="codeButton"
            onClick={this.toggleDrawer}
            disabled={this.state.open && !this.state.noOverlay}
            >
            {!this.state.open ? <span>&lt; Code &gt;</span>: <span>&lt;/ Code &gt;</span>}
          </button>
        </div>
       
        <ReactDrawer
          open={this.state.open}
          position={this.state.position}
          onClose={this.onDrawerClose}
          noOverlay={true}>
          {this.props.children}
        </ReactDrawer>
      </div>
    );
  }
}

export default Drawer;