import { h, Component } from '../../../lib/preact.js';
import page from "../../../lib/page.mjs";
import htm from '../../../lib/htm.js';
import { sentenceInfo } from '../../../js/globalvar.js';

const html = htm.bind(h);

class PracticeSentence extends Component {
    constructor() {
        super();
        this.state = { 
            volume: 8,
            startCounter: 3,
            audioProgress: 0,
            playCounter: -1,
            wordChunks: [],
            answerDisplayed: "",
            selectedOptionId: -1,
            hidden: "hidden",
            optionGroups : [[],[]],
            audioEnded: true
        };

        this.setupAudio();
    }

    setupAudio() {
        this.audioStartTime = 0;
        this.audioEndTime = 0;
        this.audio = new Audio(sentenceInfo.mediaURL);
        this.audio.onloadeddata = () => {
            this.setState({playCounter: Math.ceil(this.audio.duration)});
        };

        let intervalHandle = null;
        this.audio.onplay = () => {
            intervalHandle = setInterval(() => {
                let currentProgress = 0;
                if (this.audio.currentTime == this.audio.duration) {
                    currentProgress = 100;
                } else {
                    let currentDuration = this.audioEndTime - this.audioStartTime;
                    let timeProgress = this.audio.currentTime - this.audioStartTime;
                    currentProgress = (timeProgress / currentDuration) * 100;
                }
                this.setState({audioProgress : currentProgress});

                if (this.state.audioEnded) {
                    this.setState({audioProgress : 0});
                    if (this.state.hidden == "hidden") 
                        this.setState({hidden: ""});

                    clearInterval(intervalHandle);
                }

                console.log("counter keep going");
            }, 500);

        }
    }
    
    // Lifecycle: Called whenever our component is created
    componentDidMount() {
        this.setState({wordChunks: sentenceInfo.wordChunks, 
                       optionGroups: this.prepareOptions()});
        let handle = setInterval(() => {
            if (this.state.playCounter == -1)
                return;
    
            if (this.state.startCounter == 0) {
                this.audioStartTime = 0;
                this.audioEndTime = this.audio.duration;
                this.playChunksAudio([this.audioStartTime, this.audioEndTime]);
            } 
            if (this.state.startCounter > -1) {
                let newCounter = this.state.startCounter - 1;
                this.setState({startCounter: newCounter});
            } else if (this.state.playCounter > 0) {
                let newCounter = this.state.playCounter - 1;
                this.setState({playCounter: newCounter});
            } else {
                clearInterval(handle);
            }
        }, 1000);
    }

    // before render(). Return false to skip render
    shouldComponentUpdate(nextProps, nextState) {
    }
    
    // Lifecycle: Called just before our component will be destroyed
    componentWillUnmount() {
    }

    adjustVolume(value) {
        if (value) {
            this.setState({volume: parseInt(value)});
            let total = 11;
            this.audio.volume = value/total;
        }
    }

    prepareOptions() {
        let wordChunks = sentenceInfo.wordChunks;
        let stopTimes = sentenceInfo.audioStopTimes;
        let combinations = [[],[]];
        let testComb = [];
        let index = 0;

        for (let i = 0; i < wordChunks.length; i++) {
            let startTime = 0;
            let stopTime = 0;
            if (i == 0) {
                startTime = 0;
                stopTime = stopTimes[i];
            } else {
                startTime = stopTimes[i - 1];
                stopTime = stopTimes[i];
            }
            combinations[0].push({ "id": index, "text": wordChunks[i], "startStopAt": [startTime, stopTime], "mark": JSON.stringify(i+1) });
            index++;
        }

        for (let i = 0; i < wordChunks.length; i++) {
            let combChunk = [];
            let mark = "";
            for (let j = 0; j <= i; j++) {
                combChunk.push(wordChunks[j]);
                mark += JSON.stringify(j+1);
            }
            testComb.push(combChunk.join(" "))
            combinations[1].push({ "id": index, "text": combChunk.join(" "), "startStopAt": [0, stopTimes[i]], "mark": mark });
            index++;
        }
        return combinations;
    }

