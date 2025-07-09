declare module 'react-simple-south-korea-map-chart' {
  import { FC } from 'react';
  
  interface MapProps {
    onClick?: (regionId: string) => void;
    onMouseEnter?: (regionId: string) => void;
    onMouseLeave?: () => void;
    customStyle?: (regionId: string) => React.CSSProperties;
    darkMode?: boolean;
    data?: any;
    unit?: string;
    setColorByCount?: boolean;
    customTooltip?: any;
  }
  
  const SouthKoreaMapChart: FC<MapProps>;
  export default SouthKoreaMapChart;
}