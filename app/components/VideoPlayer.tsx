import React from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize2 } from 'lucide-react';
import { VideoLecture } from '../lect_1/types';

interface VideoPlayerProps {
  video: VideoLecture;
}

export function VideoPlayer({ video }: VideoPlayerProps) {
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [isMuted, setIsMuted] = React.useState(false);
  const [progress, setProgress] = React.useState(0);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const progress = (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setProgress(progress);
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (videoRef.current) {
      const progressBar = e.currentTarget;
      const clickPosition = (e.clientX - progressBar.getBoundingClientRect().left) / progressBar.offsetWidth;
      videoRef.current.currentTime = clickPosition * videoRef.current.duration;
    }
  };

  return (
    <div className="relative group aspect-video">
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-transparent z-10 pointer-events-none" />
      <h2 className="absolute top-4 left-4 text-2xl font-bold text-white z-20 drop-shadow-lg">
        {video.title}
      </h2>
      <video
        ref={videoRef}
        className="w-full h-full object-cover bg-black"
        src={video.url}
        onTimeUpdate={handleTimeUpdate}
        onClick={togglePlay}
      />
      
      {/* Video Controls */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 opacity-0 group-hover:opacity-100 transition-opacity">
        {/* Progress Bar */}
        <div 
          className="w-full h-1.5 bg-white/30 rounded-full mb-4 cursor-pointer"
          onClick={handleProgressClick}
        >
          <div 
            className="h-full bg-blue-500 rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Control Buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
              onClick={togglePlay}
            >
              {isPlaying ? (
                <Pause className="w-6 h-6 text-white" />
              ) : (
                <Play className="w-6 h-6 text-white" />
              )}
            </button>
            <button
              className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
              onClick={toggleMute}
            >
              {isMuted ? (
                <VolumeX className="w-6 h-6 text-white" />
              ) : (
                <Volume2 className="w-6 h-6 text-white" />
              )}
            </button>
            <span className="text-white text-sm font-medium">{video.duration}</span>
          </div>
          <button
            className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
            onClick={() => videoRef.current?.requestFullscreen()}
          >
            <Maximize2 className="w-6 h-6 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}