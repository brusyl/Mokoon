// jshint esversion:6

import GridPosition from "./grid-position";

/**
 * Class representing a dot.
 * @extends Point
 */
var HexaMatrix = class {
    
    static isOdd(value) {
        return value % 2 === 0 ? true : false;
    }
    
    static generate(size, options) {
        var matrix = [],
            row, 
            column,
            excludeCenter = false;
        
        if (options) {
            if (options.excludeCenter) {
                excludeCenter = options.excludeCenter;
            }
        }
        
		for (row = -size; row < size + 1; row++) {
            var diff = size - Math.abs(row),
                side = parseInt((size + diff) / 2),
                minColumn = -side,
                maxColumn = side;
            
            if (!this.isOdd(row)) {
                minColumn -= 1;  
            }
			for (column = minColumn; column < maxColumn + 1; column++) {
                matrix.push(new GridPosition(row, column, 0));
			}
		}
        
        return matrix;
    }
    
    static intersect(mainMatrix, minMatrix) {
        var deleteCell = function(minPos) {
            if (pos.row === minPos.row && 
                pos.column === minPos.column) {
                mainMatrix.splice(i, 1);
                return i--;
            }
        };
        
        for (var i = 0; i < mainMatrix.length; i++) {
            var pos = mainMatrix[i];
            minMatrix.some(deleteCell);
        }
        
        return mainMatrix;
    }
    
    static shift(shiftPosition, matrix) {
        matrix.forEach(function(cell) {
            cell.row += shiftPosition.row;
            cell.column += shiftPosition.column;
        });
        
        return matrix;
    }
};

export default HexaMatrix;