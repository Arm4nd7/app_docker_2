import { useState } from 'react'
import './App.css'
import Pacientes from './pages/Pacientes'

function App() {
  const [currentPage, setCurrentPage] = useState('pacientes')

  return (
    <div className="app">
      <header className="navbar">
        <div className="navbar-container">
          <h1>Sistema Médico</h1>
          <nav className="nav-links">
            <button 
              onClick={() => setCurrentPage('pacientes')}
              className={currentPage === 'pacientes' ? 'active' : ''}
            >
              Pacientes
            </button>
          </nav>
        </div>
      </header>
      
      <main className="main-content">
        {currentPage === 'pacientes' && <Pacientes />}
      </main>
    </div>
  )
}

export default App
