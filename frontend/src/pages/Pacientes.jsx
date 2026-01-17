import { useEffect, useState } from "react";
import "../styles/Pacientes.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

function Pacientes() {
  const [pacientes, setPacientes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    edad: "",
    sexo: "M"
  });

  // Obtener lista de pacientes
  const fetchPacientes = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`${API_URL}/pacientes`);
      if (!response.ok) {
        throw new Error("Error al obtener pacientes");
      }
      const data = await response.json();
      setPacientes(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Cargar pacientes al montar el componente
  useEffect(() => {
    fetchPacientes();
  }, []);

  // Manejar cambios en el formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Enviar formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.nombre || !formData.apellido || !formData.edad || !formData.sexo) {
      setError("Todos los campos son requeridos");
      return;
    }

    if (formData.edad < 0 || formData.edad > 150) {
      setError("La edad debe estar entre 0 y 150");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const response = await fetch(`${API_URL}/pacientes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          edad: parseInt(formData.edad)
        })
      });

      if (!response.ok) {
        throw new Error("Error al registrar paciente");
      }

      const newPaciente = await response.json();
      setPacientes([...pacientes, newPaciente]);
      setFormData({
        nombre: "",
        apellido: "",
        edad: "",
        sexo: "M"
      });
      setError("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Eliminar paciente
  const handleDelete = async (id) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar este paciente?")) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/pacientes/${id}`, {
        method: "DELETE"
      });

      if (!response.ok) {
        throw new Error("Error al eliminar paciente");
      }

      setPacientes(pacientes.filter(p => p.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="pacientes-container">
      <h2>Gestión de Pacientes</h2>

      {error && <div className="error-message">{error}</div>}

      {/* Formulario de registro */}
      <form className="paciente-form" onSubmit={handleSubmit}>
        <h3>Registrar Nuevo Paciente</h3>
        
        <div className="form-group">
          <label htmlFor="nombre">Nombre:</label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleInputChange}
            placeholder="Nombre"
          />
        </div>

        <div className="form-group">
          <label htmlFor="apellido">Apellido:</label>
          <input
            type="text"
            id="apellido"
            name="apellido"
            value={formData.apellido}
            onChange={handleInputChange}
            placeholder="Apellido"
          />
        </div>

        <div className="form-group">
          <label htmlFor="edad">Edad:</label>
          <input
            type="number"
            id="edad"
            name="edad"
            value={formData.edad}
            onChange={handleInputChange}
            placeholder="Edad"
            min="0"
            max="150"
          />
        </div>

        <div className="form-group">
          <label htmlFor="sexo">Sexo:</label>
          <select
            id="sexo"
            name="sexo"
            value={formData.sexo}
            onChange={handleInputChange}
          >
            <option value="M">Masculino</option>
            <option value="F">Femenino</option>
            <option value="O">Otro</option>
          </select>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Registrando..." : "Registrar Paciente"}
        </button>
      </form>

      {/* Lista de pacientes */}
      <div className="pacientes-list">
        <h3>Lista de Pacientes ({pacientes.length})</h3>
        
        {loading && <p className="loading">Cargando...</p>}
        
        {pacientes.length === 0 && !loading ? (
          <p className="no-data">No hay pacientes registrados</p>
        ) : (
          <div className="table-responsive">
            <table className="pacientes-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Apellido</th>
                  <th>Edad</th>
                  <th>Sexo</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {pacientes.map(paciente => (
                  <tr key={paciente.id}>
                    <td>{paciente.id}</td>
                    <td>{paciente.nombre}</td>
                    <td>{paciente.apellido}</td>
                    <td>{paciente.edad}</td>
                    <td>{paciente.sexo === 'M' ? 'Masculino' : paciente.sexo === 'F' ? 'Femenino' : 'Otro'}</td>
                    <td>
                      <button
                        className="btn-delete"
                        onClick={() => handleDelete(paciente.id)}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Pacientes;
