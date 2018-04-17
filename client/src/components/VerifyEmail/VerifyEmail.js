import React, {Component} from 'react';
import axios from 'axios';

class VerifyEmail extends Component {
  constructor(props) {
    super(props);
    this.state = {verified: false}
  }

  componentDidMount() {
    // axios.get('/account')
    console.log(this.props);
    axios.get(`/account/${this.props.match.params.username}/${this.props.match.params.token}`)
      .then(res => {
        this.setState({verified: true});
      }).catch(err => {
        this.setState({verified: false});
      })
  }

  render() {
    return (<div className="text-center">
      {this.state.verified ? <p className="alert alert-success">Account verified! Please login.</p> : <p className="alert alert-danger">Unable to verify account. Contact support.</p>}
      </div>)
  }
}

export default VerifyEmail;