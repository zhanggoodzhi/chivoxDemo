import React, { Component } from 'react';
import { Button, Input, Icon, Row, Col, Spin, Radio, Popover, Slider } from 'antd';
import headSet from './assets/white_headset.png';
import logo from './assets/logo.png';
import download from './assets/download.png';
import changeVoiceIcon from './assets/changeVoice.png';
import recordIcon from './assets/recordicon.png';
import arcIcon from './assets/arc.png';
import Recorder from 'recorderjs/recorder.js';
import './index.less';

const RadioGroup = Radio.Group;
class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {
            status: 'download',// download wait write check upload 五种状态
            dataSource: null,
            number: 5,
            questionType: 'speak',
            questionIndex: 0,
            recordIconState: 'pause'
        }
        this.timer = null;
        this.audio = document.createElement('audio');
        this.recorder = null;
    }

    componentWillMount() {
        this.setState({
            status: 'download'
        });
        // 模拟取后台试卷数据
        setTimeout(() => {
            const dataSource = {
                title: '北京7年级听说模拟试卷009',
                listen: {
                    title: '一、听力选答',
                    tip: '本部分有6小题......',
                    score: 10,
                    children: [{
                        voice: 'http://dl.stream.qqmusic.qq.com/C400002z1ZuN1zFgnK.m4a?vkey=868234F1DFEF5966E1FD9D51AAEB160DAD9901034188EF0F092A4A9B7B15BA3DF7778DA6CD97D7AE75B5612A5EF9F70810B6C4B83DF7994D&guid=8253092704&uin=474294484&fromtag=66',
                        correctAnswer: 2,
                        question: 'is it ok?',
                        article: 'W:Hello,may I help you?</br>M:Yes.</br>W:thank you!',
                        answer: ['1111', '2222', '3333'],
                        knowledge: '社交'
                    }, {
                        voice: 'http://www.uukaola.com/web/resources/papers/9013c9679358439ba25184afc7a6fbd7/6a41cff527814747997f77fb8ca4e51a_Audio.mp3',
                        correctAnswer: 1,
                        question: 'is it wrong?',
                        article: 'W:Hello2,may I help you?</br>M:Yes.</br>W:thank you!',
                        answer: ['b', 'n', 'm'],
                        knowledge: '互联网'
                    }]
                },
                speak: {
                    title: '二、朗读短文',
                    tip: '你将有一分钟时间......',
                    score: 8,
                    children: [{
                        voice: 'http://dl.stream.qqmusic.qq.com/C400002z1ZuN1zFgnK.m4a?vkey=868234F1DFEF5966E1FD9D51AAEB160DAD9901034188EF0F092A4A9B7B15BA3DF7778DA6CD97D7AE75B5612A5EF9F70810B6C4B83DF7994D&guid=8253092704&uin=474294484&fromtag=66',
                        article: 'Hello,may I help you?thank you!Hello,may I help you?thank you!Hello,may I help you?thank you!Hello,may I help you?thank you!Hello,may I help you?thank you!Hello,may I help you?thank you!Hello,may I help you?thank you!'
                    }, {
                        voice: 'http://www.uukaola.com/web/resources/papers/9013c9679358439ba25184afc7a6fbd7/6a41cff527814747997f77fb8ca4e51a_Audio.mp3',
                        article: 'Hello,may I help you?thank you!Hello,may I help you?thank you!Hello,may I help you?thank you!Hello,may I help you?thank you!Hello,may I help you?thank you!Hello,may I help you?thank you!Hello,may I help you?thank you!'
                    }]
                }
            };
            this.setState({
                dataSource,
                status: 'wait'
            });
            this.reduceTime();
        }, 0);
        // 初始化recorderjs
        let audio_context;
        try {
            // webkit shim
            window.AudioContext = window.AudioContext || window.webkitAudioContext;
            navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia;
            window.URL = window.URL || window.webkitURL;
            audio_context = new AudioContext();
            console.log('Audio context set up.');
            console.log('navigator.getUserMedia ' + (navigator.getUserMedia ? 'available.' : 'not present!'));
        } catch (e) {
            message.error('该浏览器不支持语音输入!');
        }
        navigator.getUserMedia({ audio: true }, (stream) => {
            const input = audio_context.createMediaStreamSource(stream);
            console.log('Media stream created.');
            this.recorder = new Recorder(input);
            console.log('Recorder initialised.');
        }, (err) => {
            console.log('获取麦克风出错', '错误:' + err);
        })
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
    playAudio = (url) => {
        this.audio.pause();
        this.audio.src = url;
        this.audio.play();
    }
    sliderChange = (value) => {
        this.audio.volume = value / 100;
    }
    backToWrite = () => {
        const { dataSource, questionIndex } = this.state;
        const oldDataSource = { ...dataSource };
        oldDataSource.listen.children[questionIndex].selectAnswer = null;
        this.setState({
            dataSource: oldDataSource,
            status: 'write'
        });
    }
    next = () => {
        const { questionIndex, dataSource, questionType } = this.state;
        const length = dataSource[questionType].children.length;
        if (questionIndex < length - 1) {
            this.setState({
                questionIndex: questionIndex + 1
            });
        } else {// 一种题目到底了
            if (questionType === 'listen') {
                this.setState({
                    questionType: 'speak',
                    questionIndex: 0
                });
            } else {
                this.setState({
                    status: 'upload'
                });
            }
        }
    }

    pre = () => {
        const { questionIndex, dataSource, questionType } = this.state;
        const length = dataSource[questionType].children.length;
        if (questionIndex !== 0) {
            this.setState({
                questionIndex: questionIndex - 1
            });
        } else {// 一种题目到了第一个
            if (questionType === 'speak') {
                this.setState({
                    questionType: 'listen',
                    questionIndex: dataSource.listen.children.length - 1
                });
            }
        }
    }
    getView = (status) => {
        const { number, dataSource, questionType, questionIndex, recordIconState } = this.state;
        const parent = dataSource && dataSource[questionType];
        if (!parent) {
            return <div></div>;
        }
        const child = parent && parent.children[questionIndex];
        const options = child.answer && child.answer.map((v, i) => {
            if (child.selectAnswer === i) {
                return (
                    <Radio key={i} className="radio-item green" value={i}>
                        {`${String.fromCharCode(i + 65)}. ${v}`}
                        <Icon className="yes" type="check" />
                    </Radio>
                );
            }
            return <Radio key={i} className="radio-item" value={i}>{`${String.fromCharCode(i + 65)}. ${v}`}</Radio>
        });
        const AnswerOptions = child.answer && child.answer.map((v, i) => {
            if (child.selectAnswer === i && child.correctAnswer === i) {
                return (
                    <Radio disabled={true} checked={true} key={i} className="radio-item" value={i}>
                        {`${String.fromCharCode(i + 65)}. ${v}`}
                        <Icon className="yes" type="check" />
                    </Radio>
                );
            }
            else if (child.selectAnswer === i) {
                return (
                    <Radio disabled={true} checked={true} key={i} className="radio-item red" value={i}>
                        {`${String.fromCharCode(i + 65)}. ${v}`}
                        <Icon className="no" type="close" />
                    </Radio>
                );
            }

            else if (child.correctAnswer === i) {
                return (
                    <Radio disabled={true} key={i} className="radio-item green" value={i}>
                        {`${String.fromCharCode(i + 65)}. ${v}`}
                        <Icon className="yes" type="check" />
                    </Radio>
                );
            }
            return <Radio disabled={true} key={i} className="radio-item" value={i}>{`${String.fromCharCode(i + 65)}. ${v}`}</Radio>
        });
        const popoverContent = (
            <Slider onChange={this.sliderChange} defaultValue={30} />
        )
        const listenContent = (
            <div className="listen-wrap">
                <div className="voice-wrap">
                    <Button onClick={() => { this.playAudio(child.voice) }} icon="sound">原文播放</Button>
                </div>
                <div className="answer-wrap">
                    <span className="index">{questionIndex + 1}.</span>
                    <div className="radio-wrap">
                        <RadioGroup onChange={this.handleSelect}>
                            {options}
                        </RadioGroup>
                    </div>
                </div>
                <div className="option-wrap clearfix">
                    <div className="option-left">
                        <Popover placement="topLeft" title="音量调节" content={popoverContent} trigger="click">
                            <img src={changeVoiceIcon} alt="" />
                        </Popover>
                    </div>
                    <div className="option-right">
                        <a onClick={() => { this.setState({ status: 'check' }) }}
                            className="check-wrap">
                            <Icon className="check" type="search" />
                            <span className="check-text">查看答案解析</span>
                        </a>
                        {
                            questionIndex === 0 && questionType === 'listen' ?
                                ''
                                :
                                <Icon onClick={this.pre} className="pre" type="step-backward" />
                        }
                        <Icon onClick={this.next} className="next" type="step-forward" />
                    </div>
                </div>
            </div>
        );
        const listenAnswerContent = (
            <div className="listen-answer-content-wrap">
                <div className="answer-title">
                    <h2>答案解析</h2>
                </div>
                <div className="answer-content-container">
                    <div className="content-top">
                        <p><span className="sound-label">[听力原文]</span><Icon onClick={() => { this.playAudio(child.voice) }} className="sound" type="sound" /></p>
                        <p dangerouslySetInnerHTML={{ __html: child.article }}></p>
                    </div>
                    <div className="content-bottom">
                        <h2 className="index">{questionIndex + 1}.{child.question}</h2>
                        <div className="radio-wrap">
                            <RadioGroup onChange={this.handleSelect}>
                                {AnswerOptions}
                            </RadioGroup>
                        </div>
                        <div className="knowledge-wrap">
                            <span className="tag">考察知识点:</span>
                            <span>社交</span>
                        </div>
                    </div>
                    <div className="back-wrap">
                        <Button onClick={this.backToWrite} icon="rollback">返回练习</Button>
                    </div>
                </div>

            </div>
        );
        const speakContent = (
            <div className="speak-wrap">
                <div className="article-wrap">
                    <p className="index">{questionIndex + 1}.</p>
                    <p className="article" dangerouslySetInnerHTML={{ __html: child.article }}></p>
                </div>
                <div className="option-wrap clearfix">
                    <div className="option-left">
                        <Popover placement="topLeft" title="音量调节" content={popoverContent} trigger="click">
                            <img src={changeVoiceIcon} alt="" />
                        </Popover>
                    </div>
                    <div className="option-right">
                        <a onClick={() => { this.setState({ status: 'check' }) }}
                            className="check-wrap">
                            <Icon className="check" type="search" />
                            <span className="check-text">查看答案解析</span>
                        </a>
                        <Icon onClick={this.pre} className="pre" type="step-backward" />
                        <Icon onClick={this.next} className="next" type="step-forward" />
                    </div>
                    <div className="arc">
                        <img src={arcIcon} alt="" />
                    </div>
                    <div className="record-wrap">
                        {
                            recordIconState === 'play' ?
                                (
                                    <div onClick={this.playAudio} className="icon-wrap">
                                        <img src={recordIcon} alt="" />
                                    </div>
                                )
                                :
                                (
                                    <Icon onClick={this.pauseAudio} className="stop" type="pause-circle" />
                                )
                        }
                    </div>
                </div>
            </div>
        );
        const speakAnswerContent = (
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
            );
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
            );
            case 'write':
                if (!child) {
                    return <div></div>;
                }
                return (
                    <div className="write-wrap">
                        {questionIndex !== 0 ? '' : (
                            <div className="question-title">
                                <h2>{parent.title}（计{parent.score}分）</h2>
                                <p className="content">{parent.tip}</p>
                            </div>
                        )}
                        {
                            questionType === 'listen' ? listenContent : speakContent
                        }
                    </div>
                );
            case 'check':
                if (!child) {
                    return <div></div>;
                }
                return (
                    <div className="check-wrap">
                        {questionIndex !== 0 ? '' : (
                            <div className="question-title">
                                <h2>{parent.title}（计{parent.score}分）</h2>
                                <p>{parent.tip}</p>
                            </div>
                        )}
                        {
                            questionType === 'listen' ? listenAnswerContent : speakAnswerContent
                        }
                    </div>
                );
        }
    }
    playAudio = () => {
        this.setState({
            recordIconState: 'pause'
        });
    }

    pauseAudio = () => {
        this.setState({
            recordIconState: 'play'
        });
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