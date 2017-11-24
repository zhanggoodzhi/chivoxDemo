import React, { Component } from 'react';
import { Button, Input, Icon, Row, Col, Spin, Radio, Popover, Slider, message } from 'antd';
import headSet from './assets/white_headset.png';
import logo from './assets/logo.png';
import download from './assets/download.png';
import end from './assets/end.png';
import changeVoiceIcon from './assets/changeVoice.png';
import recordIcon from './assets/recordicon.png';
import arcIcon from './assets/arc.png';
import Recorder from 'plugin/recorderjs/recorder';
import './index.less';

const RadioGroup = Radio.Group;
class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {
            status: 'download',// download wait write check upload 五种状态
            dataSource: null,
            number: 5,
            loading: false,
            questionType: 'listen',
            questionIndex: 0,
            recordIconState: 'play'
        }
        this.timer = null;
        this.audio = document.createElement('audio');
        this.recorder = null;
    }

    componentDidMount() {
        // 模拟取后台试卷数据
        setTimeout(() => {
            const dataSource = {
                title: '北京7年级听说模拟试卷009',
                listen: {
                    title: '一、听力选答',
                    tip: '本部分有6小题......',
                    score: 10,
                    voice: 'http://www.uukaola.com/web/resources/papers/9013c9679358439ba25184afc7a6fbd7/6a41cff527814747997f77fb8ca4e51a_Audio.mp3',
                    children: [{
                        correctAnswer: 2,
                        question: 'is it ok?',
                        article: 'W:Hello,may I help you?</br>M:Yes.</br>W:thank you!',
                        answer: ['1111', '2222', '3333'],
                        knowledge: '社交'
                    }, {
                        correctAnswer: 1,
                        question: 'is it wrong?',
                        article: 'W:Hello2,may I help you?</br>M:Yes.</br>W:thank you!',
                        answer: ['b', 'n', 'm'],
                        knowledge: '互联网'
                    },
                    {
                        correctAnswer: 0,
                        question: "what's your name?",
                        article: 'W:Hello2,may I help you?</br>M:Yes.</br>W:thank you!',
                        answer: ['u', 'i', 'o'],
                        knowledge: '游戏'
                    }]
                },
                speak: {
                    title: '二、朗读短文',
                    tip: '你将有一分钟时间......',
                    score: 8,
                    children: [{
                        allScore: 3.0,
                        voice: 'http://www.uukaola.com/web/resources/papers/9013c9679358439ba25184afc7a6fbd7/c85ccee2f4c240dca16bf66a7f538a52_Audio.mp3',
                        article: 'Hello,may I help you?thank you!Hello,may I help you?thank you!Hello,may I help you?thank you!Hello,may I help you?thank you!Hello,may I help you?thank you!Hello,may I help you?thank you!Hello,may I help you?thank you!'
                    }, {
                        allScore: 5.0,
                        voice: 'http://www.uukaola.com/web/resources/papers/9013c9679358439ba25184afc7a6fbd7/fc4728fa29224d49aa5f678fb301cb9e_Audio.mp3',
                        article: 'balabalb,albala,balabal,balb,alab,alaba,lbal,balabalab,albalb,alabalab,albal,balaba,labalba,balalb,baba,bab,bababa,ba...'
                    }]
                }
            };
            this.setState({
                dataSource,
                status: 'wait'
            });
            this.reduceTime();
        }, 2000);
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
            console.log('获取麦克风出错', '错误:', err);
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
        }, 1000);
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
        this.setState({
            status: 'write'
        });
    }
    play = () => {
        this.recorder.record();
        this.setState({
            recordIconState: 'pause'
        });
    }

    pause = () => {
        const { dataSource, questionIndex } = this.state;
        this.recorder.stop();
        this.recorder.exportWAV((blob) => {
            const url = URL.createObjectURL(blob);
            console.log(url);
            this.setState({
                loading: true
            });
            message.loading('正在评分,请稍后..', 10000000000000);
            setTimeout(() => {
                const oldDataSource = { ...dataSource };
                const child = oldDataSource.speak.children[questionIndex];
                child.myVoice = url;
                child.myScore = (Math.random() * child.allScore).toFixed(1);
                this.setState({
                    dataSource: oldDataSource,
                    loading: false
                });
                message.destroy();
                message.success('评分成功');
            }, 2000);
        });
        this.recorder.clear();
        this.setState({
            recordIconState: 'play'
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
        const { number, dataSource, loading, questionType, questionIndex, recordIconState } = this.state;
        const parent = dataSource && dataSource[questionType];
        if (status === 'download') {
            return (
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
        }
        if (!parent) {
            return <div></div>;
        }
        const child = parent && parent.children[questionIndex];
        const options = child.answer && child.answer.map((v, i) => {
            if (child.selectAnswer === i) {
                return (
                    <Radio key={v + i.toString()} className="radio-item green" value={i}>
                        {`${String.fromCharCode(i + 65)}. ${v}`}
                        <Icon className="yes" type="check" />
                    </Radio>
                );
            }
            return <Radio key={v + i.toString()} className="radio-item" value={i}>{`${String.fromCharCode(i + 65)}. ${v}`}</Radio>
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
                {
                    questionIndex === 0 ?
                        (
                            <div className="voice-wrap">
                                <Button onClick={() => { this.playAudio(parent.voice); }} icon="sound">原文播放</Button>
                            </div>
                        ) : ''
                }
                <div className="answer-wrap">
                    <span className="index">{questionIndex + 1}.</span>
                    <div className="radio-wrap">
                        <RadioGroup value={child.selectAnswer} onChange={this.handleSelect}>
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
                        <p><span className="sound-label">[听力原文]</span><Icon onClick={() => { this.playAudio(parent.voice) }} className="sound" type="sound" /></p>
                        <p dangerouslySetInnerHTML={{ __html: child.article }}></p>
                    </div>
                    <div className="content-bottom">
                        <h2 className="index">{questionIndex + 1}.{child.question}</h2>
                        <div className="radio-wrap">
                            <RadioGroup value={child.selectAnswer} onChange={this.handleSelect}>
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
                                    <div onClick={this.play} className="icon-wrap">
                                        <img src={recordIcon} alt="" />
                                    </div>
                                )
                                :
                                (
                                    <Icon onClick={this.pause} className="stop" type="pause-circle" />
                                )
                        }
                    </div>
                </div>
            </div>
        );
        const speakAnswerContent = (
            <div className="speak-answer-content-wrap">
                <div className="answer-title">
                    <h2>答案解析</h2>
                </div>
                <div className="answer-content-container">
                    <div className="content-top">
                        <p>
                            <span dangerouslySetInnerHTML={{ __html: child.article }} />
                            <Icon onClick={() => { this.playAudio(child.voice) }} className="sound" type="sound" />
                        </p>
                    </div>
                    <div className="content-bottom">
                        <p className="answer">
                            <Icon type="user" />
                            <span>我的答案：</span>
                            {
                                child.myVoice ?
                                    <Icon className="sound" onClick={() => { this.playAudio(child.myVoice) }} className="sound" type="sound" />
                                    : ''
                            }
                        </p>
                        <p className="score">
                            <Icon type="clock-circle-o" />
                            <span>得分/总分：</span>
                            <span className="my-score">{child.myScore}</span>
                            <span className="link">/</span>
                            <span className="all-score">{child.allScore}</span>
                        </p>
                    </div>
                    <div className="back-wrap">
                        <Button onClick={this.backToWrite} icon="rollback">返回练习</Button>
                    </div>
                </div>

            </div>
        );


        switch (status) {
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
                    <Spin spinning={loading}>
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
                    </Spin>
                );
            case 'upload': return (
                <div className="loading-wrap">
                    <div>
                        <img src={end} alt="" />
                    </div>
                    <div className="spin-wrap">
                        <span style={{ marginLeft: 5 }}>恭喜您通过了该测验!</span>
                    </div>
                </div>
            );
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