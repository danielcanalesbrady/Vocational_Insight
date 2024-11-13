import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  MenuItem,
  Grid,
  Typography,
  Box,
  IconButton,
  InputAdornment,
  LinearProgress,
  CircularProgress,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  Email,
  AccountCircle,
  Lock,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import logo from "../assets/img/icono_logo_listo.png";

const RegistroUsuario = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    genero: "",
    fecha_nac: "",
    id_region: "",
    id_ciudad: "",
    email: "",
    contrasena: "",
    confirm_contrasena: "",
  });

  const [regions, setRegions] = useState([]);
  const [cities, setCities] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false); // Estado de carga
  const [message, setMessage] = useState(""); // Estado para el mensaje de éxito o error
  const navigate = useNavigate();

  // Estados para manejo de carga y errores en fetch
  const [loadingRegions, setLoadingRegions] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    fetchRegions();
  }, []);

  // Función para obtener las regiones
  const fetchRegions = async () => {
    setLoadingRegions(true);
    try {
      const response = await fetch(
        "https://vocational-insight-562114386469.southamerica-west1.run.app/regiones"
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setRegions(data);
      setFetchError(null);
    } catch (error) {
      console.error("Error fetching regions:", error);
      setRegions([]);
      setFetchError("Error al obtener las regiones. Inténtalo de nuevo.");
    } finally {
      setLoadingRegions(false);
    }
  };

  // Función para obtener las ciudades de una región
  const fetchCities = async (regionId) => {
    setLoadingCities(true);
    try {
      const response = await fetch(
        `https://vocational-insight-562114386469.southamerica-west1.run.app/regiones/${regionId}/ciudades`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setCities(data);
      setFetchError(null);
    } catch (error) {
      console.error("Error fetching cities:", error);
      setCities([]);
      setFetchError("Error al obtener las ciudades. Inténtalo de nuevo.");
    } finally {
      setLoadingCities(false);
    }
  };

  const handleRegionChange = (e) => {
    const { name, value } = e.target;
    const updatedFormData = {
      ...formData,
      [name]: value,
      id_ciudad: "", // Resetea la ciudad seleccionada
    };
    setFormData(updatedFormData);
    setCities([]); // Limpia las ciudades actuales
    fetchCities(value);
    validateField(name, value, updatedFormData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedFormData = {
      ...formData,
      [name]: value,
    };
    setFormData(updatedFormData);
    validateField(name, value, updatedFormData);

    if (name === "contrasena") {
      evaluatePasswordStrength(value);
    }
  };

  const validateField = (name, value, formData) => {
    let errorMsg = "";
    if (name === "nombre" && !value) {
      errorMsg = "Por favor, ingrese su nombre";
    } else if (name === "apellido" && !value) {
      errorMsg = "Por favor, ingrese su apellido";
    } else if (name === "genero" && !value) {
      errorMsg = "Seleccione su género";
    } else if (
      name === "email" &&
      (!value || !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value))
    ) {
      errorMsg = "Por favor, ingrese un correo electrónico válido";
    } else if (name === "contrasena") {
      if (!value || value.length < 8) {
        errorMsg = "La contraseña debe tener al menos 8 caracteres";
      }
      // Validar si confirm_contrasena coincide
      if (
        formData.confirm_contrasena &&
        formData.confirm_contrasena !== value
      ) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          confirm_contrasena: "Las contraseñas no coinciden",
        }));
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          confirm_contrasena: "",
        }));
      }
    } else if (name === "confirm_contrasena") {
      if (value !== formData.contrasena) {
        errorMsg = "Las contraseñas no coinciden";
      } else {
        errorMsg = "";
      }
    } else if (name === "id_region" && !value) {
      errorMsg = "Por favor, seleccione su región";
    } else if (name === "id_ciudad" && !value) {
      errorMsg = "Por favor, seleccione su ciudad";
    }
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: errorMsg,
    }));
  };

  const validateFields = () => {
    const newErrors = {};
    if (!formData.nombre) newErrors.nombre = "Por favor, ingrese su nombre";
    if (!formData.apellido)
      newErrors.apellido = "Por favor, ingrese su apellido";
    if (!formData.genero) newErrors.genero = "Seleccione su género";
    if (
      !formData.email ||
      !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.email)
    )
      newErrors.email = "Por favor, ingrese un correo electrónico válido";
    if (!formData.contrasena || formData.contrasena.length < 8)
      newErrors.contrasena = "La contraseña debe tener al menos 8 caracteres";
    if (formData.confirm_contrasena !== formData.contrasena)
      newErrors.confirm_contrasena = "Las contraseñas no coinciden";
    if (!formData.id_region)
      newErrors.id_region = "Por favor, seleccione su región";
    if (!formData.id_ciudad)
      newErrors.id_ciudad = "Por favor, seleccione su ciudad";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const evaluatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    setPasswordStrength(strength);
  };

  const getPasswordStrengthLabel = () => {
    switch (passwordStrength) {
      case 1:
        return "Débil";
      case 2:
        return "Media";
      case 3:
        return "Fuerte";
      case 4:
        return "Muy fuerte";
      default:
        return "";
    }
  };

  const toggleShowPassword = () => setShowPassword(!showPassword);
  const toggleShowConfirmPassword = () =>
    setShowConfirmPassword(!showConfirmPassword);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateFields()) return;

    setIsLoading(true); // Activar la animación de carga
    setMessage(""); // Limpiar mensaje previo

    // Formatear la fecha correctamente
    let formattedDate = formData.fecha_nac;
    if (formData.fecha_nac) {
      const dateParts = formData.fecha_nac.split("-");
      formattedDate = `${dateParts[0]}/${dateParts[1]}/${dateParts[2]}`;
    }

    const updatedFormData = {
      ...formData,
      fecha_nac: formattedDate,
    };

    try {
      const response = await fetch(
        "https://vocational-insight-562114386469.southamerica-west1.run.app/usuarios",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedFormData),
        }
      );

      if (response.status === 201) {
        setMessage("Registro exitoso");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else if (response.status === 409) {
        setMessage("Ya existe una cuenta con este correo");
      } else {
        const data = await response.json();
        if (data.message && data.message.includes("User already exists")) {
          setMessage("Ya existe una cuenta con este correo");
        } else {
          throw new Error("Error en el registro. Revisa los campos.");
        }
      }
    } catch (error) {
      console.error("Error registrando usuario:", error);
      setMessage("Ya existe una cuenta con este correo");
    } finally {
      setIsLoading(false); // Desactivar la animación de carga
    }
  };

  return (
    <Grid container style={{ minHeight: "100vh", backgroundColor: "#2c3e50" }}>
      {/* Sección izquierda con logo y texto */}
      <Grid
        item
        xs={12}
        sm={6}
        md={6}
        style={{
          backgroundColor: "#2c3e50",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          color: "#fff",
          padding: "2rem",
        }}
      >
        <img
          src={logo}
          alt="Logo"
          style={{
            width: "150px",
            marginBottom: "20px",
          }}
        />
        <Typography
          variant="h5"
          align="center"
          style={{
            fontWeight: "bold",
            marginBottom: "20px",
            fontSize: "24px",
          }}
        >
          Vocational Insight
        </Typography>
        <Typography
          variant="body1"
          align="center"
          style={{
            maxWidth: "300px",
            lineHeight: "1.4",
            fontSize: "16px",
          }}
        >
          ¡Crea tu cuenta y empieza a descubrir tu camino académico y
          profesional!
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
          backgroundColor: "#2c3e50",
          padding: "2rem",
        }}
      >
        <Box
          sx={{
            backgroundColor: "#ffffff",
            padding: "2rem",
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
            maxWidth: "600px",
            width: "100%",
          }}
        >
          <Typography
            variant="h5"
            gutterBottom
            align="center"
            sx={{
              fontWeight: "bold",
              marginBottom: "1rem",
              color: "#ECB444",
            }}
          >
            Registro de Usuario
          </Typography>

          <form onSubmit={handleSubmit}>
            {/* Campos de nombre y apellido */}
            <TextField
              id="nombre"
              name="nombre"
              label="Nombre"
              placeholder="Ingrese su nombre"
              value={formData.nombre}
              onChange={handleChange}
              error={!!errors.nombre}
              helperText={errors.nombre}
              fullWidth
              margin="normal"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AccountCircle style={{ color: "#ECB444" }} />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              id="apellido"
              name="apellido"
              label="Apellido"
              placeholder="Ingrese su apellido"
              value={formData.apellido}
              onChange={handleChange}
              error={!!errors.apellido}
              helperText={errors.apellido}
              fullWidth
              margin="normal"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AccountCircle style={{ color: "#ECB444" }} />
                  </InputAdornment>
                ),
              }}
            />

            {/* Género y fecha de nacimiento */}
            <TextField
              id="genero"
              name="genero"
              label="Género"
              select
              placeholder="Seleccione su género"
              value={formData.genero}
              onChange={handleChange}
              error={!!errors.genero}
              helperText={errors.genero}
              fullWidth
              margin="normal"
            >
              <MenuItem value="M">Masculino</MenuItem>
              <MenuItem value="F">Femenino</MenuItem>
            </TextField>

            <TextField
              id="fecha_nac"
              name="fecha_nac"
              label="Fecha de Nacimiento"
              type="date"
              InputLabelProps={{
                shrink: true,
              }}
              placeholder="Seleccione su fecha de nacimiento"
              value={formData.fecha_nac}
              onChange={handleChange}
              fullWidth
              margin="normal"
              error={!!errors.fecha_nac}
              helperText={errors.fecha_nac}
            />

            {/* Dropdown para Región */}
            <TextField
              id="id_region"
              name="id_region"
              label="Región"
              select
              placeholder="Seleccione su región"
              value={formData.id_region}
              onChange={handleRegionChange}
              error={!!errors.id_region}
              helperText={errors.id_region}
              fullWidth
              margin="normal"
            >
              {loadingRegions ? (
                <MenuItem disabled>
                  <CircularProgress size={24} />
                  Cargando regiones...
                </MenuItem>
              ) : (
                regions.map((region) => (
                  <MenuItem key={region.id_region} value={region.id_region}>
                    {region.nombre_region}
                  </MenuItem>
                ))
              )}
            </TextField>

            {/* Dropdown para Ciudad */}
            <TextField
              id="id_ciudad"
              name="id_ciudad"
              label="Ciudad"
              select
              placeholder="Seleccione su ciudad"
              value={formData.id_ciudad}
              onChange={handleChange}
              error={!!errors.id_ciudad}
              helperText={errors.id_ciudad}
              fullWidth
              margin="normal"
              disabled={!formData.id_region || loadingCities}
            >
              {loadingCities ? (
                <MenuItem disabled>
                  <CircularProgress size={24} />
                  Cargando ciudades...
                </MenuItem>
              ) : (
                cities.map((city) => (
                  <MenuItem key={city.id_ciudad} value={city.id_ciudad}>
                    {city.nombre_ciudad}
                  </MenuItem>
                ))
              )}
            </TextField>

            {/* Correo electrónico */}
            <TextField
              id="email"
              name="email"
              label="Correo electrónico"
              type="email"
              placeholder="Ingrese su correo electrónico"
              value={formData.email}
              onChange={handleChange}
              fullWidth
              margin="normal"
              error={!!errors.email}
              helperText={errors.email}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email style={{ color: "#ECB444" }} />
                  </InputAdornment>
                ),
              }}
            />

            {/* Contraseña y confirmación */}
            <TextField
              id="contrasena"
              name="contrasena"
              label="Contraseña"
              type={showPassword ? "text" : "password"}
              placeholder="Ingrese su contraseña"
              value={formData.contrasena}
              onChange={handleChange}
              fullWidth
              margin="normal"
              error={!!errors.contrasena}
              helperText={errors.contrasena}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock style={{ color: "#ECB444" }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={toggleShowPassword}>
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            {formData.contrasena && (
              <div style={{ marginTop: "0.5rem" }}>
                <LinearProgress
                  variant="determinate"
                  value={passwordStrength * 25}
                />
                <Typography
                  variant="caption"
                  style={{
                    color:
                      passwordStrength === 1
                        ? "red"
                        : passwordStrength === 2
                        ? "orange"
                        : "green",
                  }}
                >
                  {getPasswordStrengthLabel()}
                </Typography>
              </div>
            )}

            <TextField
              id="confirm_contrasena"
              name="confirm_contrasena"
              label="Confirmar Contraseña"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirme su contraseña"
              value={formData.confirm_contrasena}
              onChange={handleChange}
              fullWidth
              margin="normal"
              error={!!errors.confirm_contrasena}
              helperText={errors.confirm_contrasena}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock style={{ color: "#ECB444" }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={toggleShowConfirmPassword}>
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            {errors.global && (
              <Typography
                color="error"
                align="center"
                sx={{ marginTop: "1rem" }}
              >
                {errors.global}
              </Typography>
            )}

            {fetchError && (
              <Typography
                color="error"
                align="center"
                sx={{ marginTop: "1rem" }}
              >
                {fetchError}
              </Typography>
            )}

            <Button
              type="submit"
              variant="contained"
              sx={{
                backgroundColor: "#ECB444",
                color: "#2c3e50",
                fontWeight: "bold",
                marginTop: "1rem",
                padding: "12px",
                "&:hover": {
                  backgroundColor: "#A3D6C4",
                  color: "#2c3e50",
                },
              }}
              fullWidth
              disabled={isLoading} // Deshabilitar el botón durante la carga
            >
              {isLoading ? <CircularProgress size={24} /> : "Registrar"}
            </Button>

            {message && (
              <Typography
                align="center"
                sx={{
                  marginTop: "1rem",
                  color: message === "Registro exitoso" ? "green" : "red",
                }}
              >
                {message}
              </Typography>
            )}
          </form>
        </Box>
      </Grid>
    </Grid>
  );
};

export default RegistroUsuario;
