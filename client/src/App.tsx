import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import ProtectedRoute from "./components/ProtectedRoute";
import { ThemeProvider } from "./contexts/ThemeContext";
import NavLayout from "./components/NavLayout";
import Home from "./pages/Home";
import CommandCenter from "./pages/CommandCenter";
import Commands from "./pages/Commands";
import StorageVault from "./pages/StorageVault";

function ProtectedCommandCenter() {
  return (
    <ProtectedRoute>
      <CommandCenter />
    </ProtectedRoute>
  );
}

function ProtectedHome() {
  return (
    <ProtectedRoute>
      <Home />
    </ProtectedRoute>
  );
}

function ProtectedCommands() {
  return (
    <ProtectedRoute>
      <Commands />
    </ProtectedRoute>
  );
}

function ProtectedStorageVault() {
  return (
    <ProtectedRoute>
      <StorageVault />
    </ProtectedRoute>
  );
}

function Router() {
  return (
    <NavLayout>
      <Switch>
        <Route path={"/"} component={ProtectedHome} />
        <Route path={"/command-center"} component={ProtectedCommandCenter} />
        <Route path={"/commands"} component={ProtectedCommands} />
        <Route path={"/storage"} component={ProtectedStorageVault} />
        <Route path={"/404"} component={NotFound} />
        <Route component={NotFound} />
      </Switch>
    </NavLayout>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
