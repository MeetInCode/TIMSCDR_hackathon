"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Video {
  $id: string;
  title: string;
  description: string;
  file_id: string;
  mentor_id: string;
}

// Create a separate VideoCard component
const VideoCard = ({ video, darkMode }: { video: Video; darkMode: boolean }) => {
  const [thumbnail, setThumbnail] = useState<string>('');

  useEffect(() => {
    // Create a hidden video element to generate thumbnail
    const videoElement = document.createElement('video');
    videoElement.crossOrigin = 'anonymous';
    videoElement.src = `https://timscdr-hackathon-git-main-meemeets-projects.vercel.app//api/view_file/${video.file_id}`;
    videoElement.load();

    const generateThumbnail = async () => {
      try {
        await new Promise((resolve) => {
          videoElement.addEventListener('loadeddata', () => {
            videoElement.currentTime = 1;
            resolve(null);
          });
        });

        await new Promise((resolve) => {
          videoElement.addEventListener('seeked', () => {
            const canvas = document.createElement('canvas');
            canvas.width = videoElement.videoWidth;
            canvas.height = videoElement.videoHeight;
            const ctx = canvas.getContext('2d');
            ctx?.drawImage(videoElement, 0, 0);
            setThumbnail(canvas.toDataURL('image/jpeg'));
            resolve(null);
          });
        });
      } catch (err) {
        console.error('Error generating thumbnail:', err);
      }
    };

    generateThumbnail();
  }, [video.file_id]);

  return (
    <div className={`group rounded-xl overflow-hidden transition-all duration-300 transform hover:scale-[1.02] ${
      darkMode ? 'bg-gray-800 hover:bg-gray-750' : 'bg-white hover:shadow-2xl'
    }`}>
      <div className="aspect-video bg-gradient-to-br from-blue-600 to-purple-600 relative">
        <div className="w-full h-full">
          <video 
            className="w-full h-full object-cover"
            controls
            preload="metadata"
            crossOrigin="anonymous"
            poster={thumbnail || undefined}
          >
            <source src={`https://timscdr-hackathon-git-main-meemeets-projects.vercel.app//api/view_file/${video.file_id}`} type="video/mp4" />
          </video>
          {!thumbnail && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm">
              <div className="animate-pulse w-14 h-14 rounded-full bg-white/40 flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M6 4l10 6-10 6V4z"/>
                </svg>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-medium">
            {video.mentor_id?.charAt(0) || 'M'}
          </div>
          <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            {video.mentor_id || 'Unknown Mentor'}
          </span>
        </div>
        <h3 className={`font-semibold text-lg mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          {video.title}
        </h3>
        <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} text-sm line-clamp-2 mb-4`}>
          {video.description}
        </p>
        <button
          onClick={() => window.open(`https://timscdr-hackathon-git-main-meemeets-projects.vercel.app//api/view_file/${video.file_id}`, '_blank')}
          className="w-full py-2.5 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-medium transition-all duration-200 flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Watch Video
        </button>
      </div>
    </div>
  );
};

export default function MentorPage() {
  const [activeTab, setActiveTab] = useState("about");
  const [darkMode, setDarkMode] = useState(true);
  const [videos, setVideos] = useState<Video[]>([]);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Add mentor data
  const mentorData = {
    id: 5,
    name: "Neha Patil",
    image: "https://images.unsplash.com/photo-1598550874175-4d0ef436c909?auto=format&fit=crop&q=80&w=200&h=200",
    title: "Cybersecurity Consultant & Ethical Hacker",
    total_students: "65,000+",
    reviews: "9,400+",
    specialization: "Cybersecurity & Ethical Hacking",
    experience: "8+ years in Cybersecurity",
    education: "B.Tech in Cybersecurity, NIT Trichy",
    bio: "Security expert helping individuals and businesses stay protected. Conducted cybersecurity training for 65,000+ students globally.",
    rating: 4.8,
    courses: [
      "Ethical Hacking Fundamentals",
      "Network Security",
      "Penetration Testing",
      "Security Compliance"
    ],
    achievements: [
      "Identified vulnerabilities in major platforms",
      "Certified Ethical Hacker (CEH)",
      "Cybersecurity Excellence Award"
    ],
    contact: {
      website: "https://nehacyber.com",
      linkedin: "https://linkedin.com/in/nehapatil"
    }
  };

  const fetchVideos = async () => {
    try {
      setIsLoading(true);
      setError("");
      
      console.log("Fetching all videos");
      
      const response = await fetch('/api/mentor/videos/all', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      console.log("Response status:", response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response:", errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("Received data:", data);
      
      if (data.videos && data.videos.documents) {
        setVideos(data.videos.documents);
        setError("");
      } else {
        console.error("Invalid response format:", data);
        setError("No videos found");
      }
      
    } catch (err: any) {
      console.error("Fetch error:", err);
      setError(err.message || "Failed to fetch videos");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const handleVideoUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUploading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    formData.append("mentor_id", "Neha_Patil");

    try {
      const response = await fetch("https://timscdr-hackathon-git-main-meemeets-projects.vercel.app//api/mentor/upload_video", {
        method: "POST",
        body: formData,
      });
      
      const data = await response.json();
      if (data.error) {
        setError(data.error);
      } else {
        fetchVideos();
        (e.target as HTMLFormElement).reset();
      }
    } catch (err: any) {
      setError("Error uploading video: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Modern Navigation Header with updated styling */}
      <div className={`${darkMode ? 'bg-gray-800/90 backdrop-blur-xl' : 'bg-white/80 backdrop-blur-lg'} sticky top-0 z-50 shadow-xl border-b ${darkMode ? 'border-gray-700/50' : 'border-gray-200'}`}>
        <div className="container mx-auto px-6">
          <nav className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-8">
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                Udaan
              </span>
              <div className="flex space-x-1">
                {["about", "videos", "upload", "requests", "schedule"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                      activeTab === tab
                        ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/20"
                        : darkMode 
                          ? "text-gray-300 hover:bg-gray-700/70" 
                          : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            <button
              onClick={toggleDarkMode}
              className={`p-2.5 rounded-lg transition-all duration-300 ${
                darkMode 
                  ? 'bg-gray-700/70 text-yellow-300 hover:bg-gray-600' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {darkMode ? '☀️' : '🌙'}
            </button>
          </nav>
        </div>
      </div>

      {/* Update container padding and max-width */}
      <div className="container mx-auto px-4 sm:px-6 py-8 max-w-7xl">
        {/* About section with improved styling */}
        {activeTab === "about" && (
          <div className={`${darkMode ? 'bg-gray-800/50 backdrop-blur-sm' : 'bg-white'} rounded-2xl shadow-xl p-8 transition-all duration-300`}>
            <div className="flex flex-col md:flex-row items-start gap-8">
              <div className="relative">
                <div className="w-48 h-48 rounded-2xl overflow-hidden">
                  <img 
                    src={mentorData.image}
                    alt={mentorData.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-3 -right-3 bg-green-500 px-3 py-1 rounded-full text-white text-sm">
                  Available
                </div>
              </div>
              
              <div className="flex-1 space-y-6">
                <div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-2xl font-bold">{mentorData.name}</h3>
                      <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} text-lg`}>
                        {mentorData.title}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-yellow-400 text-2xl font-bold">{mentorData.rating}</span>
                      <div className="flex">
                        {[1,2,3,4,5].map((star) => (
                          <svg key={star} className={`w-5 h-5 ${star <= mentorData.rating ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                          </svg>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-4 mt-4">
                    <div className={`px-4 py-2 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                      <span className="block text-sm text-gray-500">Students</span>
                      <span className="font-bold">{mentorData.total_students}</span>
                    </div>
                    <div className={`px-4 py-2 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                      <span className="block text-sm text-gray-500">Reviews</span>
                      <span className="font-bold">{mentorData.reviews}</span>
                    </div>
                  </div>
                </div>
                
                <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                  <p className="leading-relaxed">{mentorData.bio}</p>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Education & Experience</h4>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z"/>
                        </svg>
                        <span>{mentorData.education}</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                        </svg>
                        <span>{mentorData.experience}</span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3">Achievements</h4>
                    <ul className="space-y-2">
                      {mentorData.achievements.map((achievement) => (
                        <li key={achievement} className="flex items-center gap-2">
                          <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                          </svg>
                          <span>{achievement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Courses</h4>
                  <div className="flex flex-wrap gap-2">
                    {mentorData.courses.map((course) => (
                      <span
                        key={course}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                          darkMode 
                            ? 'bg-blue-500/20 text-blue-300 hover:bg-blue-500/30' 
                            : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                        }`}
                      >
                        {course}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex gap-4 mt-6">
                  <a 
                    href={mentorData.contact.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="px-6 py-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-all duration-200 shadow-lg shadow-blue-500/30 flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"/>
                    </svg>
                    Website
                  </a>
                  <a 
                    href={mentorData.contact.linkedin} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={`px-6 py-3 rounded-full transition-all duration-200 flex items-center gap-2 ${
                      darkMode 
                        ? 'bg-gray-700 text-white hover:bg-gray-600' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                    </svg>
                    LinkedIn
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Videos section with improved styling */}
        {activeTab === "videos" && (
          <div className={`${darkMode ? 'bg-gray-800/50 backdrop-blur-sm' : 'bg-white'} rounded-2xl shadow-xl p-8`}>
            <div className="flex justify-between items-center mb-8">
              <h2 className={`text-2xl font-bold ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                My Video Content
              </h2>
              <div className="flex gap-3">
                <button 
                  onClick={() => fetchVideos()}
                  className={`px-4 py-2 rounded-lg ${
                    darkMode 
                      ? 'bg-gray-700/70 text-white hover:bg-gray-600' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  } transition-all duration-300`}
                >
                  Refresh
                </button>
                <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:opacity-90 transition-all duration-300">
                  New Video
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-500/10 border-l-4 border-red-500 p-4 mb-6 rounded-lg">
                <div className="flex items-center">
                  <svg className="w-6 h-6 text-red-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="text-red-700 font-medium">Error</p>
                    <p className="text-red-600 text-sm">{error}</p>
                  </div>
                </div>
                <button 
                  onClick={() => fetchVideos()}
                  className="mt-3 text-red-700 hover:text-red-800 text-sm font-medium"
                >
                  Try Again →
                </button>
              </div>
            )}

            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="relative w-16 h-16">
                  <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-200 rounded-full"></div>
                  <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-500 rounded-full animate-spin border-t-transparent"></div>
                </div>
                <p className={`mt-6 ${darkMode ? 'text-gray-400' : 'text-gray-600'} font-medium`}>
                  Loading videos...
                </p>
              </div>
            ) : videos.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {videos.map(video => (
                  <VideoCard key={video.$id} video={video} darkMode={darkMode} />
                ))}
              </div>
            ) : (
              <div className={`text-center py-12 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                <svg 
                  className="mx-auto h-12 w-12 mb-4" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" 
                  />
                </svg>
                <p className="text-lg font-medium mb-2">No videos found</p>
                <p className="text-sm">Upload your first video to get started</p>
              </div>
            )}
          </div>
        )}

        {/* Upload section with improved styling */}
        {activeTab === "upload" && (
          <div className={`${darkMode ? 'bg-gray-800/50 backdrop-blur-sm' : 'bg-white'} rounded-2xl shadow-xl p-8`}>
            <h2 className={`text-2xl font-bold mb-8 ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
              Upload New Video
            </h2>
            <form onSubmit={handleVideoUpload} className="max-w-2xl space-y-6">
              <div>
                <label className={`block text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'} mb-2`}>
                  Video Title
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  className={`w-full p-4 rounded-xl transition-all duration-200 ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:bg-gray-600' 
                      : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500 focus:bg-white'
                  } border focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  placeholder="Enter an engaging title"
                />
              </div>

              <div>
                <label className={`block text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'} mb-2`}>
                  Description
                </label>
                <textarea
                  name="description"
                  required
                  rows={4}
                  className={`w-full p-4 rounded-xl transition-all duration-200 ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:bg-gray-600' 
                      : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500 focus:bg-white'
                  } border focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  placeholder="Describe your video content"
                />
              </div>

              <div>
                <label className={`block text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'} mb-2`}>
                  Video File
                </label>
                <div className={`w-full p-8 border-2 border-dashed rounded-xl text-center ${
                  darkMode 
                    ? 'border-gray-600 bg-gray-700/50' 
                    : 'border-gray-300 bg-gray-50'
                }`}>
                  <input
                    type="file"
                    name="video"
                    accept="video/*"
                    required
                    className="hidden"
                    id="video-upload"
                  />
                  <label htmlFor="video-upload" className="cursor-pointer">
                    <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      Drag and drop your video here, or click to browse
                    </div>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                disabled={uploading}
                className={`w-full py-4 rounded-xl font-medium transition-all duration-300 ${
                  uploading 
                    ? 'bg-blue-400/70 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:opacity-90 shadow-lg shadow-blue-500/20'
                } text-white`}
              >
                {uploading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Uploading...
                  </span>
                ) : "Upload Video"}
              </button>
            </form>
          </div>
        )}

        {/* Modern Mentoring Requests */}
        {activeTab === "requests" && (
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-xl p-8`}>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold">Mentoring Requests</h2>
              <div className="flex gap-4">
                <button className={`px-4 py-2 rounded-full ${
                  darkMode 
                    ? 'bg-gray-700 text-white hover:bg-gray-600' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                } transition-all duration-200`}>
                  Filter
                </button>
              </div>
            </div>
            
            <div className="space-y-4">
              {[1 , "satva", "Kush"].map((request) => (
                <div
                  key={request}
                  className={`p-6 rounded-xl transition-all duration-200 ${
                    darkMode 
                      ? 'bg-gray-700/50 hover:bg-gray-700' 
                      : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-medium">
                        {`S${request}`}
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{request}</h3>
                        <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} text-sm`}>
                          Looking for guidance in React Development
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-3">
                      <button className="px-4 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-all duration-200">
                        Accept
                      </button>
                      <button className="px-4 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all duration-200">
                        Decline
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Schedule tab content */}
        {activeTab === "schedule" && (
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-xl overflow-hidden`}>
            <div className="p-6 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}">
              <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Schedule a Mentoring Session
              </h2>
              <p className={`mt-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Book a one-on-one session with your mentor. Choose a time that works best for you.
              </p>
              
              {/* Quick Info Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-blue-500/10">
                      <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>Duration</h3>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>30 minutes</p>
                    </div>
                  </div>
                </div>
                
                <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-green-500/10">
                      <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>Availability</h3>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Real-time slots</p>
                    </div>
                  </div>
                </div>
                
                <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-purple-500/10">
                      <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>Session Type</h3>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Video Call</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Calendar Container */}
            <div className="relative" style={{ height: '700px' }}>
              {/* Loading Overlay */}
              <div className="absolute inset-0 flex items-center justify-center bg-gray-900/10 backdrop-blur-sm">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              </div>
              
              {/* Calendly iframe */}
              <iframe
                src="https://calendly.com/00000superman/30min?back=1&month=2025-02"
                style={{
                  width: '100%',
                  height: '100%',
                  border: 'none',
                }}
                onLoad={(e) => {
                  // Hide loading overlay when iframe loads
                  const target = e.target as HTMLIFrameElement;
                  target.parentElement?.querySelector('.bg-gray-900\\/10')?.classList.add('hidden');
                }}
              />
            </div>

            {/* Bottom Info Section */}
            <div className={`p-6 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <div className="flex items-start gap-4">
                <div className="p-2 rounded-lg bg-yellow-500/10">
                  <svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                    Important Note
                  </h3>
                  <p className={`mt-1 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Please be ready 5 minutes before the session starts. Make sure you have a stable internet connection and a quiet environment for the best experience.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 