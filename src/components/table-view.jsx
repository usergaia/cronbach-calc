import React from "react";
import { useEffect } from "react";

export const CreateTable = ({
  row,
  col,
  tableData,
  setTableData,
  nanCells = [],
}) => {
  // return a table with the specified number of rows and columns
  const createEmptyTable = (rows, cols) => {
    return Array.from({ length: rows }, () =>
      Array.from({ length: cols }, () => ""),
    );
  };

  // create table on mount
  useEffect(() => {
    if (tableData.length === 0 && row > 0 && col > 0) {
      setTableData(createEmptyTable(row, col));
    }
  }, [row, col, setTableData, tableData.length]);

  return (
    // render the table
    <UpdateTable
      tableData={tableData}
      setTableData={setTableData}
      nanCells={nanCells}
    />
  );
};

// handles modification of the table and error states of each cells
export const UpdateTable = ({ tableData, setTableData, nanCells = [] }) => {
  const handleChangeMatrix = (r, c, value) => {
    const newMatrix = tableData.map((row) => row.slice());
    newMatrix[r][c] = value;
    setTableData(newMatrix);
  };

  const deleteRow = (rowIndex) => {
    if (tableData.length < 3) {
      console.error("Cannot delete row: table must have at least 2 rows");
      return;
    }

    const newTableData = tableData.filter((_, index) => index !== rowIndex);
    setTableData(newTableData);
  };

  const deleteCol = (colIndex) => {
    if (tableData[0].length < 3) {
      console.error("Cannot delete column: table must have at least 2 columns");
      return;
    }

    const newTableData = tableData.map((row) =>
      row.filter((_, index) => index !== colIndex),
    );
    setTableData(newTableData);
  };

  const addRow = () => {
    if (tableData.length === 0) return;
    const cols = tableData[0].length;
    setTableData([...tableData, Array(cols).fill("")]);
  };

  const addCol = () => {
    setTableData(tableData.map((row) => [...row, ""]));
  };

  if (!tableData || tableData.length === 0) return null;

  // check if a cell is in nanCells
  const isNanCell = (r, c) =>
    nanCells.some(([row, col]) => row === r && col === c);

  return (
    <div className="relative mx-auto w-full max-w-6xl p-6 pr-20">
      <button
        type="button"
        onClick={addCol}
        className="group button absolute top-1/2 right-4 z-20 flex h-12 w-12 items-center justify-center rounded-xl border border-emerald-200 bg-emerald-50 text-2xl font-bold text-emerald-500 shadow-lg hover:border-emerald-300 hover:bg-emerald-400 hover:text-white"
        style={{ translate: "0 -50%" }}
        title="Add column"
      >
        +
      </button>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg">
        <div className="overflow-x-auto">
          <div className="relative inline-block min-w-full">
            <div className="border-b border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100 px-4 py-4">
              <div
                className="grid items-center gap-2"
                style={{
                  gridTemplateColumns: `40px repeat(${tableData[0].length}, minmax(120px, 1fr))`,
                }}
              >
                <div className="h-8 w-10"></div>
                {tableData[0].map((_, c) => (
                  <div
                    key={c}
                    className="flex h-12 items-center justify-center"
                  >
                    <button
                      type="button"
                      onClick={() => deleteCol(c)}
                      className="group flex h-12 w-12 items-center justify-center rounded-xl border border-red-200 bg-red-50 text-2xl font-bold text-red-500 shadow-lg transition-all duration-200 hover:border-red-300 hover:bg-red-400 hover:text-white"
                      title="Delete column"
                    >
                      −
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* table body */}
            <div
              className="relative flex flex-col p-4"
              style={{ maxHeight: "520px" }}
            >
              <div className="flex-1 overflow-y-auto">
                {tableData.map((row, r) => (
                  <div
                    key={r}
                    className="mb-3 flex items-center gap-2 last:mb-0"
                  >
                    {/* row delete button */}
                    <div className="m-2 flex w-10 justify-center">
                      <button
                        type="button"
                        onClick={() => deleteRow(r)}
                        className="group m-0.5 flex h-12 w-12 items-center justify-center rounded-xl border border-red-200 bg-red-50 text-2xl font-bold text-red-500 shadow-lg transition-all duration-200 hover:border-red-300 hover:bg-red-400 hover:text-white"
                        title="Delete row"
                      >
                        −
                      </button>
                    </div>

                    {/* row cells */}
                    {row.map((cell, c) => (
                      <div key={c} className="m-2 min-w-24 flex-1">
                        <input
                          type="text"
                          value={cell}
                          onChange={(e) =>
                            handleChangeMatrix(r, c, e.target.value)
                          }
                          className={`h-12 w-full rounded-lg border bg-slate-50 px-4 text-center text-slate-700 transition-all duration-200 hover:bg-slate-100 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none ${isNanCell(r, c) ? "border-red-500 bg-red-50" : "border-slate-200"}`}
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
      <div className="mt-4 flex justify-center">
        <button
          type="button"
          onClick={addRow}
          className="group flex h-12 w-12 items-center justify-center rounded-xl border border-emerald-200 bg-emerald-50 text-2xl font-bold text-emerald-500 shadow-lg hover:border-emerald-300 hover:bg-emerald-400 hover:text-white"
          title="Add row"
        >
          +
        </button>
      </div>
    </div>
  );
};
