import React from 'react';
import { useEffect } from 'react';


export const ResultTable = ({ data = [] }) => {
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full border-collapse bg-white shadow rounded-lg text-lg">
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <td key={cellIndex} className="text-black px-8 py-4 border-b text-center">{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export const CreateTable = ({ row, col, tableData, setTableData, nanCells = [] }) => {
  const createEmptyTable = (rows, cols) => {
    return Array.from({ length: rows }, () => Array.from({ length: cols }, () => ''));
  };

  useEffect(() => {
    if (tableData.length === 0 && row > 0 && col > 0) {
      setTableData(createEmptyTable(row, col));
    }
  }, [row, col, setTableData, tableData.length]);

  return (
    <UpdateTable tableData={tableData} setTableData={setTableData} nanCells={nanCells} />
  );
};

export const UpdateTable = ({ tableData, setTableData, nanCells = [] }) => {
  const handleChangeMatrix = (r, c, value) => {
    const newMatrix = tableData.map(row => row.slice());
    newMatrix[r][c] = value;
    setTableData(newMatrix);
  };

  const deleteRow = (rowIndex) => {

    if (tableData.length < 3) {
      console.error('Cannot delete row: table must have at least 2 rows');
      return;
    }

    const newTableData = tableData.filter((_, index) => index !== rowIndex);
    setTableData(newTableData);
  };

  const deleteCol = (colIndex) => {

    if (tableData[0].length < 3) {
      console.error('Cannot delete column: table must have at least 2 columns');
      return;
    }

    const newTableData = tableData.map(row => row.filter((_, index) => index !== colIndex));
    setTableData(newTableData);
  };

  const addRow = () => {
    if (tableData.length === 0) return;
    const cols = tableData[0].length;
    setTableData([...tableData, Array(cols).fill('')]);
  };

  const addCol = () => {
    setTableData(tableData.map(row => [...row, '']));
  };

  if (!tableData || tableData.length === 0) return null;

  // Helper to check if a cell is in nanCells
  const isNanCell = (r, c) => nanCells.some(([row, col]) => row === r && col === c);

  return (
    <div className="w-full max-w-6xl mx-auto p-6 pr-20 relative">
      {/* Add Column Button - Positioned outside on the right */}
      <button
        type="button"
        onClick={addCol}
        className="absolute top-1/2 right-4 z-20 group flex items-center justify-center w-12 h-12 rounded-xl bg-emerald-50 hover:bg-emerald-400 border border-emerald-200 hover:border-emerald-300 text-emerald-500 hover:text-white font-bold text-2xl shadow-lg button"
        style={{ translate: '0 -50%' }}
        title="Add column"
      >
        +
      </button>

      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full relative">
            {/* Header with column controls */}
            <div className="bg-gradient-to-r from-slate-50 to-slate-100 px-4 py-4 border-b border-slate-200">
              <div className="grid gap-2 items-center" style={{gridTemplateColumns: `40px repeat(${tableData[0].length}, minmax(120px, 1fr))`}}>
                <div className="w-10 h-8"></div>
                {tableData[0].map((_, c) => (
                  <div key={c} className="flex justify-center items-center h-12">
                    <button 
                      type="button" 
                      onClick={() => deleteCol(c)} 
                      className="group flex items-center justify-center w-12 h-12 rounded-xl bg-red-50 hover:bg-red-400 border border-red-200 hover:border-red-300 transition-all duration-200 text-red-500 hover:text-white font-bold text-2xl shadow-lg"
                      title="Delete column"
                    >
                      −
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Table body */}
            <div className="p-4 relative flex flex-col" style={{ maxHeight: '520px' }}>
              <div className="flex-1 overflow-y-auto">
                {tableData.map((row, r) => (
                  <div key={r} className="flex items-center gap-2 mb-3 last:mb-0">
                    {/* Row delete button */}
                    <div className="m-2 w-10 flex justify-center">
                      <button 
                        type="button" 
                        onClick={() => deleteRow(r)} 
                        className="group flex items-center justify-center w-12 h-12 rounded-xl bg-red-50 hover:bg-red-400 border border-red-200 hover:border-red-300 transition-all duration-200 text-red-500 hover:text-white font-bold text-2xl shadow-lg m-0.5"
                        title="Delete row"
                      >
                      −
                      </button>
                    </div>

                    {/* Row cells */}
                    {row.map((cell, c) => (
                      <div key={c} className="flex-1 min-w-24 m-2">
                        <input
                          type="text"
                          value={cell}
                          onChange={e => handleChangeMatrix(r, c, e.target.value)}
                          className={`w-full h-12 px-4 text-center text-slate-700 bg-slate-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:bg-slate-100 ${isNanCell(r, c) ? 'border-red-500 bg-red-50' : 'border-slate-200'}`}
                          placeholder="Enter value"
                        />
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Row Button - Positioned outside below the table */}
      <div className="flex justify-center mt-4">
        <button 
          type="button" 
          onClick={addRow} 
          className="group flex items-center justify-center w-12 h-12 rounded-xl bg-emerald-50 hover:bg-emerald-400 border border-emerald-200 hover:border-emerald-300 text-emerald-500 hover:text-white font-bold text-2xl shadow-lg"
          title="Add row"
        >
        +
        </button>
      </div>
    </div>
  );
};