import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './styles/App.css'
import { getAlpha } from './utils/file-handling.js'
import { TableView } from './components/table-view.jsx'

function App() {
  const [alpha, setAlpha] = useState(null)
  const [file, setFile] = useState(null)
  const [matrix, setMatrix] = useState([])

  const handleFileChange = (e) => {
    console.log('File selected:', e.target.files[0])
    setFile(e.target.files[0])
  }

  const handleCalculate = async () => {
    if (!file) return

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

      <p>{alpha !== null ? `Cronbach's Alpha: ${alpha}` : 'No result available'}</p>

      {matrix ? (matrix.length > 0 && <TableView data={matrix} />) : null}
    </>
  )
}

export default App
