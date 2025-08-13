import { MdFullscreen } from "react-icons/md";
import { useBodyScrollLock } from "../hooks/scLock-body";

export function DataMatrix({ data, inFullScreen = false, onFullScreenToggle }) {
  if (!data || !Array.isArray(data)) return null;

  useBodyScrollLock(inFullScreen);

  return (
    <div className={`w-full ${inFullScreen ? "h-full" : "mx-auto max-w-4xl"}`}>
      {!inFullScreen && (
        <div className="mb-6 flex items-center justify-center gap-2">
          <button
            className="ml-2 flex items-center justify-center rounded-full p-2 text-black hover:bg-gray-100"
            onClick={onFullScreenToggle}
            title="Full Screen Data Matrix"
          >
            <MdFullscreen style={{ fontSize: "1.3rem" }} />
          </button>
        </div>
      )}
      <div
        className={`rounded-xl border-2 border-blue-200 bg-blue-50 p-6 ${
          inFullScreen ? "h-full overflow-auto" : "max-h-[300px] overflow-auto"
        }`}
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
                    Item {idx + 1}
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
}
