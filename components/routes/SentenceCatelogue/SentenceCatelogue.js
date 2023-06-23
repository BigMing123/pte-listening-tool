import { h, Component } from '../../../lib/preact.js';
import page from "../../../lib/page.mjs";
import htm from '../../../lib/htm.js';
import { sentenceInfo, sentenceList } from '../../../js/globalvar.js';

const html = htm.bind(h);

class SentenceCatelogue extends Component {
    constructor() {
        super();
        this.state = { 
            selectedIndexes : [],
            indexChunkGroups : [],
            editorEnable : false
        };
    }
    
    // Lifecycle: Called whenever our component is created
    componentDidMount() {
    }
    
    // Lifecycle: Called just before our component will be destroyed
    componentWillUnmount() {
    }

    displaySentences() {
        let that = this;
        return html`
            <ul>
                ${
                    sentenceList.map(function(sentence) {
                        return html`
                            <li class="${that.difficultyOutput(sentence.englishText)[0]}">
                                <span>${sentence.sentenceId}</span>
                                <div>${that.difficultyOutput(sentence.englishText)[1]}</div>
                                ${that.editorBtns(sentence)}
                                <a onclick="${e => {that.goPracticeSentence(sentence)}}">练习</a>
                            </li>`;
                    })
                }
            </ul>
        `
    }

    editorBtns(sentence) {
        if (this.state.editorEnable) {
            return html`
                <a onclick="${() => alert("功能开发中")}">文本</a>
                <a onclick="${() => alert("功能开发中")}">音频</a>
                <a onclick="${e => {this.goSentenceCutter(sentence.sentenceId)}}">切割</a>
            `
        } 
    }

    difficultyOutput(englishSen) {
        let senLen = englishSen.split(" ").length;
        let levelIndex = 0;
        let colorList = ['c-d69824', 'c-d64224', 'c-0c249c', 
                         'c-a31297', 'c-0c7f9c', 'c-5b12a3', 'c-339c0c'];
        let difficultyWord = ['level 1', 'level 2', 'level 3', 'level 4', 'level 5', 'level 6', 'level 7'];
        if (senLen > 6 && senLen <= 8) 
            levelIndex = 1;
        else if (senLen > 8 && senLen <= 11)
            levelIndex = 2;
        else if (senLen > 11 && senLen <= 14)
            levelIndex = 3;
        else if (senLen > 14 && senLen <= 16)
            levelIndex = 4;
        else if (senLen > 16 && senLen <= 18)
            levelIndex = 5;
        else if (senLen > 18)
            levelIndex = 6;
        return [colorList[levelIndex], difficultyWord[levelIndex]];
    }

    goSentenceCutter(sentenceId) {
        for (let i = 0; i < sentenceList.length; i++) {
            if (sentenceList[i].sentenceId == sentenceId) {
                sentenceInfo.englishText = sentenceList[i].englishText;
                sentenceInfo.mediaURL = sentenceList[i].mediaURL;
                sentenceInfo.sentenceId = sentenceList[i].sentenceId;
                page.redirect("/sentence-cutter");
            }
        }
    }

    goPracticeSentence(sentence) {
        sentenceInfo.sentenceId = sentence.sentenceId;
        sentenceInfo.wordIndexChunks = sentence.wordIndexChunks;
        sentenceInfo.englishText = sentence.englishText;
        sentenceInfo.mediaURL = sentence.mediaURL;
        sentenceInfo.audioStopTimes = sentence.audioStopTimes;
        sentenceInfo.wordChunks = sentence.wordChunks;
        page.redirect("/practice-sentence");
    }

    enableEditor() {
        if (!this.state.editorEnable)
            this.setState({editorEnable: true});
        else
            this.setState({editorEnable: false});
    }

    render() {
        return html`
            <div>
                <div id="sentence-catelogue" style="display:flex; flex-direction:column; margin:3%; padding:3%;">
                    <span class="title">RS和WFD精听练习</span>
                    <div class="text-buttons">
                        ${this.displaySentences()} 
                    </div>
                    <div class="footer">
                        <button onClick="${e => {this.enableEditor()}}">${this.state.editorEnable?"关闭":"开启"}编辑模式</button>  
                    </div>
                </div>
            </div>
        `
    }
}

export default SentenceCatelogue;