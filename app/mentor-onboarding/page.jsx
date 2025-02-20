"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { ChevronLeft, ChevronRight } from "lucide-react";

const MentorOnboarding = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState("personal");
  const [formData, setFormData] = useState({
    name: "",
    image: "",
    title: "",
    total_students: "",
    reviews: "",
    specialization: "",
    experience: "",
    education: "",
    bio: "",
    rating: "",
    courses: [""],
    achievements: [""],
    contact: {
      website: "",
      linkedin: "",
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("contact.")) {
      const contactField = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        contact: { ...prev.contact, [contactField]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleArrayChange = (field, index, e) => {
    const { value } = e.target;
    setFormData((prev) => {
      const updatedArray = [...prev[field]];
      updatedArray[index] = value;
      return { ...prev, [field]: updatedArray };
    });
  };

  const addArrayField = (field) => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...prev[field], ""],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    toast({
      title: "Profile Created!",
      description: "Your mentor profile has been created successfully.",
    });
    router.push("/");
  };

  const steps = {
    personal: "1. Personal Info",
    professional: "2. Professional",
    content: "3. Content",
    contact: "4. Contact",
  };

  const nextStep = () => {
    const stepOrder = Object.keys(steps);
    const currentIndex = stepOrder.indexOf(currentStep);
    if (currentIndex < stepOrder.length - 1) {
      setCurrentStep(stepOrder[currentIndex + 1]);
    }
  };

  const prevStep = () => {
    const stepOrder = Object.keys(steps);
    const currentIndex = stepOrder.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(stepOrder[currentIndex - 1]);
    }
  };

  const personalFields = [
    { label: "Full Name", name: "name" },
    { label: "Profile Image URL", name: "image" },
    {
      label: "Title",
      name: "title",
      placeholder: "e.g., Cybersecurity Consultant & Ethical Hacker",
    },
    { label: "Bio", name: "bio", type: "textarea" },
  ];

  const professionalFields = [
    {
      label: "Specialization",
      name: "specialization",
      placeholder: "e.g., Cybersecurity & Ethical Hacking",
    },
    {
      label: "Experience",
      name: "experience",
      placeholder: "e.g., 8+ years in Cybersecurity",
    },
    {
      label: "Education",
      name: "education",
      placeholder: "e.g., B.Tech in Cybersecurity, NIT Trichy",
    },
    {
      label: "Rating",
      name: "rating",
      placeholder: "e.g., 4.8",
      type: "number",
      step: "0.1",
    },
  ];

  const contactFields = [
    {
      label: "Total Students",
      name: "total_students",
      placeholder: "e.g., 65,000+",
    },
    { label: "Reviews", name: "reviews", placeholder: "e.g., 9,400+" },
    {
      label: "Website",
      name: "contact.website",
      placeholder: "e.g., https://yourwebsite.com",
    },
    {
      label: "LinkedIn",
      name: "contact.linkedin",
      placeholder: "e.g., https://linkedin.com/in/yourprofile",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <h1 className="text-2xl font-bold text-center text-blue-900">
            Complete Your Mentor Profile
          </h1>
          <p className="text-blue-700 text-center">
            Tell us about yourself and your expertise
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <Tabs value={currentStep} className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                {Object.entries(steps).map(([key, label]) => (
                  <TabsTrigger
                    key={key}
                    value={key}
                    onClick={() => setCurrentStep(key)}
                    className="text-sm"
                  >
                    {label}
                  </TabsTrigger>
                ))}
              </TabsList>

              <TabsContent value="personal" className="space-y-4 mt-4">
                <div className="space-y-4">
                  {personalFields.map(
                    ({ label, name, placeholder = "", type = "text" }) => (
                      <div key={name} className="space-y-2">
                        <label className="text-sm font-medium text-blue-900">
                          {label}
                        </label>
                        {type === "textarea" ? (
                          <textarea
                            name={name}
                            value={formData[name]}
                            onChange={handleChange}
                            placeholder={placeholder}
                            className="w-full min-h-[100px] rounded-md border border-blue-200 px-3 py-2 text-sm"
                            required
                          />
                        ) : (
                          <Input
                            name={name}
                            type={type}
                            value={formData[name]}
                            onChange={handleChange}
                            placeholder={placeholder}
                            className="border-blue-200"
                            required
                          />
                        )}
                      </div>
                    )
                  )}
                </div>
              </TabsContent>

              <TabsContent value="professional" className="space-y-4 mt-4">
                <div className="space-y-4">
                  {professionalFields.map(
                    ({
                      label,
                      name,
                      placeholder = "",
                      type = "text",
                      step,
                    }) => (
                      <div key={name} className="space-y-2">
                        <label className="text-sm font-medium text-blue-900">
                          {label}
                        </label>
                        <Input
                          name={name}
                          type={type}
                          step={step}
                          value={formData[name]}
                          onChange={handleChange}
                          placeholder={placeholder}
                          className="border-blue-200"
                          required
                        />
                      </div>
                    )
                  )}
                </div>
              </TabsContent>

              <TabsContent value="content" className="space-y-4 mt-4">
                {["courses", "achievements"].map((field) => (
                  <div key={field} className="space-y-2">
                    <label className="text-sm font-medium text-blue-900 capitalize">
                      {field}
                    </label>
                    {formData[field].map((item, index) => (
                      <Input
                        key={index}
                        value={item}
                        onChange={(e) => handleArrayChange(field, index, e)}
                        placeholder={`Enter ${field.slice(0, -1)} ${index + 1}`}
                        className="border-blue-200 mb-2"
                        required
                      />
                    ))}
                    <Button
                      type="button"
                      onClick={() => addArrayField(field)}
                      className="bg-green-400 hover:bg-green-500 text-blue-900"
                    >
                      Add {field.slice(0, -1)}
                    </Button>
                  </div>
                ))}
              </TabsContent>

              <TabsContent value="contact" className="space-y-4 mt-4">
                <div className="space-y-4">
                  {contactFields.map(({ label, name, placeholder = "" }) => (
                    <div key={name} className="space-y-2">
                      <label className="text-sm font-medium text-blue-900">
                        {label}
                      </label>
                      <Input
                        name={name}
                        value={
                          name.includes("contact")
                            ? formData.contact[name.split(".")[1]]
                            : formData[name]
                        }
                        onChange={handleChange}
                        placeholder={placeholder}
                        className="border-blue-200"
                        required
                      />
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex justify-between mt-6">
              <Button
                type="button"
                onClick={prevStep}
                className="bg-gray-200 hover:bg-gray-300 text-blue-900"
                disabled={currentStep === "personal"}
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>

              {currentStep === "contact" ? (
                <Button
                  type="submit"
                  className="bg-yellow-400 hover:bg-yellow-500 text-blue-900"
                >
                  Create Profile
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={nextStep}
                  className="bg-blue-400 hover:bg-blue-500 text-white"
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default MentorOnboarding;
