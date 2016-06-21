//all import statements must go at the top of the file.
import React from 'react';
import Board from './board';
import Controls from './controls';

import "./stylesheets/reset.css";
import "./stylesheets/application.scss";



//get the content DOMElement create in index.html


class Main extends React.Component {

    constructor({ size, interval, max_cursors }) {
        super({ interval, max_cursors });
        this.state = { size, time: -1 }
    }


    render() {
        return <div id="react-application">
                <Board size={ this.state.size } max_cursors={ this.props.max_cursors } time={ this.state.time } />
                <Controls control={this}/>
            </div>;
    }

    time = (maybe_time) => {
        if(_(maybe_time).isNumber()) {
            this.setState({ time: maybe_time });
            return this;
        } else {
            return this.state.time
        }
    };

    reset = () => {
        this.time(-1)
    };

    step = () => {
        var time = this.time() + 1;
        this.time(this.time() + 1);
    };

    play = () => {
        if(!this.loop)
            this.loop = setInterval(() => { this.step() }, this.props.interval);
    };

    stop = () => {
        if(this.loop)
            clearInterval(this.loop);
            this.loop = null;
    }

    setSize = (maybe_size) => {
        if(!maybe_size) {
            this.setState({ size: 7, time: -1 });
        } else {
            this.setState({ size: maybe_size, time: -1 });
        }


    }

}

$(document).ready(() => {
    React.render(<Main size={5} max_cursors={3} interval={300} />, document.body);
});