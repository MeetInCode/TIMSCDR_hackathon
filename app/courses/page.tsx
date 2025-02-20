"use client";

import { useState, useEffect } from "react";
import { Play, RefreshCw, Plus, Film, ExternalLink } from "lucide-react";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"

interface Video {
  $id: string;
  title: string;
  description: string;
  file_id: string;
  mentor_id: string;
}

export default function CoursesPage() {
  const [darkMode, setDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState("videos");
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);

  // VideoCard Component
  const VideoCard = ({ video }: { video: Video }) => {
    const [thumbnail, setThumbnail] = useState<string>('');
    const [isHovered, setIsHovered] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
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
      <div 
        className={`relative rounded-xl overflow-hidden shadow-lg transition-all duration-300 ${
          darkMode ? 'bg-gray-800' : 'bg-white'
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          setIsPlaying(false);
        }}
      >
        {/* Video Thumbnail */}
        <div className="relative aspect-video">
          {thumbnail ? (
            <img 
              src={thumbnail} 
              alt={video.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className={`w-full h-full flex items-center justify-center ${
              darkMode ? 'bg-gray-700' : 'bg-gray-100'
            }`}>
              <Film className="w-12 h-12 opacity-50" />
            </div>
          )}
          
          {/* Play Button Overlay */}
          <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}>
            <a
              href={`/lect_1?fileId=${video.file_id}&title=${encodeURIComponent(video.title)}&description=${encodeURIComponent(video.description)}`}
              className="bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-full shadow-lg transform transition-transform duration-300 hover:scale-110"
            >
              <Play className="w-6 h-6" />
            </a>
          </div>
        </div>

        {/* Video Info */}
        <div className="p-4">
          <h3 className={`font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            {video.title}
          </h3>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            {video.description}
          </p>
        </div>
      </div>
    );
  };

  const fetchVideos = async () => {
    try {
      setIsRefreshing(true);
      setError("");
      
      const response = await fetch('/api/mentor/videos/all', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.videos && data.videos.documents) {
        setVideos(data.videos.documents);
        setError("");
      } else {
        setError("No videos found");
      }
      
    } catch (err: any) {
      setError(err.message || "Failed to fetch videos");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className={`${
          darkMode ? 'bg-gray-800/90' : 'bg-white'
        } rounded-3xl shadow-xl p-8 transition-all duration-300`}>
          <div className="flex justify-between items-center mb-8">
            <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              Your Videos
            </h1>
            <div className="flex items-center gap-4">
              <button
                onClick={() => fetchVideos()}
                className={`p-2 rounded-lg transition-colors duration-200 ${
                  darkMode 
                    ? 'hover:bg-gray-700 text-gray-400 hover:text-white' 
                    : 'hover:bg-gray-100 text-gray-600 hover:text-gray-800'
                }`}
              >
                <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
              </button>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`p-2 rounded-lg transition-colors duration-200 ${
                  darkMode 
                    ? 'hover:bg-gray-700 text-gray-400 hover:text-white' 
                    : 'hover:bg-gray-100 text-gray-600 hover:text-gray-800'
                }`}
              >
                {darkMode ? '🌞' : '🌙'}
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-500/10 border-l-4 border-red-500 p-4 mb-6 rounded-xl">
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
                className="mt-3 text-red-700 hover:text-red-800 text-sm font-medium transition-colors duration-200"
              >
                Try Again →
              </button>
            </div>
          )}

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="relative w-16 h-16">
                <div className="absolute top-0 left-0 w-full h-full border-4 border-indigo-200 rounded-full"></div>
                <div className="absolute top-0 left-0 w-full h-full border-4 border-indigo-500 rounded-full animate-spin border-t-transparent"></div>
              </div>
              <p className={`mt-6 ${darkMode ? 'text-gray-400' : 'text-gray-600'} font-medium`}>
                Loading your videos...
              </p>
            </div>
          ) : videos.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {videos.map(video => (
                <VideoCard key={video.$id} video={video} />
              ))}
            </div>
          ) : (
            <div className={`text-center py-16 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              <Film className="mx-auto h-12 w-12 mb-4 opacity-80" />
              <p className="text-lg font-medium mb-2">No videos yet</p>
              <p className="text-sm mb-6">Start by uploading your first educational video</p>
              <button
                onClick={() => setActiveTab("upload")}
                className="px-6 py-3 rounded-xl bg-indigo-500 text-white hover:bg-indigo-600 
                  transition-all duration-300 flex items-center gap-2 mx-auto transform hover:-translate-y-0.5"
              >
                <Plus className="w-5 h-5" />
                Upload Video
              </button>
            </div>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}