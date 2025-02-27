import { Paper, Typography, Button } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";

interface WelcomeCardProps {
  username: string;
  onLogout: () => void;
}

export const WelcomeCard = ({ username, onLogout }: WelcomeCardProps) => (
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
