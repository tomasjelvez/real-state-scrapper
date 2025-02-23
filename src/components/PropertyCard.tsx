"use client";

import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Chip,
  IconButton,
} from "@mui/material";
import BedIcon from "@mui/icons-material/Bed";
import SquareFootIcon from "@mui/icons-material/SquareFoot";
import WcIcon from "@mui/icons-material/Wc";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { Property } from "@/types/property";
import { useState, useEffect } from "react";

interface PropertyCardProps {
  property: Property;
  isFavorite?: boolean;
  onToggleFavorite?: (propertyId: string) => Promise<void>;
}

export function PropertyCard({
  property,
  isFavorite = false,
  onToggleFavorite,
}: PropertyCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [favorite, setFavorite] = useState(isFavorite);

  useEffect(() => {
    setFavorite(isFavorite);
  }, [isFavorite]);

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!onToggleFavorite || isLoading || !property.propertyId) return;

    setIsLoading(true);
    try {
      await onToggleFavorite(property.propertyId);
    } catch (error) {
      console.error("Error toggling favorite:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const showFavoriteButton = onToggleFavorite && property.propertyId;

  return (
    <Card
      sx={{
        maxWidth: 345,
        height: "100%",
        cursor: "pointer",
        "&:hover": {
          boxShadow: 6,
        },
        position: "relative",
      }}
      onClick={() => window.open(property.href, "_blank")}
    >
      {showFavoriteButton && (
        <IconButton
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            backgroundColor: "rgba(255, 255, 255, 0.8)",
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.9)",
            },
          }}
          onClick={handleFavoriteClick}
          disabled={isLoading}
        >
          {favorite ? <FavoriteIcon color="primary" /> : <FavoriteBorderIcon />}
        </IconButton>
      )}
      <CardMedia
        component="img"
        height="200"
        image={property.imageUrl}
        alt={property.title}
      />
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {property.currency === "CLP" ? "$" : property.currency}{" "}
          {property.price}
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {property.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {property.location}
        </Typography>
        <Box
          sx={{
            mt: 2,
            display: "flex",
            flexWrap: "wrap",
            gap: 1,
          }}
        >
          <Chip
            icon={<BedIcon />}
            label={`${property.features?.[0]}`}
            size="small"
          />
          <Chip icon={<WcIcon />} label={property.features?.[1]} size="small" />
          <Chip
            icon={<SquareFootIcon />}
            label={`${property.features?.[2]}`}
            size="small"
          />
        </Box>
      </CardContent>
    </Card>
  );
}
