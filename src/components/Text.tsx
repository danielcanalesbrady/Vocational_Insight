import React from "react";
import { Box, Grid, Typography, Container, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import MotivationalImage from "../assets/img/motivacion.png"; // Ruta de tu imagen motivacional

const MotivationalSection: React.FC = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Box
      sx={{
        backgroundColor: "ECB444",
        paddingY: 6,
        paddingX: { xs: 3, md: 8 },
      }}
    >
      <Container maxWidth="lg">
        <Grid
          container
          spacing={4}
          alignItems="center"
          direction={isSmallScreen ? "column" : "row"}
        >
          {/* Imagen en el lado izquierdo */}
          <Grid item xs={12} md={6}>
            <Box
              component="img"
              src={MotivationalImage}
              alt="Motivational Image"
              sx={{
                width: "60%", // Ajusta al 80% del contenedor
                height: "auto",
                borderRadius: 2,
                boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.3)",
                mx: "auto", // Centra la imagen dentro del contenedor
                display: "block",
              }}
            />
          </Grid>

          {/* Texto motivacional en el lado derecho */}
          <Grid item xs={12} md={6}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: "bold",
                color: "#ECB444",
                marginBottom: 2,
              }}
            >
              ¿Por qué es importante llenar este formulario?
            </Typography>
            <Typography
              variant="body1"
              sx={{ color: "#f4f4f4", lineHeight: 1.7, textAlign: "justify" }}
            >
              El formulario te ayudará a descubrir tus verdaderos intereses y
              habilidades. Te proporciona una guía personalizada para elegir una
              carrera que realmente te apasione y en la cual puedas destacar. Al
              dedicar unos minutos a responder las preguntas, obtendrás una
              mejor comprensión de tus opciones y podrás tomar decisiones
              informadas sobre tu futuro profesional. ¡Atrévete a dar el primer
              paso hacia el éxito!
            </Typography>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default MotivationalSection;
