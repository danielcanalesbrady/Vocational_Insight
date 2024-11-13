import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Grid,
  Typography,
  Box,
  Avatar,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Card,
  MenuItem,
  Snackbar,
} from "@mui/material";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useNavigate } from "react-router-dom";

interface Region {
  id_region: string;
  nombre_region: string;
}

interface Ciudad {
  id_ciudad: string;
  nombre_ciudad: string;
}

const ModificarPerfil = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    genero: "",
    fecha_nac: "",
    id_region: localStorage.getItem("id_region") || "",
    nombre_region: "",
    id_ciudad: localStorage.getItem("id_ciudad") || "",
    nombre_ciudad: "",
    email: "",
    contrasena: "",
    fotoPerfil: "",
  });

  const [regiones, setRegiones] = useState<Region[]>([]);
  const [ciudades, setCiudades] = useState<Ciudad[]>([]);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeactivateDialog, setOpenDeactivateDialog] = useState(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [openSuccessDialog, setOpenSuccessDialog] = useState(false);
  const [fieldToEdit, setFieldToEdit] = useState("");
  const [tempValue, setTempValue] = useState("");
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const fetchUserData = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const response = await fetch(
        "https://vocational-insight-562114386469.southamerica-west1.run.app/usuarios/datos",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 401) {
        localStorage.removeItem("authToken");
        navigate("/login");
      } else {
        const data = await response.json();
        setFormData((prevData) => ({
          ...prevData,
          ...data,
          id_region: data.id_region || localStorage.getItem("id_region") || "",
          id_ciudad: data.id_ciudad || localStorage.getItem("id_ciudad") || "",
          fotoPerfil: data.fotoPerfil || "/default-avatar.png",
        }));
      }
    } catch (error) {
      console.error("Error al verificar el token:", error);
      navigate("/login");
    }
  };

  const fetchRegiones = async () => {
    try {
      const response = await fetch(
        "https://vocational-insight-562114386469.southamerica-west1.run.app/regiones"
      );
      const data = await response.json();
      setRegiones(data);
    } catch (error) {
      console.error("Error al cargar las regiones:", error);
    }
  };

  const fetchCiudades = async (regionId: string): Promise<Ciudad[]> => {
    try {
      const response = await fetch(
        `https://vocational-insight-562114386469.southamerica-west1.run.app/regiones/${regionId}/ciudades`
      );
      const data: Ciudad[] = await response.json();
      setCiudades(data);
      return data;
    } catch (error) {
      console.error("Error al cargar las ciudades:", error);
      return [];
    }
  };

  useEffect(() => {
    const initializeData = async () => {
      await fetchUserData();
      await fetchRegiones();
    };

    initializeData();
  }, [navigate]);

  useEffect(() => {
    if (formData.id_region && regiones.length > 0) {
      const regionSeleccionada = regiones.find(
        (reg) => reg.id_region === formData.id_region
      );
      if (regionSeleccionada) {
        setFormData((prevData) => ({
          ...prevData,
          nombre_region: regionSeleccionada.nombre_region,
        }));

        fetchCiudades(formData.id_region).then((ciudadesData) => {
          const ciudadSeleccionada = ciudadesData.find(
            (ciu) => ciu.id_ciudad === formData.id_ciudad
          );
          if (ciudadSeleccionada) {
            setFormData((prevData) => ({
              ...prevData,
              nombre_ciudad: ciudadSeleccionada.nombre_ciudad,
            }));
          }
        });
      }
    }
  }, [formData.id_region, formData.id_ciudad, regiones]);

  const handleFieldClick = (fieldName: string, value: string) => {
    setFieldToEdit(fieldName);
    setTempValue(value);

    if (fieldName === "id_region") {
      const selectedRegion = regiones.find(
        (region) => region.id_region === value
      );
      if (selectedRegion) {
        fetchCiudades(selectedRegion.id_region);
        setFormData({
          ...formData,
          id_region: selectedRegion.id_region,
          nombre_region: selectedRegion.nombre_region,
          id_ciudad: "",
          nombre_ciudad: "",
        });
      }
    }

    setOpenEditDialog(true);
  };

  const handleSaveChanges = async () => {
    if (!validateFields()) return;
    setOpenConfirmDialog(true);
  };

  const confirmSaveChanges = async () => {
    try {
      const response = await fetch(
        "https://vocational-insight-562114386469.southamerica-west1.run.app/usuarios/actualizar",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
          body: JSON.stringify(formData),
        }
      );
      if (!response.ok) throw new Error("Error al actualizar el perfil.");
      setOpenConfirmDialog(false);
      setOpenSuccessDialog(true);

      // Guardar región y ciudad en el localStorage para persistencia
      localStorage.setItem("id_region", formData.id_region);
      localStorage.setItem("id_ciudad", formData.id_ciudad);

      // Recargar los datos actualizados
      await fetchUserData();
    } catch (error) {
      setError("Error al actualizar el perfil.");
    }
  };

  const handleDeactivateAccount = async () => {
    try {
      const response = await fetch(
        "https://vocational-insight-562114386469.southamerica-west1.run.app/usuarios/desactivar",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      if (!response.ok) throw new Error("Error al desactivar la cuenta.");
      alert("Cuenta desactivada correctamente.");
      navigate("/login");
    } catch (error) {
      setError("Error al desactivar la cuenta.");
    }
  };

  const validateFields = () => {
    if (
      !formData.nombre ||
      !formData.apellido ||
      !formData.email ||
      !formData.fecha_nac ||
      !formData.id_region ||
      !formData.id_ciudad
    ) {
      setError("Por favor, completa todos los campos obligatorios.");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("El correo electrónico no es válido.");
      return false;
    }
    return true;
  };

  return (
    <Grid
      container
      direction="column"
      alignItems="center"
      sx={{ minHeight: "100vh", backgroundColor: "#2c3e50", padding: "2rem" }}
    >
      <Box
        sx={{
          backgroundColor: "#f4f4f4",
          padding: "2rem",
          borderRadius: "8px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
          maxWidth: "800px",
          width: "100%",
        }}
      >
        <Typography
          variant="h4"
          align="center"
          sx={{ fontWeight: "bold", marginBottom: "1rem", color: "#ECB444" }}
        >
          Modificar Perfil
        </Typography>
        <Grid container justifyContent="center" sx={{ mb: 2 }}>
          <Avatar
            alt="Foto de Perfil"
            src={formData.fotoPerfil || "/default-avatar.png"}
            sx={{ width: 120, height: 120, backgroundColor: "#A3D6C4" }}
          >
            {formData.nombre.charAt(0).toUpperCase()}
          </Avatar>
        </Grid>

        {[
          { label: "Nombre", value: formData.nombre, field: "nombre" },
          { label: "Apellido", value: formData.apellido, field: "apellido" },
          {
            label: "Género",
            value: formData.genero === "M" ? "Masculino" : "Femenino",
            field: "genero",
          },
          {
            label: "Fecha de Nacimiento",
            value: formData.fecha_nac,
            field: "fecha_nac",
          },
          {
            label: "Región",
            value: formData.nombre_region,
            field: "id_region",
          },
          {
            label: "Ciudad",
            value: formData.nombre_ciudad,
            field: "id_ciudad",
          },
          { label: "Correo", value: formData.email, field: "email" },
          { label: "Contraseña", value: "********", field: "contrasena" },
        ].map((item, index) => (
          <Card
            key={index}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              padding: "1rem",
              marginTop: "1rem",
              borderRadius: "12px",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
            }}
          >
            <Typography>{item.label}</Typography>
            <Typography>{item.value}</Typography>
            <IconButton
              onClick={() => handleFieldClick(item.field, item.value)}
            >
              <ChevronRightIcon />
            </IconButton>
          </Card>
        ))}

        <Grid container justifyContent="center" spacing={2} sx={{ mt: 4 }}>
          <Grid item>
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#ECB444",
                color: "#2c3e50",
                fontWeight: "bold",
                padding: "12px 24px",
                "&:hover": { backgroundColor: "#A3D6C4" },
              }}
              onClick={handleSaveChanges}
            >
              GUARDAR CAMBIOS
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="outlined"
              color="error"
              onClick={() => setOpenDeactivateDialog(true)}
            >
              DESACTIVAR CUENTA
            </Button>
          </Grid>
        </Grid>

        <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
          <DialogTitle>Editar {fieldToEdit}</DialogTitle>
          <DialogContent>
            {fieldToEdit === "id_region" ? (
              <TextField
                select
                label="Región"
                value={tempValue}
                onChange={(e) => {
                  const selectedRegionId = e.target.value;
                  setTempValue(selectedRegionId);
                  const selectedRegion = regiones.find(
                    (region) => region.id_region === selectedRegionId
                  );
                  if (selectedRegion) {
                    setFormData({
                      ...formData,
                      id_region: selectedRegionId,
                      nombre_region: selectedRegion.nombre_region,
                      id_ciudad: "",
                      nombre_ciudad: "",
                    });
                    fetchCiudades(selectedRegionId);
                  }
                }}
                fullWidth
              >
                {regiones.map((region) => (
                  <MenuItem key={region.id_region} value={region.id_region}>
                    {region.nombre_region}
                  </MenuItem>
                ))}
              </TextField>
            ) : fieldToEdit === "id_ciudad" ? (
              <TextField
                select
                label="Ciudad"
                value={tempValue}
                onChange={(e) => {
                  const selectedCityId = e.target.value;
                  const selectedCity = ciudades.find(
                    (ciudad) => ciudad.id_ciudad === selectedCityId
                  );
                  if (selectedCity) {
                    setTempValue(selectedCityId);
                    setFormData({
                      ...formData,
                      id_ciudad: selectedCityId,
                      nombre_ciudad: selectedCity.nombre_ciudad,
                    });
                  }
                }}
                fullWidth
              >
                {ciudades.map((ciudad) => (
                  <MenuItem key={ciudad.id_ciudad} value={ciudad.id_ciudad}>
                    {ciudad.nombre_ciudad}
                  </MenuItem>
                ))}
              </TextField>
            ) : (
              <TextField
                fullWidth
                label={`Nuevo valor para ${fieldToEdit}`}
                type={fieldToEdit === "contrasena" ? "password" : "text"}
                value={tempValue}
                onChange={(e) => setTempValue(e.target.value)}
              />
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenEditDialog(false)}>Cancelar</Button>
            <Button
              onClick={() => {
                setFormData({ ...formData, [fieldToEdit]: tempValue });
                setOpenEditDialog(false);
              }}
            >
              Guardar
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={openConfirmDialog}
          onClose={() => setOpenConfirmDialog(false)}
        >
          <DialogTitle>Confirmar Guardar Cambios</DialogTitle>
          <DialogContent>
            <Typography>
              ¿Estás seguro de que deseas guardar los cambios?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenConfirmDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={confirmSaveChanges}>Sí, Guardar</Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={openDeactivateDialog}
          onClose={() => setOpenDeactivateDialog(false)}
        >
          <DialogTitle>Advertencia</DialogTitle>
          <DialogContent>
            <Typography>
              ¿Estás seguro de que deseas desactivar tu cuenta?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDeactivateDialog(false)}>No</Button>
            <Button onClick={handleDeactivateAccount} color="error">
              Sí, Desactivar
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={openSuccessDialog}
          onClose={() => setOpenSuccessDialog(false)}
        >
          <DialogTitle>¡Éxito!</DialogTitle>
          <DialogContent>
            <Typography>Perfil actualizado correctamente.</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenSuccessDialog(false)} color="primary">
              Aceptar
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar
          open={!!error}
          autoHideDuration={6000}
          onClose={() => setError(null)}
          message={error}
        />
      </Box>
    </Grid>
  );
};

export default ModificarPerfil;
