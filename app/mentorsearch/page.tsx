/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState, useEffect } from "react";
import { Search, Users, FileText, Clock, CheckCircle, Sparkles, Star, GraduationCap, Briefcase, Mail, Calendar, Award, Globe, BookOpen, Trophy } from "lucide-react";
import mentors from "./mentors.json";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"

const loadingMessages = [
  "Analyzing your learning preferences...",
  "Matching with expert mentors...",
  "Finding the perfect mentor for you...",
  "Checking mentor availability...",
  "Almost there! Preparing your perfect match..."
];

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showButton, setShowButton] = useState(false);
  const [searching, setSearching] = useState(false);
  const [foundMentor, setFoundMentor] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [onlineMentors] = useState(158);
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);
  const [loadingMentorIndex, setLoadingMentorIndex] = useState(0);

  useEffect(() => {
    setShowButton(searchTerm.length >= 3);
  }, [searchTerm]);

  useEffect(() => {
    if (searching) {
      const messageInterval = setInterval(() => {
        setLoadingMessageIndex((prev) => (prev + 1) % loadingMessages.length);
      }, 1000);

      const mentorInterval = setInterval(() => {
        setLoadingMentorIndex((prev) => (prev + 1) % mentors.length);
      }, 500);

      setTimeout(() => {
        const randomMentor = mentors[Math.floor(Math.random() * mentors.length)];
        setSearching(false);
        clearInterval(messageInterval);
        clearInterval(mentorInterval);
      }, 5000);

      return () => {
        clearInterval(messageInterval);
        clearInterval(mentorInterval);
      };
    }
  }, [searching]);



  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

  const handleSearch = async () => {
    setSearching(true);
    setFoundMentor(null);
    setShowDetails(false);
    setLoadingMessageIndex(0);
    setLoadingMentorIndex(0);
    try {
      const response = await fetch('http://127.0.0.1:5328/mentors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: `Find me ${searchTerm} mentors`
        })
      });

      const data = await response.json();

      // Get a random mentor from the list
      const randomIndex = Math.floor(Math.random() * data.mentors.length);
      const randomMentor = data.mentors[randomIndex];
      setFoundMentor(randomMentor);


      // Log the random mentor to console
      console.log('Random Mentor:', randomMentor);

    } catch (error) {
      console.error('Error fetching mentors:', error);
    }
  };

  return (

 <SidebarProvider>
 <AppSidebar />
 <SidebarInset>
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Navigation */}
     

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
              Find Your Perfect
              <br />
              <span className="text-blue-600">Mentor Today!</span>
            </h1>

            <p className="text-xl text-gray-600">
              Connect with expert mentors who can guide you towards success
            </p>

            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="w-8 h-8 rounded-full bg-yellow-100 border-2 border-white flex items-center justify-center overflow-hidden">
                    <img
                      src={mentors[i].image}
                      alt={mentors[i].name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
              <span className="text-yellow-600 font-medium">
                +{onlineMentors} Mentors are online
              </span>
            </div>

            <div className="space-y-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="What do you want to learn?"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-6 py-4 text-lg rounded-full border-2 border-blue-100 focus:border-blue-500 focus:outline-none shadow-lg"
                />
                <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-blue-400" />
              </div>

              {showButton && (
                <button
                  onClick={handleSearch}
                  className="w-full px-6 py-4 bg-blue-600 text-white rounded-full text-lg font-semibold hover:bg-blue-700 transition-all duration-300 shadow-lg flex items-center justify-center gap-2 hover:scale-105"
                >
                  <Sparkles className="w-5 h-5 text-yellow-300" />
                  Find My Mentor
                </button>
              )}
            </div>

            <div className="flex items-center gap-8 pt-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-blue-600" />
                <span className="text-gray-600">Verified Experts</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-500" />
                <span className="text-gray-600">Top Rated</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-600" />
                <span className="text-gray-600">24/7 Support</span>
              </div>
            </div>
          </div>

          <div className="relative max-w-md mx-auto">
            <img
              src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=600"
              alt="Professional mentor"
              className="rounded-2xl shadow-2xl"
            />
            <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-lg shadow-lg">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">Available Now</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Results Section */}
      {(searching || foundMentor) && (
        <div className="container mx-auto px-4 pb-20">
          <div className="grid md:grid-cols-2 gap-8">
            {/* User Profile Card */}
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-blue-100">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <Users className="w-8 h-8 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">Your Learning Profile</h2>
                  <p className="text-gray-600">Interested in: {searchTerm}</p>
                </div>
              </div>
              <div className="space-y-4">
                <p className="text-gray-700">
                  We're finding you a mentor who specializes in {searchTerm} and matches your learning goals.
                </p>
              </div>
            </div>

            {/* Mentor Results */}
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-blue-100">
              {searching ? (
                <div className="flex flex-col items-center justify-center h-full space-y-6">
                  <div className="relative">
                    <div className="w-20 h-20 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full overflow-hidden">
                      <img
                        src={mentors[loadingMentorIndex].image}
                        alt="Loading mentor"
                        className="w-full h-full object-cover animate-pulse"
                      />
                    </div>
                  </div>
                  <p className="text-xl text-blue-600 font-medium animate-pulse-custom">
                    {loadingMessages[loadingMessageIndex]}
                  </p>
                </div>
              ) : foundMentor && (
                <div className="animate-fade-in">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 rounded-full overflow-hidden">
                      <img
                        src={foundMentor.image}
                        alt={foundMentor.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold">{foundMentor.name}</h2>
                      <p className="text-blue-600 font-medium">{foundMentor.title}</p>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <p className="text-gray-700 text-lg">{foundMentor.bio}</p>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Briefcase className="w-5 h-5 text-blue-600" />
                          <h3 className="font-semibold">Experience</h3>
                        </div>
                        <p className="text-gray-700">{foundMentor.experience}</p>
                      </div>

                      <div className="bg-yellow-50 p-4 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <GraduationCap className="w-5 h-5 text-yellow-600" />
                          <h3 className="font-semibold">Education</h3>
                        </div>
                        <p className="text-gray-700">{foundMentor.education}</p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <button className="flex-1 px-6 py-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all duration-300 flex items-center justify-center gap-2">
                        <Calendar className="w-5 h-5" />
                        Schedule Session
                      </button>
                      <button className="px-6 py-4 border-2 border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-all duration-300">
                        <Mail className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="flex items-center gap-2">
                        <Award className="w-5 h-5 text-yellow-500" />
                        <span className="text-gray-600">Top Rated Mentor</span>
                      </div>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={toggleDetails}
                      className="w-full mt-4 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      {showDetails ? "Hide Details" : "View Full Profile"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Detailed Profile Section */}
          {foundMentor && showDetails && (
            <div className="mt-8 bg-white p-8 rounded-2xl shadow-lg border border-blue-100">
              <div className="grid md:grid-cols-3 gap-8">
                {/* Left Column */}
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="w-32 h-32 mx-auto rounded-full overflow-hidden mb-4">
                      <img
                        src={"https://images.unsplash.com/photo-1598550874175-4d0ef436c909?auto=format&fit=crop&q=80&w=200&h=200"}
                        alt={foundMentor.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h2 className="text-2xl font-bold">{foundMentor.name}</h2>
                    <p className="text-blue-600 font-medium">{foundMentor.title}</p>
                  </div>

                  <div className="flex justify-center gap-4">
                    <a
                      href={(foundMentor.contact || foundMentor.contact_info)?.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 bg-blue-50 rounded-full text-blue-600 hover:bg-blue-100 transition-colors"
                    >
                      <Globe className="w-5 h-5" />
                    </a>
                    <a
                      href={(foundMentor.contact || foundMentor.contact_info)?.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 bg-blue-50 rounded-full text-blue-600 hover:bg-blue-100 transition-colors"
                    >
                      <Briefcase className="w-5 h-5" />
                    </a>
                  </div>

                  <div className="border-t pt-6">
                    <h3 className="font-semibold mb-4">Quick Stats</h3>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <Users className="w-5 h-5 text-blue-600" />
                        <span>{foundMentor.total_students || foundMentor.total_students_taught} Students</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Star className="w-5 h-5 text-yellow-500" />
                        <span>{foundMentor.reviews || foundMentor.num_reviews} Reviews</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Award className="w-5 h-5 text-blue-600" />
                        <span>{typeof foundMentor.experience === "number" ? `${foundMentor.experience}+ years in Mathematics` : foundMentor.experience}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Middle Column */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-blue-600" />
                      Courses
                    </h3>
                    <ul className="space-y-3">
                      {(foundMentor.courses || foundMentor.courses_offered || []).map((course, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span>{course}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <Trophy className="w-5 h-5 text-yellow-500" />
                      Achievements
                    </h3>
                    <ul className="space-y-3">
                      {(foundMentor.achievements || []).map((achievement, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <Star className="w-4 h-4 text-yellow-500" />
                          <span>{achievement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  <div className="bg-blue-50 p-6 rounded-xl">
                    <h3 className="text-lg font-semibold mb-4">Schedule a Session</h3>
                    <div className="space-y-4">
                      <button className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all duration-300 flex items-center justify-center gap-2">
                        <Calendar className="w-5 h-5" />
                        Book 1:1 Session
                      </button>
                      <button className="w-full px-4 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-all duration-300 flex items-center justify-center gap-2">
                        <Users className="w-5 h-5" />
                        Join Group Session
                      </button>
                    </div>
                  </div>

                  <div className="bg-yellow-50 p-6 rounded-xl">
                    <h3 className="text-lg font-semibold mb-4">Contact Options</h3>
                    <div className="space-y-4">
                      <button className="w-full px-4 py-3 border-2 border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-all duration-300 flex items-center justify-center gap-2">
                        <Mail className="w-5 h-5" />
                        Send Message
                      </button>
                      <button className="w-full px-4 py-3 border-2 border-green-600 text-green-600 rounded-lg font-semibold hover:bg-green-50 transition-all duration-300 flex items-center justify-center gap-2">
                        <FileText className="w-5 h-5" />
                        View Resources
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      )}
    </main>
    </SidebarInset>
    </SidebarProvider>
  );
}