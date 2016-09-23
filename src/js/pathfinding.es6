// jshint esversion:6

/**
 * Class representing a dot.
 * @extends Point
 */
var PathFinding = class {
    /**
     * Create a dot.
     * @param {number} x - The x value.
     * @param {number} y - The y value.
     * @param {number} width - The width of the dot, in pixels.
     */
    constructor(grid) {
        this.grid = grid;
    }

    findPath(originTile, targetTile) {
        var neighbours = this.grid.getNeighbours(originTile);
        // TODO retrouve le meilleur voisin avec la distance entre les 2 
        // tuiles puis à partir de cette nouvelle tuile faire de meme
        // puis faire cette opération jusqu'a obtenir le chemin complet.
        
        // TODO transformer ce resultat en spline pour deplacer le personnage
    }
    
};

export default PathFinding;