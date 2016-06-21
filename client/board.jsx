import React from 'react';
import Fuzzer from 'randexp';

import Cell from './cell'

class Board extends React.Component {

    constructor({ size, max_cursors }) {
        super({ size, max_cursors });
        this.state = { time: -1 };
    }

    generate_board = () => {
        var size = this.props.size;
        if(size > 0) {
            var gen_row_directions = `[urdl]{${ size }}`;
            var gen_board_directions = `${ gen_row_directions }(\n${ gen_row_directions }){${ size-1 }}`;
            var board_directions_fuzzer = new Fuzzer(new RegExp(gen_board_directions));
            var board_directions_string = board_directions_fuzzer.gen();
            var directions = _(board_directions_string.split('\n')).invoke("split", '');



            var cardinalities = directions.map((row) => { return row.map(() => {  }) });
            var moduli = directions.map((row) => { return row.map(() => { return Number.POSITIVE_INFINITY }) });

            // Set the cardinalities of final steps to 1.
            for(var i=0; i < size; i++) {
                if(directions[i][0] == 'l') {
                    cardinalities[i][0] = 1;
                }
                if(directions[0][i] == 'u') {
                    cardinalities[0][i] = 1;
                }
                if(directions[size-1][size-1-i] == 'd') {
                    cardinalities[size-1][size-1-i] = 1;
                }
                if(directions[size-1-i][size-1] == 'r') {
                    cardinalities[size-1-i][size-1] = 1;
                }
            }

            // Recursively compute moduli, producing cardinalities as a side-effect.
            var relax = ([i, j], ...previous) => {
                if(_(previous).contains(`${ i },${ j }`)) {
                    // Special Case: Discovered a Loop
                    var modulus = previous.indexOf(`${ i },${ j }`) + 1;
                    var cardinality = modulus;
                    var in_loop_prefix = false;

                    for(var [_i, _j] of _(previous).invoke('split', ",")) {
                        [_i, _j] = [parseInt(_i), parseInt(_j)];
                        moduli[_i][_j] = modulus;
                        if (in_loop_prefix) {
                           cardinality++;
                        } else if (_i == i && _j == j) {
                           in_loop_prefix = true;
                        }
                        cardinalities[_i][_j] = cardinality;
                    }
                } else if(cardinalities[i][j]) {
                    cardinality = cardinalities[i][j];
                    // Base Case: Already solved.
                    for(var [_i, _j] of _(previous).invoke('split', ",")) {
                        [_i, _j] = [parseInt(_i), parseInt(_j)];
                        moduli[_i][_j] = moduli[i][j];
                        cardinalities[_i][_j] = ++cardinality;
                    }
                } else {
                    // Default: Tail Recursion
                    previous.unshift(`${ i },${ j }`);
                    relax(Board.transition([i,j], directions[i][j]), ...previous);
                }
            };

            // Relax all moduli, computing cardinalities and paths as a side-effect.
            for(var u=0; u<size; u++) {
                for(var v=0; v<size; v++) {
                    relax([u,v]);
                }
            }

            // Generate the steps from each cell, computing longest path as a side-effect.
            var paths = directions.map((row) => { return row.map(() => { return [] }) });
            var longest_path = 0;
            for(var u=0; u<size; u++) {
                for(var v=0; v<size; v++) {
                    var cardinality = cardinalities[u][v];
                    var position = [u,v];
                    for(var w=0; w<cardinality; w++) {
                        paths[u][v].push(position);
                        position = Board.transition(position, directions[position[0]][position[1]]);
                    }
                    longest_path = Math.max(longest_path, cardinality);
                }
            }


            return { directions, cardinalities, moduli, paths, longest_path };
        } else {
            return { directions: [], cardinalities: [], moduli: [], paths: [], longest_path: 0 };
        }
    };

    
    generate_cursors = () => {
        var cursors = [];
        for(var i=0; i<this.props.max_cursors; i++) {
            var choose = Math.floor(Math.random() * Math.pow(this.props.size,2 ))
            var i_0 = Math.floor(choose / this.props.size);
            var j_0 = choose - i_0*this.props.size;
            cursors.push({ t_0: 0, i_0, j_0 })
        }
        return cursors;
    };
    

    render = () => {

        if (this.state.time == -1) {
            this.state.board = this.generate_board();
            this.state.cursors = this.generate_cursors();
            console.log("state", this.state.board, this.state.cursors)
            this.state.time = 0;
        }

        // Compute the current positions of all cursors.
        var cursor_positions = { };
        for(var u = 0; u < this.props.size; u++) {
            cursor_positions[u] = { }
        }

        for(var { i_0, j_0, t_0 } of this.state.cursors) {
            var path = this.state.board.paths[i_0][j_0];
            var cardinality = this.state.board.cardinalities[i_0][j_0];
            var modulus = this.state.board.moduli[i_0][j_0];

            var t = (this.state.time - t_0);

            if(t >= cardinality) {
                if(modulus == Number.POSITIVE_INFINITY) {
                    continue;
                } else {
                    var loop_prefix_length = (cardinality - modulus);
                    console.log("((%i - %i) % %i) + %i) = %i", t, loop_prefix_length, modulus, loop_prefix_length, ((t - loop_prefix_length) % modulus) + loop_prefix_length);
                    t = ((t - loop_prefix_length) % modulus) + loop_prefix_length;
                }
            }

            var [i, j] = path[t];
            cursor_positions[i][j] = true;


        }

        let rows = [];
        for (let i=0; i < this.props.size; i++) {
            let cells = []
            for (let j=0; j < this.props.size; j++) {
                cells.push(<Cell key={`${i},${j}`}direction={ this.state.board.directions[i][j] }
                                 has_cursor={ cursor_positions[i][j] }/>)
            }
            rows.push(<div className="row" key={ i }>{ cells }</div>)
        }

        return <div className="board">{ rows }</div>;
    }

    componentWillReceiveProps = ({ time }) => {
        this.setState({ time })
    }
}


Board.transition = ([i,j], direction) => {
    switch(direction) {
        case 'u':
            return [i-1,j];
        case 'r':
            return [i,j+1];
        case 'd':
            return [i+1,j];
        case 'l':
            return [i,j-1];
        default:
            throw `Unsupported operand: ${ direction }`
        }
}

export default Board