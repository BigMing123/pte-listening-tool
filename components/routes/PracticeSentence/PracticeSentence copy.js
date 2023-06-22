import { h, Component } from '../../../lib/preact.js';
import page from "../../../lib/page.mjs";
import htm from '../../../lib/htm.js';
import { sentenceInfo } from '../../../js/globalvar.js';

const html = htm.bind(h);

class PracticeSentence extends Component {
    constructor() {
        super();
        this.state = { 
            wordChunks: [],
            wordChunksLength: 0,
            currentChunk: 0,
            startBtnText: "Start",
            nextBtnText: "Next",
            answerDisplayed: "",
            disabled : true
        };

        this.audio = new Audio(sentenceInfo.mediaURL);
        this.audioStartTime = 0;
        this.audioStopTime = 0;
    }
    
    // Lifecycle: Called whenever our component is created
    componentDidMount() {
        let [wordChunks, length] = this.getWordChunksAndLength();
        this.setState({wordChunks: wordChunks, wordChunksLength: length});
    }
    
    // Lifecycle: Called just before our component will be destroyed
    componentWillUnmount() {
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

    displayWordChunks() {
        return html`
            ${wordChunks[currentChunkIndex]}
        `
    }

    prepareOptions() {
        let wordChunks = this.state.wordChunks;
        let stopTimes = sentenceInfo.audioStopTimes;
        let combinations = [];
        let testComb = [];
        stopTimes = [1.239218, 2.056911, 3.792];
        wordChunks = ['It is expected', 'that all students', 'have their own laptops.'];

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
            combinations.push({ "text": wordChunks[i], "startStopAt": [startTime, stopTime], "mark": JSON.stringify(i+1) });
        }

        for (let i = 0; i < wordChunks.length; i++) {
            let combChunk = [];
            let mark = "";
            if (i > 0) {
                for (let j = 0; j <= i; j++) {
                    combChunk.push(wordChunks[j]);
                    mark += JSON.stringify(j+1);
                }
                testComb.push(combChunk.join(" "))
                combinations.push({ "text": combChunk.join(" "), "startStopAt": [0, stopTimes[i]], "mark": mark });
            }
        }

        return combinations;
    }

    displayOptionToPlay() {
        let options = this.prepareOptions();
        let that = this;
        return html`
        ${
            options.map(function(option) {
                return html`<button onClick="${e => {that.playChunks(option)}}">${option.mark}</button>`;
            })
        }
        `
    }

    playChunks(option) {
        this.setState({answerDisplayed: option.text});
        this.playChunksAudio(option.startStopAt);
    }

    goCatelogue() {
        page.redirect("/sentence-catelogue");
    }

    playChunksAudio(startStopAt) {
        let startTime = startStopAt[0];
        let stopTime = startStopAt[1];
        this.audio.currentTime = startTime;

        this.audio.play();
        let handle = setInterval(() => {
            if(this.audio.currentTime >= stopTime){
                this.audio.pause();
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
                <div id="practice-sentence" style="display:flex; flex-direction:column; margin:3%; padding:3%;">
                    <span class="title"></span>
                    <div class="text-buttons">
                        ${this.state.answerDisplayed} 
                    </div>
                    <div class="footer">
                        <button onClick="${e => {this.goCatelogue()}}">返回</button>  
                        ${this.displayOptionToPlay()}
                        <!-- <button onClick="${e => {this.goNextPage()}}" disabled=${this.state.disabled}>选项3</button>       -->
                    </div>
                </div>
            </div>
        `
    }
}

export default PracticeSentence;