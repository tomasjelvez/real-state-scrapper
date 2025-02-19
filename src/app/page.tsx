"use client";

import { useSession, signOut } from "next-auth/react";
import { Box, Container, Typography, Paper, Button } from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import LogoutIcon from "@mui/icons-material/Logout";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth");
    }
  }, [status, router]);

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/auth");
  };

  if (status === "loading") {
    return (
      <Container>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "100vh",
          }}
        >
          <Typography>Cargando...</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container>
      <Box
        sx={{
          mt: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
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
            Bienvenido, {session?.user?.name || "Usuario"}
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
            onClick={handleLogout}
            startIcon={<LogoutIcon />}
          >
            Cerrar Sesión
          </Button>
        </Paper>
      </Box>
    </Container>
  );
}
