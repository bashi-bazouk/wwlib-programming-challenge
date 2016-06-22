import React from 'react';
import { Button } from 'react-bootstrap';

class SizeModal extends React.Component {

    constructor({ current_size, set_size }) {
        super({ set_size })
        this.state = { current_size }
    }

    render = () => {
        return <div id="impromptu-modal-stack">
            <div id="size-modal" className="modal">
                <h3>Set Size</h3>
                <input ref="input-size" type="number" min="0" max="100" value={this.state.current_size} onChange={ this.change_size } />
                <Button onClick={ this.set_size } >Confirm</Button>
            </div>
        </div>
    };

    change_size = (event) => {
        this.setState({ current_size: event.target.value });
    }

    set_size = () => {
        console.log("got ref", this.refs['input-size'], this.refs['input-size'].props.value)
        var size = this.refs['input-size'].props.value;
        this.props.set_size(size);
    }

}

export default SizeModal