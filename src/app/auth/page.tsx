//src/app/auth/page.tsx

'use client';

import { useState } from 'react';
import { AuthForm } from '@/components/AuthForm';
import SignInWithGoogleButton from '@/app/auth/components/SignInWithGoogleButton';
import { GalleryVerticalEnd } from "lucide-react"

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);


  return (

    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-6 p-2 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="/" className="flex items-center gap-2 font-medium">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <GalleryVerticalEnd className="size-4" />
            </div>
            Home.
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-md">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-xl shadow-lg">
              <div className="flex gap-4">
                <button
                  onClick={() => setIsLogin(true)}
                  className={`flex-1 py-2 font-medium ${isLogin
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-400 hover:text-gray-600'
                    }`}
                >
                  Login
                </button>
                <button
                  onClick={() => setIsLogin(false)}
                  className={`flex-1 py-2 font-medium ${!isLogin
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-400 hover:text-gray-600'
                    }`}
                >
                  Register
                </button>
              </div>
              <AuthForm
                key={isLogin ? 'login' : 'customer-signup'}
                mode={isLogin ? 'login' : 'customer-signup'}
              />

              <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                <span className="relative z-10 bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
              <SignInWithGoogleButton />
            </div>
          </div>
        </div>
      </div>
      <div className="relative hidden bg-muted lg:block">
        <img
          src="/Login-amico.svg"
          alt="Image"
          className="absolute p-20 inset-0 h-full w-full object-fit dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>


  );
}
