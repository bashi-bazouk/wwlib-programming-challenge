import React from 'react';

//this exports a reference to a React class as the default export
class Cell extends React.Component {

    constructor({ direction, has_cursor }) {
        super({ });
        this.state = { direction, has_cursor }
    }

    componentWillReceiveProps = ({ direction, has_cursor }) => {
        this.setState({ direction, has_cursor })
    }

    render() {
        var className = this.state.has_cursor ? "cursor populated" : "cursor";
        return <div className="cell" data-direction={ this.state.direction }>
            <div className={ className }></div>
        </div>
    }

};

Cell.propTypes = {

};

Cell.defaultProps = {

};


export default Cell