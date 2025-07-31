import { CustomImage } from "@/components/atoms";
import { Images } from "@/public";
import React from "react";
import LoginForm from "./LoginForm";

const Login = () => {
  return (
    <div className="h-lvh w-lvw bg-primaryContainer flex items-center justify-center">
      <div className="flex flex-col min-w-[60%] gap-4 md:gap-8 bg-background p-10 rounded-2xl shadow-lightShadow">
        <p className="heading2 text-primary">{"Hi, Welcome Back"}</p>

        <LoginForm />
      </div>
    </div>
  );
};

export default Login;
