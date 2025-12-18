import { Boundary } from './classes.js';
import { mapData } from './map.js';

/**
 * Converts the 2D map array into an array of Boundary objects.
 * Positions are calculated based on the 48x48 tile size.
 */

export const collisions = [];

mapData.forEach((row, i) => {
    row.forEach((symbol, j) => {
        if (symbol === 1) {
            collisions.push(
                new Boundary({
                    position: {
                        x: j * Boundary.width,
                        y: i * Boundary.height
                    }
                })
            );
        }
    });
});