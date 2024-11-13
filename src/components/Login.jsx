import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Grid,
  FormControl,
  InputAdornment,
  Typography,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { Email, Lock, Visibility, VisibilityOff } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import logo from "../assets/img/icono_logo.svg";

const Login = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const [formData, setFormData] = useState({
    email: "",
    contraseña: "",
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Estado de carga
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    validateField(name, value);
  };

  const validateField = (name, value) => {
    let errorMsg = "";
    if (
      name === "email" &&
      (!value || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value))
    ) {
      errorMsg = "El correo electrónico no es válido";
    } else if (name === "contraseña" && (!value || value.length < 8)) {
      errorMsg =
        "La contraseña debe tener al menos 8 caracteres, incluyendo letras y números";
    }
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: errorMsg,
    }));
  };

  const validateFields = () => {
    const newErrors = {};
    if (
      !formData.email ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(formData.email)
    )
      newErrors.email = "El correo electrónico no es válido";
    if (!formData.contraseña || formData.contraseña.length < 8)
      newErrors.contraseña =
        "La contraseña debe tener al menos 8 caracteres, incluyendo letras y números";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateFields()) {
      setIsLoading(true); // Iniciar la carga
      const requestBody = {
        email: formData.email,
        contrasena: formData.contraseña,
      };

      try {
        const response = await fetch(
          "https://vocational-insight-562114386469.southamerica-west1.run.app/login",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(requestBody),
          }
        );

        const data = await response.json().catch(() => {
          throw new Error("La cuenta no existe o no está registrada.");
        });

        if (!response.ok) {
          throw new Error(data.message || "Error en el inicio de sesión");
        }

        localStorage.setItem("authToken", data.token);
        localStorage.setItem("userName", data.nombre);
        localStorage.setItem("userEmail", data.email);

        setMessage("Inicio de sesión exitoso");

        navigate("/");
        window.location.reload();
      } catch (error) {
        setMessage(error.message || "Error en el inicio de sesión");
      } finally {
        setIsLoading(false); // Detener la carga
      }
    }
  };

  return (
    <Grid
      container
      style={{ minHeight: "100vh", backgroundColor: "#2c3e50ff" }}
    >
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
            marginBottom: "10px",
            fontSize: isSmallScreen ? "20px" : "24px",
          }}
        >
          Vocational Insight
        </Typography>
        <Typography
          variant="body1"
          align="center"
          style={{
            fontSize: isSmallScreen ? "14px" : "16px",
            maxWidth: "80%",
          }}
        >
          ¡Haz que cada paso cuente y encuentra la carrera que te impulse a
          alcanzar tu máximo potencial y éxito!
        </Typography>
      </Grid>

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
            Iniciar sesión
          </Typography>

          {/* Formulario */}
          <FormControl fullWidth style={{ marginBottom: "1rem" }}>
            <TextField
              label="Correo electrónico"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Ingresa tu correo electrónico"
              error={!!errors.email}
              helperText={errors.email}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email style={{ color: "#ECB444" }} />
                  </InputAdornment>
                ),
              }}
              fullWidth
            />
          </FormControl>

          <FormControl fullWidth style={{ marginBottom: "1rem" }}>
            <TextField
              label="Contraseña"
              name="contraseña"
              type={showPassword ? "text" : "password"}
              value={formData.contraseña}
              onChange={handleChange}
              placeholder="Ingresa tu contraseña"
              error={!!errors.contraseña}
              helperText={errors.contraseña}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock style={{ color: "#ECB444" }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              fullWidth
            />
          </FormControl>

          <Button
            variant="contained"
            color="primary"
            fullWidth
            style={{
              backgroundColor: "#A3D6C4",
              marginTop: "1rem",
              padding: "12px",
              fontWeight: "bold",
              fontSize: "16px",
              borderRadius: "5px",
              transition: "background-color 0.3s ease",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
            }}
            onClick={handleSubmit}
            disabled={isLoading} // Deshabilitar el botón durante la carga
          >
            {isLoading ? <CircularProgress size={24} /> : "Iniciar sesión"}
          </Button>

          {message && (
            <Typography
              align="center"
              style={{
                marginTop: "1rem",
                color: message.includes("exitoso") ? "green" : "red",
              }}
            >
              {message}
            </Typography>
          )}

          <Typography align="center" style={{ marginTop: "1rem" }}>
            ¿No tienes cuenta?{" "}
            <Link to="/registro" style={{ color: "#ECB444" }}>
              Regístrate aquí
            </Link>
          </Typography>
          <Typography align="center" style={{ marginTop: "1rem" }}>
            ¿Olvidaste tu contraseña?{" "}
            <Link to="/recuperarcontraseña" style={{ color: "#ECB444" }}>
              Recuperala aquí
            </Link>
          </Typography>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Login;
