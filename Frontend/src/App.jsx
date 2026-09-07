import InscripcionForm from "./components/InscripcionForm/InscripcionForm";
import "./App.css";

function App() {
  return (
    <div className="app-layout">
      <header className="app-header">
        <span className="app-badge">Club de Beneficios</span>
        <h1 className="app-title">Regístrate en nuestro programa de fidelidad</h1>
        <p className="app-subtitle">
          Únete para acumular puntos, recibir promociones personalizadas y acceder a beneficios exclusivos con nuestras marcas asociadas.
        </p>
      </header>
      <main className="app-main">
        <InscripcionForm />
      </main>
    </div>
  );
}

export default App;