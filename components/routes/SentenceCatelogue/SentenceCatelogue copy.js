import { h, Component } from '../../../lib/preact.js';
import page from "../../../lib/page.mjs";
import htm from '../../../lib/htm.js';
import { sentenceInfo } from '../../../js/globalvar.js';
// import { rsSentences, wfdSentences, globalSentences, displayCate } from '/data/sentence-data.js';
import globalVar from '/js/globalvar.js';


const html = htm.bind(h);

class SentenceCatelogue extends Component {
    constructor() {
        super();
        this.state = { 
            currentCategory : "wfd_unpublished",
            currentCategoryText : "WFD真题题库",
            editorEnable : true,
            createSentence : false,
            submitSentences : false,
            sentenceAreaValue : "",
            sentenceList : []
        };
    }

    // Lifecycle: Called whenever our component is created
    componentDidMount() {
        this.setupTextAreaListener();
        this.setupSentences();
    }
    
    // Lifecycle: Called just before our component will be destroyed
    componentWillUnmount() {
    }

    addSentencesToDB() {
        sentenceList.map(sentence => {
            faunaAddSentence(sentence)
            .then(res => {
            })
            .catch(err => {
                console.log(err)
            })
        })
    }

    fetchSentencesByCategory(cate) {
        faunaGetSentencesByCategory(cate).then(res => {
            globalVar.globalSentences = res.data;
            this.getSentences();
        })
        .catch(err => {
            console.log(err)
        })
    }

    getSentences() {
        this.setState({sentenceList: globalVar.globalSentences});
    }

    setupSentences() {
        if (globalVar.globalSentences.length > 0) {
            this.getSentences();
        }
        else
            this.fetchSentencesByCategory(this.state.currentCategory);
    }

    setupTextAreaListener() {
        let textarea = document.getElementById("sentence-textarea");
        textarea.addEventListener("sl-change", (e) => {
            this.setState({sentenceAreaValue : e.target.value});
        })
    }

    copyText(value) {
        navigator.clipboard.writeText(value);
    }

    hideTooltip(target) {
        setTimeout(e => {
            target.hide();
        }, 1000)
    }

    displaySentences() {
        let that = this;
        let i = 0;
        return html`
            <ul>
                ${
                    that.state.sentenceList.map(function(sentence) {
                        sentence = sentence.data;
                        i++;
                        return html`
                            <li class="${that.getSenLen(sentence.englishText)}">
                                <div class="left">
                                    <span class="content">${i}. ${sentence.englishText}</span>
                                    <div class="sub-content">长度：${that.getSenLen(sentence.englishText)}</div>
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
            console.log(this.submittedSentences);
            // this.setState({submitSentences : false});
        }
    }

    setCate(cate) {
        let text = ""
        if (cate == "wfd_unpublished")
            text = "WFD真题题库";
        else if (cate == "rs_unpublished")
            text = "RS真题题库";
        this.setState({
            currentCategory : cate,
            currentCategoryText : text
        })
        this.fetchSentencesByCategory(cate);
    }

    downloadSound(id, sen) {
        console.log(id, sen);
        getSpeech(sen).then(res => {
            this.downloadFile(id, res);
        });
    }

    downloadFile(fileName, file) {
        var hiddenElement = document.createElement('a');
        hiddenElement.href = encodeURI(file);
        hiddenElement.target = '_blank';
        hiddenElement.download = fileName + '.mp3';
        hiddenElement.click();
    }

    //测试函数
    // displaySubmitSentences() {
    //     if (!this.state.sentenceAreaValue)
    //         return;
    //     this.submittedSentences = [];
    //     let tempSens = this.state.sentenceAreaValue.split("\n");
    //     tempSens = tempSens.map(sen => {
    //         this.submittedSentences.push(this.processSen(sen));
    //     });
    //     let that = this;
    //     let no = 0;
    //     return html`
    //         <ul>
    //             ${
    //                 this.submittedSentences.map(function(sentence) {
    //                     let str = "rs_" + ++no;
    //                     return html`
    //                         <li>
    //                             <div class="left">
    //                                 <span class="content">${str} ${sentence}</span>
    //                                 <div class="sub-content">长度：${that.getSenLen(sentence)}</div>
    //                             </div>
    //                             <div class="right">
    //                                 <sl-button onclick="${e => that.downloadSound(str, sentence)}" class="practice-btn" variant="danger">删除</sl-button>
    //                             </div>
    //                         </li>`;
    //                 })
    //             }
    //         </ul>
    //     `
    // }

    // 原始函数
    displaySubmitSentences() {
        if (!this.state.sentenceAreaValue)
            return;
        this.submittedSentences = [];
        let tempSens = this.state.sentenceAreaValue.split("\n");
        tempSens = tempSens.map(sen => {
            this.submittedSentences.push(this.processSen(sen));
        });
        let that = this;
        return html`
            <ul>
                ${
                    this.submittedSentences.map(function(sentence) {
                        return html`
                            <li>
                                <div class="left">
                                    <span class="content">${sentence}</span>
                                    <div class="sub-content">长度：${that.getSenLen(sentence)}</div>
                                </div>
                                <div class="right">
                                    <sl-button onclick="${e => console.log(that.submittedSentences)}" class="practice-btn" variant="danger">删除</sl-button>
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
                <!-- <sl-button onclick="${e => {this.goEditSentenceText()}}" 
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
                </sl-button> -->
                <sl-button onclick="${e => {this.goSentenceCutter(sentence)}}" 
                           class="practice-btn" 
                           variant="primary" 
                           outline>
                    切割
                </sl-button>
            `
        } 
    }

    getSenLen(englishSen) {
        if (englishSen) {
            let senLen = englishSen.split(" ").length;
            return senLen;
        }
        else
            return "";
    }

    processSen(sentence) {
        let re = /[\w!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/g;
        let words = sentence.match(re);
        return words.join(" ");
    }

    goSentenceCutter(sentence) {
        sentenceInfo.englishText = sentence.englishText;
        sentenceInfo.mediaURL = sentence.mediaURL;
        sentenceInfo.sentenceId = sentence.sentenceId;
        sentenceInfo.category = sentence.category;
        page.redirect("/sentence-cutter");
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
                                    outline>${window.location.href} <sl-icon name="link-45deg"></sl-icon>
                            </sl-button>
                        </sl-tooltip>
                    </div>
                </div>
                <div id="sentence-catelogue">
                    <div class="top">
                        <sl-dropdown class="left dropdown">
                            <sl-button slot="trigger" caret>${this.state.currentCategoryText}</sl-button>
                            <sl-menu>
                                <sl-menu-item value="wfd_unpublished" onclick="${e => this.setCate(e.target.value)}">WFD真题题库</sl-menu-item>
                                <sl-menu-item value="rs_unpublished" onclick="${e => this.setCate(e.target.value)}">RS真题题库</sl-menu-item>
                            </sl-menu>
                        </sl-dropdown>
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
                        <!-- <sl-button onclick="${e => {this.addSentenceToDB()}}"
                                   class="right" 
                                   variant="primary" 
                                   outline>
                            测试
                        </sl-button> -->
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