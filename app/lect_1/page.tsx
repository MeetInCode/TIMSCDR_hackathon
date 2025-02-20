"use client"
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { VideoPlayer } from '../components/VideoPlayer';
import { Quiz } from '../components/Quiz';
import { CourseOverview } from '../components/CourseOverview';
import type { Course } from './types';
import { BookOpen } from 'lucide-react';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"

function App() {
  const searchParams = useSearchParams();
  const [isLoadingQuiz, setIsLoadingQuiz] = useState(false);
  const [quizError, setQuizError] = useState<string | null>(null);
  const [courseData, setCourseData] = useState<Course>({
    videoLecture: {
      title: searchParams.get('title') || "Introduction to Machine Learning",
      url: `http://127.0.0.1:5328/api/view_file/${searchParams.get('fileId')}`,
      duration: "45 min"
    },
    aiQuiz: {
      questions: [
        {
          question: "What is the main goal of Machine Learning?",
          options: ["To program computers manually", "To enable computers to learn from data", "To create software documentation", "To improve UI design"],
          correctAnswer: "To enable computers to learn from data"
        },
        {
          question: "Which algorithm is used for classification?",
          options: ["Linear Regression", "Decision Tree", "K-Means Clustering", "Apriori Algorithm"],
          correctAnswer: "Decision Tree"
        }
      ]
    },
    courseDetails: {
      title: searchParams.get('title') || "Machine Learning Basics",
      description: searchParams.get('description') || "This course introduces students to fundamental concepts of machine learning, including supervised and unsupervised learning techniques.",
      mentor: "Dr. Jane Doe",
      whatYouWillLearn: [
        "Understanding supervised and unsupervised learning",
        "Building simple machine learning models",
        "Working with data preprocessing",
        "Evaluating model performance"
      ],
      courseContent: [
        { week: 1, topic: "Introduction to Machine Learning" },
        { week: 2, topic: "Supervised Learning Techniques" },
        { week: 3, topic: "Unsupervised Learning Techniques" },
        { week: 4, topic: "Model Evaluation and Optimization" }
      ]
    }
  });

  useEffect(() => {
    const videoId = searchParams.get('videoId');
    const mentorId = searchParams.get('mentorId');
    
    // You can add API calls here to fetch additional data
    // Example:
    // const fetchVideoDetails = async () => {
    //   const response = await fetch(`/api/videos/${videoId}`);
    //   const data = await response.json();
    //   setCourseData(prevData => ({
    //     ...prevData,
    //     // Update with fetched data
    //   }));
    // };
    
    // fetchVideoDetails();

    const fetchQuizQuestions = async () => {
      setIsLoadingQuiz(true);
      setQuizError(null);
      
      try {
        console.log('Fetching quiz questions...'); // Debug log
        const response = await fetch('http://127.0.0.1:5328/quiz', { // Make sure URL matches your API
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title: searchParams.get('title'),
            desc: searchParams.get('description')
          })
        });

        console.log('Response status:', response.status); // Debug log

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Quiz data received:', data); // Debug log

        if (data.aiQuiz && data.aiQuiz.questions) {
          setCourseData(prevData => ({
            ...prevData,
            aiQuiz: data.aiQuiz
          }));
        } else {
          throw new Error('Invalid quiz data format');
        }
      } catch (error) {
        console.error('Error fetching quiz:', error);
        setQuizError(error instanceof Error ? error.message : 'Failed to load quiz');
      } finally {
        setIsLoadingQuiz(false);
      }
    };

    fetchQuizQuestions();
  }, [searchParams]);

  return (
    <SidebarProvider>
          <AppSidebar />
          <SidebarInset>

    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        

      {/* Video Section */}
      <div className="w-full bg-gray-900">
        <div className="container mx-auto">
          <VideoPlayer video={courseData.videoLecture} />
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 py-8">
        {/* Course Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            {courseData.courseDetails.title}
          </h1>
          <div className="flex items-center gap-4">
            <img
              src="https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=400"
              alt={courseData.courseDetails.mentor}
              className="w-12 h-12 rounded-full object-cover ring-2 ring-blue-100"
            />
            <div>
              <p className="font-medium text-gray-800">
                {courseData.courseDetails.mentor}
              </p>
              <p className="text-sm text-blue-600 font-medium">
                Course Instructor
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Course Overview Sidebar */}
          <div className="lg:col-span-1 order-2 lg:order-1">
            <div className="bg-white rounded-xl shadow-sm sticky top-4">
              <CourseOverview courseDetails={courseData.courseDetails} />
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3 space-y-6 order-1 lg:order-2">
            {/* Video Info */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">About This Lecture</h2>
              <p className="text-gray-600 mb-4 leading-relaxed">
                {courseData.courseDetails.description}
              </p>
              <div className="flex items-center gap-4 text-sm">
                <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full">
                  Duration: {courseData.videoLecture.duration}
                </span>
                <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full">
                  Week 1: {courseData.courseDetails.courseContent?.[0]?.topic || 'Introduction'}
                </span>
              </div>
            </div>

            {/* Quiz Section */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-6 text-gray-800">Knowledge Check</h2>
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6">
                <p className="text-blue-700">
                  Test your understanding of the concepts covered in this lecture.
                </p>
              </div>
              
              {isLoadingQuiz && (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                  <span className="ml-3">Loading quiz questions...</span>
                </div>
              )}

              {quizError && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
                  <p className="text-red-600">Error loading quiz: {quizError}</p>
                  <button 
                    onClick={() => window.location.reload()}
                    className="mt-2 text-red-600 hover:text-red-700 underline"
                  >
                    Try again
                  </button>
                </div>
              )}

              {!isLoadingQuiz && !quizError && courseData.aiQuiz.questions.length > 0 && (
                <Quiz questions={courseData.aiQuiz.questions} />
              )}

              {!isLoadingQuiz && !quizError && courseData.aiQuiz.questions.length === 0 && (
                <p className="text-gray-600">No quiz questions available for this lecture.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>

</SidebarInset>
    </SidebarProvider>
  );
}

export default App;