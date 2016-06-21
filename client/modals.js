import react from 'react';
import { Button } from 'react-bootstrap'

class ModalStack extends react.Component {

    constructor({ }) {
        super({});
        this.state.modals = []
    }


    componentWillReceiveProps = ({ modals }) => {
        this.setState({ modals })
    }


    render = () => {
        return <div className="modal-stack">{this.state.modals}</div>
    }




}

class Modal extends react.Component { }


class SizeModal extends Modal {

    constructor({ current_size, confirm_size }) {
        super({ current_size, confirm_size });
    }

    render = () => {
        return <div id="size-modal" className="modal">
            <h3>C</h3>
            <input ref="input-size" type="text" val={this.props.current_size} />
            <Button onClick={ this.onConfirm} />
        </div>
    }

    onConfirm = () => {
        this.props.confirm_size(this.ref)
    }


}

exports = { ModalStack, Modal}