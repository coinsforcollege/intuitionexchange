'use client';

import React, { useEffect, useRef, useState } from 'react';
import { createChart, IChartApi, ColorType, AreaSeries } from 'lightweight-charts';
import { theme, Spin } from 'antd';
import { useThemeMode } from '@/context/ThemeContext';

const { useToken } = theme;

interface MiniPriceChartProps {
  /** Array of price points (7-day sparkline data) */
  prices: number[];
  /** Whether data is loading */
  isLoading?: boolean;
  /** Whether the price change is positive */
  isPositive?: boolean;
}

/**
 * A minimal, clean price chart for token detail pages.
 * Uses lightweight-charts for smooth rendering.
 * Automatically fills its container's dimensions.
 */
const MiniPriceChart: React.FC<MiniPriceChartProps> = ({
  prices,
  isLoading = false,
  isPositive = true,
}) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const { token } = useToken();
  const { mode } = useThemeMode();
  const isDark = mode === 'dark';
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Color based on positive/negative trend
  const lineColor = isPositive ? '#16C47F' : '#fc6f03';
  const topColor = isPositive ? 'rgba(22, 196, 127, 0.3)' : 'rgba(252, 111, 3, 0.3)';
  const bottomColor = isPositive ? 'rgba(22, 196, 127, 0.02)' : 'rgba(252, 111, 3, 0.02)';

  // Handle resize and track container dimensions
  useEffect(() => {
    if (!chartContainerRef.current) return;

    const updateDimensions = () => {
      if (chartContainerRef.current) {
        const { width, height } = chartContainerRef.current.getBoundingClientRect();
        setDimensions({ width, height });
      }
    };

    // Initial dimensions
    updateDimensions();

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        if (width > 0 && height > 0) {
          setDimensions({ width, height });
          // Update chart if it exists
          if (chartRef.current) {
            chartRef.current.applyOptions({ width, height });
            chartRef.current.timeScale().fitContent();
          }
        }
      }
    });

    resizeObserver.observe(chartContainerRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  // Create/update chart when dimensions or data change
  useEffect(() => {
    if (!chartContainerRef.current || !prices || prices.length === 0) return;
    if (dimensions.width === 0 || dimensions.height === 0) return;

    // Remove existing chart
    if (chartRef.current) {
      chartRef.current.remove();
      chartRef.current = null;
    }

    // Create chart with explicit dimensions
    const chart = createChart(chartContainerRef.current, {
      width: dimensions.width,
      height: dimensions.height,
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor: 'transparent',
        attributionLogo: false,
      },
      grid: {
        vertLines: { visible: false },
        horzLines: { visible: false },
      },
      crosshair: {
        mode: 0,
      },
      rightPriceScale: { 
        visible: false,
      },
      leftPriceScale: {
        visible: false,
      },
      timeScale: {
        visible: false,
        borderVisible: false,
      },
      handleScroll: false,
      handleScale: false,
    });

    chartRef.current = chart;

    // Add area series
    const areaSeries = chart.addSeries(AreaSeries, {
      lineColor: lineColor,
      topColor: topColor,
      bottomColor: bottomColor,
      lineWidth: 2,
      crosshairMarkerVisible: false,
      priceLineVisible: false,
      lastValueVisible: false,
    });

    // Transform sparkline data to chart format
    const now = Date.now();
    const interval = (7 * 24 * 60 * 60 * 1000) / prices.length;
    
    const chartData = prices.map((price, index) => ({
      time: Math.floor((now - (prices.length - 1 - index) * interval) / 1000) as any,
      value: price,
    }));

    areaSeries.setData(chartData);
    chart.timeScale().fitContent();

    return () => {
      if (chartRef.current) {
        chartRef.current.remove();
        chartRef.current = null;
      }
    };
  }, [prices, lineColor, topColor, bottomColor, dimensions.width, dimensions.height]);

  if (isLoading) {
    return (
      <div
        style={{
          width: '100%',
          height: '100%',
          minHeight: 100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Spin size="small" />
      </div>
    );
  }

  if (!prices || prices.length === 0) {
    return (
      <div
        style={{
          width: '100%',
          height: '100%',
          minHeight: 100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: token.colorTextTertiary,
          fontSize: token.fontSizeSM,
        }}
      >
        No chart data
      </div>
    );
  }

  return (
    <div
      ref={chartContainerRef}
      style={{
        width: '100%',
        height: '100%',
        minHeight: 100,
      }}
    />
  );
};

export default MiniPriceChart;

