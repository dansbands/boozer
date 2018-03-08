import React from 'react';
import Container from './Container';
import api from './services/api';
import SignUp from './UserSignUp';
import Login from './UserLogin';


import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';


class App extends React.Component {
  state = { auth: { currentUser: {} } };

  componentDidMount() {
    // if(!api.apiData.auth){
    //   // localStorage.clear();
    //   this.handleLogout()
    // }
    if (localStorage.getItem('token')) {
      api.apiData.currentUser().then(user => {
        console.log('response is', user);
        if (!user.error) {
          this.setState({ auth: { currentUser: user } });
        }
      });
    }
  }

  handleLogin = user => {
    console.log('Login', user);
    localStorage.setItem('token', user.token);
    this.setState({ auth: { currentUser: user } });
  };

  handleLogout = () => {
    localStorage.removeItem('token');
    this.setState({ auth: { currentUser: {} } });
    console.log(this.props.history)
  };

  render(){
    console.log('App State', this.state.auth.currentUser);
    return(
      <Router basename="/boozer">
        <div className="container">

          {!Object.keys(this.state.auth.currentUser).length &&
              <div>
                <Route
                  exact
                  path="/" render={routerProps => {
                    return(
                      <Login handleLogin={this.handleLogin}/>

                    )
                  }}
                />
              <Route exact path="/login" render={routerProps => {
                    return(
                      <Login handleLogin={this.handleLogin}/>

                    )
                  }}
                />
                <Route exact path="/signup" component={SignUp} />
              </div>
          }
          {Object.keys(this.state.auth.currentUser).length &&
            <Route
              path="/" render={
                routerProps => {
                  <Container
                    logout={this.handleLogout}
                    login={this.state.auth.currentUser}/>    
                }
              } />
          }





        </div>
      </Router>
    )
  }
}

export default App;
