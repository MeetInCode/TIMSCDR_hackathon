'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";

const StudentDetails = () => {
  const router = useRouter();
  const [grade, setGrade] = useState("");
  const [subject, setSubject] = useState("");
  const [age, setAge] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    toast({
      title: "Profile updated!",
      description: "Your details have been saved successfully.",
    });
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white flex items-center justify-center p-6">
      <Card className="w-full max-w-lg shadow-lg rounded-2xl">
        <CardHeader className="text-center">
          <h1 className="text-3xl font-extrabold text-blue-900">Complete Your Profile</h1>
          <p className="text-blue-600">Help us personalize your learning journey</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Select onValueChange={setGrade}>
                <SelectTrigger className="border-blue-300 focus:ring-2 focus:ring-blue-500">
                  <SelectValue placeholder="Select your grade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="9">Grade 9</SelectItem>
                  <SelectItem value="10">Grade 10</SelectItem>
                  <SelectItem value="11">Grade 11</SelectItem>
                  <SelectItem value="12">Grade 12</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Select onValueChange={setSubject}>
                <SelectTrigger className="border-blue-300 focus:ring-2 focus:ring-blue-500">
                  <SelectValue placeholder="Primary subject of interest" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mathematics">Mathematics</SelectItem>
                  <SelectItem value="science">Science</SelectItem>
                  <SelectItem value="english">English</SelectItem>
                  <SelectItem value="computer">Computer Science</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Input
                type="number"
                placeholder="Age"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="border-blue-300 focus:ring-2 focus:ring-blue-500 rounded-xl"
                required
              />
            </div>

            <div className="space-y-2">
              <Input
                type="tel"
                placeholder="Phone Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="border-blue-300 focus:ring-2 focus:ring-blue-500 rounded-xl"
                required
              />
            </div>

            <div className="space-y-2">
              <Input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border-blue-300 focus:ring-2 focus:ring-blue-500 rounded-xl"
                required
              />
            </div>

            <Button type="submit" className="w-full bg-blue-400 hover:bg-yellow-500  rounded-xl py-3 text-lg font-semibold">
              Complete Profile
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-blue-600">
              You can update these details later from your profile settings
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentDetails;
