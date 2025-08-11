
import React from 'react';
import { useEffect } from 'react';

export const ResultTable = ({ data = [] }) => {
  return (
    <table>
      <thead>
        <tr>
          {data[0].map((header, index) => (
            <th key={index}>{header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.slice(1).map((row, rowIndex) => (
          <tr key={rowIndex}>
            {row.map((cell, cellIndex) => (
              <td key={cellIndex}>{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};


export const CreateTable = ({ row, col, tableData, setTableData }) => {
  const createEmptyTable = (rows, cols) => {
    return Array.from({ length: rows }, () => Array.from({ length: cols }, () => ''));
  };

  // Initialize tableData if empty and row/col are set
  useEffect(() => {
    if (tableData.length === 0 && row > 0 && col > 0) {
      setTableData(createEmptyTable(row, col));
    }
  }, [row, col, setTableData, tableData.length]);

  return (
    <UpdateTable tableData={tableData} setTableData={setTableData} />
  );
};


export const UpdateTable = ({ tableData, setTableData }) => {
  const handleChangeMatrix = (r, c, value) => {
    const newMatrix = tableData.map(row => row.slice());
    newMatrix[r][c] = value;
    setTableData(newMatrix);
  };



  const deleteRow = (rowIndex) => {
    const newTableData = tableData.filter((_, index) => index !== rowIndex);
    setTableData(newTableData);
  };

  const deleteCol = (colIndex) => {
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

  return (
    <table className="mx-auto my-8 border-collapse table-auto">
      <thead>
        <tr>
          <th></th>
          {tableData[0].map((_, c) => (
            <th key={c}>
              <button type="button" onClick={() => deleteCol(c)} style={{ color: 'red' }}>×</button>
            </th>
          ))}
          <th>
            <button type="button" onClick={addCol} style={{ color: 'green' }}>＋</button>
          </th>
        </tr>
      </thead>
      <tbody>
        {tableData.map((row, r) => (
          <tr key={r}>
            <td>
              <button type="button" onClick={() => deleteRow(r)} style={{ color: 'red' }}>×</button>
            </td>
            {row.map((cell, c) => (
              <td key={c} style={{ border: '1px solid #ccc', padding: 2 }}>
                <input
                  type="text"
                  maxLength={3}
                  value={cell}
                  onChange={e => handleChangeMatrix(r, c, e.target.value)}
                  style={{ width: 40, textAlign: 'center' }}
                />
              </td>
            ))}
          </tr>
        ))}
        <tr>
          <td>
            <button type="button" onClick={addRow} style={{ color: 'green' }}>＋</button>
          </td>
          {tableData[0].map((_, c) => (
            <td key={c}></td>
          ))}
        </tr>
      </tbody>
    </table>
  );
};