"use client";

import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Chip,
} from "@mui/material";
import BedIcon from "@mui/icons-material/Bed";
import SquareFootIcon from "@mui/icons-material/SquareFoot";
import WcIcon from "@mui/icons-material/Wc";
import { Property } from "@/types/property";

interface PropertyCardProps {
  property: Property;
}

export function PropertyCard({ property }: PropertyCardProps) {
  return (
    <Card
      sx={{
        maxWidth: 345,
        height: "100%",
        cursor: "pointer",
        "&:hover": {
          boxShadow: 6,
        },
      }}
      onClick={() => window.open(property.href, "_blank")}
    >
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
