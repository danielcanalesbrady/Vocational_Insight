import React, { useState, useEffect } from "react";
import {
  Container,
  FormGroup,
  FormControlLabel,
  Radio,
  Button,
  Typography,
  Grid,
  Box,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Define el tipo para el estado de las preguntas
type StateType = {
  [key: string]: string | undefined;
};

// Estilo personalizado para los RadioButtons redondos
const CustomRadioButton = styled(Radio)({
  "& .MuiSvgIcon-root": {
    borderRadius: "50%", // Hace que el icono sea redondo
  },
  color: "#ECB444",
  "&.Mui-checked": {
    color: "#ECB444",
  },
});

const preguntas = [
  {
    texto: "¿Qué tipo de actividades disfrutas más en tu tiempo libre?",
    opciones: [
      "a) Resolver acertijos y problemas matemáticos",
      "b) Escribir, leer libros, o crear contenido artístico",
      "c) Participar en actividades al aire libre o deportes",
      "d) Dibujar, pintar, crear cosas, o trabajar con las manos",
      "e) Interactuar con personas y ayudar a otros",
    ],
  },
  {
    texto: "¿Qué materias te gustaban más en la escuela?",
    opciones: [
      "a) Matemáticas y ciencias",
      "b) Lenguaje, literatura y artes",
      "c) Educación física",
      "d) Artes plásticas, música y tecnología",
      "e) Ciencias sociales, psicología y filosofía",
    ],
  },
  {
    texto: "¿Cómo prefieres trabajar?",
    opciones: [
      "a) Solo, concentrado en un problema específico",
      "b) En un ambiente creativo, generando ideas nuevas",
      "c) En equipo, colaborando con otros",
      "d) En actividades prácticas que involucren el uso de herramientas o técnicas",
      "e) Ayudando directamente a las personas",
    ],
  },
  {
    texto: "¿Te interesa el uso de la tecnología en tu futura carrera?",
    opciones: [
      "a) Sí, quiero trabajar con tecnología de punta",
      "b) Me interesa, pero no quiero que sea el enfoque principal",
      "c) No es algo que me atraiga particularmente",
      "d) Prefiero usar tecnología de manera práctica, sin enfocarme en ella",
      "e) No, me interesa más el trato directo con las personas",
    ],
  },
  {
    texto: "¿Qué es lo más importante para ti en una carrera?",
    opciones: [
      "a) Estabilidad laboral y un buen salario",
      "b) Libertad creativa y la posibilidad de innovar",
      "c) Un trabajo dinámico que no sea repetitivo",
      "d) Ver los resultados tangibles de mi trabajo",
      "e) Hacer una diferencia en la vida de las personas",
    ],
  },
  {
    texto: "¿Cómo prefieres aprender nuevas habilidades?",
    opciones: [
      "a) A través de libros, cursos online o estudios formales",
      "b) Experimentando y probando nuevas ideas por mi cuenta",
      "c) A través de la práctica y el trabajo en equipo",
      "d) Aprendiendo de otros profesionales o en el lugar de trabajo",
      "e) Observando e interactuando con personas con experiencia",
    ],
  },
  {
    texto: "¿Cómo te describes a ti mismo en términos de personalidad?",
    opciones: [
      "a) Analítico y lógico",
      "b) Creativo y soñador",
      "c) Energético y activo",
      "d) Hábil con las manos y detallista",
      "e) Empático y comunicativo",
    ],
  },
  {
    texto: "¿Cuál de estas actividades te resultaría más interesante?",
    opciones: [
      "a) Desarrollar un nuevo software o aplicación",
      "b) Escribir un guion para una película o crear una obra artística",
      "c) Organizar un evento o torneo deportivo",
      "d) Diseñar un edificio, máquina, o producto",
      "e) Trabajar como voluntario en una ONG o en una profesión de servicio",
    ],
  },
  {
    texto: "¿Qué tipo de entorno prefieres para trabajar?",
    opciones: [
      "a) Una oficina o laboratorio con acceso a tecnología avanzada",
      "b) Un estudio creativo o un espacio artístico",
      "c) Al aire libre o en un entorno dinámico",
      "d) Un taller, sitio de construcción, o fábrica",
      "e) Un centro de atención al cliente, hospital, o institución educativa",
    ],
  },
  {
    texto: "¿Cómo te ves en cinco años?",
    opciones: [
      "a) Liderando un equipo de desarrollo tecnológico",
      "b) Publicando mi propio libro o mostrando mis obras en una galería",
      "c) Organizando eventos deportivos o trabajando en proyectos comunitarios",
      "d) Diseñando productos innovadores o trabajando en una empresa de ingeniería",
      "e) Trabajando en una profesión que ayude a otros, como la psicología, enfermería, o educación",
    ],
  },
  {
    texto: "¿Qué te motiva más en tu trabajo?",
    opciones: [
      "a) Resolver problemas complejos y encontrar soluciones efectivas",
      "b) Expresar ideas y emociones a través de mi trabajo",
      "c) La acción y el movimiento constante",
      "d) Crear o construir algo desde cero",
      "e) Ayudar a los demás y ver cómo mi trabajo mejora sus vidas",
    ],
  },
  {
    texto: "¿Cuál es tu reacción ante los desafíos?",
    opciones: [
      "a) Me gusta analizar todas las opciones antes de actuar",
      "b) Busco soluciones creativas y diferentes",
      "c) Afronto los retos de forma activa y enérgica",
      "d) Prefiero un enfoque práctico, manos a la obra",
      "e) Pienso en cómo el resultado afectará a las personas involucradas",
    ],
  },
  {
    texto: "¿Cómo imaginas tu vida diaria en el futuro?",
    opciones: [
      "a) Trabajando en una oficina con horarios fijos",
      "b) Con un horario flexible y la posibilidad de trabajar desde distintos lugares",
      "c) Con una rutina física activa y al aire libre",
      "d) Trabajando en proyectos diversos que me permitan moverme constantemente",
      "e) Ayudando a personas en situaciones críticas o de apoyo constante",
    ],
  },
  {
    texto: "¿Cuánto tiempo estás dispuesto a invertir para tus estudios?",
    opciones: [
      "a) Prefiero una carrera de corta duración que me permita aprender rápidamente y ser efectivo en poco tiempo.",
      "b) Prefiero una carrera con una duración equilibrada para adquirir conocimientos completos sin que sea demasiado extensa.",
      "c) Prefiero una carrera de larga duración para profundizar y obtener un conocimiento exhaustivo.",
      "d) La duración de la carrera no es un factor importante para mí; estoy abierto a estudiar el tiempo que sea necesario.",
    ],
  },
];

export default function Survey() {
  const [state, setState] = useState<StateType>({});
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      setOpenDialog(true); // Muestra el diálogo si no hay token
    }
  }, []);

  const handleDialogClose = (accept: boolean) => {
    setOpenDialog(false);
    if (accept) {
      navigate("/login"); // Redirige al login si se acepta
    } else {
      navigate("/"); // Redirige a inicio si se cancela
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setState((prev) => ({ ...prev, [name]: value }));
  };

  const isFormValid = () => {
    return preguntas.every((_, i) => state[`q${i + 1}`]);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!isFormValid()) {
      setOpenSnackbar(true);
      return;
    }

    const respuestasUsuario: { [key: string]: string } = {};
    Object.keys(state).forEach((key) => {
      if (state[key]) {
        const questionNumber = key.slice(1);
        respuestasUsuario[questionNumber] = state[key]!;
      }
    });

    const token = localStorage.getItem("authToken");

    if (!token) {
      alert("Error de autenticación. Token no encontrado.");
      return;
    }

    try {
      setLoading(true); // Mostrar animación de carga
      const response = await axios.post(
        "https://vocational-insight-562114386469.southamerica-west1.run.app/encuesta",
        { respuestas_usuario: respuestasUsuario },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setLoading(false); // Ocultar animación de carga
      if (response.status === 200 || response.status === 201) {
        localStorage.setItem(
          "resultadoEncuesta",
          JSON.stringify(response.data)
        );
        navigate("/results", { state: { message: response.data.message } });
      } else {
        alert("Error inesperado. Inténtalo de nuevo.");
      }
    } catch (error) {
      setLoading(false); // Ocultar animación de carga
      alert("Error al enviar las respuestas. Inténtalo de nuevo.");
    }
  };

  const handleCloseSnackbar = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") return;
    setOpenSnackbar(false);
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 3 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Test Vocacional
      </Typography>

      {/* Alerta de diálogo para iniciar sesión */}
      <Dialog open={openDialog} onClose={() => handleDialogClose(false)}>
        <DialogTitle>Iniciar sesión requerido</DialogTitle>
        <DialogContent>
          Necesitas iniciar sesión para realizar la encuesta. ¿Te gustaría
          iniciar sesión?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleDialogClose(false)} color="secondary">
            Cancelar
          </Button>
          <Button onClick={() => handleDialogClose(true)} color="primary">
            Aceptar
          </Button>
        </DialogActions>
      </Dialog>

      <form onSubmit={handleSubmit}>
        <Grid container spacing={4}>
          {preguntas.map((pregunta, i) => (
            <Grid key={i} item xs={12} md={6}>
              <Box
                sx={{
                  padding: 2,
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                }}
              >
                <Typography variant="h6">{`${i + 1}. ${
                  pregunta.texto
                }`}</Typography>
                <FormGroup>
                  {pregunta.opciones.map((opcion, j) => (
                    <FormControlLabel
                      key={j}
                      control={
                        <CustomRadioButton
                          checked={
                            state[`q${i + 1}`] === String.fromCharCode(97 + j)
                          }
                          onChange={handleChange}
                          name={`q${i + 1}`}
                          value={String.fromCharCode(97 + j)}
                        />
                      }
                      label={opcion}
                    />
                  ))}
                </FormGroup>
              </Box>
            </Grid>
          ))}
          <Grid item xs={12}>
            <Box display="flex" justifyContent="center">
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                disabled={loading}
                sx={{
                  backgroundColor: loading ? "#ECB444" : "primary.main",
                  color: loading ? "#2c3e50" : "#ffffff",
                  "&:hover": {
                    backgroundColor: loading ? "#ECB444" : "primary.dark",
                  },
                  padding: "12px 24px",
                  fontSize: "1.1rem",
                }}
              >
                {loading ? (
                  <>
                    <CircularProgress
                      size={24}
                      color="inherit"
                      sx={{ mr: 1 }}
                    />
                    Procesando resultados...
                  </>
                ) : (
                  "Ver Resultados"
                )}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="error"
          sx={{ width: "100%" }}
        >
          Por favor, selecciona al menos una opción en cada pregunta.
        </Alert>
      </Snackbar>
    </Container>
  );
}
