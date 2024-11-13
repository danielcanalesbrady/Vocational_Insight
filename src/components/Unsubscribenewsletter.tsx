import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Container,
  CircularProgress,
} from "@mui/material";
import logo from "../assets/img/icono_logo.svg";
import { useNavigate } from "react-router-dom";

const UnsubscribeNewsletter = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showCheck, setShowCheck] = useState(false);

  useEffect(() => {
    const storedEmail = localStorage.getItem("userEmail");

    if (storedEmail) {
      setEmail(storedEmail);
      handleUnsubscribe(storedEmail);
    } else {
      setError("No se pudo identificar al usuario. Inicia sesión primero.");
    }
  }, []);

  const handleUnsubscribe = async (email: string) => {
    setMessage("");
    setError("");
    setLoading(true);
    setShowCheck(false);

    try {
      const response = await fetch(
        "https://vocational-insight-562114386469.southamerica-west1.run.app/desuscripcion",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setShowCheck(true);
        if (data.estado_actualizado === 0) {
          setMessage(
            `Te has dado de baja correctamente de nuestro boletín con el correo: ${email}.`
          );
        } else if (data.estado_actual === 0) {
          setMessage(
            `Ya estabas desuscrito del boletín con el correo: ${email}.`
          );
        }
      } else if (response.status === 404) {
        setError("Usuario no encontrado.");
      } else {
        setError(data.error || "Ocurrió un error al desuscribirse.");
      }
    } catch (err) {
      setError("Ocurrió un error al conectar con la API.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        backgroundColor: "#2c3e50",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Container
        maxWidth="sm"
        sx={{
          textAlign: "center",
          padding: 4,
          backgroundColor: "#34495e",
          borderRadius: "10px",
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
        }}
      >
        <img
          src={logo}
          alt="Vocational Insight Logo"
          style={{ height: "100px", marginBottom: "10px" }}
        />

        {/* Checkmark SVG Animation */}
        {showCheck && (
          <Box sx={{ marginBottom: "20px", marginTop: "-10px" }}>
            <svg viewBox="0 0 64 64" width="60" height="60">
              <path
                fill="none"
                stroke="green"
                strokeWidth="4"
                strokeMiterlimit="10"
                d="M8,32 L28,52 L56,12"
                className="checkmark-path"
              />
              <animate
                attributeName="stroke-dashoffset"
                from="100"
                to="0"
                dur="0.5s"
                fill="freeze"
              />
              <animate
                attributeName="stroke-dasharray"
                from="0 100"
                to="100 0"
                dur="0.5s"
                fill="freeze"
              />
            </svg>
          </Box>
        )}

        <Typography
          variant="h4"
          sx={{ fontWeight: "bold", marginBottom: 2, color: "#fff" }}
        >
          ¡Desuscribirse del Boletín!
        </Typography>

        {email && (
          <Typography
            variant="body1"
            sx={{ marginBottom: 4, color: "#ecf0f1" }}
          >
            Desuscribiendo a: {email}
          </Typography>
        )}

        {loading ? (
          <Box sx={{ marginBottom: 4 }}>
            <CircularProgress />
            <Typography variant="body2" sx={{ color: "#ecf0f1", marginTop: 2 }}>
              Procesando...
            </Typography>
          </Box>
        ) : (
          <>
            {message && (
              <Typography
                variant="body1"
                sx={{ marginBottom: 4, color: "#ecf0f1" }}
              >
                {message}
              </Typography>
            )}
            {error && (
              <Typography
                variant="body1"
                sx={{ marginBottom: 4, color: "red" }}
              >
                {error}
              </Typography>
            )}
          </>
        )}

        <Button
          variant="contained"
          onClick={() => navigate("/login")}
          disabled={loading}
          sx={{
            backgroundColor: "#f39c12",
            color: "#fff",
            padding: "12px",
            fontWeight: "bold",
            fontSize: "16px",
            borderRadius: "5px",
            transition: "background-color 0.3s ease",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
            "&:hover": { backgroundColor: "#e67e22" },
          }}
        >
          INICIAR SESIÓN
        </Button>
      </Container>
    </Box>
  );
};

export default UnsubscribeNewsletter;
