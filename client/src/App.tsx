import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import AdminPanel from "./pages/AdminPanel";
import AdminLogin from "./pages/AdminLogin";
import Shop from "./pages/Shop";
import Blog from "./pages/Blog";
import BlogPage from "./pages/BlogPage";
import ShopPage from "./pages/ShopPage";
import IngressosPage from "./pages/IngressosPage";
import { useAuth } from "@/_core/hooks/useAuth";

function Router() {
  const { user } = useAuth();
  
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/shop"} component={Shop} />
      <Route path={"/blog"} component={Blog} />
      <Route path={"/blog-page"} component={BlogPage} />
      <Route path={"/shop-page"} component={ShopPage} />
      <Route path={"/ingressos"} component={IngressosPage} />
      <Route path={"/admin-login"} component={AdminLogin} />
      <Route path={"/admin"} component={() => user?.role === "admin" ? <AdminPanel /> : <AdminLogin />} />
      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
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
