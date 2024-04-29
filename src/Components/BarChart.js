import React from 'react';
import { Line } from 'react-chartjs-2';

const BarChart = ({ data }) => {
  const isMonthTable = data.length > 0 && data[0].month !== undefined;

  const labels = data.map((entry, index) => (isMonthTable ? entry.month : index + 1));
  const countWordsData = data.map((entry) => entry.count_words);
  const labelColors = data.map((entry) => {
    const label = entry.label;
    return label === 'negative' ? 'red' : label === 'neutral' ? 'orange' : 'green';
  });

  const dataset = {
    labels,
    datasets: [
      {
        label: 'Positive Count Words',
        data: countWordsData.map((count, index) => (labelColors[index] !== 'red' && labelColors[index] !== 'orange' ? count : 0)),
        borderColor: '#557C55',
        borderWidth: 1.5,
        fill: false,
      },
      {
        label: 'Neutral Count Words',
        data: countWordsData.map((count, index) => (labelColors[index] === 'orange' ? count : 0)),
        borderColor: '#A6CF98',
        borderWidth: 1.5,
        fill: false,
      },
      {
        label: 'Negative Count Words',
        data: countWordsData.map((count, index) => (labelColors[index] === 'red' ? count : 0)),
        borderColor: '#FA7070',
        borderWidth: 1.5,
        fill: false,
      },
    ],
  };

  const options = {
    scales: {
      x: {
        title: {
          display: true,
          text: isMonthTable ? 'Month Table' : 'Source Ids',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Count Words',
        },
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: (context) => {
            const dataIndex = context.dataIndex;
            const labelValue = isMonthTable ? data[dataIndex].month : data[dataIndex].source;
            const countnum = data[dataIndex].count_words;

            return `${labelValue} : ${countnum}`;
          },
        },
      },
    },
  };

  return <Line data={dataset} options={options} style={{ width: '800px', height: '500px' }} />;
};

export default BarChart;
