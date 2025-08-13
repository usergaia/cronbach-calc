import { useState } from "react";
import { calculateCronbachAlpha } from "../utils/calcu.js";
import { getAlpha } from "../utils/file-handling.js";
import { CreateTable } from "./table-view.jsx";

import { VscChromeClose } from "react-icons/vsc";
import { FiUpload } from "react-icons/fi";
import { MdFullscreen } from "react-icons/md";
import { useBodyScrollLock } from "../hooks/scLock-body.js";

export const MainFeature = ({ setMatrix, setAlpha }) => {
  // full screen popup state
  const [showTableFullScreen, setShowTableFullScreen] = useState(false);

  // Track NaN cells for error highlighting
  const [nanCells, setNanCells] = useState([]); // array of [rowIdx, colIdx]

  // for data handling
  const [file, setFile] = useState(null);
  const [tableData, setTableData] = useState([]);

  // for creating table
  const [tableRow, setTableRow] = useState(2);
  const [tableCol, setTableCol] = useState(2);
  const [confirmedRow, setConfirmedRow] = useState(0);
  const [confirmedCol, setConfirmedCol] = useState(0);

  //error handling
  const [errEF, setErrEF] = useState(null);
  const [rowError, setRowError] = useState("");
  const [colError, setColError] = useState("");
  const [errCells, setErrCells] = useState(null);


  useBodyScrollLock(showTableFullScreen);

  const handleRowChange = (e) => {
    const value = e.target.value;
    setTableRow(value);
    if (!value || isNaN(value) || Number(value) < 2) {
      setRowError("Minimum is 2");
    } else {
      setRowError("");
    }
  };

  const handleColChange = (e) => {
    const value = e.target.value;
    setTableCol(value);
    if (!value || isNaN(value) || Number(value) < 2) {
      setColError("Minimum is 2");
    } else {
      setColError("");
    }
  };

  const createTable = () => {
    setErrEF(null);
    if (rowError || colError) {
      setErrEF("Please fix input errors above.");
      return;
    }
    if (!tableRow || !tableCol) {
      setRowError("Required");
      setColError("Required");
      setErrEF("Row and column are required.");
      return;
    }
    if (tableRow < 2 || tableCol < 2) {
      setRowError("Minimum is 2");
      setColError("Minimum is 2");
      setErrEF("Table dimensions must be at least 2x2.");
      return;
    }
    const row = Number(tableRow);
    const col = Number(tableCol);
    setConfirmedRow(row);
    setConfirmedCol(col);
    setTableData(Array.from({ length: row }, () => Array(col).fill("")));
    setErrEF(null);
  };

  {
    /* resets with the dimensions of the recently created table */
  }
  const resetTable = () => {
    confirmedCol && confirmedRow
      ? setTableData(
          Array.from({ length: confirmedRow }, () =>
            Array(confirmedCol).fill(""),
          ),
        )
      : createTable();
  };

  const handleTableData = async () => {
    setErrEF(null);
    setNanCells([]);

    // tracks NaN cells for error highlighting
    const nanList = [];
    tableData.forEach((row, i) => {
      row.forEach((cell, j) => {
        if (cell === "" || isNaN(Number(cell))) {
          nanList.push([i, j]);
        }
      });
    });

    if (nanList.length > 0) {
      setNanCells(nanList);
      setErrCells(
        "Please ensure that all highlighted cells contain numeric values.",
      );
      goToTable();
      return;
    } else {
      setErrCells(null);
    }
    try {
      const numericTableData = tableData.map((row) =>
        row.map((cell) => Number(cell)),
      );
      const tdAlpha = calculateCronbachAlpha(numericTableData);
      setAlpha(tdAlpha);
      setMatrix(numericTableData);
    } catch (error) {
      setErrEF(
        "Failed to calculate Cronbach's Alpha: " + (error?.message || error),
      );
    }
  };

  return (
    <div className="top-0 mx-auto max-w-5xl min-w-0 rounded-lg border-2 border-gray-300 bg-gray-50 p-0 text-black shadow-xl/30">
      <div className="top-0 flex w-full flex-col items-center px-4 pt-8">
        <div className="mb-4 w-full max-w-md text-left">
          <div className="mb-1">
            <span className="block text-sm font-semibold text-gray-800">
              Upload Data File
            </span>
            <span className="mt-0.5 block text-xs text-gray-500 italic">
              Supported formats: <span className="underline">csv</span>,{" "}
              <span className="underline">xlsx</span>,{" "}
              <span className="underline">xls</span>
            </span>
          </div>
          <div className="mt-2 flex items-center gap-3">
            <input
              id="customFileInput"
              type="file"
              className="hidden"
              onChange={async (e) => {
                const selectedFile = e.target.files[0];
                setFile(selectedFile);
                if (!selectedFile) return setErrEF("No file selected");
                setErrEF(null);
                setNanCells([]); // Clear NaN cell highlights
                setErrCells(null); // Clear error message
                try {
                  const res = await getAlpha(selectedFile);
                  if (res.alp === "Invalid Data!" || res === false) {
                    setErrEF("Invalid file format or data");
                    return;
                  }
                  setTableData(res.mat);
                  setConfirmedRow(res.mat.length);
                  setConfirmedCol(res.mat[0]?.length || 0);
                } catch (error) {
                  setErrEF(
                    <div className="text-xs">
                      <b>Failed to parse file: </b>
                      <i>{error?.message || error}</i>
                    </div>,
                  );
                }
              }}
              ref={(el) => (window._fileInputRef = el)}
            />
            {/* File name display */}
            <div className="min-w-0 flex-1 truncate rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-600 shadow-inner">
              {file ? (
                file.name
              ) : (
                <span className="text-gray-400 italic">No file chosen</span>
              )}
            </div>
            {/* Upload button triggers file input */}
            <button
              className="flex items-center gap-2 rounded-lg bg-neutral-900 px-5 py-2 text-white shadow-md transition-colors duration-150 hover:bg-blue-700"
              onClick={() =>
                window._fileInputRef && window._fileInputRef.click()
              }
              type="button"
            >
              <FiUpload className="h-5 w-5" />
              <span className="font-medium">Upload</span>
            </button>
          </div>
          {errEF ? (
            <i className="mt-1 block text-center text-red-500 opacity-70">
              {errEF}
            </i>
          ) : null}
        </div>

        <div className="my-6 flex w-full items-center">
          <div className="flex-grow border-t-2 border-gray-300 opacity-60 shadow-sm"></div>
          <span className="mx-4 font-semibold text-gray-500">OR</span>
          <div className="flex-grow border-t-2 border-gray-300 opacity-60 shadow-sm"></div>
        </div>

        {/* table creation inputs */}
        <div className="mb-4 flex flex-row items-center">
          <div className="flex flex-col items-center">
            <input
              className={`border bg-slate-50 px-4 text-center text-slate-700 ${rowError ? "border-red-500" : "border-slate-200"} mr-2 h-10 w-16 rounded-lg transition-all duration-200 hover:bg-slate-100 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none`}
              id="matr-row"
              type="number"
              min="1"
              placeholder="2"
              value={tableRow}
              onChange={handleRowChange}
            />
            {rowError && (
              <span className="mt-1 text-xs text-red-500">{rowError}</span>
            )}
          </div>
          <span className="mx-2">
            <VscChromeClose />
          </span>
          <div className="flex flex-col items-center">
            <input
              className={`border bg-slate-50 px-4 text-center text-slate-700 ${colError ? "border-red-500" : "border-slate-200"} mr-2 ml-2 h-10 w-16 rounded-lg transition-all duration-200 hover:bg-slate-100 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none`}
              id="matr-col"
              type="number"
              min="1"
              placeholder="2"
              value={tableCol}
              onChange={handleColChange}
            />
            {colError && (
              <span className="mt-1 text-xs text-red-500">{colError}</span>
            )}
          </div>

          <button className="relative ml-2 h-12 overflow-hidden rounded bg-[#0183ce] px-5 py-2.5 text-white shadow-lg transition-all duration-300 hover:bg-neutral-800 hover:ring-2 hover:ring-neutral-800 hover:ring-offset-2">
            <span className="relative" onClick={createTable}>
              Create
            </span>
          </button>

          <button
            role="link"
            className="relative ml-2 after:absolute after:right-0 after:bottom-0 after:left-0 after:h-[2px] after:w-full after:origin-bottom after:scale-x-0 after:bg-red-800 after:transition-transform after:duration-300 after:ease-[cubic-bezier(0.65_0.05_0.36_1)] hover:after:origin-bottom hover:after:scale-x-100"
            onClick={resetTable}
          >
            Reset
          </button>
          <button
            type="button"
            className="transition-transform duration-200 hover:scale-110"
            onClick={() => setShowTableFullScreen(true)}
            title="Open table in full screen"
          >
            <MdFullscreen />
          </button>
        </div>

        <div className="relative w-full min-w-0 overflow-x-auto">
          <CreateTable
            row={2}
            col={2}
            tableData={tableData}
            setTableData={setTableData}
            nanCells={nanCells}
          />
        </div>

        {/* full screen modal for better qol in table view */}
        {showTableFullScreen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90">
            {/* Floating close button */}
            <button
              type="button"
              className="fixed top-6 right-8 z-50 rounded-full bg-gray-200 p-3 text-3xl text-gray-600 shadow-lg transition-colors hover:bg-red-100 hover:text-red-600"
              onClick={() => setShowTableFullScreen(false)}
              title="Close full screen table"
              style={{ lineHeight: 1 }}
            >
              ×
            </button>
            <div className="w-full max-w-6xl px-2 scale-100">
              <CreateTable
                row={2}
                col={2}
                tableData={tableData}
                setTableData={setTableData}
                nanCells={nanCells}
              />
            </div>
          </div>
        )}

        {errCells ? (
          <div className="mt-1 mb-4 text-xs text-red-500">{errCells}</div>
        ) : null}

        <button
          className="group relative mb-8 inline-flex h-12 items-center justify-center overflow-hidden rounded-md bg-neutral-950 px-6 font-medium text-neutral-50"
          onClick={handleTableData}
        >
          <span className="absolute h-0 w-0 rounded-full bg-blue-500 transition-all duration-300 group-hover:h-56 group-hover:w-32"></span>
          <span className="relative">Calculate</span>
        </button>
      </div>
    </div>
  );
};
