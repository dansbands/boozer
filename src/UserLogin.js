import React from 'react';
import api from './services/api';
import { NavLink } from 'react-router-dom'


export default class Login extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      error: false,
      fields: {
        username: '',
        password: ''
      }
    }

  }

  handleChange = (e) => {
    this.setState({
      fields: {
        ...this.state.fields,
        [e.target.id]: e.target.value
      }
    })
  }

  login = (e) => {
    e.preventDefault();
    api.apiData.login(this.state.fields)
    .then(data => this.props.handleLogin(data))

  }

  render () {
    // console.log('User Login Props', this.props);
    return (
      <div className="col-md-6 content">
        <form onChange={this.handleChange} onSubmit={this.login}>
          <h1>Boozer</h1>
          <h3>Sign In</h3>
          <div className="form-group">
            <label htmlFor="username">Username:</label>
            <input className="form-control" type="text" id="username" placeholder="Username" value={this.state.fields.username}/>
          </div>
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input className="form-control" type="password" id="password" placeholder="Password" value={this.state.fields.password}/>
          </div>
          <button
            onSubmit={this.login}

            type="submit"
            className="btn btn-default" >Login</button>
          <NavLink
            to="/signup"
            className="pull-right"
            >Don't have an account? Sign Up Instead</NavLink>
        </form>
      </div>
    )
  }
}
