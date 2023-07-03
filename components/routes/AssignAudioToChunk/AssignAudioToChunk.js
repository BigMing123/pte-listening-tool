import { h, Component } from '../../../lib/preact.js';
import page from "../../../lib/page.mjs";
import htm from '../../../lib/htm.js';
import globalVar from '/js/globalvar.js';

const html = htm.bind(h);

class AssignAudioToChunk extends Component {
    constructor() {
        super();
        this.state = { 
            wordChunks: [],
            wordChunksLength: 0,
            currentChunk: 0,
            startBtnText: "Start",
            nextBtnText: "Next",
            disabled : true,
            playSpeed : 1.0,
            submitting : false
        };

        this.audio = new Audio(globalVar.sentenceInfo.mediaURL);
        this.audioStartTime = 0;
        this.audioStopTime = 0;
        this.audioStopTimes = [];
    }
    
    // Lifecycle: Called whenever our component is created
    componentDidMount() {
        let [wordChunks, length] = this.getWordChunksAndLength();
        this.setState({wordChunks: wordChunks, wordChunksLength: length});
    }
    
    // Lifecycle: Called just before our component will be destroyed
    componentWillUnmount() {
    }

    playMedia(url) {
        let audio = new Audio(url);
        audio.play();
    }

    convertIndexToStringChunks(wordIndexChunks, words) {
        let wordChunks = [];
        let tmpChunk = "";
        for (let i = 0; i < wordIndexChunks.length; i++) {
            for (let j = 0; j < wordIndexChunks[i].length; j++) {
                let word = words[wordIndexChunks[i][j]];
                tmpChunk += word + " ";
            }
            wordChunks.push(tmpChunk.trim());
            tmpChunk = "";
        }
        return wordChunks;
    }

    getWordChunksAndLength() {
        const wordIndexChunks = globalVar.sentenceInfo.wordIndexChunks;
        const words = globalVar.sentenceInfo.englishText.split(" ");
        let wordChunks = this.convertIndexToStringChunks(wordIndexChunks, words);
        let length = wordChunks.length;
        return [wordChunks, length];
    }

    displayFixedWords() {
        return html`
            <span>${this.state.wordChunks[this.state.currentChunk]}</span>
        `
    }

    reDo() {
        this.audio.currentTime = this.audioStartTime;
        this.setState({disabled: true, startBtnText: "Start"});
    }

    start() {
        if (this.state.startBtnText === "Start") {
            this.setState({startBtnText: "Stop"});
            this.audio.play();
        } else if (this.state.startBtnText === "Stop"){
            this.audioStopTime = this.audio.currentTime;
            this.audio.pause();
            this.setState({startBtnText: "Play", disabled: false});
        } else if (this.state.startBtnText === "Play") {
            this.audio.currentTime = this.audioStartTime;
            this.audio.play();
            let handle = setInterval(() => {
                if(this.audio.currentTime >= this.audioStopTime){
                    this.audio.pause();
                    clearInterval(handle);
                }
            }, 100);
        }
    }

    goNext() {
        this.audioStopTimes.push(this.audioStopTime);
        this.audioStartTime = this.audioStopTime;
        this.audio.currentTime = this.audioStartTime;
        if (this.state.currentChunk < this.state.wordChunksLength - 1) {
            this.setState({startBtnText: "Start", currentChunk: this.state.currentChunk + 1, disabled: true},() => {
                if (this.state.currentChunk == this.state.wordChunksLength - 1) 
                    this.setState({nextBtnText: "Submit"});
            });
        } else {
            this.submit();
        }
    }

    submit() {
        this.setState({submitting: true});
        globalVar.sentenceInfo.audioStopTimes = this.audioStopTimes;
        globalVar.sentenceInfo.wordChunks = this.getWordChunksAndLength()[0];
        globalVar.sentenceInfo.sentenceLen = globalVar.sentenceInfo.englishText.split(" ").length;
        faunaEditSentence(globalVar.sentenceInfo)
        .then(res => {
            for (let i = 0; i < globalVar.globalSentences.length; i++) {
                let sen = globalVar.globalSentences[i];
                if (typeof sen.dbId && sen.dbId === globalVar.sentenceInfo.dbId)
                    globalVar.globalSentences[i] = globalVar.sentenceInfo;
            }
            this.setState({submitting: false});
            page.redirect("/sentence-catelogue");
        })
    }

    downloadJSON(sentenceInfo) {
        let jsonFile = new File([JSON.stringify(globalVar.sentenceInfo)], {type: "application/json"});
        this.downloadFile(sentenceInfo.sentenceId, jsonFile);
    }

    downloadFile(filename,f) {
        var hiddenElement = document.createElement('a');
        hiddenElement.href = URL.createObjectURL(f);
        hiddenElement.target = '_blank';
        hiddenElement.download = filename + ".json";
        hiddenElement.click();
    }

    displayPlaySpeed() {
        return html`
            <sl-dropdown class="playspeed" value="${this.state.playSpeed}">
                <sl-button slot="trigger" caret>
                    播放速度 ${"X" + this.state.playSpeed}
                </sl-button>
                <sl-menu>
                    <sl-menu-item value="0.4" onclick="${e => {this.setPlaySpeed(e.target.value)}}">0.4</sl-menu-item>
                    <sl-menu-item value="0.6" onclick="${e => {this.setPlaySpeed(e.target.value)}}">0.6</sl-menu-item>
                    <sl-menu-item value="0.8" onclick="${e => {this.setPlaySpeed(e.target.value)}}">0.8</sl-menu-item>
                    <sl-menu-item value="1.0" onclick="${e => {this.setPlaySpeed(e.target.value)}}">1.0</sl-menu-item>
                    <sl-menu-item value="1.2" onclick="${e => {this.setPlaySpeed(e.target.value)}}">1.2</sl-menu-item>
                </sl-menu>
            </sl-dropdown>
        `;
    }

    setPlaySpeed(value) {
        this.setState({playSpeed: parseFloat(value)}, () => {
            this.audio.playbackRate = this.state.playSpeed;
        });
    }

    render() {
        return html`
            <div>
                <div id="assign-audio-to-chunk" style="display:flex; flex-direction:column; margin:3%; padding:3%;">
                    ${this.displayPlaySpeed()}
                    <span class="title">Edit the audio to fit the chunks.</span>
                    <div class="text-display">
                        <span>${this.state.wordChunks[this.state.currentChunk]}</span>
                    </div>
                    <div class="footer">
                        <button onClick="${e => {this.reDo()}}">Redo</button>
                        <button class="start-btn" onClick="${e => {this.start()}}">${this.state.startBtnText}</button>
                        <button style="display:${this.state.submitting ? "none":""}" 
                                onClick="${e => {this.goNext()}}" 
                                disabled=${this.state.disabled}>
                                ${this.state.nextBtnText}
                        </button> 
                        <sl-spinner class="spinner" style="display:${this.state.submitting ? "":"none"}"></sl-spinner>
                    </div>
                </div>
            </div>
        `
    }
}

export default AssignAudioToChunk;