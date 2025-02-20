'use client';

import { useState, useRef, useEffect } from 'react';
import axios from 'axios';

const AudioRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [loading, setLoading] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        audioChunksRef.current = [];
        // Automatically send the audio once recording stops
        sendAudio(audioBlob);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Error accessing microphone:", err);
      alert("Could not access microphone. Please check permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    }
  };

  const sendAudio = async (blob: Blob) => {
    setLoading(true);
    const formData = new FormData();
    formData.append("file", blob, "recording.wav");
  
    try {
      const result = await axios.post(
        "https://eb12-2409-40c0-1061-13a7-9945-b4b2-ce58-3e5.ngrok-free.app/process_audio",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
  
      console.log("Response from server:", result.data);
  
      if (result.data?.llama_response) {
        const newLocation = result.data.llama_response.trim();
        if (newLocation.startsWith("/")) {
          window.location.href = newLocation; // Navigate to the new path
        }
      }
    } catch (err) {
      console.error("Error sending audio:", err);
    } finally {
      setLoading(false);
    }
  };
  

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  return (
    <button
      onClick={toggleRecording}
      disabled={loading}
      className={`w-12 h-12 rounded-full flex items-center justify-center text-white transition-colors ${
        isRecording ? "bg-red-500 hover:bg-red-600" : "bg-blue-500 hover:bg-blue-600"
      }`}
    >
      {loading ? (
        <span className="animate-pulse">...</span>
      ) : isRecording ? (
        // Stop icon: a square
        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <rect x="6" y="6" width="12" height="12" />
        </svg>
      ) : (
        // Microphone icon (using Heroicons outline)
        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 1.5c1.93 0 3.5 1.57 3.5 3.5v6c0 1.93-1.57 3.5-3.5 3.5s-3.5-1.57-3.5-3.5v-6c0-1.93 1.57-3.5 3.5-3.5z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.5 10.5c0 3.037-2.463 5.5-5.5 5.5S8.5 13.537 8.5 10.5" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 16.5v4m6-4.5c0 2.485-2.015 4.5-4.5 4.5S9 18.485 9 16.5" />
        </svg>
      )}
    </button>
  );
};

export default AudioRecorder;
