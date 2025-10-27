import React, { useContext, useState } from 'react';
import { Calendar, Video, Clock, Menu, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/context/useAuth';
import VideoSocketContext from '@/context/VideoContext';

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { auth, logout } = useAuth();
  
  const { socket } = useContext(VideoSocketContext);

  const navigator = useNavigate();

  function handleSignIn () {
    navigator('/auth/signin')
  }

  function handleSignUp () {
    navigator('/auth/signup');
  }

  function handleCreateMetting ()  {
    console.log("Create Meeting");
    console.log("User details ", auth);
    if(!auth.user || !auth.token) {
        navigator('/auth/signin');
    }
    socket.emit("create-room");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <Video className="w-8 h-8 text-indigo-600" />
              <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                MeetHub
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
                {(auth.user && auth.token) ? (
                    <button
                    onClick={logout}
                    className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 font-medium transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                    >
                    Log out
                    </button>
                ) : (
                    <>
                    <button
                        onClick={handleSignIn}
                        className="px-6 py-2 text-gray-700 hover:text-indigo-600 font-medium transition-colors duration-200"
                    >
                        Sign In
                    </button>
                    <button
                        onClick={handleSignUp}
                        className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 font-medium transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                    >
                        Sign Up
                    </button>
                    </>
                )}
            </div>
            

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-gray-100"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 text-gray-700" />
              ) : (
                <Menu className="w-6 h-6 text-gray-700" />
              )}
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 space-y-2 border-t">
              <button className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 rounded-lg font-medium">
                Sign In
              </button>
              <button className="w-full px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium">
                Sign Up
              </button>
            </div>
          )}
        </nav>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="text-center">
          {/* Hero Section */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            Connect and Collaborate
            <span className="block bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Effortlessly
            </span>
          </h1>
          
          <p className="text-xl sm:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto">
            Start instant meetings or schedule for later. No hassle, just seamless video conferencing.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <button 
                className="group relative px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 w-full sm:w-auto"
                onClick={handleCreateMetting}
            >
              <div 
                className="flex items-center justify-center space-x-3"
                
              >
                <Video className="w-6 h-6" />
                <span >Create New Meeting</span>
              </div>
              <div className="absolute inset-0 bg-white/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>

            <button className="group relative px-8 py-4 bg-white text-gray-800 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-2 border-gray-200 hover:border-indigo-300 w-full sm:w-auto">
              <div className="flex items-center justify-center space-x-3">
                <Calendar className="w-6 h-6 text-indigo-600" />
                <span>Schedule a Meeting</span>
              </div>
            </button>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 mt-20 max-w-5xl mx-auto">
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-14 h-14 bg-indigo-100 rounded-xl flex items-center justify-center mb-4 mx-auto">
                <Video className="w-7 h-7 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Instant Meetings</h3>
              <p className="text-gray-600">Start a video call in seconds with just one click</p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mb-4 mx-auto">
                <Calendar className="w-7 h-7 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Smart Scheduling</h3>
              <p className="text-gray-600">Plan meetings ahead with calendar integration</p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-14 h-14 bg-pink-100 rounded-xl flex items-center justify-center mb-4 mx-auto">
                <Clock className="w-7 h-7 text-pink-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">24/7 Available</h3>
              <p className="text-gray-600">Connect anytime, anywhere, on any device</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}