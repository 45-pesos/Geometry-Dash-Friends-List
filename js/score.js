/**
 * Numbers of decimal digits to round to
 */
const scale = 1;

/**
 * Calculate the score awarded when having a certain percentage on a list level
 * @param {Number} rank Position on the list
 * @param {Number} percent Percentage of completion
 * @param {Number} minPercent Minimum percentage required
 * @returns {Number}
 */
export function score(rank, percent, minPercent) {
    if (rank > 150) {
        return 1;
    }
    if (rank > 75 && percent < 100) {
        return 1;
    }

    // Old formula
    /*
    let score = (100 / Math.sqrt((rank - 1) / 50 + 0.444444) - 50) *
        ((percent - (minPercent - 1)) / (100 - (minPercent - 1)));
    */
    // New formula
const scale = 2; // número de decimales

function getScore(rank, percent, minPercent) {
    // Limitar rango
    rank = Math.min(Math.max(rank, 1), 250);

    // Fórmula exponencial base (350 → 2.5 en 250 niveles)
    let baseScore = 350 * Math.pow(2.5 / 350, (rank - 1) / (250 - 1));

    // Ajuste por porcentaje alcanzado
    let score = baseScore * ((percent - (minPercent - 1)) / (100 - (minPercent - 1)));

    // Evitar negativos o NaN
    if (isNaN(score)) score = 0;
    score = Math.max(0, score);

    // Penalización si no es 100%
    if (percent != 100) {
        return round(score - score / 3);
    }

    return Math.max(round(score), 0);
}

function round(num) {
    if (!('' + num).includes('e')) {
        return +(Math.round(num + 'e+' + scale) + 'e-' + scale);
    } else {
        var arr = ('' + num).split('e');
        var sig = '';
        if (+arr[1] + scale > 0) {
            sig = '+';
        }
        return +(
            Math.round(+arr[0] + 'e' + sig + (+arr[1] + scale)) +
            'e-' +
            scale
        );
    }
}
