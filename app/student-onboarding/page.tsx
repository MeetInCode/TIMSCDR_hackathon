'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";

const StudentOnboarding = () => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [grade, setGrade] = useState("");
  const [school, setSchool] = useState("");
  const [interests, setInterests] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast({
      title: "Profile updated!",
      description: "Your student profile has been created successfully.",
    });
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <h1 className="text-2xl font-bold text-center text-blue-900">Complete Your Student Profile</h1>
          <p className="text-blue-700 text-center">Tell us about yourself</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-blue-900">Full Name</label>
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-blue-900">Email</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-blue-900">Grade/Year</label>
              <Input
                type="text"
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                placeholder="Enter your current grade or year"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-blue-900">School/College</label>
              <Input
                type="text"
                value={school}
                onChange={(e) => setSchool(e.target.value)}
                placeholder="Enter your school or college name"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-blue-900">Interests</label>
              <Input
                type="text"
                value={interests}
                onChange={(e) => setInterests(e.target.value)}
                placeholder="Enter your academic interests"
                required
              />
            </div>
            <Button type="submit" className="w-full bg-blue-500 hover:bg-blue-600">
              Create Profile
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentOnboarding;
