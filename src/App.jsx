import { useState } from 'react'
import './styles/App.css'
import { getAlpha } from './utils/file-handling.js'
import { ResultTable, CreateTable} from './components/table-view.jsx'
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
    
    setConfirmedRow(Number(tableRow));
    setConfirmedCol(Number(tableCol));
    setTableData([]);
    console.log('Confirmed:', tableRow, tableCol);

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
      <input id="matr-row" type="number" min="1" placeholder="Number of rows" onChange={(e) => setTableRow(e.target.value)} />
      <input id="matr-col" type="number" min="1" placeholder="Number of columns" onChange={(e) => setTableCol(e.target.value)} />

      <button onClick={createTable}>Create</button>

      {confirmedRow > 0 && confirmedCol > 0 ? (
        <CreateTable
          row={confirmedRow}
          col={confirmedCol}
          data={[]}
          tableData={tableData}
          setTableData={setTableData}
        />
      ) : null}

      {confirmedRow && confirmedCol ? <button onClick={handleTableData}>Submit</button> : null}

      <br></br>
      <br></br>
      <input id="file-upload" type="file" accept=".csv,.xlsx" onChange={(fileInput) => handleFileChange(fileInput)} />

      <button onClick={handleFile}>Upload</button>


      <p>{alpha !== null ? `Cronbach's Alpha: ${alpha}` : 'No result available'}</p>

      {matrix ? (matrix.length > 0 && <ResultTable data={matrix} />) : null}

    </>
  )
}

export default App
