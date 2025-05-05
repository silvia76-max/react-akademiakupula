// src/PingTest.jsx
import { useEffect, useState } from "react";

function PingTest() {
  const [message, setMessage] = useState("Conectando...");

  useEffect(() => {
    fetch("http://localhost:5000/api/test/ping")
      .then((res) => res.json())
      .then((data) => setMessage(data.message))
      .catch(() => setMessage("Error al conectar con Flask  😢"));
  }, []);

  return (
    <div style={{ padding: "2rem", fontSize: "1.2rem" }}>
      <strong>Respuesta del backend:</strong> {message}
    </div>
  );
}

export default PingTest;
