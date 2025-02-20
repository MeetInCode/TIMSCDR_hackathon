"use client"
import React, { useState } from 'react';
import { format } from 'date-fns';
import {
  BookOpen,
  Calendar,
  ChevronRight,
  GraduationCap,
  LineChart,
  MessageCircle,
  Star,
  Users,
  Trophy,
  Home,
} from 'lucide-react';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"

// Mock data
const upcomingSessions = [
  {
    id: 1,
    subject: 'Mathematics',
    mentor: 'Dr. Sarah Wilson',
    date: new Date(2024, 2, 25, 14, 30),
    duration: '1 hour',
    topic: 'Advanced Calculus',
  },
  {
    id: 2,
    subject: 'Physics',
    mentor: 'Prof. James Miller',
    date: new Date(2024, 2, 26, 16, 0),
    duration: '1.5 hours',
    topic: 'Quantum Mechanics',
  },
];

const subjects = [
  { name: 'Mathematics', progress: 75, sessions: 12 },
  { name: 'Physics', progress: 60, sessions: 8 },
  { name: 'Chemistry', progress: 45, sessions: 6 },
];

const mentors = [
  {
    name: 'Dr. Sarah Wilson',
    subject: 'Mathematics',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
  },
  {
    name: 'Prof. James Miller',
    subject: 'Physics',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
  },
];

const leaderboardData = [
  {
    id: 1,
    name: 'Ananya Mehta',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
    points: 2850,
    streak: 15,
    subjects: ['Mathematics', 'Physics'],
    badges: ['Quick Learner', 'Perfect Attendance'],
    rank: 1,
  },
  {
    id: 2,
    name: 'Arjun Patel',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    points: 2720,
    streak: 12,
    subjects: ['Chemistry', 'Biology'],
    badges: ['Subject Master', 'Team Player'],
    rank: 2,
  },
  {
    id: 3,
    name: 'Riya Singh',
    image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400',
    points: 2680,
    streak: 10,
    subjects: ['Physics', 'Computer Science'],
    badges: ['Rising Star'],
    rank: 3,
  },
  {
    id: 4,
    name: 'Vikram Malhotra',
    image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400',
    points: 2590,
    streak: 8,
    subjects: ['Mathematics'],
    badges: ['Consistent Learner'],
    rank: 4,
  },
  {
    id: 5,
    name: 'Aisha Patel',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
    points: 2470,
    streak: 7,
    subjects: ['Biology'],
    badges: ['Quick Learner'],
    rank: 5,
  },
];

