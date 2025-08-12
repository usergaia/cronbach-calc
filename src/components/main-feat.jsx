import { useState } from "react";
import { calculateCronbachAlpha } from "../utils/calcu.js";
import { getAlpha } from "../utils/file-handling.js";
import { CreateTable, ResultTable } from "./table-view.jsx";

import { VscChromeClose } from "react-icons/vsc";
import { FiUpload } from "react-icons/fi";
import { MdFullscreen } from "react-icons/md";


export const MainFeature = () => {
  // Full screen popup state
  const [showTableFullScreen, setShowTableFullScreen] = useState(false);

  // Track NaN cells for error highlighting
  const [nanCells, setNanCells] = useState([]); // array of [rowIdx, colIdx]

  // for data handling
  const [alpha, setAlpha] = useState(null)
  const [file, setFile] = useState(null)
  const [matrix, setMatrix] = useState([])
  const [tableData, setTableData] = useState([])

  // for creating table
  const [tableRow, setTableRow] = useState(2)
  const [tableCol, setTableCol] = useState(2)
  const [confirmedRow, setConfirmedRow] = useState(0)
  const [confirmedCol, setConfirmedCol] = useState(0)

  //error handling
  const [errEF, setErrEF] = useState(null)
  const [rowError, setRowError] = useState("");
  const [colError, setColError] = useState("");
  const [errCells, setErrCells] = useState(null);


  // Input handlers with validation
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
    setTableData(Array.from({ length: row }, () => Array(col).fill('')));
    setErrEF(null);
    console.log('Confirmed:', row, col);
  }


  const resetTable = () => {
    confirmedCol && confirmedRow ? setTableData(Array.from({ length: confirmedRow }, () => Array(confirmedCol).fill(''))) : createTable();
  }

  const handleTableData = async () => {
    setErrEF(null);
    setNanCells([]);
    // Find NaN cells
    const nanList = [];
    tableData.forEach((row, i) => {
      row.forEach((cell, j) => {
        if (cell === '' || isNaN(Number(cell))) {
          nanList.push([i, j]);
        }
      });
    });
    if (nanList.length > 0) {
      setNanCells(nanList);
      setErrCells('Some cells are empty or invalid. Please correct highlighted cells.');
      return;
    } else {
      setErrCells(null);
    }
    try {
      const numericTableData = tableData.map(row => row.map(cell => Number(cell)));
      console.log('Current table data (numeric):', numericTableData);
      const tdAlpha = calculateCronbachAlpha(numericTableData);
      console.log('Calculated Cronbach Alpha:', tdAlpha);
      setAlpha(tdAlpha);
      setMatrix(numericTableData);
    } catch (error) {
      setErrEF('Failed to calculate Cronbach\'s Alpha: ' + (error?.message || error));
    }
  }
    
  return (
  <div className="top-0 max-w-5xl min-w-0 bg-gray-50 p-0 text-black mx-auto rounded-lg border-2 border-gray-300 shadow-xl/30">
  <div className="top-0 pt-8 px-4 w-full flex flex-col items-center">

        <div className="mb-4 text-left w-full max-w-md">
          <div className="mb-1">
            <span className="block text-gray-800 font-semibold text-sm">Upload Data File</span>
            <span className="block text-xs text-gray-500 mt-0.5 italic">Supported formats: <span className="underline">csv</span>, <span className="underline">xlsx</span>, <span className="underline">xls</span></span>
          </div>
          <div className="flex items-center gap-3 mt-2">

            {/* Hidden file input, triggered by Upload button */}
            <input
              id="customFileInput"
              type="file"
              className="hidden"
              onChange={async (e) => {
                const selectedFile = e.target.files[0];
                setFile(selectedFile);
                if (!selectedFile) return setErrEF('No file selected');
                setErrEF(null);
                setNanCells([]); // Clear NaN cell highlights
                setErrCells(null); // Clear error message
                try {
                  const res = await getAlpha(selectedFile);
                  if (res.alp === 'Invalid Data!' || res === false) {
                    setErrEF('Invalid file format or data');
                    return;
                  }
                  setTableData(res.mat);
                  setConfirmedRow(res.mat.length);
                  setConfirmedCol(res.mat[0]?.length || 0);
                } catch (error) {
                  setErrEF(
                    <div className='text-xs'>
                      <b>Failed to parse file: </b>
                      <i>{error?.message || error}</i>
                    </div>
                  );
                }
              }}
              ref={el => window._fileInputRef = el}
            />
            {/* File name display */}
            <div className="flex-1 min-w-0 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-600 truncate shadow-inner">
              {file ? file.name : <span className="italic text-gray-400">No file chosen</span>}
            </div>
            {/* Upload button triggers file input */}
            <button
              className="bg-neutral-900 hover:bg-blue-700 text-white px-5 py-2 rounded-lg flex items-center gap-2 shadow-md transition-colors duration-150"
              onClick={() => window._fileInputRef && window._fileInputRef.click()}
              type="button"
            >
              <FiUpload className="w-5 h-5" />
              <span className="font-medium">Upload</span>
            </button>
          </div>
          {errEF ? <i className="text-red-500 block mt-1 text-center opacity-70">{errEF}</i> : null}
        </div>

                    <div className="flex items-center my-6 w-full">
          <div className="flex-grow border-t-2 border-gray-300 shadow-sm opacity-60"></div>
          <span className="mx-4 text-gray-500 font-semibold">OR</span>
          <div className="flex-grow border-t-2 border-gray-300 shadow-sm opacity-60"></div>
        </div>

        <div className="flex flex-row items-center mb-4">
          <div className="flex flex-col items-center">
            <input
              className={`px-4 text-center text-slate-700 bg-slate-50 border ${rowError ? 'border-red-500' : 'border-slate-200'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:bg-slate-100 w-16 h-10 mr-2`}
              id="matr-row"
              type="number"
              min="1"
              placeholder="2"
              value={tableRow}
              onChange={handleRowChange}
            />
            {rowError && <span className="text-red-500 text-xs mt-1">{rowError}</span>}
          </div>
          <span className="mx-2"><VscChromeClose /></span>
          <div className="flex flex-col items-center">
            <input
              className={`px-4 text-center text-slate-700 bg-slate-50 border ${colError ? 'border-red-500' : 'border-slate-200'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:bg-slate-100 w-16 h-10 mr-2 ml-2`}
              id="matr-col"
              type="number"
              min="1"
              placeholder="2"
              value={tableCol}
              onChange={handleColChange}
            />
            {colError && <span className="text-red-500 text-xs mt-1">{colError}</span>}
          </div>

          <button className="relative h-12 overflow-hidden rounded bg-[#0183ce] px-5 py-2.5 text-white transition-all duration-300 hover:bg-neutral-800 hover:ring-2 hover:ring-neutral-800 hover:ring-offset-2 ml-2"><span className="relative" onClick={createTable}>Create</span></button>
          <button
            role="link" className="relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:w-full after:origin-bottom after:scale-x-0 after:bg-red-800 after:transition-transform after:duration-300 after:ease-[cubic-bezier(0.65_0.05_0.36_1)] hover:after:origin-bottom hover:after:scale-x-100 ml-2" onClick={resetTable}>
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






        <div className="w-full min-w-0 overflow-x-auto relative">
          <CreateTable
            row={2}
            col={2}
            tableData={tableData}
            setTableData={setTableData}
            nanCells={nanCells}
          />
        </div>

        {/* Full Screen Table Platform - fills viewport, no extra wrappers, table is the platform */}
        {showTableFullScreen && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-80 flex items-center justify-center m-0 p-0">
            <button
              type="button"
              className="absolute top-4 right-6 text-gray-500 hover:text-red-600 text-4xl font-bold z-50 bg-white bg-opacity-80 rounded-full px-3 py-1 shadow-lg"
              onClick={() => setShowTableFullScreen(false)}
              title="Close full screen table"
              style={{lineHeight:1}}
            >
              ×
            </button>
            <div className="w-screen h-screen flex items-center justify-center m-0 p-0">
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

        {errCells ? <div className="text-red-500 text-xs mt-1">{errCells}</div> : null}

        <button className="group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-md bg-neutral-950 px-6 font-medium text-neutral-50" onClick={handleTableData}>
          <span className="absolute h-0 w-0 rounded-full bg-blue-500 transition-all duration-300 group-hover:h-56 group-hover:w-32"></span>
          <span className="relative">Calculate</span>
        </button>
        <p className="mt-6">{alpha !== null ? `Cronbach's Alpha: ${alpha}` : null}</p>

        {matrix ? (matrix.length > 0 && <ResultTable data={matrix} />) : null}
      </div>
        </div>

  );
};
