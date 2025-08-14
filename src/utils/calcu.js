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
  if (!Array.isArray(data) || data.length === 0) {
    return {
      alpha: NaN,
      error: {
        code: "EMPTY_DATA",
        message: "Input data is empty or not an array.",
        details: "Please provide a valid 2D array with survey responses.",
      },
    };
  }
  if (!Array.isArray(data[0]) || data[0].length === 0) {
    return {
      alpha: NaN,
      error: {
        code: "INVALID_SHAPE",
        message: "Input data is not a 2D array or has no columns.",
        details:
          "Data should be a matrix where rows are respondents and columns are items/questions.",
      },
    };
  }

  const n_items = data[0].length;
  const n_respondents = data.length;

  if (n_items <= 1) {
    return {
      alpha: NaN,
      error: {
        code: "NOT_ENOUGH_ITEMS",
        message: "At least 2 items (columns) are required.",
        details: `Found ${n_items} item(s). Cronbach's Alpha requires at least 2 items to measure internal consistency.`,
      },
    };
  }
  if (data.length <= 1) {
    return {
      alpha: NaN,
      error: {
        code: "NOT_ENOUGH_RESPONDENTS",
        message: "At least 2 respondents (rows) are required.",
        details: `Found ${n_respondents} respondent(s). Need at least 2 respondents to calculate variance.`,
      },
    };
  }

  // Check for jagged array (rows of different lengths)
  for (let i = 0; i < data.length; i++) {
    if (!Array.isArray(data[i]) || data[i].length !== n_items) {
      return {
        alpha: NaN,
        error: {
          code: "JAGGED_ARRAY",
          message: `Row ${i + 1} does not have the same number of columns as the first row.`,
          details: `Expected ${n_items} columns but found ${data[i]?.length || 0} in row ${i + 1}.`,
        },
      };
    }
  }

  // Check for non-numeric values
  for (let i = 0; i < data.length; i++) {
    for (let j = 0; j < n_items; j++) {
      if (typeof data[i][j] !== "number" || isNaN(data[i][j])) {
        return {
          alpha: NaN,
          error: {
            code: "NON_NUMERIC_VALUE",
            message: `Non-numeric value found at row ${i + 1}, column ${j + 1}.`,
            details: `Found "${data[i][j]}" (${typeof data[i][j]}) at position [${i + 1}, ${j + 1}]. All values must be numbers.`,
          },
        };
      }
    }
  }

  // 1. Calculate total score for each respondent (row)
  const total_scores = [];
  for (let i = 0; i < data.length; i++) {
    let rowSum = 0;
    for (let j = 0; j < n_items; j++) {
      rowSum += data[i][j];
    }
    total_scores.push(rowSum);
  }

  // Calculate sum of total scores
  let sum_total_scores = 0;
  for (let i = 0; i < total_scores.length; i++) {
    sum_total_scores += total_scores[i];
  }

  // 2. Calculate variance for each item (σᵢ²) and mean for each item
  const item_variances = [];
  const item_means = [];
  const zeroVarianceItems = [];

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

    // Track zero variance items
    if (variance === 0) {
      zeroVarianceItems.push({
        item: col + 1,
        value: data[0][col],
        description: `Q${col + 1} (all responses = ${data[0][col]})`,
      });
    }
  }

  // 3. Calculate total score
  // Calculate mean of total scores
  const total_mean = sum_total_scores / total_scores.length;

  // Calculate variance of total scores
  let totalSqDiffSum = 0;
  for (let i = 0; i < total_scores.length; i++) {
    const diff = total_scores[i] - total_mean;
    totalSqDiffSum += diff * diff;
  }
  const total_variance = totalSqDiffSum / (total_scores.length - 1);

  // Calculate sum of item variances
  let sum_item_variances = 0;
  for (let i = 0; i < item_variances.length; i++) {
    sum_item_variances += item_variances[i];
  }

  // Create base computation data
  const baseComputationData = {
    n_items,
    n_respondents,
    item_variances,
    item_means,
    total_scores,
    total_mean,
    total_variance,
    sum_item_variances,
    sum_total_scores,
    zeroVarianceItems,
  };

  // error responses
  if (item_variances.every((v) => v === 0)) {
    return {
      alpha: NaN,
      computationData: baseComputationData,
      error: {
        code: "ZERO_ITEM_VARIANCE",
        message: "All items have zero variance (all columns are constant).",
        details: `All ${n_items} items show no variation across respondents. This means all respondents gave the same answer to every question, making reliability calculation meaningless.`,
        affectedItems: zeroVarianceItems,
      },
    };
  }

  if (zeroVarianceItems.length > 0) {
    return {
      alpha: NaN,
      computationData: baseComputationData,
      error: {
        code: "PARTIAL_ZERO_VARIANCE",
        message: `${zeroVarianceItems.length} item(s) have zero variance.`,
        details: `Items with zero variance cannot contribute to reliability measurement as they show no variation across respondents.`,
        affectedItems: zeroVarianceItems,
      },
    };
  }

  if (total_variance === 0) {
    return {
      alpha: NaN,
      computationData: baseComputationData,
      error: {
        code: "ZERO_TOTAL_VARIANCE",
        message:
          "Total variance is zero (all respondents have the same total score).",
        details: `All respondents have the same total score (${total_scores[0]}). This creates division by zero in the Cronbach's Alpha formula.`,
        totalScore: total_scores[0],
      },
    };
  }

  // 4. Cronbach's Alpha formula:
  //    α = (k / (k-1)) * [1 - (Σσᵢ² / σₜ²)]
  //    where k = n_items, Σσᵢ² = sum_item_variances, σₜ² = total_variance
  const alpha =
    (n_items / (n_items - 1)) * (1 - sum_item_variances / total_variance);

  // Return data for visualization with successful calculation
  return {
    alpha,
    computationData: {
      ...baseComputationData,
      formula_parts: {
        k_over_k_minus_1: n_items / (n_items - 1),
        sum_item_var_over_total_var: sum_item_variances / total_variance,
        one_minus_ratio: 1 - sum_item_variances / total_variance,
      },
    },
  };
};
