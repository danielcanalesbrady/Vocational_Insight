import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Grid,
  Typography,
  InputAdornment,
} from "@mui/material";
import { Email } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import logo from "../assets/img/icono_logo.svg";

const RecuperarContraseña = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm")); // Detectar pantallas pequeñas

  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});
  const [mensaje, setMensaje] = useState("");

  // Validar correo electrónico
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    return emailRegex.test(email);
  };

  // Validación en tiempo real
  useEffect(() => {
    if (email && !validateEmail(email)) {
      setErrors({ email: "El correo electrónico no es válido" });
    } else {
      setErrors({});
    }
  }, [email]);

  // Manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setErrors({ email: "El correo electrónico no es válido" });
    } else {
      setErrors({});
      try {
        const response = await fetch(
          "https://vocational-insight-562114386469.southamerica-west1.run.app/restablecer_contrasenna",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email }), // Enviando el correo ingresado al backend
          }
        );

        // Verificar la respuesta del servidor
        const responseData = await response.json();

        if (response.ok) {
          setMensaje(responseData.message); // Muestra el mensaje de éxito
        } else if (response.status === 404) {
          setMensaje("Usuario no encontrado");
        } else if (response.status === 400) {
          setMensaje("Falta el email");
        } else {
          throw new Error(
            responseData.message ||
              "Ocurrió un error. Intenta de nuevo más tarde."
          );
        }
      } catch (error) {
        setMensaje(error.message);
      }
    }
  };

  return (
    <Grid
      container
      style={{
        minHeight: "100vh",
        backgroundColor: "#2c3e50ff",
        margin: 0,
        padding: 0,
      }}
    >
      {/* Sección izquierda con logo y texto */}
      <Grid
        item
        xs={12}
        sm={6}
        md={6}
        style={{
          backgroundColor: "#2c3e50ff",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          color: "#fff",
          padding: isSmallScreen ? "1rem" : "2rem",
        }}
      >
        <img
          src={logo}
          alt="Logo"
          style={{
            width: isSmallScreen ? "100px" : "150px",
            marginBottom: "20px",
          }}
        />
        <Typography
          variant="h5"
          align="center"
          style={{
            fontWeight: "bold",
            marginBottom: "20px",
            fontSize: isSmallScreen ? "20px" : "24px",
          }}
        >
          Vocational Insight
        </Typography>
        <Typography
          variant="body1"
          align="center"
          style={{
            maxWidth: isSmallScreen ? "250px" : "300px",
            lineHeight: "1.4",
            fontSize: isSmallScreen ? "14px" : "16px",
          }}
        >
          Recupera tu cuenta en unos simples pasos.
        </Typography>
      </Grid>

      {/* Sección derecha con el formulario */}
      <Grid
        item
        xs={12}
        sm={6}
        md={6}
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#f4f4f4",
          padding: "2rem",
        }}
      >
        <Grid item xs={12} sm={10} md={8}>
          <Typography
            variant="h5"
            align="center"
            gutterBottom
            style={{
              fontWeight: "bold",
              marginBottom: "20px",
              fontSize: isSmallScreen ? "20px" : "24px",
            }}
          >
            Recuperar contraseña
          </Typography>

          <Typography
            variant="body1"
            align="center"
            style={{ marginBottom: "1rem" }}
          >
            Ingresa tu correo electrónico para recibir un enlace de
            recuperación.
          </Typography>

          <form onSubmit={handleSubmit}>
            <TextField
              label="Correo electrónico"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)} // Validación en tiempo real
              placeholder="Ingresa tu correo electrónico"
              error={!!errors.email}
              helperText={errors.email}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email style={{ color: "#ECB444", marginRight: "10px" }} />
                  </InputAdornment>
                ),
              }}
              fullWidth
              style={{ marginBottom: "1rem" }}
            />
            {mensaje && (
              <Typography
                variant="body2"
                color="primary"
                style={{ marginBottom: "1rem" }}
              >
                {mensaje}
              </Typography>
            )}

            <Button
              variant="contained"
              color="primary"
              fullWidth
              style={{
                backgroundColor: "#A3D6C4",
                padding: "12px",
                fontWeight: "bold",
                fontSize: "16px",
                borderRadius: "5px",
                transition: "background-color 0.3s ease",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
              }}
              type="submit"
            >
              ENVIAR ENLACE DE RECUPERACIÓN
            </Button>
          </form>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default RecuperarContraseña;
