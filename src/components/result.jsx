import { useState, useEffect } from "react";
import { MdFullscreen } from "react-icons/md";
import { TbReportAnalytics } from "react-icons/tb";
import { IoStatsChart } from "react-icons/io5";

export function ResultContainer({ matrix, alpha }) {
  // result display layout util
  const [showSolution, setShowSolution] = useState(false);
  const [fullScreenMatrix, setFullScreenMatrix] = useState(false);
  const [fullScreenAnalysis, setFullScreenAnalysis] = useState(false);

  // analysis result states
  const [alphaValue, setAlphaValue] = useState(null);
  const [computationData, setComputationData] = useState(null);
  const [description, setDescription] = useState("");

  // niche states for specialized errors (Zero variance, Undefined..)
  const [invalid, setInvalid] = useState(null);

  // only show if matrix is valid and has data
  const hasResult =
    Array.isArray(matrix) && matrix.length > 0 && Array.isArray(matrix[0]);

  useEffect(() => {
    // calculate all derived state in one effect
    let newDescription = "";
    let newAlphaValue = null;
    let newComputationData = null;
    let newInvalid = null;

    if (alpha && typeof alpha === "object") {
      newAlphaValue = alpha.alpha;
      newComputationData = alpha.computationData;
      newInvalid = alpha.invalid || null;
    } else {
      newAlphaValue = alpha;
    }

    // interpretation based on publicly available references
    if (newAlphaValue !== null && newAlphaValue !== undefined) {
      if (newAlphaValue >= 0.9)
        newDescription = "Excellent Internal Consistency";
      else if (newAlphaValue >= 0.8)
        newDescription = "Good Internal Consistency";
      else if (newAlphaValue >= 0.7)
        newDescription = "Acceptable Internal Consistency";
      else if (newAlphaValue >= 0.6)
        newDescription = "Questionable Internal Consistency";
      else if (newAlphaValue >= 0.5)
        newDescription = "Poor Internal Consistency";
      else if (newAlphaValue < 0.5)
        newDescription = "Unacceptable Internal Consistency";
      else {
        newDescription = "Invalid Calculation";
        newInvalid =
          "Invalid alpha value calculation (possible division by zero)";
      }
    }

    // only update state if values have changed to be more efficient
    if (alphaValue !== newAlphaValue) setAlphaValue(newAlphaValue);
    if (computationData !== newComputationData)
      setComputationData(newComputationData);
    if (invalid !== newInvalid) setInvalid(newInvalid);
    if (description !== newDescription) setDescription(newDescription);
  }, [alpha, alphaValue, computationData, description, invalid]);

  // data matrix display
  const DataMatrix = ({ data, inFullScreen = false }) => {
    if (!data || !Array.isArray(data)) return null;

    return (
      <div
        className={`w-full ${inFullScreen ? "h-full" : "mx-auto max-w-4xl"}`}
      >
        {!inFullScreen && (
          <div className="mb-6 flex items-center justify-center gap-2">
            <button
              className="ml-2 flex items-center justify-center rounded-full p-2 text-black transition-transform duration-200 hover:scale-110"
              onClick={() => setFullScreenMatrix(true)}
              title="Full Screen Data Matrix"
            >
              <MdFullscreen style={{ fontSize: "1.3rem" }} />
            </button>
          </div>
        )}
        <div
          className={`rounded-xl border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-6 shadow-lg ${inFullScreen ? "h-full overflow-auto" : "h-[300px] overflow-auto"}`}
        >
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="rounded-lg bg-blue-100">
                  <th className="px-4 py-3 font-semibold text-blue-800">
                    Response
                  </th>
                  {data[0].map((_, idx) => (
                    <th
                      key={idx}
                      className="px-4 py-3 font-semibold text-blue-800"
                    >
                      Q{idx + 1}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((row, rowIdx) => (
                  <tr
                    key={rowIdx}
                    className={rowIdx % 2 === 0 ? "bg-white" : "bg-blue-25"}
                  >
                    <td className="px-4 py-3 text-center font-medium text-gray-700">
                      {rowIdx + 1}
                    </td>
                    {row.map((cell, cellIdx) => (
                      <td
                        key={cellIdx}
                        className="px-4 py-3 text-center text-gray-600"
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  // responsible for computation result visualization
  const ComputationVisualization = ({ data, computation }) => {
    if (!data || !computation) return null;

    const DataAnalysisTables = ({ inFullScreen = false }) => (
      <div
        className={`space-y-4 ${inFullScreen ? "h-full overflow-auto" : "h-[600px] overflow-auto"}`}
      >
        {/* Invalid data warning */}
        {invalid && (
          <div className="rounded border-l-4 border-red-500 bg-red-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-500"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Invalid Calculation
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{invalid}</p>
                  {computation?.zeroVariance && (
                    <p className="mt-1">
                      Zero variance detected in one or more items.
                    </p>
                  )}
                  {computation?.undefinedResult && (
                    <p className="mt-1">
                      Undefined result (0/0) in calculation.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Data table with row totals */}
        <div className="rounded-xl border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-6 shadow-lg">
          {!inFullScreen && (
            <div className="mb-4 flex items-center justify-center gap-2">
              <h4 className="flex items-center gap-2 text-lg font-semibold text-gray-700">
                <TbReportAnalytics className="mr-1 inline-block text-xl" />
                Denomination
              </h4>
              <button
                className="ml-2 flex items-center justify-center rounded-full p-2 text-black transition-transform duration-200 hover:scale-110"
                onClick={() => setFullScreenAnalysis(true)}
                title="Full Screen Data Analysis"
              >
                <MdFullscreen style={{ fontSize: "1.7rem" }} />
              </button>
            </div>
          )}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="rounded-lg bg-blue-100">
                  <th className="px-3 py-2 font-semibold text-blue-800">
                    Response
                  </th>
                  {data[0].map((_, idx) => (
                    <th
                      key={idx}
                      className="px-3 py-2 font-semibold text-blue-800"
                    >
                      Q{idx + 1}
                    </th>
                  ))}
                  <th className="rounded-r-lg bg-yellow-200 px-3 py-2 font-semibold text-blue-800">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.map((row, rowIdx) => (
                  <tr
                    key={rowIdx}
                    className={rowIdx % 2 === 0 ? "bg-white" : "bg-blue-25"}
                  >
                    <td className="px-3 py-2 text-center font-medium text-gray-700">
                      {rowIdx + 1}
                    </td>
                    {row.map((cell, cellIdx) => (
                      <td
                        key={cellIdx}
                        className="px-3 py-2 text-center text-gray-600"
                      >
                        {cell}
                      </td>
                    ))}
                    <td className="bg-yellow-100 px-3 py-2 text-center font-bold text-yellow-700">
                      {computation.total_scores[rowIdx]}
                    </td>
                  </tr>
                ))}
                <tr className="border-t-2 border-blue-300 bg-green-50">
                  <td className="px-3 py-2 font-bold text-green-800">Sum</td>
                  {data[0].map((_, colIdx) => (
                    <td
                      key={colIdx}
                      className="px-3 py-2 text-center font-semibold text-green-700"
                    >
                      {data.reduce((sum, row) => sum + row[colIdx], 0)}
                    </td>
                  ))}
                  <td className="bg-green-200 px-3 py-2 text-center font-bold text-green-800">
                    {computation.sum_total_scores}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Variance table */}
        <div className="rounded-xl border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50 p-6 shadow-lg">
          <h5 className="mb-4 font-medium text-purple-800">
            <IoStatsChart className="mr-1 inline-block" />
            Variance Analysis
          </h5>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-purple-100">
                  <th className="px-3 py-2 font-semibold text-purple-800">
                    Statistic
                  </th>
                  {data[0].map((_, idx) => (
                    <th
                      key={idx}
                      className="px-3 py-2 font-semibold text-purple-800"
                    >
                      Q{idx + 1}
                    </th>
                  ))}
                  <th className="bg-orange-200 px-3 py-2 font-semibold text-purple-800">
                    Total Score
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-white">
                  <td className="px-3 py-2 font-medium text-gray-700">Mean</td>
                  {computation.item_means.map((mean, idx) => (
                    <td
                      key={idx}
                      className="px-3 py-2 text-center text-gray-600"
                    >
                      {mean.toFixed(4)}
                    </td>
                  ))}
                  <td className="bg-orange-100 px-3 py-2 text-center font-medium text-orange-700">
                    {computation.total_mean.toFixed(4)}
                  </td>
                </tr>
                <tr className="bg-purple-25">
                  <td className="px-3 py-2 font-medium text-gray-700">
                    Variance
                  </td>
                  {computation.item_variances.map((variance, idx) => (
                    <td
                      key={idx}
                      className="px-3 py-2 text-center text-gray-600"
                    >
                      {variance.toFixed(6)}
                    </td>
                  ))}
                  <td className="bg-orange-100 px-3 py-2 text-center font-bold text-orange-700">
                    {computation.sum_item_variances.toFixed(6)}
                  </td>
                </tr>
                <tr className="bg-orange-50">
                  <td className="px-3 py-2 font-medium text-gray-700">
                    Total Variance
                  </td>
                  {data[0].map((_, idx) => (
                    <td key={idx} className="px-3 py-2"></td>
                  ))}
                  <td className="bg-orange-200 px-3 py-2 text-center font-bold text-orange-700">
                    {computation.total_variance.toFixed(6)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-4 rounded-lg border border-pink-300 bg-gradient-to-r from-pink-100 to-purple-100 p-4">
            <p className="text-sm text-purple-800">
              <strong>Sum of Item Variances (Σσᵢ²): </strong>{" "}
              {computation.sum_item_variances.toFixed(6)}
            </p>
          </div>
          <div className="mt-4 rounded-lg border border-pink-300 bg-gradient-to-r from-pink-100 to-purple-100 p-4">
            <p className="text-sm text-purple-800">
              <strong>Total Variance (σₜ²): </strong>{" "}
              {computation.total_variance.toFixed(6)}
            </p>
          </div>
        </div>
      </div>
    );

    return (
      <div className="mt-8 w-full">
        {/* Fullscreen Analysis Modal */}
        {fullScreenAnalysis && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85">
            <div className="relative mx-auto flex h-[90vh] w-full max-w-5xl flex-col rounded-lg bg-white p-0 shadow-2xl">
              {/* Header */}
              <div className="flex items-center justify-between rounded-t-lg border-b border-gray-200 bg-gray-50 px-6 py-4">
                <h2 className="text-lg font-semibold text-gray-800">
                  Data Analysis
                </h2>
                <button
                  type="button"
                  className="rounded-full bg-gray-200 p-2 text-2xl text-gray-600 transition-colors hover:bg-red-100 hover:text-red-600"
                  onClick={() => setFullScreenAnalysis(false)}
                  title="Close full screen table"
                  style={{ lineHeight: 1 }}
                >
                  ×
                </button>
              </div>
              {/* Scrollable Table Area */}
              <div className="flex-1 overflow-hidden rounded-b-lg bg-white p-6">
                <DataAnalysisTables inFullScreen />
              </div>
            </div>
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Left side: Data tables */}
          <DataAnalysisTables />

          {/* Right side: Formula breakdown */}
          {!fullScreenAnalysis && (
            <div className="space-y-4">
              <div className="rounded-xl border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 p-6 shadow-lg">
                <h5 className="mb-6 font-medium text-green-800">
                  Cronbach's Alpha Formula
                </h5>

                <div className="space-y-6">
                  {/* Formula display */}
                  <div className="rounded-lg border-2 border-green-300 bg-white p-4 text-center">
                    <div className="font-mono text-lg text-gray-800">
                      α = <span className="text-blue-600">(k / (k-1))</span> ×{" "}
                      <span className="text-orange-600">
                        (1 - <span className="text-purple-600">Σσᵢ² / σₜ²</span>
                        )
                      </span>
                    </div>
                    <div className="mt-2 text-xs text-gray-500">
                      where k = number of Q, σᵢ² = item variance, σₜ² = total
                      variance
                    </div>
                  </div>

                  {/* Step-by-step calculation */}
                  <div className="space-y-4">
                    <div className="rounded-lg border-2 border-green-300 bg-white p-4 text-center">
                      <div className="mb-2 text-sm font-semibold text-blue-800">
                        Step 1: Calculate k/(k-1)
                      </div>
                      <div className="font-mono text-gray-700">
                        k/(k-1) = {computation.n_items}/({computation.n_items}
                        -1) ={" "}
                        <span className="font-bold text-blue-600">
                          {computation.formula_parts?.k_over_k_minus_1?.toFixed(
                            6,
                          ) || "N/A"}
                        </span>
                      </div>
                    </div>

                    <div className="rounded-lg border-2 border-green-300 bg-white p-4 text-center">
                      <div className="mb-2 text-sm font-semibold text-purple-800">
                        Step 2: Calculate Σσᵢ²/σₜ²
                      </div>
                      <div className="font-mono text-gray-700">
                        Σσᵢ²/σₜ² = {computation.sum_item_variances.toFixed(6)}/
                        {computation.total_variance.toFixed(6)} ={" "}
                        <span className="font-bold text-purple-600">
                          {computation.formula_parts?.sum_item_var_over_total_var?.toFixed(
                            6,
                          ) || "N/A"}
                        </span>
                      </div>
                    </div>

                    <div className="rounded-lg border-2 border-green-300 bg-white p-4 text-center">
                      <div className="mb-2 text-sm font-semibold text-orange-800">
                        Step 3: Calculate (1 - Σσᵢ²/σₜ²)
                      </div>
                      <div className="font-mono text-gray-700">
                        1 -{" "}
                        <span className="font-bold text-purple-600">
                          {computation.formula_parts?.sum_item_var_over_total_var?.toFixed(
                            6,
                          ) || "N/A"}
                        </span>{" "}
                        ={" "}
                        <span className="font-bold text-orange-600">
                          {computation.formula_parts?.one_minus_ratio?.toFixed(
                            6,
                          ) || "N/A"}
                        </span>
                      </div>
                    </div>

                    <div className="rounded-lg border-2 border-green-400 bg-gradient-to-r from-green-100 to-emerald-100 p-4">
                      <div className="mb-2 text-sm font-semibold text-green-800">
                        Final Result:
                      </div>
                      <div className="font-mono text-gray-700">
                        α ={" "}
                        <span className="font-bold text-blue-600">
                          {computation.formula_parts?.k_over_k_minus_1?.toFixed(
                            6,
                          ) || "N/A"}
                        </span>{" "}
                        ×{" "}
                        <span className="font-bold text-orange-600">
                          {computation.formula_parts?.one_minus_ratio?.toFixed(
                            6,
                          ) || "N/A"}{" "}
                        </span>{" "}
                        ={" "}
                        <span className="border-2 border-red-600 text-2xl font-bold text-black">
                          <span className="group relative m-2 cursor-pointer transition-transform duration-200 hover:scale-110">
                            {alphaValue?.toFixed(6) || "Undefined"}
                            <span className="pointer-events-none absolute top-full left-1/2 z-10 mt-2 w-max -translate-x-1/2 rounded bg-black px-2 py-1 text-xs text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                              Cronbach's Alpha
                            </span>
                          </span>
                        </span>
                      </div>
                      {invalid && (
                        <div className="mt-2 text-sm text-red-600">
                          Note: {invalid}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Interpretation */}
                  <div className="rounded-lg border border-indigo-300 bg-gradient-to-r from-indigo-100 to-blue-100 p-4">
                    <div className="mb-2 text-sm font-semibold text-indigo-800">
                      📋 Interpretation Guidelines
                    </div>
                    <div className="space-y-1 text-xs text-indigo-700">
                      <div>• α &#8805; 0.9: Excellent reliability</div>
                      <div>• 0.8 &#8804; α &lt; 0.9: Good reliability</div>
                      <div>
                        • 0.7 &#8804; α &lt; 0.8: Acceptable reliability
                      </div>
                      <div>
                        • 0.6 &#8804; α &lt; 0.7: Questionable reliability
                      </div>
                      <div>• α &lt; 0.6: Poor reliability</div>
                      {invalid && (
                        <div className="pt-2 text-red-600">
                          • Invalid: {invalid}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  try {
    return (
      <>
        {/* Fullscreen Data Matrix Modal */}
        {fullScreenMatrix && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85">
            <div className="relative mx-auto flex h-[90vh] w-full max-w-5xl flex-col rounded-lg bg-white p-0 shadow-2xl">
              {/* Header */}
              <div className="flex items-center justify-between rounded-t-lg border-b border-gray-200 bg-gray-50 px-6 py-4">
                <h2 className="text-lg font-semibold text-gray-800">
                  Data Matrix
                </h2>
                <button
                  type="button"
                  className="rounded-full bg-gray-200 p-2 text-2xl text-gray-600 transition-colors hover:bg-red-100 hover:text-red-600"
                  onClick={() => setFullScreenMatrix(false)}
                  title="Close full screen table"
                  style={{ lineHeight: 1 }}
                >
                  ×
                </button>
              </div>
              {/* Scrollable Table Area */}
              <div className="flex-1 overflow-hidden rounded-b-lg bg-white p-6">
                <DataMatrix data={matrix} inFullScreen />
              </div>
            </div>
          </div>
        )}
        <hr className="my-6 border-t-2 border-gray-300 opacity-60 shadow-sm" />
        <div className="mt-12 flex w-full flex-col items-center justify-center">
          <div className="flex w-full max-w-7xl flex-col items-center rounded-2xl border-2 border-gray-200 bg-white px-8 py-10 shadow-lg">
            {hasResult ? (
              <div className="w-full">
                {/* Result Summary */}
                <div className="mb-8 text-center">
                  <div className="mb-2 text-3xl font-bold text-blue-800">
                    Cronbach's Alpha:{" "}
                    <span className="text-gray-900">
                      {alphaValue?.toFixed
                        ? alphaValue.toFixed(4)
                        : "Undefined"}
                    </span>
                    <span className="ml-2 font-light text-gray-600 italic opacity-50">
                      ({alphaValue.toFixed(4) * 100}%)
                    </span>
                  </div>
                  <div className="mb-4 text-lg text-gray-600">
                    {description}
                  </div>
                  {invalid && (
                    <div className="mt-2 text-red-600">{invalid}</div>
                  )}
                </div>

                {/* Data Matrix (always shown) */}
                <DataMatrix data={matrix} />

                {/* Show/Hide Solution Button */}
                <div className="mt-8 mb-6 flex justify-center">
                  <button
                    onClick={() => setShowSolution(!showSolution)}
                    className="transform rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-3 font-semibold text-white shadow-lg transition-all duration-200 hover:scale-105 hover:from-blue-700 hover:to-indigo-700 focus:ring-4 focus:ring-blue-300 focus:outline-none"
                  >
                    {showSolution ? "Hide Solution" : "See Solution"}
                  </button>
                </div>

                {/* Computation visualization (conditionally shown) */}
                {showSolution && computationData && (
                  <div className="animate-in slide-in-from-top duration-500">
                    <ComputationVisualization
                      data={matrix}
                      computation={computationData}
                    />
                  </div>
                )}
              </div>
            ) : (
              <div className="text-lg text-gray-400 italic">
                No results to display yet.
              </div>
            )}
          </div>
        </div>
      </>
    );
  } catch (err) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-8 text-center text-red-700">
        <h2 className="mb-2 text-xl font-bold">
          An error occurred in the result display
        </h2>
        <div className="text-sm">{err?.message || String(err)}</div>
      </div>
    );
  }
}
