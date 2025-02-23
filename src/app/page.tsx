"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import {
  Container,
  Grid,
  TextField,
  Box,
  Button,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Paper,
  Skeleton,
  Autocomplete,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import { PropertyCard } from "@/components/PropertyCard";
import { Property } from "@/types/property";
import { propertyTypesByOperation } from "@/lib/data/propertieTypesByOperation";
import LogoutIcon from "@mui/icons-material/Logout";
import SearchIcon from "@mui/icons-material/Search";

// Components
const WelcomeCard = ({
  username,
  onLogout,
}: {
  username: string;
  onLogout: () => void;
}) => (
  <Paper
    elevation={3}
    sx={{
      p: 4,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      maxWidth: 600,
      width: "100%",
    }}
  >
    <Typography variant="h4" component="h1" gutterBottom>
      Bienvenid@, {username}
    </Typography>
    <Typography
      variant="body1"
      color="text.secondary"
      align="center"
      sx={{ mb: 3 }}
    >
      Aquí podrás buscar y guardar tus propiedades favoritas
    </Typography>
    <Button
      variant="outlined"
      color="primary"
      onClick={onLogout}
      startIcon={<LogoutIcon />}
    >
      Cerrar Sesión
    </Button>
  </Paper>
);

const SearchForm = ({
  filters,
  onOperationChange,
  onFilterChange,
  onSearch,
  isLoading,
}: {
  filters: {
    operation: string;
    propertyType: string;
    location: string;
  };
  onOperationChange: (operation: string) => void;
  onFilterChange: (update: {
    operation?: string;
    propertyType?: string;
    location?: string;
  }) => void;
  onSearch: () => Promise<void>;
  isLoading: boolean;
}) => {
  const [locationOptions, setLocationOptions] = useState<string[]>([]);

  // Simulated location search
  const handleLocationSearch = async (text: string) => {
    if (text.length < 3) {
      setLocationOptions([]);
      return;
    }

    try {
      const response = await fetch(`/api/locations?search=${text}`);
      const data = await response.json();
      setLocationOptions(data);
    } catch (error) {
      console.error("Error fetching locations:", error);
    }
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={3}>
        <FormControl fullWidth>
          <InputLabel>Operación</InputLabel>
          <Select
            value={filters.operation}
            label="Operación"
            onChange={(e) => onOperationChange(e.target.value)}
          >
            <MenuItem value="venta">Venta</MenuItem>
            <MenuItem value="arriendo">Arriendo</MenuItem>
            <MenuItem value="arriendo-de-temporada">Arriendo Temporal</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} sm={3}>
        <FormControl fullWidth>
          <InputLabel>Tipo de propiedad</InputLabel>
          <Select
            value={filters.propertyType}
            label="Tipo de propiedad"
            onChange={(e) => onFilterChange({ propertyType: e.target.value })}
          >
            {propertyTypesByOperation[
              filters.operation as keyof typeof propertyTypesByOperation
            ].map((type) => (
              <MenuItem key={type.value} value={type.value}>
                {type.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} sm={4}>
        <Autocomplete
          freeSolo
          options={locationOptions}
          getOptionLabel={(option) => option}
          filterOptions={(x) => x}
          value={filters.location}
          onChange={(_, newValue) => {
            onFilterChange({
              location: newValue || undefined,
            });
          }}
          onInputChange={(_, newInputValue) => {
            handleLocationSearch(newInputValue);
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              fullWidth
              label="Ubicación"
              placeholder="Ingresa comuna o ciudad"
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {params.InputProps.endAdornment}
                    <SearchIcon color="action" />
                  </>
                ),
              }}
            />
          )}
          renderOption={(props, option) => {
            const { key, ...otherProps } = props;
            return (
              <ListItemButton key={key} component="li" {...otherProps}>
                <ListItemText primary={option} />
              </ListItemButton>
            );
          }}
          PaperComponent={(props) => (
            <Paper
              elevation={3}
              {...props}
              sx={{
                mt: 1,
                maxHeight: "300px",
                overflowY: "auto",
              }}
            />
          )}
        />
      </Grid>
      <Grid item xs={12} sm={2}>
        <Button
          variant="contained"
          fullWidth
          sx={{ height: "56px" }}
          onClick={onSearch}
          disabled={isLoading}
        >
          {isLoading ? "Buscando..." : "Buscar"}
        </Button>
      </Grid>
    </Grid>
  );
};

// Add Loading Components
const LoadingSkeleton = () => (
  <Container maxWidth="lg" sx={{ py: 4 }}>
    <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <Grid container spacing={3}>
        {[...Array(6)].map((_, i) => (
          <Grid item key={i} xs={12} sm={6} md={4}>
            <Skeleton variant="rectangular" height={350} />
          </Grid>
        ))}
      </Grid>
    </Box>
  </Container>
);

// Main Component
export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState({
    operation: "venta",
    propertyType: "departamento",
    location: "",
  });

  useEffect(() => {
    if (status === "unauthenticated") router.push("/auth");
  }, [status, router]);

  if (status === "unauthenticated") {
    return null;
  }

  const handleSearch = async () => {
    setIsLoading(true);
    let url = "";
    try {
      if (filters.location.length > 3) {
        const params = new URLSearchParams(filters);
        const urlResponse = await fetch(`/api/urls?${params}`);
        url = await urlResponse.json();
      } else {
        const baseUrl = "https://www.portalinmobiliario.com";
        url = `${baseUrl}/${filters.operation}/${filters.propertyType}`;
      }

      const response = await fetch(`/api/properties?url=${url}`);
      if (!response.ok && response.status === 401) {
        router.push("/auth");
        return;
      }
      setProperties(await response.json());
    } catch (error) {
      console.error("Error fetching properties:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOperationChange = (operation: string) => {
    const newOperation = operation as keyof typeof propertyTypesByOperation;
    const availableTypes = propertyTypesByOperation[newOperation].map(
      (t) => t.value
    );

    setFilters({
      ...filters,
      operation,
      propertyType: availableTypes.includes(filters.propertyType)
        ? filters.propertyType
        : propertyTypesByOperation[newOperation][0].value,
    });
  };

  const handleLogout = async () => {
    await signOut({ redirect: false });
    document.cookie =
      "session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    router.push("/auth");
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <WelcomeCard
          username={session?.user?.name || "Usuario"}
          onLogout={handleLogout}
        />

        <Box>
          <Typography variant="h4" gutterBottom align="center">
            Encuentra tu próxima propiedad
          </Typography>
          <SearchForm
            filters={filters}
            onOperationChange={handleOperationChange}
            onFilterChange={(update) =>
              setFilters((prev) => ({ ...prev, ...update }))
            }
            onSearch={handleSearch}
            isLoading={isLoading}
          />
        </Box>

        {isLoading ? (
          <LoadingSkeleton />
        ) : (
          properties.length > 0 && (
            <Grid container spacing={3}>
              {properties.map((property, index) => (
                <Grid item key={index} xs={12} sm={6} md={4}>
                  <PropertyCard property={property} />
                </Grid>
              ))}
            </Grid>
          )
        )}
      </Box>
    </Container>
  );
}
