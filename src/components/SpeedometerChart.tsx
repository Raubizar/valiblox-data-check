import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface SpeedometerChartProps {
  percentage: number;
  label: string;
  size?: number;
}

export const SpeedometerChart: React.FC<SpeedometerChartProps> = ({ 
  percentage, 
  label, 
  size = 120 
}) => {
  // Ensure percentage is between 0 and 100
  const clampedPercentage = Math.max(0, Math.min(100, percentage));
  
  // Define color ranges
  const getColor = (value: number) => {
    if (value >= 0 && value < 40) return '#dc3545'; // Red
    if (value >= 40 && value < 80) return '#ffc107'; // Yellow
    return '#28a745'; // Green
  };

  // Create data for the gauge
  const gaugeData = [
    {
      name: 'value',
      value: clampedPercentage,
      color: getColor(clampedPercentage)
    },
    {
      name: 'remaining',
      value: 100 - clampedPercentage,
      color: '#e9ecef' // Light gray for remaining
    }
  ];

  // Create background segments for color coding
  const backgroundSegments = [
    { value: 40, color: '#dc3545' }, // Red: 0-40%
    { value: 40, color: '#ffc107' }, // Yellow: 40-80%
    { value: 20, color: '#28a745' }  // Green: 80-100%
  ];

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size / 2 + 20 }}>
        {/* Background gauge with color segments */}
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={backgroundSegments}
              cx="50%"
              cy="90%"
              startAngle={180}
              endAngle={0}
              innerRadius={size * 0.25}
              outerRadius={size * 0.35}
              dataKey="value"
              stroke="none"
            >
              {backgroundSegments.map((entry, index) => (
                <Cell key={`bg-cell-${index}`} fill={entry.color} opacity={0.3} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* Main gauge */}
        <div className="absolute inset-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={gaugeData}
                cx="50%"
                cy="90%"
                startAngle={180}
                endAngle={0}
                innerRadius={size * 0.25}
                outerRadius={size * 0.35}
                dataKey="value"
                stroke="none"
              >
                {gaugeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Needle */}
        <div 
          className="absolute bottom-0 left-1/2 origin-bottom bg-gray-700"
          style={{
            width: '2px',
            height: size * 0.25,
            transform: `translateX(-50%) rotate(${-90 + (clampedPercentage * 180) / 100}deg)`,
            transformOrigin: 'bottom center'
          }}
        />

        {/* Center circle */}
        <div 
          className="absolute bottom-0 left-1/2 transform -translate-x-1/2 bg-gray-700 rounded-full"
          style={{
            width: '8px',
            height: '8px',
            bottom: '-4px'
          }}
        />

        {/* Percentage text */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 text-center">
          <div className="text-lg font-bold text-gray-900 mb-1">
            {Math.round(clampedPercentage)}%
          </div>
          <div className="text-xs text-gray-600 whitespace-nowrap">
            {label}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpeedometerChart;
