//all import statements must go at the top of the file.
import React from 'react';
import Board from './board';
import Controls from './controls';
import SizeModal from './size_modal';

import "./stylesheets/reset.css";
import "./stylesheets/application.scss";


// Preload the sound.
import click from './click.wav';
var sound = new Audio(click);


class ClientTop extends React.Component {

    constructor({ size, interval, max_cursors }) {
        super({ interval, max_cursors });
        this.state = { size, size_modal: false, time: -1 }
    }


    render() {
        if(this.state.size_modal) {
            return <div id="react-application">
                    <SizeModal current_size={ this.state.size } set_size={ this.set_size } />
                    <Board size={ this.state.size } max_cursors={ this.props.max_cursors } time={ this.state.time } />
                    <Controls control={this}/>
                </div>;
        } else {
            return <div id="react-application">
                    <Board size={ this.state.size } max_cursors={ this.props.max_cursors } time={ this.state.time } />
                    <Controls control={this}/>
                </div>;
            
        }
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
        ClientTop.play_sound()
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

    set_size = (maybe_size) => {
        if(!maybe_size) {
            this.setState({ size_modal: true })
        } else {
            this.setState({ size: maybe_size, size_modal: false, time: -1 });
        }


    }

}

ClientTop.play_sound = () => {
    sound.play();
}

$(document).ready(() => {
    React.render(<ClientTop size={5} max_cursors={3} interval={600} />, document.body);
});