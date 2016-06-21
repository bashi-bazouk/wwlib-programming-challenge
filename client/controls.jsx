import React from 'react';
import {Button, ButtonToolbar} from 'react-bootstrap'

class Controls extends React.Component {

    constructor(props) {
        super(props)
        this.state = { }
    }

    render() {
        return <ButtonToolbar>
            <Button bsStyle="success" onClick={this.onPlay}>Play</Button>
            <Button bsStyle="danger" onClick={this.onStop}>Stop</Button>
            <Button bsStyle="primary" onClick={this.onReset}>Reset</Button>
            <Button onClick={this.onSetSize}>Set Size</Button>
        </ButtonToolbar>
    }

    onPlay = () => {
        this.props.control.play();
    }


    onStop = () => {
        this.props.control.stop();
    }


    onReset = () => {
        this.props.control.reset();
    }

    onSetSize = () => {
        this.props.control.setSize();
    }
}

Controls.propTypes = {

};

Controls.defaultProps = {

};

export default Controls