function Dashboard() {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Sessions</p>
                  <p className="text-2xl font-semibold text-gray-900">26</p>
                </div>
                <Calendar className="h-8 w-8 text-indigo-600" />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Subjects</p>
                  <p className="text-2xl font-semibold text-gray-900">3</p>
                </div>
                <BookOpen className="h-8 w-8 text-indigo-600" />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Connected Mentors</p>
                  <p className="text-2xl font-semibold text-gray-900">4</p>
                </div>
                <Users className="h-8 w-8 text-indigo-600" />
              </div>
            </div>
          </div>

          {/* Upcoming Sessions */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Sessions</h2>
              <div className="space-y-4">
                {upcomingSessions.map((session) => (
                  <div
                    key={session.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="bg-indigo-100 rounded-lg p-3">
                        <BookOpen className="h-6 w-6 text-indigo-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{session.subject}</h3>
                        <p className="text-sm text-gray-500">{session.topic}</p>
                        <p className="text-sm text-gray-500">
                          with {session.mentor} • {session.duration}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">
                        {format(session.date, 'MMM d, yyyy')}
                      </p>
                      <p className="text-sm text-gray-500">{format(session.date, 'h:mm a')}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Subject Progress */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Subject Progress</h2>
                <LineChart className="h-5 w-5 text-gray-400" />
              </div>
              <div className="space-y-4">
                {subjects.map((subject) => (
                  <div key={subject.name}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">{subject.name}</span>
                      <span className="text-sm text-gray-500">{subject.sessions} sessions</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-indigo-600 h-2.5 rounded-full"
                        style={{ width: `${subject.progress}%` }}
                        ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          {/* Your Mentors */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Mentors</h2>
              <div className="space-y-4">
                {mentors.map((mentor) => (
                  <div
                    key={mentor.name}
                    className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg"
                  >
                    <img
                      src={mentor.image}
                      alt={mentor.name}
                      className="h-12 w-12 rounded-full"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{mentor.name}</h3>
                      <p className="text-sm text-gray-500">{mentor.subject}</p>
                    </div>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400" />
                      <span className="ml-1 text-sm text-gray-600">{mentor.rating}</span>
                    </div>
                  </div>
                ))}
              </div>
              <button className="mt-4 w-full flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                View All Mentors
                <ChevronRight className="ml-2 h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
              <div className="space-y-2">
                <button className="w-full flex items-center justify-between px-4 py-3 text-left text-sm font-medium text-gray-700 bg-gray-50 rounded-lg hover:bg-gray-100">
                  Schedule New Session
                  <Calendar className="h-5 w-5 text-gray-400" />
                </button>
                <button className="w-full flex items-center justify-between px-4 py-3 text-left text-sm font-medium text-gray-700 bg-gray-50 rounded-lg hover:bg-gray-100">
                  Browse Subjects
                  <BookOpen className="h-5 w-5 text-gray-400" />
                </button>
                <button className="w-full flex items-center justify-between px-4 py-3 text-left text-sm font-medium text-gray-700 bg-gray-50 rounded-lg hover:bg-gray-100">
                  Message Mentor
                  <MessageCircle className="h-5 w-5 text-gray-400" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Leaderboard() {
  return (
    <div className="space-y-8">
      {/* Top 3 Students */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {leaderboardData.slice(0, 3).map((student, index) => (
          <div
            key={student.id}
            className={`bg-white rounded-lg shadow-lg p-6 transform hover:scale-105 transition-transform duration-200 ${
              index === 0
                ? 'ring-2 ring-yellow-400'
                : index === 1
                ? 'ring-2 ring-gray-300'
                : 'ring-2 ring-amber-600'
            }`}
          >
            <div className="flex flex-col items-center text-center">
              <div className="relative">
                <img
                  src={student.image}
                  alt={student.name}
                  className="h-20 w-20 rounded-full"
                />
                <div
                  className={`absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center ${
                    index === 0
                      ? 'bg-yellow-400'
                      : index === 1
                      ? 'bg-gray-300'
                      : 'bg-amber-600'
                  }`}
                >
                  <Trophy className="h-5 w-5 text-white" />
                </div>
              </div>
              <h3 className="mt-4 font-semibold text-gray-900">{student.name}</h3>
              <p className="text-2xl font-bold text-indigo-600">{student.points} pts</p>
              <div className="mt-2 flex flex-wrap justify-center gap-2">
                {student.badges.map((badge) => (
                  <span
                    key={badge}
                    className="px-2 py-1 bg-indigo-100 text-indigo-800 text-xs rounded-full"
                  >
                    {badge}
                  </span>
                ))}
              </div>
              <p className="mt-2 text-sm text-gray-500">🔥 {student.streak} day streak</p>
            </div>
          </div>
        ))}
      </div>

      {/* Leaderboard Table */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">All Students</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rank
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Points
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Streak
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Subjects
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {leaderboardData.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span
                          className={`flex items-center justify-center w-6 h-6 rounded-full ${
                            student.rank === 1
                              ? 'bg-yellow-400'
                              : student.rank === 2
                              ? 'bg-gray-300'
                              : student.rank === 3
                              ? 'bg-amber-600'
                              : 'bg-gray-100'
                          } text-white font-semibold text-sm`}
                        >
                          {student.rank}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img
                          className="h-10 w-10 rounded-full"
                          src={student.image}
                          alt=""
                        />
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {student.name}
                          </div>
                          <div className="flex gap-1">
                            {student.badges.map((badge) => (
                              <span
                                key={badge}
                                className="px-2 py-0.5 bg-indigo-100 text-indigo-800 text-xs rounded-full"
                              >
                                {badge}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{student.points}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">🔥 {student.streak} days</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex gap-1">
                        {student.subjects.map((subject) => (
                          <span
                            key={subject}
                            className="px-2 py-0.5 bg-gray-100 text-gray-800 text-xs rounded-full"
                          >
                            {subject}
                          </span>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [currentPage, setCurrentPage] = useState<'dashboard' | 'leaderboard'>('dashboard');

  return (
    <SidebarProvider>
          <AppSidebar />
          <SidebarInset>

    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <GraduationCap className="h-8 w-8 text-indigo-600" />
              <h1 className="text-2xl font-bold text-gray-900">Udaan</h1>
            </div>
            <div className="flex items-center space-x-4">
              <nav className="flex space-x-4">
                <button
                  onClick={() => setCurrentPage('dashboard')}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium ${
                    currentPage === 'dashboard'
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Home className="h-4 w-4" />
                  <span>Dashboard</span>
                </button>
                <button
                  onClick={() => setCurrentPage('leaderboard')}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium ${
                    currentPage === 'leaderboard'
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Trophy className="h-4 w-4" />
                  <span>Leaderboard</span>
                </button>
              </nav>
              <button className="text-gray-500 hover:text-gray-700">
                <MessageCircle className="h-6 w-6" />
              </button>
              <img
                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400"
                alt="Profile"
                className="h-8 w-8 rounded-full"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentPage === 'dashboard' ? <Dashboard /> : <Leaderboard />}
      </main>
    </div>
    </SidebarInset>
    </SidebarProvider>
  );
}

export default App;