import TAPSLogo from "@/assets/taps-toolkit-logo.svg?react";
import { Button } from "@/components/ui/button";
import useEasyAuth from "@/hooks/use-easy-auth";

const LoginPage = () => {
  const { authContext } = useEasyAuth();

  const redirectToLogin = () => {
    authContext.signinRedirect();
  };

  return (
    <div className="flex flex-col items-center justify-start h-screen">
      <div className="flex min-h-full flex-1 flex-col justify-start px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <TAPSLogo className="mx-auto h-20 w-auto" />
          <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
            Sign in to your account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <Button
            className="flex w-full justify-center rounded-md px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            onClick={redirectToLogin}
          >
            Log in
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
