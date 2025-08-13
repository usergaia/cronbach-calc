import { useState, useEffect } from "react";
import { IoIosWarning } from "react-icons/io";
import { DataMatrix } from "./data-matr-res.jsx";
import { ComputationVisualization } from "./comp-vis-res.jsx";

export function ResultContainer({ matrix, alpha }) {
  // State management
  const [showSolution, setShowSolution] = useState(false);
  const [fullScreenMatrix, setFullScreenMatrix] = useState(false);
  const [fullScreenAnalysis, setFullScreenAnalysis] = useState(false);
  const [computationData, setComputationData] = useState(null);
  const [description, setDescription] = useState("");
  const [invalid, setInvalid] = useState(null);
  const [errorDetails, setErrorDetails] = useState(null);

  const hasResult =
    Array.isArray(matrix) && matrix.length > 0 && Array.isArray(matrix[0]);

  // checks if alpha is valid
  useEffect(() => {
    if (!alpha) return;

    let newDescription = "";
    let newComputationData = null;
    let newInvalid = null;
    let newErrorDetails = null;

    if (typeof alpha === "object") {
      newComputationData = alpha.computationData;

      // handle error cases
      if (alpha.error) {
        newInvalid = alpha.error.message;
        newErrorDetails = {
          code: alpha.error.code,
          details: alpha.error.details,
          affectedItems: alpha.error.affectedItems,
          totalScore: alpha.error.totalScore,
        };
      } else if (alpha.invalid) {
        newInvalid = alpha.invalid;
      } else if (isNaN(alpha.alpha)) {
        newInvalid =
          "Invalid alpha value calculation (possible division by zero)";
      }
    }

    // Interpretation logic
    // use computationData to determine alpha for description
    let alphaForDescription = null;
    if (newComputationData && newComputationData.total_variance !== undefined) {
      alphaForDescription =
        newComputationData.total_variance > 0
          ? (newComputationData.n_items / (newComputationData.n_items - 1)) *
            (1 -
              newComputationData.sum_item_variances /
                newComputationData.total_variance)
          : 0;
    } else if (typeof alpha === "number") {
      alphaForDescription = alpha;
    }
    if (alphaForDescription !== null && !isNaN(alphaForDescription)) {
      if (alphaForDescription >= 0.9)
        newDescription = "Excellent Internal Consistency";
      else if (alphaForDescription >= 0.8)
        newDescription = "Good Internal Consistency";
      else if (alphaForDescription >= 0.7)
        newDescription = "Acceptable Internal Consistency";
      else if (alphaForDescription >= 0.6)
        newDescription = "Questionable Internal Consistency";
      else if (alphaForDescription >= 0.5)
        newDescription = "Poor Internal Consistency";
      else newDescription = "Unacceptable Internal Consistency";
    } else if (newInvalid) { // if invalid because of zero variance
      newDescription = "Invalid Calculation";
    }

    // Safe state updates
    if (
      JSON.stringify(computationData) !== JSON.stringify(newComputationData)
    ) {
      setComputationData(newComputationData);
    }
    if (invalid !== newInvalid) setInvalid(newInvalid);
    if (JSON.stringify(errorDetails) !== JSON.stringify(newErrorDetails)) {
      setErrorDetails(newErrorDetails);
    }
    if (description !== newDescription) setDescription(newDescription);
  }, [alpha]); // will trigger when alpha changes

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
          return <IoIosWarning className="text-red-700" />;
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

  return (
    <>
      {fullScreenMatrix && ( 
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85">
          <div className="relative mx-auto flex h-[90vh] w-full max-w-5xl flex-col rounded-lg bg-white p-0 shadow-2xl">
            <div className="flex items-center justify-between rounded-t-lg border-b border-gray-200 bg-gray-50 px-6 py-4">
              <h2 className="text-lg font-semibold text-gray-800">
                Tabular Data
              </h2>
              <button
                type="button"
                className="rounded-full bg-gray-200 p-2 text-2xl text-gray-600 hover:bg-red-100 hover:text-red-600"
                onClick={() => setFullScreenMatrix(false)}
              >
                ×
              </button>
            </div>
            <div className="flex-1 overflow-hidden rounded-b-lg bg-white p-6">
              <DataMatrix
                data={matrix}
                inFullScreen
                onFullScreenToggle={() => {}}
              />
            </div>
          </div>
        </div>
      )}

      <hr className="my-6 border-t-2 border-gray-300 opacity-60 shadow-sm" />
      <div className="mt-12 flex w-full flex-col items-center justify-center">
        <div className="flex w-full max-w-7xl flex-col items-center rounded-2xl border-2 border-gray-200 bg-white px-8 py-10 shadow-lg">
          {hasResult ? (
            <div className="w-full">
              <div className="mb-8 text-center">
                <div className="mb-2 text-3xl font-bold text-blue-800">
                  Cronbach's Alpha:{" "}
                  <span className="text-gray-900">
                    {computationData &&
                    computationData.total_variance !== undefined
                      ? computationData.total_variance > 0
                        ? (
                            (computationData.n_items /
                              (computationData.n_items - 1)) *
                            (1 -
                              computationData.sum_item_variances /
                                computationData.total_variance)
                          ).toFixed(4)
                        : "0.0000"
                      : "Undefined"}
                  </span>
                </div>
                <div className="mb-4 text-lg text-gray-600">{description}</div>
              </div>

              <ErrorDisplay error={invalid} errorDetails={errorDetails} />

              <DataMatrix
                data={matrix}
                onFullScreenToggle={() => setFullScreenMatrix(true)}
              />

              {computationData && (
                <div className="mt-8 mb-6 flex justify-center">
                  <button
                    onClick={() => setShowSolution(!showSolution)}
                    className="rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-3 font-semibold text-white shadow-lg hover:from-blue-700 hover:to-indigo-700"
                  >
                    {showSolution ? "Hide Solution" : "See Solution"}
                  </button>
                </div>
              )}

              {showSolution && computationData && (
                <div className="animate-in slide-in-from-top duration-500">
                  <ComputationVisualization
                    data={matrix}
                    computation={computationData}
                    fullScreenAnalysis={fullScreenAnalysis}
                    onFullScreenAnalysisToggle={() =>
                      setFullScreenAnalysis(!fullScreenAnalysis)
                    }
                    invalid={invalid}
                    errorDetails={errorDetails}
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
}
