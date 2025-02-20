import React from 'react';
import { CourseDetails } from '../lect_1/types';
import { CheckCircle, Book, Star, User, Clock } from 'lucide-react';

interface CourseOverviewProps {
  courseDetails: CourseDetails;
}

export function CourseOverview({ courseDetails }: CourseOverviewProps) {
  return (
    <div className="bg-white rounded-xl p-6 divide-y divide-gray-100">
      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4 pb-6">
        <div className="bg-blue-50 rounded-lg p-4 text-center">
          <Clock className="w-6 h-6 text-blue-600 mx-auto mb-2" />
          <p className="text-sm text-blue-600 font-medium">4 Weeks</p>
        </div>
        <div className="bg-blue-50 rounded-lg p-4 text-center">
          <User className="w-6 h-6 text-blue-600 mx-auto mb-2" />
          <p className="text-sm text-blue-600 font-medium">Self-Paced</p>
        </div>
      </div>

      {/* Learning Objectives */}
      <div className="py-6">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">What You'll Learn</h2>
        <ul className="space-y-3">
          {courseDetails.whatYouWillLearn.map((item, index) => (
            <li key={index} className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
              <span className="text-gray-600 text-sm leading-tight">{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Course Content */}
      <div className="py-6">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">Course Content</h2>
        <div className="space-y-3">
          {courseDetails.courseContent.map((module) => (
            <div
              key={module.week}
              className="bg-gray-50 rounded-lg p-4 transition duration-200 hover:bg-gray-100"
            >
              <div className="flex items-center gap-3">
                <div className="bg-white p-2 rounded-lg">
                  <Book className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-800">Week {module.week}</h3>
                  <p className="text-sm text-gray-600">{module.topic}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Instructor Section */}
      <div className="py-6">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">Your Instructor</h2>
        <div className="flex items-center gap-4 mb-4">
          <img
            src="https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=400"
            alt={courseDetails.mentor}
            className="w-14 h-14 rounded-full object-cover ring-2 ring-gray-100"
          />
          <div>
            <h3 className="font-medium text-gray-800">{courseDetails.mentor}</h3>
            <p className="text-sm text-gray-600">Machine Learning Expert</p>
          </div>
        </div>
        
        {/* Rating */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center gap-1 mb-2">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
            ))}
          </div>
          <p className="text-sm text-gray-600">
            4.9 average rating • 2.3k students enrolled
          </p>
        </div>
      </div>

      {/* Course Description */}
      <div className="pt-6">
        <h2 className="text-lg font-semibold mb-3 text-gray-800">About the Course</h2>
        <p className="text-sm text-gray-600 leading-relaxed">
          {courseDetails.description}
        </p>
      </div>
    </div>
  );
}