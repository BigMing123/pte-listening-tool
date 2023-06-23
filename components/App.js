import { h, Component } from '../lib/preact.js';
import htm from '../lib/htm.js';
import SentenceCutter from './routes/SentenceCutter/SentenceCutter.js';
import AssignAudioToChunk from './routes/AssignAudioToChunk/AssignAudioToChunk.js';
import SentenceCatelogue from './routes/SentenceCatelogue/SentenceCatelogue.js';
import PracticeSentence from './routes/PracticeSentence/PracticeSentence.js';
import page from "../lib/page.mjs";

const html = htm.bind(h);

class App extends Component {
    constructor() {
        super();
        this.state = { 
            route: SentenceCatelogue
        };

        // console.log(signal)

        //设置页面路径
        page.base("/#");
        page();

        page('/sentence-cutter', () => {
            this.setState({route: SentenceCutter});
        });

        page('/assign-audio-to-chunk', () => {
            this.setState({route: AssignAudioToChunk});
        });

        page('/sentence-catelogue', () => {
            this.setState({route: SentenceCatelogue});
        });

        page('/practice-sentence', () => {
            this.setState({route: PracticeSentence});
        });

    }

    render() {
        return html`
            <div>
                <header id="header">
                    <sl-tab-group>
                        <sl-tab slot="nav" panel="custom">精听练习</sl-tab>
                        <sl-tab slot="nav" panel="account">账号</sl-tab>
                        <sl-tab slot="nav" panel="policy">使用条款</sl-tab>
                    </sl-tab-group>
                </header>
                <${this.state.route} />
            </div>
        `;
    }
}

export default App;