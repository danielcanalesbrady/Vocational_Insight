import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#2c3e50ff", // Azul oscuro
    },
    secondary: {
      main: "#ECB444", // Amarillo
    },
    background: {
      default: "#2c3e50ff", // Azul oscuro para el fondo global
      paper: "#ffffff", // Mantén el blanco para elementos como Paper o Cards
    },
  },
  components: {
    MuiContainer: {
      styleOverrides: {
        root: {
          backgroundColor: "#2c3e50ff", // Fondo azul oscuro para todos los Containers
          color: "#ffffff", // Texto en blanco para mejor contraste
          borderRadius: "8px", // Bordes redondeados
          padding: "16px", // Un poco de padding interno
        },
      },
    },
  },
  typography: {
    fontFamily: '"Bree Serif", Roboto, sans-serif', // Aplicando Bree Serif globalmente
  },
});

export default theme;
