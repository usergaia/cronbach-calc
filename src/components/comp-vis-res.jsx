import { MdFullscreen } from "react-icons/md";
import { TbReportAnalytics } from "react-icons/tb";
import { IoStatsChart } from "react-icons/io5";
import { IoIosWarning } from "react-icons/io";
import { useBodyScrollLock } from "../hooks/scLock-body";

export function ComputationVisualization({
  data,
  computation,
  fullScreenAnalysis,
  onFullScreenAnalysisToggle,
  invalid,
  errorDetails,
}) {
  useBodyScrollLock(fullScreenAnalysis);
  if (!data || !computation) return null;

  // error display
  const ErrorDisplay = ({ error, errorDetails }) => {
    if (!error) return null;

    const getErrorIcon = () => {
      if (!errorDetails?.code) return <IoIosWarning className="text-red-700" />;
      switch (errorDetails.code) {
        case "ZERO_ITEM_VARIANCE":
          return <IoIosWarning className="text-red-700" />;
        case "ZERO_TOTAL_VARIANCE":
          return <IoIosWarning className="text-orange-500" />;
        default:
          return <IoIosWarning className="text-yellow-500" />;
      }
    };

    return (
      <div
        className={`rounded-lg border-l-4 ${
          errorDetails?.code === "ZERO_TOTAL_VARIANCE"
            ? "border-orange-500 bg-orange-50"
            : "border-red-500 bg-red-50"
        } mb-6 p-4`}
      >
        <div className="flex">
          <div className="mr-3 flex-shrink-0 text-xl">{getErrorIcon()}</div>
          <div className="flex-1">
            <h3
              className={`text-sm font-medium ${
                errorDetails?.code === "ZERO_TOTAL_VARIANCE"
                  ? "text-orange-800"
                  : "text-red-800"
              }`}
            >
              {error}
            </h3>
            {errorDetails?.details && (
              <div className="mt-2 text-sm text-black">
                <p>{errorDetails.details}</p>
              </div>
            )}
            {errorDetails?.totalScore !== undefined && (
              <div className="mt-2 text-sm text-black">
                <p>
                  <strong>Common total score:</strong> {errorDetails.totalScore}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // denomination display
  const DataAnalysisTables = ({ inFullScreen = false }) => (
    <div
      className={`space-y-4 ${inFullScreen ? "h-full overflow-auto" : "h-[600px] overflow-auto"}`}
    >
      <ErrorDisplay error={invalid} errorDetails={errorDetails} />

      <div className="rounded-xl border-2 border-blue-200 bg-blue-50 p-6 shadow-lg">
        {!inFullScreen && (
          <div className="mb-4 flex items-center justify-center gap-2">
            <h4 className="flex items-center gap-2 text-lg font-semibold text-gray-700">
              <TbReportAnalytics className="mr-1 inline-block text-xl" />
              Denomination
            </h4>
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
                    Item {idx + 1}
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
                <td className="px-3 py-2 font-bold text-green-800">Score</td>
                {data[0].map((_, colIdx) => (
                  <td
                    key={colIdx}
                    className="px-3 py-2 text-center font-semibold text-green-700"
                  >
                    {data.reduce((sum, row) => sum + row[colIdx], 0)}
                  </td>
                ))}
                <td className="bg-green-200 px-3 py-2 text-center font-bold text-green-800">
                  {computation.sum_total_scores}{" "}
                  {/* sum of responses for each item */}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-xl border-2 border-purple-200 bg-purple-50 p-6 shadow-lg">
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
                    Item {idx + 1}
                  </th>
                ))}
                <th className="bg-orange-200 px-3 py-2 font-semibold text-purple-800">
                  Total
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-white">
                <td className="px-3 py-2 font-medium text-gray-700">Mean</td>
                {computation.item_means.map((mean, idx) => (
                  <td key={idx} className="px-3 py-2 text-center text-gray-600">
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
                    className={`px-3 py-2 text-center ${
                      variance === 0
                        ? "border-2 border-red-300 bg-red-100 font-bold text-red-700"
                        : "text-gray-600"
                    }`}
                  >
                    {variance.toFixed(6)}
                    {variance === 0 && <span className="ml-1">⚠️</span>}
                  </td>
                ))}
                <td
                  className={`border-2 border-purple-800 bg-orange-100 px-3 py-2 text-center font-bold ${
                    computation.sum_item_variances === 0
                      ? "border-2 border-red-300 text-red-700"
                      : "text-orange-700"
                  }`}
                >
                  {computation.sum_item_variances.toFixed(6)}
                  {computation.sum_item_variances === 0 && (
                    <span className="ml-1">⚠️</span>
                  )}
                </td>
              </tr>
              <tr className="bg-white">
                <td className="bg-orange-400 px-3 py-2 font-medium text-gray-700">
                  Total Variance
                </td>
                {data[0].map((_, idx) => (
                  <td key={idx}></td>
                ))}
                <td className="border-2 border-purple-800 bg-orange-100 px-3 py-2 text-center font-bold text-orange-700">
                  {computation.total_variance.toFixed(6)}
                </td>
              </tr>
            </tbody>
          </table>
          <div className="mt-7 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-4">
            <h5 className="mb-3 flex items-center gap-2 text-base font-semibold text-blue-900">
              <span className="inline-block rounded bg-gray-300 px-2 py-0.5 text-xs font-bold text-black">
                Formula Reference
              </span>
            </h5>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <span className="font-mono text-sm text-gray-800">Mean</span>
                <span className="text-gray-500">=</span>
                <span className="px-2 py-0.5 font-mono text-sm text-blue-700">
                  Σx / n
                </span>
              </li>
              <li className="flex items-center gap-2">
                <span className="font-mono text-sm text-gray-800">
                  Variance per Item
                </span>
                <span className="text-gray-500">=</span>
                <span className="px-2 py-0.5 font-mono text-sm text-blue-700">
                  Σ (x − x̄)² / (n − 1)
                </span>
              </li>
              <li className="flex items-center gap-2">
                <span className="font-mono text-sm text-gray-800">
                  Total Mean
                </span>
                <span className="text-gray-500">=</span>
                <span className="px-2 py-0.5 font-mono text-sm text-blue-700">
                  Σ Total Score / n
                </span>
              </li>
              <li className="flex items-center gap-2">
                <span className="font-mono text-sm text-gray-800">
                  Total Variance
                </span>
                <span className="text-gray-500">=</span>
                <span className="px-2 py-0.5 font-mono text-sm text-blue-700">
                  Σ (Total Score − Total Mean)² / (n − 1)
                </span>
              </li>
            </ul>
            <div className="mt-4 border-t border-blue-100 pt-2 text-xs text-gray-600 italic">
              where <span className="font-mono">x</span> = individual score,{" "}
              <span className="font-mono">x̄</span> = mean,{" "}
              <span className="font-mono">n</span> = number of responses
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // calculate alpha value
  const calculatedAlpha =
    computation.total_variance > 0
      ? (computation.n_items / (computation.n_items - 1)) *
        (1 - computation.sum_item_variances / computation.total_variance)
      : 0; // Return 0 when total variance is zero

  return (
    <div className="mt-8 w-full">
      <div className="mb-4 flex w-2/4 justify-center">
        <button
          className="flex items-center justify-center rounded-full p-2 text-black hover:bg-gray-100"
          onClick={onFullScreenAnalysisToggle}
          title="Full Screen Data Analysis"
        >
          <MdFullscreen style={{ fontSize: "1.7rem" }} />
        </button>
      </div>
      {fullScreenAnalysis && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85">
          <div className="relative mx-auto flex h-[90vh] w-full max-w-5xl flex-col rounded-lg bg-white p-0 shadow-2xl">
            <div className="flex items-center justify-between rounded-t-lg border-b border-gray-200 bg-gray-50 px-6 py-4">
              <h2 className="text-lg font-semibold text-gray-800">
                Denomination
              </h2>
              <button
                type="button"
                className="rounded-full bg-gray-200 p-2 text-2xl text-gray-600 hover:bg-red-100 hover:text-red-600"
                onClick={() => onFullScreenAnalysisToggle(false)}
              >
                ×
              </button>
            </div>
            <div className="flex-1 overflow-hidden rounded-b-lg bg-white p-6">
              <DataAnalysisTables inFullScreen />
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-2">
        <DataAnalysisTables />

        {!fullScreenAnalysis && (
          <div className="space-y-4">
            <div className="rounded-xl border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 p-6 shadow-lg">
              <h5 className="mb-6 font-medium text-green-800">
                Cronbach's Alpha Formula
              </h5>
              <div className="space-y-6">
                <div className="rounded-lg border-2 border-green-300 bg-white p-4 text-center">
                  <div className="font-mono text-lg text-gray-800">
                    α = <span className="text-blue-600">(k / (k-1))</span> ×{" "}
                    <span className="text-orange-600">
                      (1 - <span className="text-purple-600">Σσᵢ² / σₜ²</span>)
                    </span>
                  </div>
                  <div className="mt-2 text-xs text-gray-500">
                    where k = number of items, σᵢ² = item variance, σₜ² = total
                    variance
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="rounded-lg border-2 border-green-300 bg-white p-4 text-center">
                    <div className="mb-2 text-sm font-semibold text-blue-800">
                      Step 1: Calculate k/(k-1)
                    </div>
                    <div className="font-mono text-gray-700">
                      k/(k-1) = {computation.n_items}/({computation.n_items}-1)
                      ={" "}
                      <span className="font-bold text-blue-600">
                        {(
                          computation.n_items /
                          (computation.n_items - 1)
                        ).toFixed(6)}
                      </span>
                    </div>
                  </div>

                  <div className="rounded-lg border-2 border-green-300 bg-white p-4 text-center">
                    <div className="mb-2 text-sm font-semibold text-purple-800">
                      Step 2: Calculate Σσᵢ²/σₜ²
                    </div>
                    {computation.total_variance === 0 ? (
                      <>
                        <div className="font-mono text-gray-700">
                          Σσᵢ²/σₜ² = {computation.sum_item_variances.toFixed(6)}
                          /0 ={" "}
                          <span className="font-bold text-red-600">
                            Undefined
                          </span>
                        </div>
                        <div className="mt-2 text-xs font-semibold text-red-600">
                          Cannot continue: Total variance is 0. Calculation is
                          invalid.
                        </div>
                        <div className="mt-4 text-base font-bold text-red-700">
                          Cronbach's Alpha:{" "}
                          <span className="ml-2">Undefined</span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="font-mono text-gray-700">
                          Σσᵢ²/σₜ² = {computation.sum_item_variances.toFixed(6)}
                          /{computation.total_variance.toFixed(6)} ={" "}
                          <span className="font-bold text-purple-600">
                            {(
                              computation.sum_item_variances /
                              computation.total_variance
                            ).toFixed(6)}
                          </span>
                        </div>

                        <div className="mt-4 rounded-lg border-2 border-green-300 bg-white p-4 text-center">
                          <div className="mb-2 text-sm font-semibold text-orange-800">
                            Step 3: Calculate (1 - Σσᵢ²/σₜ²)
                          </div>
                          <div className="font-mono text-gray-700">
                            1 -{" "}
                            <span className="font-bold text-purple-600">
                              {(
                                computation.sum_item_variances /
                                computation.total_variance
                              ).toFixed(6)}
                            </span>{" "}
                            ={" "}
                            <span className="font-bold text-orange-600">
                              {(
                                1 -
                                computation.sum_item_variances /
                                  computation.total_variance
                              ).toFixed(6)}
                            </span>
                          </div>
                        </div>

                        <div className="mt-4 rounded-lg border-2 border-green-400 bg-gradient-to-r from-green-100 to-emerald-100 p-4">
                          <div className="mb-2 text-sm font-semibold text-green-800">
                            Final Result:
                          </div>
                          <div className="font-mono text-gray-700">
                            α ={" "}
                            <span className="font-bold text-blue-600">
                              {(
                                computation.n_items /
                                (computation.n_items - 1)
                              ).toFixed(6)}
                            </span>{" "}
                            ×{" "}
                            <span className="font-bold text-orange-600">
                              {(
                                1 -
                                computation.sum_item_variances /
                                  computation.total_variance
                              ).toFixed(6)}{" "}
                            </span>{" "}
                            ={" "}
                            <span className="border-2 border-gray-600 text-2xl font-bold text-black">
                              <span className="m-2">
                                {calculatedAlpha.toFixed(6)}
                              </span>
                            </span>
                          </div>
                          {calculatedAlpha === 0 && (
                            <div className="mt-2 text-xs text-gray-600">
                              Note: α = 0 indicates no internal consistency
                              between items
                            </div>
                          )}
                        </div>
                      </>
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
}
