import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './styles/App.css'
import './utils/calcu.js'
import { calculateCronbachAlpha } from './utils/calcu.js'

function App() {
  const [alpha, setAlpha] = useState(null)
  const [file, setFile] = useState(null)

  const handleFileChange = (e) => {
    console.log('File selected:', e.target.files[0])
    setFile(e.target.files[0])
  }

  const handleCalculate = () => {
    console.log('Calculating Cronbach Alpha from file:', file.name)
    if (file) {

      const result = calculateCronbachAlpha(file)
      
      const reader = new FileReader()

      reader.onload = (evt) => {
        const data = evt.target.result
        if (data.endsWith('.csv')) {
          const rows = data.split('\n').map(row => row.split(','))
          const result = calculateCronbachAlpha(rows)
          setAlpha(result)
        }
        else if (data.endsWith('.xlsx')) {
          const workbook = XLSX.read(data, { type: 'binary' })
          const sheetName = workbook.SheetNames[0]
          const rows = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1 })
          const result = calculateCronbachAlpha(rows)
          setAlpha(result)
      }
    }
      console.log('result', result)
      // reader.readAsText(file)
    }
  }

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>

      <h1>Cronbach's Alpha Calculator</h1>
      <input id="file-upload" type="file" accept=".csv,.xlsx" onChange={(fileInput) => handleFileChange(fileInput)} />

      <button onClick={handleCalculate}>Press me</button>

      {alpha ? <p>File Selected: {alpha.name}</p> : <p>No File Selected</p>}  {/* Ignore */}
    </>
  )
}

export default App
