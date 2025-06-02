import React, { useState, useEffect } from 'react';
import { 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip, 
  Legend,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid
} from 'recharts';
import { 
  Users, 
  UserCheck, 
  FileText, 
  Filter, 
  Search, 
  Download,
  RefreshCw,
  TrendingUp,
  Calendar,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { motion } from 'framer-motion';

const AdminStatistics = () => {
  // State management
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalProblems: 0,
    difficultyData: [],
    topicData: [],
    problems: []
  });

  const [filters, setFilters] = useState({
    difficulty: [],
    topics: [],
    searchTerm: ''
  });

  const [filteredProblems, setFilteredProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(true);

  // Sample data - replace with actual API calls
  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    setLoading(true);
    try {
      // Replace with actual API calls
      const mockData = {
        totalUsers: 1250,
        activeUsers: 890,
        totalProblems: 456,
        difficultyData: [
          { name: 'Easy', value: 180, percentage: 39.5, color: '#10B981' },
          { name: 'Medium', value: 200, percentage: 43.9, color: '#F59E0B' },
          { name: 'Hard', value: 76, percentage: 16.7, color: '#EF4444' }
        ],
        topicData: [
          { name: 'Arrays', value: 85, color: '#3B82F6' },
          { name: 'Strings', value: 72, color: '#8B5CF6' },
          { name: 'Trees', value: 64, color: '#06B6D4' },
          { name: 'Graphs', value: 58, color: '#84CC16' },
          { name: 'Dynamic Programming', value: 45, color: '#F97316' },
          { name: 'Others', value: 132, color: '#6B7280' }
        ],
        problems: [
          { id: 1, title: 'Two Sum', difficulty: 'Easy', topic: 'Arrays', createdAt: '2024-01-15' },
          { id: 2, title: 'Binary Tree Traversal', difficulty: 'Medium', topic: 'Trees', createdAt: '2024-01-20' },
          { id: 3, title: 'Longest Substring', difficulty: 'Medium', topic: 'Strings', createdAt: '2024-01-25' },
          { id: 4, title: 'Graph Coloring', difficulty: 'Hard', topic: 'Graphs', createdAt: '2024-02-01' },
          { id: 5, title: 'Merge Sort', difficulty: 'Medium', topic: 'Arrays', createdAt: '2024-02-05' },
          { id: 6, title: 'Knapsack Problem', difficulty: 'Hard', topic: 'Dynamic Programming', createdAt: '2024-02-10' },
          { id: 7, title: 'Linked List Cycle', difficulty: 'Easy', topic: 'Linked Lists', createdAt: '2024-02-15' },
          { id: 8, title: 'Valid Parentheses', difficulty: 'Easy', topic: 'Strings', createdAt: '2024-02-20' },
        ]
      };
      
      setStats(mockData);
      setFilteredProblems(mockData.problems);
    } catch (error) {
      console.error('Error fetching statistics:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter problems based on selected filters
  useEffect(() => {
    let filtered = stats.problems;

    if (filters.difficulty.length > 0) {
      filtered = filtered.filter(problem => 
        filters.difficulty.includes(problem.difficulty)
      );
    }

    if (filters.topics.length > 0) {
      filtered = filtered.filter(problem => 
        filters.topics.includes(problem.topic)
      );
    }

    if (filters.searchTerm) {
      filtered = filtered.filter(problem =>
        problem.title.toLowerCase().includes(filters.searchTerm.toLowerCase())
      );
    }

    setFilteredProblems(filtered);
  }, [filters, stats.problems]);

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: prev[filterType].includes(value)
        ? prev[filterType].filter(item => item !== value)
        : [...prev[filterType], value]
    }));
  };

  const clearFilters = () => {
    setFilters({
      difficulty: [],
      topics: [],
      searchTerm: ''
    });
  };

  const exportData = () => {
    // Implement export functionality
    console.log('Exporting data...');
  };

  // Custom tooltip for pie charts
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg"
        >
          <p className="font-semibold">{`${payload[0].name}: ${payload[0].value}`}</p>
          <p className="text-sm text-gray-600">{`${payload[0].payload.percentage || ((payload[0].value / stats.totalProblems) * 100).toFixed(1)}%`}</p>
        </motion.div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"
        ></motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#07034d] py-25 px-4 sm:py-25 sm:px-6 lg:py-25 lg:px-20">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 sm:mb-8"
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div className="mb-4 lg:mb-0">
            <h1 className="text-2xl sm:text-3xl font-bold text-amber-400 mb-2">Admin Statistics Dashboard</h1>
            <p className="text-white text-sm sm:text-base">Comprehensive analytics and problem management</p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={fetchStatistics}
              className="flex items-center justify-center px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg shadow-md hover:shadow-lg transition-all text-sm sm:text-base"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh Data
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={exportData}
              className="flex items-center justify-center px-4 py-2 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-lg shadow-md hover:shadow-lg transition-all text-sm sm:text-base"
            >
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
        {[
          {
            title: "Total Users",
            value: stats.totalUsers,
            icon: Users,
            color: "blue",
            trend: "+12.5% from last month"
          },
          {
            title: "Active Users",
            value: stats.activeUsers,
            icon: UserCheck,
            color: "green",
            trend: "+8.2% from last month"
          },
          {
            title: "Total Problems",
            value: stats.totalProblems,
            icon: FileText,
            color: "purple",
            trend: "+15 new this week"
          },
          {
            title: "Filtered Results",
            value: filteredProblems.length,
            icon: Filter,
            color: "orange",
            trend: `${((filteredProblems.length / stats.totalProblems) * 100).toFixed(1)}% of total`
          }
        ].map((card, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-100 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">{card.title}</p>
                <p className="text-xl sm:text-3xl font-bold text-gray-900 mt-1">{card.value.toLocaleString()}</p>
                <p className={`text-xs sm:text-sm ${index === 3 ? 'text-gray-500' : 'text-green-600'} flex items-center mt-2`}>
                  {index !== 3 && <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 mr-1 flex-shrink-0" />}
                  <span className="truncate">{card.trend}</span>
                </p>
              </div>
              <div className={`p-2 sm:p-3 bg-${card.color}-100 rounded-full flex-shrink-0 ml-2`}>
                <card.icon className={`w-4 h-4 sm:w-6 sm:h-6 text-${card.color}-600`} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 sm:gap-8 mb-6 sm:mb-8">
        {/* Difficulty Distribution Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-100 hover:shadow-md transition-shadow"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-0">Problems by Difficulty</h3>
            <div className="flex items-center text-xs sm:text-sm text-gray-500">
              <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
              Last updated: Today
            </div>
          </div>
          <div className="h-64 sm:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.difficultyData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={window.innerWidth < 640 ? 80 : 120}
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, percent }) => window.innerWidth >= 640 ? `${name}: ${(percent * 100).toFixed(0)}%` : `${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {stats.difficultyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  layout="horizontal" 
                  verticalAlign="bottom" 
                  align="center"
                  formatter={(value) => <span className="text-xs sm:text-sm text-gray-600">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Topic Distribution Chart */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-100 hover:shadow-md transition-shadow"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-0">Problems by Topic</h3>
            <div className="flex items-center text-xs sm:text-sm text-gray-500">
              <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
              Last updated: Today
            </div>
          </div>
          <div className="h-64 sm:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.topicData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={window.innerWidth < 640 ? 80 : 120}
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, percent }) => window.innerWidth >= 640 ? `${(percent * 100).toFixed(0)}%` : `${(percent * 100).toFixed(0)}%`}
                >
                  {stats.topicData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  layout="horizontal" 
                  verticalAlign="bottom" 
                  align="center"
                  formatter={(value) => <span className="text-xs sm:text-sm text-gray-600">{window.innerWidth >= 640 ? value : value.length > 8 ? value.substring(0, 8) + '...' : value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Filters and Problem List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
      >
        <div 
          className="p-4 sm:p-6 border-b border-gray-200 cursor-pointer flex justify-between items-center"
          onClick={() => setShowFilters(!showFilters)}
        >
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Problem Management</h3>
          <button className="text-gray-500 hover:text-gray-700">
            {showFilters ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
        </div>
        
        {/* Filter Controls - Animated */}
        <motion.div
          initial={false}
          animate={{ 
            height: showFilters ? 'auto' : 0,
            opacity: showFilters ? 1 : 0,
            padding: showFilters ? '1rem' : '0 1rem'
          }}
          className="overflow-hidden sm:p-6"
        >
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
              <input
                type="text"
                placeholder="Search problems by title..."
                value={filters.searchTerm}
                onChange={(e) => setFilters(prev => ({ ...prev, searchTerm: e.target.value }))}
                className="w-full pl-8 sm:pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm sm:text-base"
              />
            </div>

            {/* Filter Buttons */}
            <div className="flex flex-col gap-4">
              {/* Difficulty Filters */}
              <div>
                <span className="text-xs sm:text-sm font-medium text-gray-700 mb-2 block">Filter by Difficulty:</span>
                <div className="flex flex-wrap gap-2">
                  {['Easy', 'Medium', 'Hard'].map(difficulty => (
                    <motion.button
                      key={difficulty}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => handleFilterChange('difficulty', difficulty)}
                      className={`px-3 sm:px-4 py-1 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all flex items-center ${
                        filters.difficulty.includes(difficulty)
                          ? difficulty === 'Easy' ? 'bg-green-100 text-green-800 border border-green-300 shadow-inner'
                            : difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800 border border-yellow-300 shadow-inner'
                            : 'bg-red-100 text-red-800 border border-red-300 shadow-inner'
                          : 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      {difficulty}
                      {filters.difficulty.includes(difficulty) && (
                        <span className="ml-1 text-xs">✓</span>
                      )}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Topic Filters */}
              <div>
                <span className="text-xs sm:text-sm font-medium text-gray-700 mb-2 block">Filter by Topic:</span>
                <div className="flex flex-wrap gap-2">
                  {['Arrays', 'Strings', 'Trees', 'Graphs', 'Dynamic Programming'].map(topic => (
                    <motion.button
                      key={topic}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => handleFilterChange('topics', topic)}
                      className={`px-3 sm:px-4 py-1 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all flex items-center ${
                        filters.topics.includes(topic)
                          ? 'bg-blue-100 text-blue-800 border border-blue-300 shadow-inner'
                          : 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      <span className="truncate max-w-24 sm:max-w-none">{topic}</span>
                      {filters.topics.includes(topic) && (
                        <span className="ml-1 text-xs flex-shrink-0">✓</span>
                      )}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Clear Filters */}
              {(filters.difficulty.length > 0 || filters.topics.length > 0 || filters.searchTerm) && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={clearFilters}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-xs sm:text-sm font-medium hover:bg-gray-200 transition-all flex items-center justify-center mt-2"
                >
                  Clear All Filters
                </motion.button>
              )}
            </div>
          </div>
        </motion.div>

        {/* Problem List */}
        <div className="p-4 sm:p-6">
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="w-full divide-y divide-gray-200 min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Problem Title</th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Difficulty</th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Topic</th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Created Date</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProblems.length > 0 ? (
                  filteredProblems.map((problem, index) => (
                    <motion.tr 
                      key={problem.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                        <div className="text-xs sm:text-sm font-medium text-gray-900 hover:text-blue-600 cursor-pointer transition-colors truncate max-w-32 sm:max-w-none">
                          {problem.title}
                        </div>
                        <div className="sm:hidden text-xs text-gray-500 mt-1">{problem.topic}</div>
                      </td>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 sm:px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          problem.difficulty === 'Easy' ? 'bg-green-100 text-green-800'
                          : problem.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                        }`}>
                          {problem.difficulty}
                        </span>
                      </td>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500 hidden sm:table-cell">
                        {problem.topic}
                      </td>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500 hidden md:table-cell">
                        {problem.createdAt}
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-3 sm:px-6 py-4 text-center text-xs sm:text-sm text-gray-500">
                      No problems found matching the current filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminStatistics;
