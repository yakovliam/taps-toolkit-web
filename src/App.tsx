import { BrowserRouter, Navigate, Outlet, Route, Routes } from "react-router";
import HomePage from "./pages/home/HomePage";
import SimpleLayout from "./components/layout/SimpleLayout";
import LoginPage from "./pages/login/LoginPage";
import AuthenticationTools from "./components/auth/AuthenticationTools";
import useEasyAuth from "./hooks/use-easy-auth";
import LoadingPage from "./pages/LoadingPage";
import ApplicationLayout from "@/components/layout/ApplicationLayout";
import IdentityListPage from "./pages/identity/list/IdentityListPage";
import IdentityEloPage from "./pages/identity/elo/IdentityEloPage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "./components/ui/toaster";
import IdentityImportPage from "./pages/identity/import/IdentityImportPage";
import IdentityImportOTPPage from "./pages/identity/import/otp/IdentityImportOTPPage";

const App = () => {
  return (
    <MasterQueryContextProvider>
      <Toaster />
      <BrowserRouter>
        <Routes>
          <Route element={<AuthenticationTools />}>
            <Route element={<SimpleLayout />}>
              <Route path="/" element={<HomePage />} />

              <Route element={<ReverseProtectedRoute />}>
                <Route path="/login" element={<LoginPage />} />
              </Route>

              {/* redirect to home if no route matches */}
              <Route path="*" element={<div>404</div>} />
            </Route>

            <Route element={<ApplicationLayout />}>
              <Route element={<ProtectedRoute />}>
                {/* identity */}
                <Route path="identity">
                  <Route index element={<Navigate to="list" />} />
                  <Route path="list" element={<IdentityListPage />} />
                  <Route path="import">
                    <Route index element={<IdentityImportPage />} />
                    <Route path="otp" element={<IdentityImportOTPPage />} />
                  </Route>
                  <Route path=":uid">
                    <Route index element={<div>Identity specific page</div>} />
                    <Route path="elo" element={<IdentityEloPage />} />
                  </Route>
                </Route>

                <Route path="device">
                  <Route index element={<div>Device index page</div>} />
                  <Route path=":uid">
                    <Route index element={<div>Device specific page</div>} />
                  </Route>
                </Route>
              </Route>
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </MasterQueryContextProvider>
  );
};

/**
 * ProtectedRoute is a route that is only accessible to authenticated users.
 */
const ProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useEasyAuth();

  if (isLoading) {
    return <LoadingPage />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return <Outlet />;
};

/**
 * ReverseProtectedRoute is a route that is only accessible to unauthenticated users.
 */
const ReverseProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useEasyAuth();

  if (isLoading) {
    return <LoadingPage />;
  }

  if (isAuthenticated) {
    return <Navigate to="/" />;
  }

  return <Outlet />;
};

const queryClient = new QueryClient();

type MasterQueryContextProviderProps = {
  children: React.ReactNode;
};

const MasterQueryContextProvider = ({
  children,
}: MasterQueryContextProviderProps) => {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

export default App;
