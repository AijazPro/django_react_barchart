import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Label } from 'recharts';
import fetchData from '../../services/api';
import './ChartComponent.css';

// API response
interface ApiResponse {
  cache_source: string;
  cache_expiry: string;
  data: {
    [year: string]: {
      [month: string]: {
        [date: string]: number;
      }[];
    }[];
  }[];
}

// Define the types data structure
interface DataPoint {
  date: string;
  value: number;
}

const ChartComponent: React.FC = () => {
  const [chartData, setChartData] = useState<DataPoint[]>([]);
  const [cacheSource, setCacheSource] = useState<string>('');
  const [cacheExpiry, setCacheExpiry] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData()
      .then(data => {
        setCacheSource(data.cache_source);
        setCacheExpiry(data.cache_expiry);
        setChartData(transformData(data));
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setError('Failed to fetch data. Please try again later.');
        setLoading(false);
      });
  }, []);

  // Function to transform the data to a flat structure
  const transformData = (data: ApiResponse): DataPoint[] => {
    const transformedData: DataPoint[] = [];

    data.data.forEach(yearData => {
      for (const [year, months] of Object.entries(yearData)) {
        months.forEach(monthData => {
          for (const [month, dates] of Object.entries(monthData)) {
            dates.forEach(dateObj => {
              for (const [date, value] of Object.entries(dateObj)) {
                // Convert "2024/01/01 , 00:00:00" to "2024-01-01"
                const formattedDate = date.split(' , ')[0].replace(/\//g, '-');
                transformedData.push({ date: formattedDate, value });
              }
            });
          }
        });
      }
    });

    return transformedData;
  };

  if (loading) {
    return <div className="container text-center mt-4">Loading...</div>;
  }

  if (error) {
    return <div className="container text-center mt-4">{error}</div>;
  }

  return (
    <div className="container mt-4 border rounded p-4 dark-theme">
      <h3 className="mb-4 text-light">Data Source: {cacheSource}</h3>
      <h3 className="mb-4 text-light">Cache Expiry: {cacheExpiry}</h3>
      <div className="row">
        <div className="col">
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis dataKey="date" tick={{ fill: '#ccc' }} stroke="#ccc">
                <Label value="Date" position="insideBottom" offset={0} style={{ fill: '#ccc' }} />
              </XAxis>
              <YAxis tick={{ fill: '#ccc' }} stroke="#ccc">
                <Label angle={-90} value="Value" position="insideLeft" style={{ fill: '#ccc' }} />
              </YAxis>
              <Tooltip contentStyle={{ backgroundColor: '#222', color: '#ccc' }} />
              <Legend wrapperStyle={{ color: '#ccc' }} />
              <Bar dataKey="value" fill="#03befc" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default ChartComponent;
