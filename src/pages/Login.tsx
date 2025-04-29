// import { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";

const LoginScreen = () => {
  // const [isLoading, setIsLoading] = useState(false);

  // const handleGoogleLogin = () => {
  //   setIsLoading(true);
  //   // In a real implementation, this would redirect to Google OAuth
  //   setTimeout(() => {
  //     setIsLoading(false);
  //     alert("In a real implementation, this would connect to Google OAuth API");
  //   }, 1500);
  // };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900">Welcome</h1>

          <p className="mt-2 text-sm text-gray-600">
            Sign in to continue to the application
          </p>
        </div>

        <div className="mt-8 space-y-6 flex items-center justify-center">
          <GoogleLogin
            onSuccess={(credentialResponse) => console.log(credentialResponse)}
            auto_select={true}
          />
        </div>

        <div className="text-center mt-6">
          <p className="text-xs text-gray-600">
            By continuing, you agree to our{" "}
            <a
              href="#"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Terms of Service
            </a>{" "}
            and{" "}
            <a
              href="#"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
