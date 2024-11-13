import { Box, Container, Typography } from "@mui/material";
import utfsmLogo from "../assets/img/logo-sm.jpg";
import usachLogo from "../assets/img/logo-uds.jpg";
import pucLogo from "../assets/img/logo-udv.jpeg";
import andresLogo from "../assets/img/logo-Andresbello.jpg";
import duocLogo from "../assets/img/logo-Duoc.jpg";
import santoLogo from "../assets/img/logo-SantoTomas.jpg";
import conceLogo from "../assets/img/logo-Uconcepcion .jpg";
import uvmLogo from "../assets/img/logo-UVM.jpg";

// Lista de imágenes duplicada para lograr el bucle continuo
const images = [
  utfsmLogo,
  usachLogo,
  pucLogo,
  andresLogo,
  duocLogo,
  santoLogo,
  conceLogo,
  uvmLogo,
  utfsmLogo,
  usachLogo,
  pucLogo,
  andresLogo,
  duocLogo,
  santoLogo,
  conceLogo,
  uvmLogo,
  utfsmLogo,
  usachLogo,
  pucLogo,
  andresLogo,
  duocLogo,
  santoLogo,
  conceLogo,
  uvmLogo,
];

export default function UniversityAdvertisement() {
  return (
    <Container
      maxWidth="xl"
      sx={{
        marginTop: 2,
        marginBottom: 4,
        backgroundColor: "primary.main",
        borderRadius: 2,
        padding: 4,
        color: "#fff",
        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
        overflow: "hidden", // Evitar que las imágenes se salgan del contenedor
        position: "relative",
        height: { xs: "180px", sm: "200px", md: "220px" }, // Ajustar altura según tamaño de pantalla
      }}
    >
      <Typography variant="h4" color="secondary" align="center" gutterBottom>
        Instituciones de educación superior en Chile
      </Typography>

      <Box
        sx={{
          display: "flex",
          whiteSpace: "nowrap", // Mantiene las imágenes en una línea
          animation: "scroll 25s linear infinite", // Animación continua
          minHeight: "100%", // Asegura que las imágenes llenen el contenedor
        }}
      >
        {/* Imágenes del carrusel */}
        {images.map((image, index) => (
          <Box
            key={index}
            component="img"
            src={image}
            alt={`Imagen ${index + 1}`}
            sx={{
              width: { xs: "100px", sm: "150px", md: "180px" }, // Tamaño ajustado para pantallas pequeñas
              marginRight: { xs: "10px", sm: "15px", md: "20px" }, // Espacio entre imágenes ajustado
              height: "auto",
              objectFit: "contain", // Mantener la proporción de la imagen
              flexShrink: 0, // Evita que las imágenes se encojan
            }}
          />
        ))}
      </Box>

      {/* Estilos CSS para la animación */}
      <style>
        {`
          @keyframes scroll {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(calc(-150px * ${
                images.length / 2
              })); /* Ajusta el tamaño según el total de imágenes */
            }
          }
        `}
      </style>
    </Container>
  );
}
