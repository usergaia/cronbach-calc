import "./styles/App.css";
import { useState } from "react";
import { NavBar } from "./components/nav.jsx";
import { MainFeature } from "./components/main-feat.jsx";
import { Guide } from "./components/guide.jsx";
import { Footer } from "./components/footer.jsx";
import { ResultContainer } from "./components/result.jsx";

function App() {
  // Lift state up to App level to share between components
  const [matrix, setMatrix] = useState([]);
  const [alpha, setAlpha] = useState(null);

  return (
    <div className="flex min-h-screen flex-col">
      <NavBar />
      <section className="mt-2.5 flex py-13">
        <div className="flex items-start">
          <Guide />
          <MainFeature
            matrix={matrix}
            setMatrix={setMatrix}
            alpha={alpha}
            setAlpha={setAlpha}
          />
        </div>
      </section>

      <section className="w-full">
        <div className="mx-auto max-w-5xl px-4">
          <ResultContainer matrix={matrix} alpha={alpha} />
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default App;
