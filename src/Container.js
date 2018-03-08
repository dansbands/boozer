import React, { Component } from 'react';

import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import './css/App.css';
import CocktailsContainer from './CocktailsContainer';
import MainContent from './MainContent';
import SearchBar from './SearchBar';
import CocktailForm from './CocktailForm';
import SignUp from './UserSignUp';
import Login from './UserLogin';
import UserProfile from './UserProfile'
import api from './services/api'
import Navbar from './Navbar'
import EditCocktailForm from './EditCocktailForm';
import SavedDrinks from './SavedDrinks';


const API_ROOT = `https://boozer.herokuapp.com/api/v1`;
// const API_ROOT = `http://localhost:3000/api/v1`;


class Container extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: '',
      cocktails: [],
      ingredients: [],
      currentCocktail: '',
      searchTerm: '',
      drinkToEdit: '',
      redirect: false,
      formValue: {
        name: '',
        description: '',
        instructions: '',
        source: '',
        proportions: [{
          ingredient_name: '',
          amount: ''
        }]
      }
    }
  }

  componentWillMount() {
    this.handleUpdateUser()
  }

  componentDidMount() {
    this.setState({
      user: this.props.login,
    }, () => {
      this.getCocktails()
      this.getIngredients()
      this.forNowGetUser()
    })
  }

// get Data from Api
  getCocktails = () => {
    api.apiData.getCocktails()
    .then(json => {
      this.setState({
        cocktails: json,
        currentCocktail: json[0]
      })
    })
  }

  getIngredients = () => {
    api.apiData.getIngredients()
    .then(json => this.setState({
      ingredients: json
    }))
  }

  forNowGetUser = () => {
    if (this.state.user) {

    fetch(`${API_ROOT}/users/${this.state.user.id}`)
      .then(resp => resp.json())
      .then(resp => this.setState({ user: resp }))
    }
  }

  handleUpdateUser = (user) => {
    console.log('updating user', this.props.login);
    this.setState({
      user: this.props.login.user
    })
  }
// this also exists in api.apiData.createUser(fields) - not currently being used
//message from silvia: createUser passes down to SignUp component
  createUser = (fields) => {
    fetch(`${API_ROOT}/users`,{
      method: 'POST',
      body: JSON.stringify(fields),
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    }).then(resp => resp.json())
      .then(resp => this.setState({ user: resp }))

  }


// event handlers (mostly)
  handleClick = (id) => {
    api.apiData.showDrink(id)
      .then(json => this.setState({ currentCocktail: json }));
  }

  handleSearch = (e) => {
    this.setState({
      searchTerm: e.target.value,
    }, () => this.foundDrink(this.state.searchTerm));
  }

  handleRedirect = () => {
    this.setState({
      redirect: false,
    })
  }

  foundDrink = (s) => {
    const search = s.toUpperCase();
    const drinks = this.state.cocktails.filter( cocktail => (this.findByIngredient(search, cocktail.proportions) || cocktail.name.toUpperCase().includes(search)) )
    // this.setState({ currentCocktail: drinks[0] })
    return drinks ? drinks : [];
  }

  findByIngredient = (search, drinks) => {
    for (let drink of drinks) {
      if ( drink.ingredient_name.toUpperCase().includes(search) ) {
        return true;
      }
    }
    return false;
  }

  handleNewCocktail = (fields) => {
    api.apiData.createNewCocktail(fields)
    .then(resp => this.selectSavedDrink(resp))
    .then(() => {
      this.getCocktails()
      this.getIngredients()
      this.forNowGetUser()
    })
  }

  handleUpdateCocktail = (fields) => {
      this.setState({
        drinkToEdit: fields,
      })
  }
// form submits 'saved_drink_name', but api expects 'name' - FIXED in UsersController
  handlePostCocktail = (fields) => {
      console.log('about to post', fields);
      api.apiData.updateCurrentCocktail(fields)
        .then(resp => {
          this.setState({
            currentCocktail: this.state.drinkToEdit
          })
        })
        .then(() => this.forNowGetUser())

      //Need to update user's cocktails, redirect to profile page
  }

  handleCocktailChange = (newValue) => {
    this.setState({formValue: newValue});
  };

  handleUpdateChange = (newValue) => {
    console.log('handle update change');
    this.setState({drinkToEdit: newValue})
  }

