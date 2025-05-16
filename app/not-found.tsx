"use client";

import React from "react";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <Card className="w-full max-w-lg shadow-lg text-center">
        <div className="mb-6">
          <div className="text-9xl font-bold text-blue-500">404</div>
          <h1 className="text-4xl font-bold text-gray-800 mt-4">
            Page Not Found
          </h1>
          <div className="text-gray-600 mt-4">
            The page you are looking for doesn't exist or has been moved.
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
          <Button
            label="Go Back"
            icon="pi pi-arrow-left"
            className="p-button-outlined"
            onClick={() => router.back()}
          />
          <Link href="/dashboard" passHref>
            <Button
              label="Go to Dashboard"
              icon="pi pi-th-large"
              className="p-button-primary"
            />
          </Link>
          <Link href="/" passHref>
            <Button
              label="Go to Home"
              icon="pi pi-home"
              className="p-button-secondary"
            />
          </Link>
        </div>

        <div className="mt-8 text-center">
          <div className="text-gray-500 text-sm">
            If you think this is an error, please contact support.
          </div>
        </div>
      </Card>

      <div className="absolute top-1/3 left-1/4 transform -translate-x-1/2 -translate-y-1/2 text-gray-200 text-[200px] font-bold opacity-20 select-none hidden md:block">
        404
      </div>
    </div>
  );
}
