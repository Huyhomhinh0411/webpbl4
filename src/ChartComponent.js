// ChartComponent.js
import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import axios from 'axios';

const ChartComponent = () => {
  const [sensorData, setSensorData] = useState([]);

  // Sử dụng useEffect để lấy dữ liệu từ API khi component được mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/sensor-data'); // Lấy dữ liệu từ API
        setSensorData(response.data);
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu từ API:', error);
      }
    };

    fetchData();
  }, []);

  // Chuẩn bị dữ liệu cho biểu đồ từ sensorData
  const data = {
    labels: sensorData.map((data) => new Date(data.timestamp).toLocaleTimeString()), // Dùng thời gian làm nhãn
    datasets: [
      {
        label: 'Nhiệt độ (°C)',
        data: sensorData.map((data) => data.temperature), // Dữ liệu nhiệt độ
        borderColor: 'red',
        fill: false,
        tension: 0.1,
      },
      {
        label: 'Độ ẩm (%)',
        data: sensorData.map((data) => data.humidity), // Dữ liệu độ ẩm
        borderColor: 'blue',
        fill: false,
        tension: 0.1,
      },
      {
        label: 'Nồng độ (ppm)',
        data: sensorData.map((data) => data.concentration), // Dữ liệu nồng độ
        borderColor: 'green',
        fill: false,
        tension: 0.1,
      },
    ],
  };

  // Cấu hình cho biểu đồ
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Thời gian',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Giá trị cảm biến',
        },
      },
    },
  };

  return (
    <div>
      <h2>Biểu đồ Thông số Cảm biến</h2>
      <Line data={data} options={options} />
    </div>
  );
};

export default ChartComponent;