    displayOptionGrpOne() {
        let options = this.state.optionGroups[1];
        let that = this;
        return html`
            <sl-radio-group label="渐进式练习" name="a" value="${this.state.selectedOptionId}">
                ${
                    options.map(function(option) {
                        return html`
                                <sl-radio-button size="large" 
                                                 value="${option.id}" 
                                                 onClick="${e => {that.playChunks(option)}}" >
                                    意群：${option.mark}
                                </sl-radio-button>
                        `;
                    })
                }
            </sl-radio-group>
        `
    }

    displayOptionGrpTwo() {
        let options = this.state.optionGroups[0];
        let that = this;
        return html`
            <sl-radio-group label="分段练习" name="a" value="${this.state.selectedOptionId}">
                ${
                    options.map(function(option) {
                        return html`
                                <sl-radio-button size="large" 
                                                 value="${option.id}" 
                                                 onClick="${e => {that.playChunks(option)}}" >
                                    意群：${option.mark}
                                </sl-radio-button>
                        `;
                    })
                }
            </sl-radio-group>
        `
    }

    playChunks(option) {
        this.setState({answerDisplayed: option.text, selectedOptionId: option.id});
        this.playChunksAudio(option.startStopAt);
    }

    goCatelogue() {
        page.redirect("/sentence-catelogue");
    }

    playChunksAudio(startStopAt) {
        let startTime = startStopAt[0];
        let stopTime = startStopAt[1];
        this.audioStartTime = startTime;
        this.audioEndTime = stopTime;
        this.audio.currentTime = startTime;

        this.audio.play();
        this.setState({audioEnded: false});
        let handle = setInterval(() => {
            if(this.audio.currentTime >= stopTime){
                this.audio.pause();
                this.audio.currentTime = 0;
                this.setState({audioEnded: true});
                clearInterval(handle);
            }
        }, 100);
    }

    goNextPage() {
        sentenceInfo.wordIndexChunks = this.state.indexChunkGroups;
        page.redirect("/assign-audio-to-chunk");
    }

    render() {
        return html`
            <div>
                <div id="practice-sentence">
                    <div class="status-box">
                        <div class="status">
                            <span class="status-left">
                                Status:
                            </span>
                            <span class="status-right">
                                ${this.state.startCounter >= 0 ? "Beginning" : "Completing"} in ${this.state.startCounter >= 0 ? this.state.startCounter : this.state.playCounter} seconds.
                            </span>
                        </div>
                        
                        <div class="volume">
                            <span>Volume</span>
                            <div class="volume-bar">
                                <input type="range" 
                                       min="0" 
                                       max="10" 
                                       step="1"
                                       value=${this.state.volume}
                                       onchange=${e => this.adjustVolume(e.target.value)} 
                                       class="slider" />
                                <div class="scale">
                                    <div class="scale-long"></div>
                                    <div class="scale-short"></div>
                                    <div class="scale-short"></div>
                                    <div class="scale-short"></div>
                                    <div class="scale-short"></div>
                                    <div class="scale-short"></div>
                                    <div class="scale-short"></div>
                                    <div class="scale-short"></div>
                                    <div class="scale-short"></div>
                                    <div class="scale-short"></div>
                                    <div class="scale-long"></div>
                                </div>
                            </div>
                        </div>

                        <div class="progress-bar">
                            <progress max="100" value="${this.state.audioProgress}"></progress>
                        </div>
                    </div>

                    <div class="user-panel ${this.state.hidden}">
                        <div class="top">
                            ${this.displayOptionGrpOne()}
                            ${this.displayOptionGrpTwo()}
                        </div>
                        <div class="middle">
                        <sl-details summary="答案（点击展开）" disabled="${this.state.selectedOptionId==-1}">
                            ${this.state.answerDisplayed}
                        </sl-details>
                        </div>
                        <div class="bottom">
                            <sl-button variant="primary" onClick="${e => {this.goCatelogue()}}">
                                返回
                            </sl-button>  
                        </div>
                    </div>
                    
                </div>
            </div>
        `
    }
}

export default PracticeSentence;