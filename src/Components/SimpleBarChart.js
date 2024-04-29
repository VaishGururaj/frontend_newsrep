import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart} from "chart.js/auto";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import zoomPlugin from 'chartjs-plugin-zoom';
import 'hammerjs';

Chart.register(zoomPlugin);

const SimpleBarChart = ({ data }) => {
  const labels = data.map((item) => item.Place);
  const counts = data.map((item) => item.counts);

  const chartRef = React.useRef(null);
  const chartData = {
    labels: labels,
    datasets: [
      {
        label: 'Counts',
        backgroundColor: 'rgba(75, 192, 192,0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
        hoverBackgroundColor: 'rgba(75, 192, 192, 1)',
        hoverBorderColor: 'rgba(75, 192, 192, 1)',
        data: counts,
      },
    ],
  };

  const resetZoom = () => {
    if (chartRef && chartRef.current) {
      chartRef.current.resetZoom();
    }
  };

  const chartOptions = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
    plugins: {
      zoom: {
        pan: {
          enabled: true,
          mode: 'xy',
          speed: 100,
          threshold: 100,
          step:1
        },
        limits: {
          x: { min: 0, max: labels.length },
          y: { min: 0, max: Math.max(...counts) + 30 },
        },
        zoom: {
          wheel: {
            enabled: true,
          },
          pinch: {
            enabled: true,
          },
          mode: 'xy',
        },
      },
    },
  };

  return (
    <div>
      <Box>
        <Grid container direction="column" rowSpacing={3}>
          <Grid item xs="auto">
            <Bar ref={chartRef} data={chartData} options={chartOptions} />
          </Grid>
          <Grid item>
            <Button variant="contained" onClick={resetZoom}>
              Reset Zoom!
            </Button>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
};

export default SimpleBarChart;
