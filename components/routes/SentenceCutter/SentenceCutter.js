import { h, Component } from '../../../lib/preact.js';
import page from "../../../lib/page.mjs";
import htm from '../../../lib/htm.js';
import globalVar from '/js/globalvar.js';

const html = htm.bind(h);

class SentenceCutter extends Component {
    constructor() {
        super();
        this.state = { 
            selectedIndexes : [],
            indexChunkGroups : [],
            disabled : true
        };
    }
    
    // Lifecycle: Called whenever our component is created
    componentDidMount() {
        this.loadMedia(globalVar.sentenceInfo.mediaURL);
    }
    
    // Lifecycle: Called just before our component will be destroyed
    componentWillUnmount() {
    }

    loadMedia(url) {
        let a = document.getElementById("audio")
        document.getElementById("as").setAttribute("src", url);
        a.load();
    }

    wordSelection(e) {
        let selectedWordIndex = parseInt(e.target.className);
        let selectedIndexes = [];
        let chunkGroups = this.state.indexChunkGroups;
        let lastChunk = chunkGroups[chunkGroups.length - 1];

        let lastChunkIndex = -1;
        if (lastChunk)
            lastChunkIndex = lastChunk[lastChunk.length - 1];

        if (selectedWordIndex <= lastChunkIndex)
            return;
    
        for (let i = lastChunkIndex+1; i < selectedWordIndex+1; i++) {
            selectedIndexes.push(i);
        }

        chunkGroups.push(selectedIndexes);
        this.setState({ indexChunkGroups : chunkGroups }, () => {
            this.triggerNextButton();
        });
    }

    selected(index) {
        let colorList = ['c-d69824', 'c-d64224', 'c-0c249c', 
                         'c-a31297', 'c-0c7f9c', 'c-5b12a3', 'c-339c0c'];
        let chunkGroups = this.state.indexChunkGroups;
        for (let i = 0; i < chunkGroups.length; i++) {
            if (chunkGroups[i].includes(index)) {
                let color = i % 7;
                return " " + colorList[color];
            }
        }
        return "";
    }

    displayWords() {
        let words = globalVar.sentenceInfo.englishText.split(" ");
        let index = -1;
        let that = this;
        return html`
            ${
                words.map(function(word) {
                    index++;
                    return html`<a class="${index}${that.selected(index)}" 
                                   onclick="${e=>{that.wordSelection(e)}}">${word} </a>`;
                })
            }
        `
    }

    triggerNextButton() {
        let words = globalVar.sentenceInfo.englishText.split(" ");
        let chunkGroups = this.state.indexChunkGroups;
        let lastChunk = chunkGroups[chunkGroups.length - 1];
        let lastChunkIndex = 0;
        if (lastChunk)
            lastChunkIndex = lastChunk[lastChunk.length - 1];
        if (lastChunkIndex && lastChunkIndex == words.length - 1) {
            this.setState({disabled : false})
        } else {
            this.setState({disabled : true})
        }
    }

    goCatelogue() {
        page.redirect("/sentence-catelogue");
    }

    reDo() {
        this.setState({indexChunkGroups : []}, () => this.triggerNextButton());
    }

    goNextPage() {
        globalVar.sentenceInfo.wordIndexChunks = this.state.indexChunkGroups;
        page.redirect("/assign-audio-to-chunk");
    }

    render() {
        return html`
            <div>
                <div id="sentence-cutter" style="display:flex; flex-direction:column; margin:3%; padding:3%;">
                    <span class="title">Click on the words to split sentence.</span>
                    <audio id="audio" controls>
                        <source id="as" src="#" type="audio/mpeg" />
                    </audio>
                    <div class="text-buttons">
                        ${this.displayWords()} 
                    </div>
                    <div class="footer">
                        <button onClick="${e => {this.goCatelogue()}}">Return</button>  
                        <button onClick="${e => {this.reDo()}}">Redo</button>
                        <button onClick="${e => {this.goNextPage()}}" disabled=${this.state.disabled}>Next</button>      
                    </div>
                </div>
            </div>
        `
    }
}

export default SentenceCutter;