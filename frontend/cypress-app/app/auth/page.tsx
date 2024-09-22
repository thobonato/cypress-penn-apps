// app/auth/page.tsx
"use client";

import React from 'react';
import AuthPage from "../components/Auth";

export default function Auth() {
  return (
    <div className="bg-[conic-gradient(from_140deg_at_50%_50%,#3ca33c_20%,#4F86E2_60%,#3ca33c_100%)]">
      <div className="min-h-screen flex items-center justify-center">
        <AuthPage />
      </div>
      <div className="text-center text-sm pb-2">
        <footer>Made with ❤️ by Akhil, Josh, & Tom.</footer>
      </div>
    </div>
  )};