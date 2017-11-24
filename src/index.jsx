import React from 'react';
import ReactDOM from 'react-dom';
import "babel-polyfill";
import Login from 'container/Login/index';
import Main from 'container/Main/index';
import PrivateRoute from 'PrivateRoute';
import {
    // BrowserRouter as Router,
    HashRouter as Router,
    Switch,
    Redirect,
    Route,
    Link
} from 'react-router-dom'
import './index.less';

ReactDOM.render(
    (
        <Router>
            <div className="container">
                <Switch>
                    <Route exact path="/login" component={Login} />
                    <PrivateRoute path="/main" component={Main} />
                    <Redirect to="/login" />
                </Switch>
            </div>
        </Router>
    ),
    document.getElementById('app')
)





