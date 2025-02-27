import {
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  CircularProgress,
  Autocomplete,
  ListItemButton,
  ListItemText,
  Paper,
} from "@mui/material";
import { useLocationSearch } from "@/hooks/useLocationSearch";
import { propertyTypesByOperation } from "@/lib/data/propertieTypesByOperation";
import { useState } from "react";

interface SearchFormProps {
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
}

export const SearchForm = ({
  filters,
  onOperationChange,
  onFilterChange,
  onSearch,
  isLoading,
}: SearchFormProps) => {
  const { locationOptions, isLoadingLocations, handleLocationSearch } =
    useLocationSearch();
  const [inputValue, setInputValue] = useState("");

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
          inputValue={inputValue}
          onChange={(_, newValue) => {
            onFilterChange({
              location: newValue || "",
            });
            setInputValue(newValue || "");
          }}
          onInputChange={(_, value, reason) => {
            if (reason !== "reset") {
              setInputValue(value);
              onFilterChange({ location: value });
            }
            if (reason === "input") {
              handleLocationSearch(value);
            }
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              fullWidth
              label="Ubicación"
              placeholder={
                isLoadingLocations ? "Buscando..." : "Ingresa comuna o ciudad"
              }
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {isLoadingLocations && (
                      <CircularProgress color="inherit" size={20} />
                    )}
                    {params.InputProps.endAdornment}
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
          onClick={onSearch}
          disabled={isLoading || isLoadingLocations}
          sx={{ height: "100%" }}
        >
          {isLoadingLocations
            ? "Buscando ubicaciones..."
            : isLoading
            ? "Buscando..."
            : "Buscar"}
        </Button>
      </Grid>
    </Grid>
  );
};
