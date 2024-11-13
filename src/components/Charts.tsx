import { Box, Button } from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";
import { useNavigate } from "react-router-dom"; // Para manejar la navegación
import jsPDF from "jspdf"; // Para generar el PDF
import html2canvas from "html2canvas"; // Para capturar el gráfico como imagen
import React, { useRef } from "react";

export default function BasicBars() {
  const navigate = useNavigate(); // Hook para navegar entre rutas
  const chartRef = useRef<HTMLDivElement>(null); // Asegúrate de que el tipo sea HTMLDivElement y no sea null

  const goToFeedback = () => {
    navigate("/feedback"); // Redirige a la página de feedback
  };

  const downloadPdf = async () => {
    const input = chartRef.current;

    if (input) {
      // Mejora la resolución de la captura con un escalado más alto
      const canvas = await html2canvas(input, {
        scale: 3,
        backgroundColor: "#ffffff",
      });

      const imgData = canvas.toDataURL("image/png", 1.0); // Alta calidad para la imagen PNG
      const pdf = new jsPDF("landscape", "mm", "a4"); // Ajusta el tamaño del PDF a A4

      // Calcula la escala para que la imagen se ajuste correctamente al PDF
      const imgWidth = 290; // Ajuste del ancho de la imagen dentro del PDF
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgHeight = (canvas.height * imgWidth) / canvas.width; // Escala proporcional

      pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight); // Añade la imagen al PDF ajustada
      pdf.save("chart.pdf"); // Guarda el PDF con un nombre específico
    } else {
      console.error("El gráfico no está disponible para ser capturado.");
    }
  };

  return (
    <Box
      sx={{
        marginTop: 6, // Añade un margen superior para separar del Navbar
        display: "flex",
        flexDirection: "column", // Apila los elementos en una columna
        justifyContent: "center", // Centra el gráfico horizontalmente
        alignItems: "center", // Centra el gráfico verticalmente
        minHeight: "calc(100vh - 150px)", // Asegura que ocupe toda la pantalla menos el tamaño del navbar
        padding: 2, // Añade espacio interno
        backgroundColor: "#2c3e50ff", // Fondo oscuro
      }}
    >
      <Box
        ref={chartRef} // Asigna la referencia al contenedor del gráfico
        sx={{
          backgroundColor: "#ffffff", // Fondo blanco para resaltar el gráfico
          padding: 3, // Padding interno para dar espacio alrededor del gráfico
          borderRadius: 2, // Bordes redondeados
          boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.3)", // Sombra suave
          mb: 4, // Añade margen inferior para separar del botón
        }}
      >
        <BarChart
          xAxis={[
            { scaleType: "band", data: ["group A", "group B", "group C"] },
          ]}
          series={[
            { data: [4, 3, 5] },
            { data: [1, 6, 3] },
            { data: [2, 5, 6] },
          ]}
          width={600} // Ajusta el ancho del gráfico
          height={400} // Ajusta la altura del gráfico
        />
      </Box>

      <Button
        variant="contained"
        color="primary"
        size="large"
        onClick={goToFeedback} // Redirige a la página de feedback
        sx={{ mb: 2 }} // Margen inferior para separar los botones
      >
        Evaluar Recomendaciones
      </Button>

      <Button
        variant="contained"
        color="secondary"
        size="large"
        onClick={downloadPdf} // Llama a la función para descargar el PDF
      >
        Descargar Gráfico en PDF
      </Button>
    </Box>
  );
}
