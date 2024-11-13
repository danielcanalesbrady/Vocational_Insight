import {
  Box,
  Container,
  Grid,
  Typography,
  IconButton,
  TextField,
  Button,
} from "@mui/material";
import { Facebook, Twitter, Instagram, LinkedIn } from "@mui/icons-material";
import { useState, useEffect } from "react";

export default function Footer() {
  const [email, setEmail] = useState(""); // Estado del correo
  const [isSubscribed, setIsSubscribed] = useState(false); // Estado de suscripción
  const [message, setMessage] = useState(""); // Mensaje de feedback
  const [loading, setLoading] = useState(false); // Estado de carga

  // Cargar el correo electrónico del usuario desde localStorage al montar el componente
  useEffect(() => {
    const storedEmail = localStorage.getItem("userEmail");
    if (storedEmail) {
      setEmail(storedEmail); // Actualizar el estado si hay correo almacenado
    }
  }, []);

  const handleSubscription = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      setMessage("Debe iniciar sesión para suscribirse.");
      return;
    }

    setLoading(true); // Activar estado de carga

    try {
      const response = await fetch(
        "https://vocational-insight-562114386469.southamerica-west1.run.app/suscripcion",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        if (data.estado_actualizado === 1) {
          setMessage("Suscripción realizada con éxito.");
          setIsSubscribed(true);
        } else {
          setMessage("Usuario ya está suscrito.");
        }
      } else {
        setMessage("Error al suscribirse.");
      }
    } catch (error) {
      setMessage("Error al procesar la solicitud.");
    }

    setLoading(false); // Desactivar estado de carga
  };

  return (
    <Box
      sx={{
        mt: 4,
        backgroundColor: "#1f2f46",
        color: "#f0f0f0",
        paddingTop: 6,
        paddingBottom: 6,
      }}
    >
      <Container
        maxWidth="xl"
        sx={{
          px: { xs: 4, md: 8 },
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
        <Grid container spacing={4}>
          {/* Sección 1: Sobre nosotros */}
          <Grid item xs={12} sm={6} md={6}>
            <Typography variant="h6" gutterBottom sx={{ color: "#4caf50" }}>
              Sobre nosotros
            </Typography>
            <Typography variant="body2" sx={{ lineHeight: 1.8 }}>
              Vocational Insight es una plataforma dedicada a ayudar a los
              estudiantes a descubrir su verdadera vocación. Brindamos recursos
              y guías para que los estudiantes tomen decisiones informadas sobre
              su futuro.
            </Typography>
          </Grid>

          {/* Sección 2: Suscripción a Newsletter */}
          <Grid item xs={12} sm={6} md={6}>
            <Typography variant="h6" gutterBottom sx={{ color: "#4caf50" }}>
              Suscríbete a nuestro boletín
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Recibe actualizaciones y consejos directamente en tu correo.
            </Typography>
            <Box component="form" noValidate sx={{ display: "flex" }}>
              <TextField
                variant="outlined"
                value={email} // Cargar correo del estado
                disabled // Deshabilitar el campo para edición
                fullWidth
                InputProps={{
                  style: {
                    color: "#ffffff", // Forzar texto blanco
                    fontWeight: "bold", // Negrita para visibilidad
                    WebkitTextFillColor: "white", // Compatibilidad con Webkit
                  },
                }}
                sx={{
                  "& .MuiInputBase-input.Mui-disabled": {
                    color: "#ffffff !important", // Asegurar blanco en estado deshabilitado
                    WebkitTextFillColor: "white", // Compatibilidad adicional
                    opacity: 1, // Visibilidad completa
                  },
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { borderColor: "#fff" },
                    "&:hover fieldset": { borderColor: "#fff" },
                    "&.Mui-focused fieldset": { borderColor: "#fff" },
                  },
                }}
              />
              <Button
                variant="contained"
                sx={{
                  bgcolor: "#4caf50",
                  ml: 1,
                  "&:hover": { bgcolor: "#388e3c" },
                }}
                onClick={handleSubscription}
                disabled={loading || isSubscribed}
              >
                Enviar
              </Button>
            </Box>
            {message && (
              <Typography
                variant="body2"
                sx={{ color: isSubscribed ? "green" : "red", mt: 1 }}
              >
                {message}
              </Typography>
            )}
          </Grid>
        </Grid>

        {/* Sección de Redes sociales */}
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4, mb: 4 }}>
          <IconButton
            href="https://facebook.com"
            target="_blank"
            rel="noopener"
            sx={{
              color: "#f0f0f0",
              transition: "color 0.3s",
              "&:hover": { color: "#4caf50" },
            }}
          >
            <Facebook />
          </IconButton>
          <IconButton
            href="https://twitter.com"
            target="_blank"
            rel="noopener"
            sx={{
              color: "#f0f0f0",
              transition: "color 0.3s",
              "&:hover": { color: "#4caf50" },
            }}
          >
            <Twitter />
          </IconButton>
          <IconButton
            href="https://instagram.com"
            target="_blank"
            rel="noopener"
            sx={{
              color: "#f0f0f0",
              transition: "color 0.3s",
              "&:hover": { color: "#4caf50" },
            }}
          >
            <Instagram />
          </IconButton>
          <IconButton
            href="https://linkedin.com"
            target="_blank"
            rel="noopener"
            sx={{
              color: "#f0f0f0",
              transition: "color 0.3s",
              "&:hover": { color: "#4caf50" },
            }}
          >
            <LinkedIn />
          </IconButton>
        </Box>

        {/* Derechos de autor */}
        <Box
          sx={{
            textAlign: "center",
            borderTop: "1px solid #4caf50",
            paddingTop: 2,
            marginTop: 2,
          }}
        >
          <Typography variant="body2">
            &copy; {new Date().getFullYear()} Vocational Insight. Todos los
            derechos reservados.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
