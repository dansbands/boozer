import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { BrowserRouter } from 'react-router-dom';


ReactDOM.render(
  <BrowserRouter basename="/boozer" >
    <App />
  </BrowserRouter>,
  document.getElementById('root'));


// TO DO LIST:



    // User Login
          // Update Drink in a User's Saved Drinks
          // Delete Drink in User's Saved Drinks
    // Routing
    // Add Photos/ Img URLs to database, display in MainContent


//NICE TO HAVE STUFF: DO ONLY WHEN WE HAVE TIME AT THE LAST MINUTE!!!!!!!!!!!
    // Bär (words not english doesnt work)




// DONE:
  // Add User Profile Page
      // Add SavedDrink to User/User Profile/User Drink Page
  // Search by drink name and ingredients
  // Add ingredients to main drink page
  //Add Create Cocktail Functionality
  // Add users to backend - add new model
    // Add new model SavedDrink so we can add drinks to User/User Profile/User Drink Page -
