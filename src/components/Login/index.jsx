import React, { Component } from 'react';
import { Button } from 'antd';
import headSet from './assets/headset.png';
class Login extends Component {
    render() {
        return (
            <div className="login">
                <div>
                    <p><img className="" src={headSet} alt="" /><h1>驰声英语听说校园版模拟考试训练系统</h1></p>
                </div>
            </div>
        );
    }
}

export default Login;