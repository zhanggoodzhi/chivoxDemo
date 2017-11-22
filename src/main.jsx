import React from 'react';
import ReactDOM from 'react-dom';
import "babel-polyfill";
import Login from 'Login/index';
import Main from 'Main/index';
import {
    // BrowserRouter as Router,
    HashRouter as Router,
    Switch,
    Route,
    Link
} from 'react-router-dom'
import './main.less';
ReactDOM.render(
    (
        <Router>
            <div className="container">
                <Route exact path="/" component={Login} />
                <Route path="/main" component={Main} />
            </div>
        </Router>
    ),
    document.getElementById('app')
)





