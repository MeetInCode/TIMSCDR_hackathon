"use client";
import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

// Define the Mentor interface
interface Mentor {
  id: string;
  name: string;
  image: string;
  title: string;
  specialization: string;
  experience: string;
  education: string;
  total_students: string;
  reviews: string;
  rating: string;
  bio: string;
  courses: string[];
  achievements: string[];
  contact: {
    website: string;
    linkedin: string;
  };
}

export default function MentorSearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const [foundMentor, setFoundMentor] = useState<Mentor | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/search-mentor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: searchQuery }),
      });

      if (!response.ok) {
        throw new Error('Failed to search for mentor');
      }

      const data = await response.json();
      setFoundMentor(data.mentor);
    } catch (err) {
      setError('Failed to find mentor');
      setFoundMentor(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-900 mb-4">
            Find Your Perfect Mentor
          </h1>
          <p className="text-blue-700">
            Search for mentors by name, specialization, or expertise
          </p>
        </div>

        <form onSubmit={handleSearch} className="mb-8">
          <div className="flex gap-4">
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search mentors..."
              className="flex-1"
            />
            <Button type="submit" disabled={loading}>
              {loading ? (
                <div className="animate-spin">⌛</div>
              ) : (
                <Search className="w-4 h-4" />
              )}
            </Button>
          </div>
        </form>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {foundMentor && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-start gap-6">
              <div className="w-16 h-16 rounded-full overflow-hidden">
                <img
                  src={foundMentor.image}
                  alt={foundMentor.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-blue-900">
                  {foundMentor.name}
                </h2>
                <p className="text-blue-700">{foundMentor.title}</p>
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Specialization</p>
                    <p className="font-medium">{foundMentor.specialization}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Experience</p>
                    <p className="font-medium">{foundMentor.experience}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Education</p>
                    <p className="font-medium">{foundMentor.education}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Rating</p>
                    <p className="font-medium">{foundMentor.rating} ⭐</p>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-sm text-gray-600">Bio</p>
                  <p className="mt-1">{foundMentor.bio}</p>
                </div>
                <div className="mt-4">
                  <p className="text-sm text-gray-600 mb-2">Courses</p>
                  <div className="flex flex-wrap gap-2">
                    {foundMentor.courses.map((course, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                      >
                        {course}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-sm text-gray-600 mb-2">Achievements</p>
                  <ul className="list-disc list-inside space-y-1">
                    {foundMentor.achievements.map((achievement, index) => (
                      <li key={index} className="text-gray-700">
                        {achievement}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-6 flex gap-4">
                  <a
                    href={foundMentor.contact.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Website
                  </a>
                  <a
                    href={foundMentor.contact.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800"
                  >
                    LinkedIn
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}