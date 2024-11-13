import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Container,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import { Rating } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function FeedbackForm() {
  const [rating, setRating] = useState<number | null>(null);
  const [comment, setComment] = useState<string>("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (rating === null) {
      setErrorMessage("Por favor, selecciona una puntuación.");
      setOpenSnackbar(true);
      return;
    }

    if (rating < 1 || rating > 5) {
      setErrorMessage("La puntuación debe estar entre 1 y 5.");
      setOpenSnackbar(true);
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("authToken");

      const response = await axios.post(
        "https://vocational-insight-562114386469.southamerica-west1.run.app/feedback",
        {
          puntuacion: rating,
          comentario: comment,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Opinión enviada:", response.data);
      setRating(null);
      setComment("");
      setSuccessMessage("Feedback enviado con éxito.");
      setOpenSnackbar(true);
      window.scrollTo(0, 0);

      // Redirigir a la página de inicio
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response && error.response.status === 400) {
          setErrorMessage("Ya has enviado un feedback anteriormente.");
        } else if (error.response && error.response.status === 401) {
          setErrorMessage("Token inválido o expirado.");
        } else {
          setErrorMessage("Error al enviar la opinión.");
        }
      } else {
        setErrorMessage("Error desconocido.");
      }
      setOpenSnackbar(true);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        backgroundColor: "#2c3e50",
        padding: 4,
        borderRadius: 3,
        boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.2)",
        mt: 5,
        color: "#ffffff",
        marginTop: 10,
        marginBottom: 10,
      }}
    >
      <Typography
        variant="h6"
        align="center"
        gutterBottom
        sx={{ color: "#ECB444" }}
      >
        ¿Qué tan útil te resultaron las recomendaciones para tu elección de
        carrera?
      </Typography>

      <Box sx={{ mt: 3, mb: 3 }}>
        <TextField
          label="Deja tu comentario"
          fullWidth
          multiline
          rows={4}
          variant="outlined"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          InputLabelProps={{
            style: { color: "#ffffff" },
          }}
          sx={{
            backgroundColor: "#34495e",
            color: "#ffffff",
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "#ECB444",
              },
              "&:hover fieldset": {
                borderColor: "#f1c40f",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#f39c12",
              },
            },
          }}
          InputProps={{
            style: { color: "#ffffff" },
          }}
        />
      </Box>

      <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
        <Rating
          name="rating"
          value={rating}
          precision={0.5}
          size="large"
          onChange={(event, newValue) => {
            setRating(newValue);
          }}
          sx={{
            color: "#f1c40f",
          }}
        />
      </Box>

      <Box sx={{ textAlign: "center" }}>
        <Button
          variant="contained"
          color="success"
          size="large"
          startIcon={<SendIcon />}
          onClick={handleSubmit}
          sx={{
            backgroundColor: "#ECB444",
            color: "#2c3e50",
            "&:hover": {
              backgroundColor: "#f1c40f",
            },
          }}
        >
          {loading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            "Enviar Valoración"
          )}
        </Button>
      </Box>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="error"
          sx={{ width: "100%" }}
        >
          {errorMessage}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!successMessage}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="success"
          sx={{ width: "100%" }}
        >
          {successMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
}
