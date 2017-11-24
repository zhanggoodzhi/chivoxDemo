import React, { Component } from 'react';
import {
    Route,
    Redirect
} from 'react-router-dom'
class PrivateRoute extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const user = sessionStorage.getItem('user');
        return user ?
            <Route {...this.props} />
            :
            <Redirect to={{
                pathname: '/',
                state: { from: this.location }
            }} />

    }
}

export default PrivateRoute;