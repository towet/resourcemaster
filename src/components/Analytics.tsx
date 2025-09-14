import React from 'react';
import { useResources } from '../hooks/useResources';
import { useAllocationRequests } from '../hooks/useAllocationRequests';
import { useTransfers } from '../hooks/useTransfers';
import { useDepartments } from '../hooks/useDepartments';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';

export const Analytics = () => {
  const { data: resources } = useResources();
  const { data: requests } = useAllocationRequests();
  const { data: transfers } = useTransfers();
  const { data: departments } = useDepartments();

  // Calculate resource status distribution
  const resourceStatusData = resources?.reduce((acc, resource) => {
    acc[resource.status] = (acc[resource.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const statusColors = {
    available: '#10B981',
    in_use: '#3B82F6',
    maintenance: '#F59E0B'
  };

  const pieData = resourceStatusData ? Object.entries(resourceStatusData).map(([name, value]) => ({
    name,
    value
  })) : [];

  // Calculate department resource distribution
  const departmentResourceData = departments?.map(dept => {
    const deptResources = resources?.filter(r => r.department_id === dept.id) || [];
    return {
      name: dept.name,
      resources: deptResources.length,
      inUse: deptResources.filter(r => r.status === 'in_use').length
    };
  });

  // Calculate request trends
  const requestTrends = requests?.reduce((acc, request) => {
    const month = new Date(request.request_date).toLocaleString('default', { month: 'short' });
    acc[month] = (acc[month] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const requestTrendData = requestTrends ? Object.entries(requestTrends).map(([month, count]) => ({
    month,
    requests: count
  })) : [];

  return (
    <div className="space-y-8">
      {/* Resource Status Distribution */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Resource Status Distribution</h3>
        <div className="h-64">
          <PieChart width={400} height={250}>
            <Pie
              data={pieData}
              cx={200}
              cy={125}
              innerRadius={60}
              outerRadius={100}
              fill="#8884d8"
              paddingAngle={5}
              dataKey="value"
              label
            >
              {pieData.map((entry, index) => (
                <Cell key={entry.name} fill={statusColors[entry.name as keyof typeof statusColors]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </div>
      </div>

      {/* Department Resource Distribution */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Department Resource Distribution</h3>
        <div className="h-64">
          <BarChart
            width={800}
            height={250}
            data={departmentResourceData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="resources" fill="#3B82F6" name="Total Resources" />
            <Bar dataKey="inUse" fill="#10B981" name="In Use" />
          </BarChart>
        </div>
      </div>

      {/* Request Trends */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Monthly Request Trends</h3>
        <div className="h-64">
          <BarChart
            width={800}
            height={250}
            data={requestTrendData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="requests" fill="#6366F1" name="Requests" />
          </BarChart>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h4 className="text-sm font-medium text-gray-500">Total Resources</h4>
          <p className="mt-2 text-3xl font-semibold text-gray-900">{resources?.length || 0}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h4 className="text-sm font-medium text-gray-500">Pending Requests</h4>
          <p className="mt-2 text-3xl font-semibold text-gray-900">
            {requests?.filter(r => r.status === 'pending').length || 0}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h4 className="text-sm font-medium text-gray-500">Active Transfers</h4>
          <p className="mt-2 text-3xl font-semibold text-gray-900">
            {transfers?.filter(t => t.status === 'pending').length || 0}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h4 className="text-sm font-medium text-gray-500">Resource Utilization</h4>
          <p className="mt-2 text-3xl font-semibold text-gray-900">
            {Math.round((resources?.filter(r => r.status === 'in_use').length || 0) / (resources?.length || 1) * 100)}%
          </p>
        </div>
      </div>
    </div>
  );
};
