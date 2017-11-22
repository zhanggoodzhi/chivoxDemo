import React, { Component } from 'react';
import { Button, Input, Icon } from 'antd';
import headSet from './assets/headset.png';
import './index.less';
class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            err: false,
            msg: ''
        }
    }
    handleSubmit = () => {
        if (this.state.msg === '123') {
            this.props.history.push('main');
        } else {
            this.setState({
                err: true
            });
        }
    }
    
    cancel = () => {
        this.setState({
            msg: ''
        });
    }

    render() {
        const { msg, err } = this.state;
        return (
            <div className="login">
                <div className="header">
                    <p><img className="headset" src={headSet} alt="" /><span className="big-title">驰声英语听说校园版模拟考试训练系统</span></p>
                </div>
                <div className="content-wrap">
                    <h2>学生登录</h2>
                    <div className="content clearfix">
                        <div className="left">
                            <div className="circle">
                                <p className="title">座位号</p>
                                <p className="number">32</p>
                            </div>
                        </div>
                        <div className="right">
                            <div className="input-wrap">
                                <Input value={msg} onChange={(e) => { this.setState({ msg: e.target.value }) }} size="large" width="80" className="sid" placeholder="请输入学号" />
                            </div>
                            <div className="btn-wrap clearfix">
                                <Button onClick={this.handleSubmit} className="sure" size="large" type="primary">确认</Button>
                                <Button onClick={this.cancel} className="reset" size="large">重置</Button>
                            </div>
                            {
                                err ? (
                                    <div className="err">
                                        <Icon className="err-icon" type="exclamation-circle" />
                                        <span className="mf">您输入的学号不存在!</span>
                                    </div>
                                ) : ''
                            }
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Login;