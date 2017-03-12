import React from 'react';
import ReactDOM from 'react-dom';
import firebase from 'firebase'
import App from './App';
import './index.css';

firebase.initializeApp({
	apiKey: "------API_KEY------",
	authDomain: "------AUTH-DOMAIN------",
	databaseURL: "------DATABASEURL------",
	storageBucket: "------STORAGEBUCKET------",
	messagingSenderId: "------MESSAGINSENDERID------"
});

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
