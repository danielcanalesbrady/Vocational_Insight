import Carousel from "react-material-ui-carousel";
import { Paper, Box, Typography, Container, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import student1 from "../assets/img/student1.jpg";
import student2 from "../assets/img/student2.jpg";
import student3 from "../assets/img/student3.jpg";

// Definimos la estructura de los objetos del carrusel
type CarouselItem = {
  name: string;
  description: string;
  image: string;
};

const items: CarouselItem[] = [
  {
    name: "Estudiante 1",
    description: "Descripción del primer estudiante.",
    image: student1,
  },
  {
    name: "Estudiante 2",
    description: "Descripción del segundo estudiante.",
    image: student2,
  },
  {
    name: "Estudiante 3",
    description: "Descripción del tercer estudiante.",
    image: student3,
  },
];

function MyCarousel() {
  const navigate = useNavigate();

  // Función para redirigir a la página del formulario
  const goToForm = () => {
    navigate("/survey"); // Redirige a la página del formulario
  };

  return (
    <>
      {/* Carrusel */}
      <Box
        sx={{
          mt: 2,
          mb: 2,
          backgroundColor: "#2c3e50ff",
          padding: 4,
          borderRadius: 3,
          width: "100%",
          boxShadow: "none", // Eliminar la sombra del carrusel
        }}
      >
        <Carousel
          navButtonsAlwaysVisible
          autoPlay={true}
          animation="slide"
          duration={600}
          indicators={true}
          sx={{ mb: 0 }}
        >
          {items.map((item, i) => (
            <Item key={i} item={item} goToForm={goToForm} />
          ))}
        </Carousel>
      </Box>

      {/* Sección "¿Quiénes somos?" */}
      <Container
        maxWidth="xl"
        sx={{
          textAlign: "center",
          padding: 3,
          backgroundColor: "#2c3e50ff",
          color: "#fff",
          borderRadius: 3,
          boxShadow: "none", // Eliminar la sombra de la sección "¿Quiénes somos?"
        }}
      >
        <Typography
          variant="h5"
          fontWeight="bold"
          gutterBottom
          sx={{
            color: "#ECB444", // Color amarillo para el título
          }}
        >
          ¿Quiénes somos?
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: "#f4f4f4",
            textAlign: "justify", // Color más claro para el texto
          }}
        >
          Somos un equipo comprometido con tu futuro. Creemos que cada
          estudiante merece encontrar una carrera que realmente le apasione y le
          permita alcanzar su máximo potencial. Con herramientas avanzadas y
          datos precisos, te ayudamos a tomar decisiones informadas para que
          construyas un camino profesional lleno de éxito y satisfacción.
          Estamos aquí para guiarte en cada paso hacia un futuro brillante.
        </Typography>
      </Container>
    </>
  );
}

// Definimos el tipo de las props para el componente Item
type ItemProps = {
  item: CarouselItem;
  goToForm: () => void;
};

function Item({ item, goToForm }: ItemProps) {
  return (
    <Paper
      elevation={6}
      sx={{
        position: "relative",
        overflow: "hidden",
        borderRadius: 3,
        backgroundColor: "#f5f5f5",
        transition: "transform 0.3s ease",
        "&:hover": {
          transform: "scale(1.03)",
        },
        boxShadow: "none", // Eliminar la sombra de cada ítem del carrusel
      }}
    >
      <Box sx={{ position: "relative", overflow: "hidden", height: "500px" }}>
        <img
          src={item.image}
          alt={item.name}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transition: "transform 0.5s ease",
          }}
        />
      </Box>

      {/* Botón dentro de la imagen */}
      <Box
        sx={{
          position: "absolute",
          bottom: 16,
          left: "50%",
          transform: "translateX(-50%)",
          textAlign: "center",
        }}
      >
        <Button
          variant="contained"
          color="secondary"
          size="large"
          onClick={goToForm}
        >
          Haz el formulario
        </Button>
      </Box>
    </Paper>
  );
}

export default MyCarousel;
