const cells = document.getElementsByTagName('input');

function getCell(index) {
    return document.getElementById(`cell-${index}`);
};

function renderBoard(values) {
    for (var i = 0; i < values.length; i++) {
        if (values.charAt(i) != '0') {
            getCell(i).value = values.charAt(i);
        }; 
    };
};

function resetBoard() {
    for (var i = 0; i < 81; i++) {
        getCell(i).value = ''
    };
};

function getBoard() {
    let start = '';
    for(index = 0; index <= 80; index++) {
        input = getCell(index)
        if(input.value && input.value != ' ') {
            start += input.value
        } else {
            start += '0'
        };
    };
    return start
};

function SudokuSolver() {
    var puzzle_table = [];
    /*
     * Check if the number is a legal candidate
     * for the given cell (by Sudoku rules).
     */
    function check_candidate(num, row, col) {
        for (var i = 0; i < 9; i++) {
            var b_index = ((Math.floor(row / 3) * 3) + Math.floor(i / 3)) * 9 + (Math.floor(col / 3) * 3) + (i % 3);
            if (num == puzzle_table[(row * 9) + i] ||
                num == puzzle_table[col + (i * 9)] ||
                num == puzzle_table[b_index]) {
                return false;
            }
        }
        return true;
    }
    /*
     * Recursively test all possible numbers for a given cell until
     * the puzzle is solved.
     */
    function get_candidate(index) {
        if (index >= puzzle_table.length) {
            return true;
        } else if (puzzle_table[index] != 0) {
            return get_candidate(index + 1);
        }

        for (var i = 1; i <= 9; i++) {
            if (check_candidate(i, Math.floor(index / 9), index % 9)) {
                puzzle_table[index] = i;
                if (get_candidate(index + 1)) {
                    return true;
                }
            }
        }

        puzzle_table[index] = 0;
        return false;
    }
    /*
     * Split result of puzzle into chunks by 9.
     */
    function chunk_in_groups(arr) {
        var result = [];
        for (var i = 0; i < arr.length; i += 9) {
            result.push(arr.slice(i, i + 9));
        }
        return result;
    }
    /*
     * Start solving the game for provided puzzle and options.
     */
    this.solve = function (puzzle, options) {
        options = options || {};
        var result = options.result || 'string';
        puzzle_table = puzzle.split('').map(function (v) { return isNaN(v) ? 0 : +v });

        if (puzzle.length !== 81) return 'Puzzle is not valid.'
        return !get_candidate(0) ? 'No solution found.' : result === 'chunks' ? chunk_in_groups(puzzle_table) : result === 'array' ? puzzle_table : puzzle_table.join('');
    }
}

function solveBoard() {
    document.getElementById('loader').classList.add('loader');
    var solver = new SudokuSolver();
    var puzzle = getBoard()
    solution = solver.solve(puzzle)
    if (solution.includes('n')) {
        alert('No solution found')
    } else {
        renderBoard(solution)
    };
    document.getElementById('loader').classList.remove('loader');
};

renderBoard('000502700000600001004000200000008046600000009190700000007000500400009000003801000');
document.getElementById("solve-button").addEventListener("click", solveBoard);
document.getElementById("reset-button").addEventListener("click", resetBoard);

