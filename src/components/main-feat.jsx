import { useState } from "react";
import { calculateCronbachAlpha } from "../utils/calcu.js";
import { getAlpha } from "../utils/file-handling.js";
import { CreateTable, ResultTable } from "./table-view.jsx";
import { VscChromeClose } from "react-icons/vsc";


export const MainFeature = () => {
  // Track NaN cells for error highlighting
  const [nanCells, setNanCells] = useState([]); // array of [rowIdx, colIdx]
  // Error state for inputs
  const [rowError, setRowError] = useState("");
  const [colError, setColError] = useState("");

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



  const handleFile = async () => {
    if (!file) return setErrEF('No file selected');
    setErrEF(null); 
    try {
      console.log('Parsing file for table preview:', file.name)
      const res = await getAlpha(file)
      if (res.alp === 'Invalid Data!' || res === false) {
        setErrEF('Invalid file format or data');
        return;
      }
      // Instead of calculating, just set tableData for editing
      setTableData(res.mat)
      setConfirmedRow(res.mat.length)
      setConfirmedCol(res.mat[0]?.length || 0)
    } catch (error) {
      setErrEF('Failed to parse file: ' + (error?.message || error));
    }
  }

  const handleFileChange = (e) => {
    console.log('File selected:', e.target.files[0])
    setFile(e.target.files[0])
  }

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
      setErrEF('Some cells are empty or invalid. Please correct highlighted cells.');
      return;
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
  <div className="top-0 max-w-5xl min-w-0 bg-gray-50 p-0 text-black mx-auto rounded-lg border-2 border-gray-300 shadow-2xl">
  <div className="top-0 pt-8 px-4 w-full flex flex-col items-center">

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
        </div>

        <div className="w-full min-w-0 overflow-x-auto">
          <CreateTable
            row={2}
            col={2}
            tableData={tableData}
            setTableData={setTableData}
            nanCells={nanCells}
          />
        </div>
        <div className="flex items-center my-6 w-full">
          <div className="flex-grow border-t-2 border-gray-300 shadow-sm opacity-60"></div>
          <span className="mx-4 text-gray-500 font-semibold">OR</span>
          <div className="flex-grow border-t-2 border-gray-300 shadow-sm opacity-60"></div>
        </div>

<div className="mb-4">
  <label className="text-left block text-gray-600 text-sm mb-1"><b>Upload Data File </b><i>(.csv, .xslx, .xls)</i></label>
  <div className="flex">
    <input
      type="file"
      className="block w-full border border-gray-300 rounded-l px-2 py-1 text-sm"
      onChange={handleFileChange}
    />
    <button
      className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-1 rounded-r flex items-center"
      onClick={handleFile}
    >
      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4" />
      </svg>
      Upload
    </button>
  </div>
   {errEF ? <tt className="text-red-500">{errEF}</tt> : null}
</div>


        <button className='bg-[#0183ce] rounded-lg hover:bg-yellow-500 mt-6' onClick={handleTableData}>Calculate Cronbach's Alpha</button>
        <p className="mt-6">{alpha !== null ? `Cronbach's Alpha: ${alpha}` : null}</p>

        {matrix ? (matrix.length > 0 && <ResultTable data={matrix} />) : null}
      </div>
        </div>

  );
};
