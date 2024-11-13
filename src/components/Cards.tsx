import React, { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import Rating from "@mui/material/Rating";
import opinion from "../assets/img/opinion.png";
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";

interface Opinion {
  puntuacion: number;
  comentario: string;
  Nombre: string;
}

function MediaCard({
  name,
  opinionText,
  rating,
}: {
  name: string;
  opinionText: string;
  rating: number;
}) {
  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        transition: "transform 0.3s, box-shadow 0.3s",
        "&:hover": {
          transform: "scale(1.05)",
          boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
        },
        borderRadius: "12px",
      }}
    >
      <CardContent>
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar alt={name} src={opinion} sx={{ width: 56, height: 56 }} />
          <Typography gutterBottom variant="h5" color="primary" component="div">
            {name}
          </Typography>
        </Stack>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          {opinionText}
        </Typography>
        <Rating
          name="user-rating"
          value={rating}
          readOnly
          precision={0.5}
          sx={{ marginTop: 1 }}
        />
      </CardContent>
    </Card>
  );
}

export default function ResponsiveCards() {
  const [opinions, setOpinions] = useState<Opinion[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const fetchOpinions = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.get(
        "https://vocational-insight-562114386469.southamerica-west1.run.app/opiniones_usuarios?page=1&per_page=20",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setOpinions(response.data.opiniones); // Ajuste aquí
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.message || "Error al cargar las opiniones.");
      } else {
        setError("Error al cargar las opiniones.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOpinions();
  }, []);

  if (loading) return <CircularProgress />;
  if (error) return <Typography>{error}</Typography>;

  return (
    <Container
      maxWidth="xl"
      sx={{
        backgroundColor: "#2c3e50ff",
        padding: 4,
        borderRadius: 1,
        boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.2)",
      }}
    >
      <Typography variant="h4" color="secondary" align="center" gutterBottom>
        Opiniones de Nuestros Usuarios
      </Typography>
      <Grid container spacing={4}>
        {opinions.slice(0, 4).map(
          (
            opinion,
            index // Ajuste aquí
          ) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
              <Box sx={{ height: "100%" }}>
                <MediaCard
                  name={opinion.Nombre}
                  opinionText={opinion.comentario}
                  rating={opinion.puntuacion}
                />
              </Box>
            </Grid>
          )
        )}
      </Grid>
    </Container>
  );
}
