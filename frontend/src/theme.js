import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: { main: "#1976d2" },
    secondary: { main: "#6a11cb" },
    success: { main: "#2e7d32" },
    warning: { main: "#ff9800" }
  },
  typography: {
    h4: { fontWeight: 700 },
    h5: { fontWeight: 600 }
  },
  components: {
    MuiButton: { defaultProps: { disableElevation: true } }
  }
});

export default theme;
