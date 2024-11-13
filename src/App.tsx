import { ThemeProvider, CssBaseline } from "@mui/material"; // Agregamos CssBaseline
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; // Importa las rutas
import NavBar from "./components/NavBar";
import Home from "./views/Home";
import Survey from "./components/Survey"; // Asegúrate de importar tu componente Survey
import theme from "./theme/theme";
import Charts from "./components/Charts";
import Results from "./components/Results";
import Feedback from "./components/Feedback";
import Footer from "./components/footer";
import Login from "./components/Login";
import Registro from "./components/Register";
import RecuperarContraseña from "./components/RecuperarContraseña";
import ModificarPerfil from "./components/ModificarPerfil";
import ResetPassword from "./components/ResetPassword"; // Importamos el componente ResetPassword
import UnsubscribeNewsletter from "./components/Unsubscribenewsletter"; // Importamos el componente correctamente
import Record from "./components/Record"; // Importamos el componente Record
import Text from "./components/Text"; // Importamos el componente

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* Aplica estilos globales básicos */}
      <Router>
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Survey" element={<Survey />} />
          <Route path="/Charts" element={<Charts />} />
          <Route path="/Results" element={<Results />} />
          <Route path="/Feedback" element={<Feedback />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/reset_password_confirm" element={<ResetPassword />} />
          <Route
            path="/RecuperarContraseña"
            element={<RecuperarContraseña />}
          />
          <Route path="/modificarperfil" element={<ModificarPerfil />} />
          <Route path="/desuscribirse" element={<UnsubscribeNewsletter />} />
          <Route path="/record" element={<Record />} />
          <Route path="/text" element={<Text />} />
        </Routes>
        <Footer />
      </Router>
    </ThemeProvider>
  );
}
