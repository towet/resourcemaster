import React from 'react';
import { BarChart3, Building2, Users2, BoxesIcon, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface LandingPageProps {
  onAuthClick: () => void;
}

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => (
  <div className="p-6 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200">
    <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center mb-4">
      {icon}
    </div>
    <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

export const LandingPage: React.FC<LandingPageProps> = ({ onAuthClick }) => {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm fixed w-full z-50 shadow-sm">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Building2 className="h-8 w-8 text-indigo-600" />
            <span className="text-xl font-bold text-gray-900">ResourceFlow</span>
          </div>
          <div className="flex space-x-4">
            <button
              onClick={onAuthClick}
              className="text-gray-600 hover:text-gray-900 px-4 py-2 rounded-lg transition-colors"
            >
              Login
            </button>
            <button
              onClick={onAuthClick}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-all duration-200 hover:shadow-lg"
            >
              Get Started
            </button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <div className="relative pt-16 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            {/* Left Column - Content */}
            <motion.div 
              className="order-2 lg:order-1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl lg:text-6xl">
                <span className="block mb-2">Streamline Your</span>
                <span className="block text-indigo-600">Resource Management</span>
              </h1>
              <p className="mt-6 text-lg sm:text-xl text-gray-600">
                Efficiently manage and allocate resources across departments. Track requests, monitor usage, and make data-driven decisions.
              </p>
              <motion.div 
                className="mt-8 flex flex-col sm:flex-row gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <button
                  onClick={onAuthClick}
                  className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-lg font-medium rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 transition-all duration-200 hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </button>
              </motion.div>
            </motion.div>

            {/* Right Column - Image */}
            <motion.div 
              className="order-1 lg:order-2 relative"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl transform hover:scale-[1.02] transition-all duration-500">
                <img
                  src="https://cdn.leonardo.ai/users/b6aa1b0f-1900-4a85-897d-d81532027875/generations/156a38d7-5bfe-465d-987c-e1072df98233/Leonardo_Phoenix_09_Create_a_sophisticated_highcontrast_visual_0.jpg"
                  alt="Resource Management"
                  className="w-full h-[400px] lg:h-[500px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/10 to-transparent mix-blend-overlay"></div>
              </div>
              {/* Decorative Elements */}
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-indigo-100 rounded-full opacity-50 blur-2xl"></div>
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-blue-100 rounded-full opacity-50 blur-2xl"></div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Powerful Features for Resource Management
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Everything you need to manage your resources effectively
          </p>
        </motion.div>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <FeatureCard
              icon={<BoxesIcon className="h-8 w-8 text-indigo-600" />}
              title="Resource Management"
              description="Track and manage resources efficiently across departments with real-time updates and detailed tracking"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <FeatureCard
              icon={<Users2 className="h-8 w-8 text-indigo-600" />}
              title="Role-Based Access"
              description="Secure access control with customizable permission levels for different user roles"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <FeatureCard
              icon={<BarChart3 className="h-8 w-8 text-indigo-600" />}
              title="Analytics & Insights"
              description="Make data-driven decisions with comprehensive analytics and visual reporting tools"
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
};