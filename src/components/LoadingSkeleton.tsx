import { Container, Box, Grid, Skeleton } from "@mui/material";

export const LoadingSkeleton = () => (
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
