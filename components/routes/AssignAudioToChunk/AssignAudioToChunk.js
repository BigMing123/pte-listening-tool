import { h, Component } from '../../../lib/preact.js';
import page from "../../../lib/page.mjs";
import htm from '../../../lib/htm.js';
import { sentenceInfo, sentenceList } from '../../../js/globalvar.js';

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
            disabled : true
        };

        this.audio = new Audio(sentenceInfo.mediaURL);
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
        const wordIndexChunks = sentenceInfo.wordIndexChunks;
        const words = sentenceInfo.englishText.split(" ");
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
        sentenceInfo.audioStopTimes = this.audioStopTimes;
        sentenceInfo.wordChunks = this.getWordChunksAndLength()[0];
        sentenceInfo.sentenceLen = sentenceInfo.englishText.split(" ").length;
        console.log(sentenceInfo)
        let jsonFile = new File([JSON.stringify(sentenceInfo)], {type: "application/json"});
        this.downloadFile(sentenceInfo.sentenceId, jsonFile)
        page.redirect("/sentence-catelogue");

        // for (let i = 0; i < sentenceList.length; i++) {
        //     if (sentenceList[i].sentenceId == sentenceInfo.sentenceId) {
        //         sentenceList[i].audioStopTimes = this.audioStopTimes;
        //         sentenceList[i].wordIndexChunks = sentenceInfo.wordIndexChunks;
        //         sentenceList[i].wordChunks = this.getWordChunksAndLength()[0];
        //         console.log(sentenceList[i]);
        //         page.redirect("/sentence-catelogue");
        //     }
        // }
        
    }

    downloadFile(filename,f) {
        var hiddenElement = document.createElement('a');
        hiddenElement.href = URL.createObjectURL(f);
        hiddenElement.target = '_blank';
        hiddenElement.download = filename + ".json";
        hiddenElement.click();
    }

    render() {
        return html`
            <div>
                <div id="assign-audio-to-chunk" style="display:flex; flex-direction:column; margin:3%; padding:3%;">
                    <span class="title">Edit the audio to fit the chunks.</span>
                    <div class="text-display">
                        <span>${this.state.wordChunks[this.state.currentChunk]}</span>
                    </div>
                    <div class="footer">
                        <button onClick="${e => {this.reDo()}}">Redo</button>
                        <button class="start-btn" onClick="${e => {this.start()}}">${this.state.startBtnText}</button>
                        <button onClick="${e => {this.goNext()}}" disabled=${this.state.disabled}>${this.state.nextBtnText}</button>      
                    </div>
                </div>
            </div>
        `
    }
}

export default AssignAudioToChunk;