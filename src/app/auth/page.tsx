"use client";

import {
  Box,
  Button,
  Container,
  Paper,
  Typography,
  Stack,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function AuthPage() {
  const router = useRouter();
  const { data: session } = useSession();

  if (session) {
    router.push("/");
    return null;
  }

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
          }}
        >
          <Typography component="h1" variant="h4" gutterBottom>
            Buscador de Propiedades
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Elige una opción para empezar
          </Typography>

          <Stack spacing={2} sx={{ width: "100%" }}>
            <Button
              variant="contained"
              size="large"
              onClick={() => router.push("/auth/signin")}
            >
              Iniciar Sesión
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => router.push("/auth/signup")}
            >
              Crear Cuenta
            </Button>
          </Stack>
        </Paper>
      </Box>
    </Container>
  );
}
