/* eslint-disable @next/next/no-img-element */
'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import { toast } from "@/hooks/use-toast";

const SignUp = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    toast({
      title: "Account created!",
      description: "Welcome to our platform.",
    });
    router.push("/");
  };

  const handleMentorSignup = () => {
    router.push("/mentor-onboarding");
  };
  const handleStudentSignup = () => {
    router.push("/student-onboarding");
  };

  return (
    <div className="flex min-h-screen">
      <div className="w-1/2 relative">
        <img
          src="https://img.freepik.com/free-vector/internship-job-training-illustration_23-2148753207.jpg?t=st=1740042431~exp=1740046031~hmac=7c66b40a1a7de4afb1665b68741f51700e2f5050bbba1733fb8b0e588c3e8e32&w=740"
          alt="Sign Up"
        />
      </div>
      <div className="w-1/2 flex items-center justify-center p-4 bg-gradient-to-b from-blue-50 to-white">
        <Card className="w-full max-w-md">
          <CardHeader>
            <h1 className="text-2xl font-bold text-center text-blue-900">Create Account</h1>
            <p className="text-blue-700 text-center">Join our learning community today</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Input
                  type="text"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="border-blue-200"
                  required
                />
              </div>
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
              <Button type="submit" onClick={handleStudentSignup} className="w-full bg-blue-500 hover:bg-blue-500 ">
                Sign Up as Student
              </Button>
            </form>

            <div className="mt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleMentorSignup}
                className="w-full border-blue-200 text-blue-700 hover:bg-blue-50"
              >
                Sign Up as Mentor
              </Button>
            </div>

            <div className="mt-6 text-center">
              <p className="text-blue-700">
                Already have an account?{" "}
                <Link href="/signin" className="text-yellow-500 hover:text-yellow-600 font-semibold">
                  Sign In
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SignUp;
