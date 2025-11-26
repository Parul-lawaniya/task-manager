
import AuthRoutes from "./routes/AuthRoutes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ThemeProvider, useTheme } from "./context/ThemeContext";
import ThemeToggle from "./components/theme/ThemeToggle";

function AppContent() {
  const { theme } = useTheme();
  return (
    <>
      <ThemeToggle />
      <AuthRoutes />
      <ToastContainer
        position="top-right"
        autoClose={2000}
        theme={theme === "dark" ? "dark" : "light"}
      />
    </>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;

