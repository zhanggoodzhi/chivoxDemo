import React, { Component } from 'react';
import { Button, Input, Icon, Row, Col, Spin, Radio } from 'antd';
import headSet from './assets/white_headset.png';
import logo from './assets/logo.png';
import download from './assets/download.png';
import './index.less';

const RadioGroup = Radio.Group;
class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {
            status: 'download',// download wait write check upload 五种状态
            dataSource: null,
            number: 5,
            questionType: 'listen',
            questionIndex: 0
        }
        this.timer = null;
    }

    componentWillMount() {
        this.setState({
            status: 'download'
        });
        setTimeout(() => {
            const dataSource = {
                title: '北京7年级听说模拟试卷009',
                listen: {
                    title: '一、听力选答',
                    tip: '本部分有6小题......',
                    score: 10,
                    children: [{
                        voice: 'http://dl.stream.qqmusic.qq.com/C400002z1ZuN1zFgnK.m4a?vkey=868234F1DFEF5966E1FD9D51AAEB160DAD9901034188EF0F092A4A9B7B15BA3DF7778DA6CD97D7AE75B5612A5EF9F70810B6C4B83DF7994D&guid=8253092704&uin=474294484&fromtag=66',
                        correctAnswer: 0,
                        article: 'W:Hello,may I help you?</br>M:Yes.</br>W:thank you!',
                        answer: ['1111', '2222', '3333'],
                        knowledge: '社交'
                    }, {
                        voice: 'http://dl.stream.qqmusic.qq.com/C400002z1ZuN1zFgnK.m4a?vkey=868234F1DFEF5966E1FD9D51AAEB160DAD9901034188EF0F092A4A9B7B15BA3DF7778DA6CD97D7AE75B5612A5EF9F70810B6C4B83DF7994D&guid=8253092704&uin=474294484&fromtag=66',
                        correctAnswer: 1,
                        article: 'W:Hello2,may I help you?</br>M:Yes.</br>W:thank you!',
                        answer: ['b', 'n', 'm'],
                        knowledge: '互联网'
                    }]
                },
                speak: {

                }
            };
            this.setState({
                dataSource,
                status: 'wait'
            });
            this.reduceTime();
        }, 0);
    }

    reduceTime = () => {
        let { number } = this.state;
        this.timer = setInterval(() => {
            if (number > 1) {
                number--;
                this.setState({
                    number
                });
            } else {
                clearInterval(this.timer);
                this.setState({
                    status: 'write'
                });
            }
        }, 0);
    }
    handleSelect = (e) => {
        const { dataSource, questionIndex } = this.state;
        const value = e.target.value;
        const oldDataSource = { ...dataSource };
        oldDataSource.listen.children[questionIndex].selectAnswer = Number(e.target.value);
        this.setState({
            dataSource: oldDataSource
        });
    }
    getView = (status) => {
        const { number, dataSource, questionType, questionIndex } = this.state;
        const parent = dataSource && dataSource[questionType];
        const Options = parent && parent.children[questionIndex].answer.map((v, i) => {
            if (parent.children[questionIndex].selectAnswer === i) {
                return (
                    <Radio className="radio-item" value={i}>
                        {`${String.fromCharCode(i + 65)}. ${v}`}
                        <Icon className="yes" type="check" />
                    </Radio>
                );
            }
            return <Radio className="radio-item" value={i}>{`${String.fromCharCode(i + 65)}. ${v}`}</Radio>
        });
        const listenContent = (
            <div className="listen-wrap">
                <div className="voice-wrap">
                    <Button icon="sound">原文播放</Button>
                </div>
                <div className="answer-wrap">
                    <span className="index">{questionIndex + 1}.</span>
                    <div className="radio-wrap">
                        <RadioGroup onChange={this.handleSelect}>
                            {Options}
                        </RadioGroup>
                    </div>
                </div>
            </div>
        );
        const speakContent = (
            <div></div>
        );

        switch (status) {
            case 'download': return (
                <div className="loading-wrap">
                    <div>
                        <img src={download} alt="" />
                    </div>
                    <div className="spin-wrap">
                        <Spin />
                        <span style={{ marginLeft: 5 }}>正在下载试卷，请稍后……</span>
                    </div>
                </div>
            ); break;
            case 'wait': return (
                <div className="wait-wrap">
                    <div className="title">
                        <span>{dataSource.title}</span>
                    </div>
                    <div className="circle-wrap">
                        <div className="circle">
                            <span className="number">{number}</span>
                        </div>
                    </div>
                </div>
            ); break;
            case 'write':
                if (!parent) {
                    return <div></div>;
                }
                return (
                    <div className="write-wrap">
                        {questionIndex !== 0 ? '' : (
                            <div className="question-title">
                                <h2>{parent.title}（计{parent.score}分）</h2>
                                <p>{parent.tip}</p>
                            </div>
                        )}
                        {
                            questionType === 'listen' ? listenContent : speakContent
                        }
                    </div>
                ); break;
        }
    }

    render() {
        const { status } = this.state;
        return (
            <div className="main">
                <div className="header">
                    <p>
                        <img className="headset" src={headSet} alt="" />
                        <span className="big-title">驰声英语听说校园版模拟考试训练系统</span>
                    </p>
                </div>
                <Row className="content-wrap">
                    <Col className="left" span={6}>
                        <img className="logo" src={logo} alt="" />
                    </Col>
                    <Col className="right" span={18}>
                        {this.getView(status)}
                    </Col>
                </Row>
            </div>
        );
    }
}

export default Main;