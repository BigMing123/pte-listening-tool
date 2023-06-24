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
            editorEnable : false,
            createSentence : false,
            submitSentences : false,
            sentenceAreaValue : ""
        };
    }
    
    // Lifecycle: Called whenever our component is created
    componentDidMount() {
        let textarea = document.getElementById("sentence-textarea");
        textarea.addEventListener("sl-change", (e) => {
            this.setState({sentenceAreaValue : e.target.value});
        })
    }
    
    // Lifecycle: Called just before our component will be destroyed
    componentWillUnmount() {
    }

    copyText(value) {
        navigator.clipboard.writeText(value);
    }

    hideTooltip(target) {
        console.log(target)
        setTimeout(e => {
            target.hide();
        }, 1000)
    }

    displaySentences() {
        let that = this;
        return html`
            <ul>
                ${
                    sentenceList.map(function(sentence) {
                        return html`
                            <li class="${that.difficultyOutput(sentence.englishText)}">
                                <div class="left">
                                    <span class="content">${sentence.englishText}</span>
                                    <div class="sub-content">长度：${that.difficultyOutput(sentence.englishText)}</div>
                                </div>
                                <div class="right">
                                    ${that.editorBtns(sentence)}
                                    <sl-button onclick="${e => {that.goPracticeSentence(sentence)}}" class="practice-btn" variant="primary">练习</sl-button>
                                </div>
                            </li>`;
                    })
                }
            </ul>
        `
    }

    createNewSentence(e) {
        if (!this.state.createSentence) {
            this.setState({createSentence: true});
        } else
            this.setState({createSentence: false, submitSentences: false ,sentenceAreaValue: ""});
    }

    submitSentences(e) {
        if (!this.state.sentenceAreaValue)
            return;

        if (!this.state.submitSentences )
            this.setState({submitSentences : true});
        else {
            console.log("submitted");
            this.setState({submitSentences : false});
        }
    }

    displaySubmitSentences() {
        if (!this.state.sentenceAreaValue)
            return;
        this.sentences = this.state.sentenceAreaValue.split("\n");
        let that = this;
        return html`
            <ul>
                ${
                    this.sentences.map(function(sentence) {
                        return html`
                            <li>
                                <div class="left">
                                    <span class="content">${sentence}</span>
                                    <div class="sub-content">长度：${that.difficultyOutput(sentence)}</div>
                                </div>
                                <div class="right">
                                    <sl-button onclick="${e => console.log("deleted")}" class="practice-btn" variant="danger">删除</sl-button>
                                </div>
                            </li>`;
                    })
                }
            </ul>
        `
    }

    goEditSentenceText() {
        alert("功能开发中");
    }

    editorBtns(sentence) {
        if (this.state.editorEnable) {
            return html`
                <sl-button onclick="${e => {this.goEditSentenceText()}}" 
                           class="practice-btn" 
                           variant="primary" 
                           outline>
                    文本
                </sl-button>
                <sl-button onclick="${e => {alert("功能开发中")}}" 
                           class="practice-btn" 
                           variant="primary" 
                           outline>
                    音频
                </sl-button>
                <sl-button onclick="${e => {this.goSentenceCutter(sentence.sentenceId)}}" 
                           class="practice-btn" 
                           variant="primary" 
                           outline>
                    切割
                </sl-button>
            `
        } 
    }

    difficultyOutput(englishSen) {
        if (englishSen) {
            let senLen = englishSen.split(" ").length;
            let levelIndex = 0;
            return senLen;
        }
        else
            return "";
        // let colorList = ['c-d69824', 'c-d64224', 'c-0c249c', 
        //                  'c-a31297', 'c-0c7f9c', 'c-5b12a3', 'c-339c0c'];
        // let difficultyWord = ['level 1', 'level 2', 'level 3', 'level 4', 'level 5', 'level 6', 'level 7'];
        // if (senLen > 6 && senLen <= 8) 
        //     levelIndex = 1;
        // else if (senLen > 8 && senLen <= 11)
        //     levelIndex = 2;
        // else if (senLen > 11 && senLen <= 14)
        //     levelIndex = 3;
        // else if (senLen > 14 && senLen <= 16)
        //     levelIndex = 4;
        // else if (senLen > 16 && senLen <= 18)
        //     levelIndex = 5;
        // else if (senLen > 18)
        //     levelIndex = 6;
        // return [colorList[levelIndex], difficultyWord[levelIndex]];
    }

    goSentenceCutter(sentenceId) {
        console.log("sentenceId", sentenceId)
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
                <div id="sentence-catelogue-banner">
                    <div class="top">
                        <sl-badge variant="primary">2023.6.23更新</sl-badge>
                        <h2> PTE英语精听题库练习专用</h2>
                        <span>以意群为基础，采用独特的渐进式与分段式精听模式，帮助高效提升听力</span>
                    </div>
                    <div class="bottom">
                        <sl-button class="left" variant="primary" href="#item-list" outline>开始练习</sl-button>
                        <sl-tooltip content="复制网址链接">
                            <sl-button onclick="${e => this.copyText(e.target.value)}" 
                                    value="${window.location.href}" 
                                    class="right" variant="primary" 
                                    outline>${window.location.href} <sl-icon name="link-45deg"></sl-icon></sl-button>
                        </sl-tooltip>
                    </div>
                </div>
                <div id="sentence-catelogue">
                    <div class="top">
                        <sl-breadcrumb class="left">
                            <sl-breadcrumb-item>
                                <sl-icon slot="prefix" name="house"></sl-icon>
                                精听题库
                            </sl-breadcrumb-item>
                            <sl-breadcrumb-item>PTE题库</sl-breadcrumb-item>
                        </sl-breadcrumb>
                        <sl-button onclick="${e => {this.enableEditor()}}"
                                   class="right" 
                                   variant="primary" 
                                   style="visibility:${this.state.createSentence ? "hidden" : ""}"
                                   outline>
                            ${this.state.editorEnable?"关闭":"开启"}编辑模式
                        </sl-button>
                        <sl-button onclick="${e => {this.createNewSentence(e)}}"
                                   class="right" 
                                   variant="primary" 
                                   outline>
                            ${this.state.createSentence ? "关闭" : "导入新句子"}
                        </sl-button>
                    </div>
                    <div class="item-list" id="item-list" style="display:${this.state.createSentence ? "none" : ""}">
                        ${this.displaySentences()} 
                    </div> 
                    <div class="create-sentence" id="create-sentence" style="display:${this.state.createSentence ? "" : "none"}">
                        <sl-textarea id="sentence-textarea"
                                     value="${this.state.sentenceAreaValue}" 
                                     placeholder="可上传多个句子，每句另起一行" 
                                     style="display:${this.state.submitSentences ? "none" : ""}"
                                     filled>
                        </sl-textarea>
                        <div class="item-list" style="display:${this.state.submitSentences ? "" : "none"}">
                            ${this.displaySubmitSentences()} 
                        </div> 
                        <sl-button onclick="${e => {this.submitSentences(e)}}"
                                   class="upload-btn" 
                                   variant="primary">
                            ${this.state.submitSentences ? "上传" : "提交"}
                        </sl-button>
                    </div>
                </div>
            </div>
        `
    }
}

export default SentenceCatelogue;