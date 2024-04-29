import * as echarts from 'echarts/core';
import { VisualMapComponent, GeoComponent } from 'echarts/components';
import { MapChart } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';
import React, { useEffect, useRef } from 'react';
import { GridComponent } from 'echarts/components';
import { UniversalTransition } from 'echarts/features';
import { BarChart } from 'echarts/charts';

import russianJson from './all_districts.json';
import 'echarts/dist/extension/dataTool';

echarts.use([
  VisualMapComponent,
  GeoComponent,
  MapChart,
  CanvasRenderer,
  GridComponent,
  UniversalTransition,
  BarChart,
]);

const RegionMapChart = ({ data }) => {
  const mapChartRef = useRef(null);
  const barChartRef = useRef(null);

  useEffect(() => {
    const mapChartDom = mapChartRef.current;
    const barChartDom = barChartRef.current;

    if (!mapChartDom || !barChartDom) return;

    const mapChart = echarts.init(mapChartDom);
    const barChart = echarts.init(barChartDom);

    echarts.registerMap('RussianDistricts', russianJson);

    data.sort((a, b) => a.value - b.value);

    const mapOption = {
      visualMap: {
        left: 'right',
        min: Math.min(...data.map(item => item.counts)),
        max: Math.max(...data.map(item => item.counts)),
        inRange: {
          color: ['#313695', '#4575b4', '#74add1', '#abd9e9', '#e0f3f8', '#ffffbf', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026']
        },
        text: ['High', 'Low'],
        calculable: true
      },
      
      series: [
        {
          id: 'RussianDistricts',
          type: 'map',
          roam: true,
          zoom: 2.25,
          map: 'RussianDistricts',
          animationDurationUpdate: 1000,
          universalTransition: true,
          data: data.map(item => ({
            name: item.Place,
            value: item.counts,
          })),
          label: {
            show: true,
            formatter: function (params) {
              const currentData = data.find((item) => item.Place === params.name);
              return currentData ? currentData.counts.toString() : '0';
            },
            emphasis: {
              label: {
                show: false,
              },
            },
            textStyle: {
              color: 'black',
            },
          },
          center:[110,55]
        },
      ]
    };

    const barOption = {
      grid: {
        left: '5%',
        containLabel: true,
      },
      xAxis: {
        type: 'value',
      },
      yAxis: {
        type: 'category',
        axisLabel: {
          rotate: 30,
        },
        data: data.map(item => item.Place),
      },
      animationDurationUpdate: 1000,
      series: [
        {
          type: 'bar',
          data: data.map(item => item.counts),
          itemStyle: {
            color: '#b121c4',
          },
        },
      ],
    };

    mapChart.setOption(mapOption);
    barChart.setOption(barOption);

    return () => {
      mapChart.dispose();
      barChart.dispose();
    };
  }, [data]);

  return (
    <div>
      <div ref={barChartRef} style={{ width: '800px', height: '500px' }} />
      <div ref={mapChartRef} style={{ width: '800px', height: '500px' }} />
    </div>
  );
};

export default RegionMapChart;
