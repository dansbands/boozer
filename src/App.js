import React from 'react';
import Container from './Container';
import api from './services/api';
import SignUp from './UserSignUp';
import Login from './UserLogin';


import { Switch, Route, Redirect } from 'react-router-dom';


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
      <Switch>
        <div className="container">

          {!Object.keys(this.state.auth.currentUser).length ? (
            <div>
              <Route
                exact
                path="/" render={routerProps => {
                  return(
                    <Login {...routerProps}
                      handleLogin={this.handleLogin}/>

                  )
                }}
                />
              <Route exact path="/login" render={routerProps => {
                  return(
                    <Login {...routerProps}
                      handleLogin={this.handleLogin}/>

                  )
                }}
                />
              <Route exact path="/signup" component={SignUp} />
            </div>
          ) : (
              <Route
                path="/"
                render={
                  routerProps => {
                    return(
                      <Container {...routerProps}
                        logout={this.handleLogout}
                        login={this.state.auth.currentUser}/>
                    )
                  }
                } />
            )
          }





        </div>
      </Switch>
    )
  }
}

export default App;
