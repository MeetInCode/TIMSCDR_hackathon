'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import Link from "next/link";

const SignIn = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Demo login - replace with actual authentication
    toast({
      title: "Welcome back!",
      description: "You have successfully signed in.",
    });
    router.push("/dash");
  };

  return (
    <div className="min-h-screen grid grid-cols-2">
      <div className="bg-cover bg-center" style={{ backgroundImage: "url('https://img.freepik.com/free-vector/cartoon-back-college-concept-with-cheerful-students-set_33099-361.jpg?t=st=1740042545~exp=1740046145~hmac=11f30dcd431fd01c2a5f59ebdc55e1856f02c8cbdbb8e1cdbd78cd3a2ce4f823&w=740')" }}></div>
      <div className="flex items-center justify-center p-4 bg-gradient-to-b from-blue-50 to-white">
        <Card className="w-full max-w-md">
          <CardHeader>
            <h1 className="text-2xl font-bold text-center text-blue-900">Welcome Back!</h1>
            <p className="text-blue-700 text-center">Sign in to continue your learning journey</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border-blue-200"
                  required
                />
              </div>
              <div className="space-y-2">
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border-blue-200"
                  required
                />
              </div>
              <Button type="submit" className="w-full bg-blue-500 hover:bg-blue-400 ">
                Sign In
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-blue-700">
                Don&apos;t have an account?{" "}
                <Link href="/signup" className="text-yellow-500 hover:text-yellow-600 font-semibold">
                  Sign Up
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SignIn;
