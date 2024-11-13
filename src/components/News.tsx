import { useState, useEffect } from "react";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Grid,
  Box,
  Container,
  CircularProgress,
} from "@mui/material";

// Definir la estructura del tipo de noticia
interface News {
  id_noticia: number;
  titulo: string;
  contenido: string;
  fecha_publicacion: string;
  link_noticia: string;
  imagen_noticia: string;
}

const NewsSection = () => {
  const [newsDataMain, setNewsDataMain] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const token = localStorage.getItem("authToken");

        if (!token) {
          throw new Error("Registrate para estar al tanto de las noticias");
        }

        const response = await fetch(
          "https://vocational-insight-562114386469.southamerica-west1.run.app/noticias",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Registrate para estar al tanto de las noticias.");
        }

        const data: News[] = await response.json();
        setNewsDataMain(data);
        setLoading(false);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Ocurrió un error desconocido"
        );
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ marginTop: 4, textAlign: "center" }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ marginTop: 4, textAlign: "center" }}>
        <Typography color="error">{error}</Typography>
      </Container>
    );
  }

  return (
    <Container
      maxWidth="xl"
      sx={{
        backgroundColor: "#2c3e50ff", // Fondo oscuro para el contenedor principal
        padding: 4,
        borderRadius: "16px", // Bordes redondeados suaves
        boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.3)", // Sombra en el contenedor
        marginTop: 6,
        marginBottom: 6,
      }}
    >
      {/* Título principal de la sección de noticias */}
      <Typography
        variant="h4"
        align="center"
        gutterBottom
        sx={{
          fontWeight: "bold",
          color: "#ECB444",
          mb: 4,
        }}
      >
        Últimas Noticias
      </Typography>

      <Typography
        variant="h5"
        align="left"
        gutterBottom
        sx={{
          fontWeight: "bold",
          color: "#f4f4f4", // Color de texto claro para que contraste con el fondo
        }}
      ></Typography>

      <Grid container spacing={4}>
        {/* Mantener el diseño original, con dos columnas principales */}
        {newsDataMain.slice(0, 10).map((news) => (
          <Grid item xs={12} sm={6} key={news.id_noticia}>
            <Card
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                borderRadius: 4, // Bordes redondeados suaves en las tarjetas
                boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)", // Sombra suave en las tarjetas
                transition: "transform 0.3s, box-shadow 0.3s",
                "&:hover": {
                  transform: "scale(1.02)", // Crece ligeramente al pasar el mouse
                  boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.15)", // Sombra más profunda al hacer hover
                },
              }}
            >
              {/* Imagen de la noticia */}
              <CardMedia
                component="img"
                image={news.imagen_noticia || "https://via.placeholder.com/300"}
                alt={news.titulo}
                sx={{
                  width: { xs: "100%", sm: "150px" }, // Ajuste de ancho según el tamaño de la pantalla
                  height: "150px", // Mantener una altura fija para las imágenes
                  objectFit: "contain", // Mostrar la imagen completa dentro del contenedor
                  borderRadius: { sm: "8px 0 0 8px" }, // Bordes redondeados solo en el lado izquierdo para pantallas grandes
                }}
              />

              {/* Contenido de la noticia */}
              <CardContent
                sx={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  backgroundColor: "#fff",
                  paddingLeft: { sm: 3 },
                  paddingTop: { xs: 2, sm: 0 },
                  height: "150px", // Mantener la misma altura que la imagen
                }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    color: "#e74c3c", // Color de acento para la categoría de la noticia
                    fontWeight: "bold",
                    textTransform: "uppercase",
                  }}
                >
                  Educación
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: "bold",
                    marginTop: 1,
                    color: "#2c3e50", // Color de texto oscuro para el título de la noticia
                  }}
                >
                  {news.titulo}
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: 1,
                    color: "text.secondary",
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    {news.fecha_publicacion}
                  </Typography>
                  <Typography variant="body2">
                    <a
                      href={news.link_noticia}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: "#ECB444", fontWeight: "bold" }}
                    >
                      Leer más
                    </a>
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default NewsSection;
