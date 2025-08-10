
export const calculateCronbachAlpha = (data) => {
    // data: 2D array (rows = responses, columns = items)
    if (!Array.isArray(data) || data.length === 0) return NaN;
    const n_items = data[0].length;
    if (n_items <= 1) return NaN;

    // calculate variance for each item (column)
    const item_variances = [];
    for (let col = 0; col < n_items; col++) {
        const colVals = data.map(row => row[col]);
        const mean = colVals.reduce((a, b) => a + b, 0) / colVals.length;
        const variance = colVals.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / (colVals.length - 1);
        item_variances.push(variance);
    }

    // calculate total score for each row and its variance
    const total_scores = data.map(row => row.reduce((a, b) => a + b, 0));
    const total_mean = total_scores.reduce((a, b) => a + b, 0) / total_scores.length;
    const total_variance = total_scores.reduce((sum, val) => sum + Math.pow(val - total_mean, 2), 0) / (total_scores.length - 1);

    const sum_item_variances = item_variances.reduce((a, b) => a + b, 0);

    const alpha = (n_items / (n_items - 1)) * (1 - sum_item_variances / total_variance);
    console.log('Cronbach Alpha:', alpha, 'Type:', typeof(alpha));

    return alpha.toFixed(4); // TODO: Make this user-dynamic
};
