import useEasyAuth from "@/hooks/use-easy-auth";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router";

const AuthenticationTools = () => {
  const { authContext } = useEasyAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    if (authContext.user?.expired) {
      authContext.signoutSilent();
      return;
    }

    // if exipired, redirect to login
    return authContext.events.addAccessTokenExpired(() => {
      navigate("/login");
    });
  }, [authContext, navigate]);

  useEffect(() => {
    // start auto sign in renew
    return authContext.startSilentRenew();
  }, [authContext]);

  useEffect(() => {
    return authContext.events.addAccessTokenExpiring(() => {
      toast({
        title: "Session Expiring",
        description:
          "Your session is about to expire. We will refresh it for you now.",
      });
    });
  }, [authContext, toast]);

  useEffect(() => {
    return authContext.events.addUserLoaded(() => {
      navigate(location.pathname, { replace: true });
    });
  }, [authContext, navigate, location, toast]);

  return <Outlet />;
};

export default AuthenticationTools;
