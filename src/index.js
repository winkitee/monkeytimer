import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
// import reportWebVitals from './reportWebVitals';
import firebase from "firebase/app";

var firebaseConfig = {
    apiKey: "AIzaSyCBlxSK7JeA50AtDze1Lb-zteLQhU4_cak",
    authDomain: "monkey-timer.firebaseapp.com",
    projectId: "monkey-timer",
    storageBucket: "monkey-timer.appspot.com",
    messagingSenderId: "353340494894",
    appId: "1:353340494894:web:b52c513e6ccc35ecab7bbf",
    measurementId: "G-YL5S9PHTB8",
};

firebase.initializeApp(firebaseConfig);

ReactDOM.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
    document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
