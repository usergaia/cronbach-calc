/**
 * Cronbach's Alpha Calculation Utility
 * ------------------------------------
 * The formula for Cronbach's Alpha is:
 *   α = (k / (k-1)) * [1 - (Σσᵢ² / σₜ²)]
 *   where:
 *     - k = number of items (columns)
 *     - σᵢ² = variance of each item (column)
 *     - σₜ² = variance of the total score (sum across items for each respondent)
 *
 *   - For each respondent, sum their answers to get a total score.
 *   - Calculate the variance for each item (how much responses differ per question).
 *   - Calculate the variance of the total scores (how much overall scores differ between respondents).
 *   - If items are consistent (measure the same thing), the total score variance will be much larger than the sum of item variances, making alpha approach 1.
 *   - If items are unrelated, the sum of item variances will be close to the total variance, making alpha approach 0.
 *
 * The function returns both the alpha value and all intermediate statistics for transparency, further analysis, and visualization.
 */
export const calculateCronbachAlpha = (data) => {
  // data: 2D array (rows = responses, columns = items)
  if (!Array.isArray(data) || data.length === 0) return { alpha: NaN }; // empty data
  const n_items = data[0].length;
  if (n_items <= 1) return { alpha: NaN };

  // 1. Calculate variance for each item (σᵢ²) and mean for each item
  const item_variances = [];
  const item_means = [];

  for (let col = 0; col < n_items; col++) {
    // Calculate mean for this column
    let sum = 0;
    let count = 0;
    for (let row = 0; row < data.length; row++) {
      sum += data[row][col];
      count++;
    }
    const mean = sum / count;
    item_means.push(mean);

    // Calculate variance for this column
    let sqDiffSum = 0;
    for (let row = 0; row < data.length; row++) {
      const diff = data[row][col] - mean;
      sqDiffSum += diff * diff;
    }
    const variance = sqDiffSum / (count - 1);
    item_variances.push(variance);
  }

  // 2. Calculate total score for each respondent (row) and its variance (σₜ²)
  // Calculate total score for each respondent (row)
  const total_scores = [];
  for (let i = 0; i < data.length; i++) {
    let rowSum = 0;
    for (let j = 0; j < n_items; j++) {
      rowSum += data[i][j];
    }
    total_scores.push(rowSum);
  }
  // Calculate mean of total scores
  let totalSum = 0;
  for (let i = 0; i < total_scores.length; i++) {
    totalSum += total_scores[i];
  }
  const total_mean = totalSum / total_scores.length;
  // Calculate variance of total scores
  let totalSqDiffSum = 0;
  for (let i = 0; i < total_scores.length; i++) {
    const diff = total_scores[i] - total_mean;
    totalSqDiffSum += diff * diff;
  }
  const total_variance = totalSqDiffSum / (total_scores.length - 1);

  // 3. Sum of item variances (Σσᵢ²) and sum of total scores (for reporting)
  // Calculate sum of item variances
  let sum_item_variances = 0;
  for (let i = 0; i < item_variances.length; i++) {
    sum_item_variances += item_variances[i];
  }
  // Calculate sum of total scores
  let sum_total_scores = 0;
  for (let i = 0; i < total_scores.length; i++) {
    sum_total_scores += total_scores[i];
  }

  if (total_variance === 0) {
    console.error(
      "Error: total variance is zero, division by zero not allowed.",
    );
    return { alpha: "Invalid Data!" };
  }

  // 4. Cronbach's Alpha formula:
  //    α = (k / (k-1)) * [1 - (Σσᵢ² / σₜ²)]
  //    where k = n_items, Σσᵢ² = sum_item_variances, σₜ² = total_variance
  const alpha =
    (n_items / (n_items - 1)) * (1 - sum_item_variances / total_variance);

  // Return data for visualization
  return {
    alpha,
    computationData: {
      n_items,
      item_variances,
      item_means,
      total_scores,
      total_mean,
      total_variance,
      sum_item_variances,
      sum_total_scores,
      formula_parts: {
        k_over_k_minus_1: n_items / (n_items - 1),
        sum_item_var_over_total_var: sum_item_variances / total_variance,
        one_minus_ratio: 1 - sum_item_variances / total_variance,
      },
    },
  };
};
