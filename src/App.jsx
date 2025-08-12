import './styles/App.css'
import { NavBar } from './components/nav.jsx'
import { MainFeature } from './components/main-feat.jsx'
import { Guide } from './components/guide.jsx'
import { Footer } from './components/footer.jsx'

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <section className="flex-1 py-13">
        <div className="flex items-start">
          <Guide />
          <MainFeature />
        </div>
      </section>
      <Footer />
    </div>
  )
}

export default App;
