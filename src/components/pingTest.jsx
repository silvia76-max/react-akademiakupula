// src/PingTest.jsx
import { useEffect, useState } from "react";

function PingTest() {
  const [message, setMessage] = useState("Conectando...");
  const [pingAttempted, setPingAttempted] = useState(false);

  useEffect(() => {
    // Verificar si ya se ha intentado hacer ping en esta sesión
    const hasPinged = sessionStorage.getItem('hasPinged');

    if (!hasPinged && !pingAttempted) {
      setPingAttempted(true);

      // Usar un controlador de aborto para limitar el tiempo de espera
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      fetch("http://localhost:5000/api/test/ping", {
        signal: controller.signal
      })
        .then((res) => res.json())
        .then((data) => {
          setMessage(data.message);
          // Guardar en sessionStorage para no volver a hacer ping
          sessionStorage.setItem('hasPinged', 'true');
        })
        .catch((error) => {
          console.log("Error de ping:", error.name);
          if (error.name === 'AbortError') {
            setMessage("Tiempo de espera agotado al conectar con Flask");
          } else {
            setMessage("Error al conectar con Flask 😢");
          }
          // Guardar en sessionStorage para no volver a hacer ping
          sessionStorage.setItem('hasPinged', 'true');
        })
        .finally(() => {
          clearTimeout(timeoutId);
        });
    } else if (hasPinged) {
      // Si ya se ha hecho ping, usar el mensaje guardado o uno por defecto
      setMessage("Conexión con Flask verificada anteriormente");
    }
  }, [pingAttempted]);

  return (
    <div style={{ padding: "1rem", fontSize: "0.9rem", color: "#666", background: "#f5f5f5", borderRadius: "4px", margin: "0.5rem" }}>
      <strong>Estado del backend:</strong> {message}
    </div>
  );
}

export default PingTest;