//working on functions below-----------

  handleSaveCocktail = (cocktail) => {
    console.log('saving cocktail', cocktail);

    const data = {
      name: cocktail.name,
      description: cocktail.description,
      instructions: cocktail.instructions,
      source: cocktail.source,
      cocktail_id: cocktail.id,
      user_id: this.state.user.id,
      proportions: cocktail.proportions
    }
    this.createSavedCocktail(data)

    // not using: proportions...so no ingredients
    // we may need to rethink this

  }

  handleSearchSubmit = (e) => {
    e.preventDefault()
    console.log('handling submit', this.props);

    this.setState({
      redirect: true
    })
  }

  createSavedCocktail = (data) => {
    console.log('saving data', data);
    fetch(`${API_ROOT}/saved_drinks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'accept': 'application/json'
      },
      body: JSON.stringify(data)
    }).then(resp => resp.json())
      .then(() => this.forNowGetUser())
  }

  selectSavedDrink = (drink) => {
    console.log('this is the saved drink', drink);
    let cocktail = this.state.cocktails.find( c => c.id === drink.cocktail_id)
    console.log('selected cocktail:', cocktail);
    this.setState({
      currentCocktail: drink
    })
  }

  removeSavedDrink = (drinkId) => {
    console.log('this is the drink to remove', drinkId);
    fetch(`${API_ROOT}/saved_drinks/${drinkId}`, {
      method: 'DELETE'
    }).then(resp => resp.json())
      .then(() => this.forNowGetUser())
  }


  editCocktail = (id, fields) => {

  }


  render() {
    console.log("App State User", this.state.user);
    // console.log('current cocktail in state', this.state.currentCocktail);

    const searchStyle = {
      position: "fixed",
      top: 0,

    }

    return (
      <div className="container">
        <Router>
          <div>
            <Navbar
              user={this.state.user}
              logout={this.props.logout}
              handleRedirect={this.handleRedirect}/>
             <Route exact path="/" render={routerProps => {
                 return(
                   <div className="container content">
                     <div>
                       <div className="spacer"></div>
                       <h1 className="main-heading">Welcome to Boozer</h1>
                       <div className="row">
                         <div className="col-xs-8">
                           <h4>Search for a Cocktail...</h4>
                           <SearchBar
                             handleSearch={this.handleSearch}
                             searchTerm={this.state.searchTerm}
                             submit={this.handleSearchSubmit}
                             style={searchStyle}
                             />
                         </div>
                       </div>
                       <div className="spacer"></div>
                     </div>
                     {this.state.redirect &&
                       <Redirect to='/search' /> }

                   </div>

                 );
               }}
              />
            <Route exact path="/search" render={routerProps => {
                 return(
                   <div className="container content">
                     <div>
                       <div className="navbar-form pull-right">
                         <SearchBar
                           handleSearch={this.handleSearch}
                           searchTerm={this.state.searchTerm}
                           submit={this.handleSearchSubmit}

                           style={searchStyle}
                           />
                       </div>
                       <CocktailsContainer cocktails={this.state.searchTerm ? this.foundDrink(this.state.searchTerm) : []} handleClick={this.handleClick} />
                       <div className="col-xs-6">
                         <MainContent
                           currentCocktail={this.state.currentCocktail}
                           edit={this.editCocktail}
                           saveCocktail={this.handleSaveCocktail}
                           />
                       </div>
                       <div className="col-xs-3">
                         <SavedDrinks drinks={this.state.user.saved_drinks}/>
                       </div>
                     </div>
                   </div>

                 );
               }}
              />
            <Route exact path="/signup" render={() => {
                return(
                  <SignUp create={this.createUser}/>
                );
              }} />
            <Route exact path="/login" render={() => {
                return(
                  <Login />
                );
              }} />
            <Route exact path="/profile" component={() => {
                return(
                  <UserProfile
                    user={this.state.user}
                    selectSavedDrink={this.selectSavedDrink}
                    removeSavedDrink={this.removeSavedDrink}
                    editSavedDrink={this.handleUpdateCocktail}
                    />
                )
              }} />

            <Route exact path="/new_cocktail" render={() => {
                return(
                  <CocktailForm onChange={this.handleCocktailChange}
                                value={this.state.formValue}
                                onSubmit={this.handleNewCocktail} />
                );
              }}
            />
          <Route exact path="/edit_cocktail" render={() => {
                return(
                  <EditCocktailForm onChange={this.handleUpdateChange}
                                value={this.state.drinkToEdit}
                                onSubmit={this.handlePostCocktail} />
                );
              }}
            />
          <Route exact path="/show_cocktail" render={() => {
                return(
                  <div>
                    <UserProfile
                      user={this.state.user}
                      selectSavedDrink={this.selectSavedDrink}
                      removeSavedDrink={this.removeSavedDrink}
                      editSavedDrink={this.handleUpdateCocktail}
                      />
                    <div className="col-xs-1"></div>
                    <div className= "col-xs-7 content">
                      <MainContent
                        currentCocktail={this.state.currentCocktail}
                        edit={this.editCocktail}
                        saveCocktail={this.handleSaveCocktail}
                        />
                      </div>
                  </div>
                );
              }}
            />

          </div>
        </Router>







      </div>
    )
  }
}

export default Container;
