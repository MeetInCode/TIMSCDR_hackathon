"use client";

import { useState, useEffect } from "react";
import { Play, RefreshCw, Plus, Film, ExternalLink } from "lucide-react";

interface Video {
  $id: string;
  title: string;
  description: string;
  file_id: string;
  mentor_id: string;
}
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"

// VideoCard Component
const VideoCard = ({ video, darkMode }: { video: Video; darkMode: boolean }) => {
  const [thumbnail, setThumbnail] = useState<string>('');
  const [isHovered, setIsHovered] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const videoElement = document.createElement('video');
    videoElement.crossOrigin = 'anonymous';
    videoElement.src = `http://127.0.0.1:5328/api/view_file/${video.file_id}`;
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
      className={`group rounded-2xl overflow-hidden transition-all duration-500 transform hover:scale-[1.02] ${
        darkMode ? 'bg-gray-800/80 hover:bg-gray-800' : 'bg-white hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)]'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="aspect-video bg-gradient-to-br from-violet-500 to-indigo-500 relative overflow-hidden">
        <div className="w-full h-full transition-transform duration-700 hover:scale-105">
          <video 
            className="w-full h-full object-cover"
            controls
            preload="metadata"
            crossOrigin="anonymous"
            poster={thumbnail || undefined}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          >
            <source src={`http://127.0.0.1:5328/api/view_file/${video.file_id}`} type="video/mp4" />
          </video>
          {!thumbnail && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
              <div className="animate-pulse w-16 h-16 rounded-full bg-white/40 flex items-center justify-center">
                <Play className="w-8 h-8 text-white" />
              </div>
            </div>
          )}
          {thumbnail && !isPlaying && (
            <div 
              className={`absolute inset-0 bg-black/30 backdrop-blur-[2px] flex items-center justify-center transition-opacity duration-300 ${
                isHovered ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <div className="transform transition-all duration-300 hover:scale-110">
                <Play className="w-12 h-12 text-white" />
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="p-6">
        <div className="space-y-2">
          <h3 className={`font-semibold text-lg transition-colors duration-200 ${
            darkMode ? 'text-white' : 'text-gray-800'
          } ${isHovered ? 'text-indigo-500' : ''}`}>
            {video.title}
          </h3>
          <p className={`${
            darkMode ? 'text-gray-300' : 'text-gray-600'
          } text-sm line-clamp-2 mb-4`}>
            {video.description}
          </p>
        </div>
        <button
  onClick={() => window.location.href = `/lect_1?videoId=${video.$id}&title=${encodeURIComponent(video.title)}&description=${encodeURIComponent(video.description)}&fileId=${video.file_id}&mentorId=${video.mentor_id}`}
  className="w-full py-3 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-medium 
    transition-all duration-300 flex items-center justify-center gap-2 transform hover:-translate-y-0.5"
>
  <ExternalLink className="w-5 h-5" />
  Open Video
</button>
      </div>
    </div>
  );
};

// Videos Component
export default function Videos({ darkMode, setActiveTab }: { darkMode: boolean; setActiveTab: (tab: string) => void }) {
  const [videos, setVideos] = useState<Video[]>([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

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
        const errorText = await response.text();
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
        <div className="space-y-1">
          <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            My Video Lectures
          </h2>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Manage and view your educational content
          </p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => fetchVideos()}
            disabled={isRefreshing}
            className={`px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all duration-300 ${
              darkMode 
                ? 'bg-gray-700 text-white hover:bg-gray-600' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            } ${isRefreshing ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
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
            <VideoCard key={video.$id} video={video} darkMode={darkMode} />
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