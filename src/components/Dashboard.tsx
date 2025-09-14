import React, { useState } from 'react';
import { Activity, PieChart, Calendar, Bell, Building2, BoxesIcon, BarChart3, ArrowRightCircle, LogOut, Menu, X, Box, CheckCircle, Package, AlertCircle } from 'lucide-react';
import { ResourceManagement } from './ResourceManagement';
import { DepartmentManagement } from './DepartmentManagement';
import { AllocationRequests } from './AllocationRequests';
import { TransferRequests } from './TransferRequests';
import { Analytics } from './Analytics';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';

export const Dashboard = () => {
  const { signOut } = useAuth();
  const [activeTab, setActiveTab] = useState<string>('resources');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };

  // Define available tabs
  const tabs = [
    { id: 'resources', text: 'Resources', icon: BoxesIcon },
    { id: 'requests', text: 'Requests', icon: Calendar },
    { id: 'departments', text: 'Departments', icon: Building2 },
    { id: 'transfers', text: 'Transfers', icon: ArrowRightCircle },
    { id: 'analytics', text: 'Analytics', icon: BarChart3 }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'resources':
        return <ResourceManagement />;
      case 'departments':
        return <DepartmentManagement />;
      case 'requests':
        return <AllocationRequests />;
      case 'transfers':
        return <TransferRequests />;
      case 'analytics':
        return <Analytics />;
      default:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            <StatCard
              title="Total Resources"
              value="1,234"
              change="+12%"
              icon={<BoxesIcon className="h-6 w-6" />}
            />
            <StatCard
              title="Active Requests"
              value="56"
              change="+3%"
              icon={<Calendar className="h-6 w-6" />}
            />
            <StatCard
              title="Departments"
              value="8"
              change="0%"
              icon={<Building2 className="h-6 w-6" />}
            />
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-0 left-0 m-4 z-50">
        <button
          onClick={toggleMobileMenu}
          className="p-2 rounded-lg bg-white shadow-lg text-gray-600 hover:text-gray-900"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold text-gray-900">ResourceFlow</h1>
              </div>
            </div>
            <div className="flex items-center">
              <motion.button
                onClick={handleLogout}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="ml-4 inline-flex items-center px-4 py-2 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar for desktop */}
        <div className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:pt-16 lg:pb-4 lg:bg-gray-800">
          <div className="flex flex-col flex-1 min-h-0 overflow-y-auto">
            <nav className="px-2 space-y-1">
              {tabs.map((tab) => (
                <SidebarItem
                  key={tab.id}
                  icon={<tab.icon className="h-6 w-6" />}
                  text={tab.text}
                  active={activeTab === tab.id}
                  onClick={() => setActiveTab(tab.id)}
                />
              ))}
            </nav>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              className="fixed inset-0 flex z-40 lg:hidden"
            >
              <motion.div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={toggleMobileMenu}>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.div>

              <motion.div className="relative flex-1 flex flex-col max-w-xs w-full bg-gray-800">
                <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
                  <nav className="mt-5 px-2 space-y-1">
                    {tabs.map((tab) => (
                      <SidebarItem
                        key={tab.id}
                        icon={<tab.icon className="h-6 w-6" />}
                        text={tab.text}
                        active={activeTab === tab.id}
                        onClick={() => {
                          setActiveTab(tab.id);
                          setIsMobileMenuOpen(false);
                        }}
                      />
                    ))}
                  </nav>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main content */}
        <div className="lg:pl-64 flex-1">
          <main className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {renderContent()}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

const SidebarItem = ({ icon, text, active, onClick }: { icon: React.ReactNode; text: string; active: boolean; onClick: () => void }) => (
  <button
    onClick={onClick}
    className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md w-full ${
      active ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
    }`}
  >
    {icon}
    <span className="ml-3">{text}</span>
  </button>
);

const StatCard = ({ title, value, change, icon }: { title: string; value: string; change: string; icon: React.ReactNode }) => (
  <div className="bg-white overflow-hidden shadow rounded-lg">
    <div className="p-5">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
            {icon}
          </div>
        </div>
        <div className="ml-5 w-0 flex-1">
          <dl>
            <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
            <dd className="flex items-baseline">
              <div className="text-2xl font-semibold text-gray-900">{value}</div>
              <div className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                {change}
              </div>
            </dd>
          </dl>
        </div>
      </div>
    </div>
  </div>
);