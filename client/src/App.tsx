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

function Router() {
  return (
    <NavLayout>
      <Switch>
        <Route path={"/"} component={Home} />
        <Route path={"/command-center"} component={ProtectedCommandCenter} />
        <Route path={"/commands"} component={Commands} />
        <Route path={"/storage"} component={StorageVault} />
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
