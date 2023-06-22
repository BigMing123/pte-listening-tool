import { h, Component, render } from '../lib/preact.js';
import page from "../lib/page.mjs";
import htm from '../lib/htm.js';
import globalVar from "../js/globalvar.js";

const html = htm.bind(h);

class AudioEditorOne extends Component {
    constructor(props) {
        super();
        this.state = { 
            taValue : ""
        };
    }
    
    // Lifecycle: Called whenever our component is created
    componentDidMount() {
    }
    
    // Lifecycle: Called just before our component will be destroyed
    componentWillUnmount() {
    }

    downloadFile(f) {
        var hiddenElement = document.createElement('a');
        hiddenElement.href = encodeURI(f);
        hiddenElement.target = '_blank';
        hiddenElement.download = 'example.mp3';
        hiddenElement.click();
    }

    loadMedia(url) {
        let a = document.getElementById("audio")
        document.getElementById("as").setAttribute("src", url);
        a.load();
    }

    handleTAChange(e) {
        this.setState({ taValue: e.target.value });
    };

    goNextPage() {
        // getSpeech(this.state.taValue)
        // .then(mediaURL => {
        //     this.downloadFile(mediaURL);
        //     this.playMedia(mediaURL);
        //     globalVar.englishText = this.state.taValue;
        // });
        globalVar.englishText = this.state.taValue;
        page.redirect("/sentence-cutter");
    }

    goPreviousPage() {
        page.redirect("/editortwo");
    }

    render() {
        return html`
            <div>
                <div id="text-to-speech" style="display:flex; flex-direction:column; margin:3%; padding:3%;">
                    <textarea 
                        style="height:100px" 
                        placeholder="Place an English sentence here"
                        value=${this.state.taValue}
                        onInput=${e => {this.handleTAChange(e)}}
                    >
                    </textarea>
                    <div class="footer">
                        <button onClick="${e => {this.goPreviousPage()}}">Previous</button>  
                        <button onClick="${e => {this.goNextPage()}}" disabled=${this.state.disabled}>Next</button>      
                    </div>
                </div>
            </div>
        `
    }
}

export default AudioEditorOne;