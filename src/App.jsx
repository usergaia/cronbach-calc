import { useState } from 'react'
import './styles/App.css'
import { getAlpha } from './utils/file-handling.js'
import { ResultTable, CreateTable } from './components/table-view.jsx'
import { calculateCronbachAlpha } from './utils/calcu.js'


function App() {

  // for data handling
  const [alpha, setAlpha] = useState(null)
  const [file, setFile] = useState(null)
  const [matrix, setMatrix] = useState([])
  const [tableData, setTableData] = useState([])

  // for creating table
  const [tableRow, setTableRow] = useState(0)
  const [tableCol, setTableCol] = useState(0)
  const [confirmedRow, setConfirmedRow] = useState(0)
  const [confirmedCol, setConfirmedCol] = useState(0)


  const handleFile = async () => {
    if (!file) return console.error('No file selected');

    try {
      console.log('Calculating Cronbach Alpha from file:', file.name)
      const res = await getAlpha(file)
      console.log('Cronbach Alpha in app.jsx:', res)
      setAlpha(res.alp)
      setMatrix(res.mat)
    } catch (error) {
      console.error('Failed to calculate alpha:', error)
    }
  }

  const handleFileChange = (e) => {
    console.log('File selected:', e.target.files[0])
    setFile(e.target.files[0])
  }

  const createTable = () => {
    if (!tableRow || !tableCol) {
      console.error('Invalid row or column input');
      return;
    }
    const row = Number(tableRow);
    const col = Number(tableCol);
    setConfirmedRow(row);
    setConfirmedCol(col);
    setTableData(Array.from({ length: row }, () => Array(col).fill('')));
    console.log('Confirmed:', row, col);
  }
  const handleTableData = async () => {
    try {
      const numericTableData = tableData.map(row => row.map(cell => Number(cell)));
      console.log('Current table data (numeric):', numericTableData);
      const tdAlpha = calculateCronbachAlpha(numericTableData);
      console.log('Calculated Cronbach Alpha:', tdAlpha);
      setAlpha(tdAlpha);
      setMatrix(numericTableData);
    } catch (error) {
      console.error('Failed to handle table data:', error);
    }

  }


  return (
    <>
      <h1>Cronbach's Alpha Calculator</h1>
      <input className='border p-2 mt-4 mb-2 mr-2' id="matr-row" type="number" min="1" placeholder="Number of rows" onChange={(e) => setTableRow(e.target.value)} />
      x
      <input className='border p-2 mt-4 mb-2 mr-2 ml-2' id="matr-col" type="number" min="1" placeholder="Number of columns" onChange={(e) => setTableCol(e.target.value)} />

      <button className="text-gray-900 bg-gradient-to-r from-teal-200 to-lime-200 hover:bg-gradient-to-l hover:from-teal-200 hover:to-lime-200 focus:ring-4 focus:outline-none focus:ring-lime-200 dark:focus:ring-teal-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2" onClick={createTable}>Create</button>



      {confirmedRow > 0 && confirmedCol > 0 && tableData.length > 0 ? (
        <>
      <button
        className="bg-[#242424] hover:bg-red-500" onClick={createTable}>
          Reset
      </button>
          <CreateTable
            row={confirmedRow}
            col={confirmedCol}
            tableData={tableData}
            setTableData={setTableData}
          />
        </>
      ) : null}

      {confirmedRow && confirmedCol ? <button className='bg-red-500 hover:bg-yellow-500' onClick={handleTableData}>Submit</button> : null}

      <br></br>
      <br></br>
      <input className='border p-2 mt-4 mb-2 mr-2' id="file-upload" type="file" accept=".csv,.xlsx" onChange={(fileInput) => handleFileChange(fileInput)} />

      <button className='bg-green-500 hover:bg-yellow-500' onClick={handleFile}>Upload</button>


      <p className='border border-lime-300'>{alpha !== null ? `Cronbach's Alpha: ${alpha}` : 'No result available'}</p>

      {matrix ? (matrix.length > 0 && <ResultTable data={matrix} />) : null}

    </>
  )
}

export default App
