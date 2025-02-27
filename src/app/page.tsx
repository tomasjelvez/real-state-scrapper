"use client";

import { Container, Box, Typography, Grid } from "@mui/material";
import { useSession, signOut } from "next-auth/react";
import { WelcomeCard } from "@/components/WelcomeCard";
import { SearchForm } from "@/components/SearchForm";
import { PropertyCard } from "@/components/PropertyCard";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";
import { usePropertySearch } from "@/hooks/usePropertySearch";
import { useFavorites } from "@/hooks/useFavorites";
import { useState } from "react";
import { propertyTypesByOperation } from "@/lib/data/propertieTypesByOperation";

export default function Home() {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      window.location.href = "/auth";
    },
  });

  const { properties, isLoading, searchProperties } = usePropertySearch();
  const { favoriteStatus, handleToggleFavorite } = useFavorites(properties);

  const [filters, setFilters] = useState({
    operation: "venta",
    propertyType: "departamento",
    location: "",
  });

  if (status === "loading") {
    return <LoadingSkeleton />;
  }

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

  const handleSearch = async () => {
    await searchProperties(filters);
  };

  const handleLogout = async () => {
    await signOut({ redirect: true, callbackUrl: "/auth" });
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
            onFilterChange={(update) => {
              setFilters((prevFilters) => ({
                ...prevFilters,
                ...update,
              }));
            }}
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
                  <PropertyCard
                    property={property}
                    isFavorite={favoriteStatus[property.propertyId || ""]}
                    onToggleFavorite={handleToggleFavorite}
                  />
                </Grid>
              ))}
            </Grid>
          )
        )}
      </Box>
    </Container>
  );
}
