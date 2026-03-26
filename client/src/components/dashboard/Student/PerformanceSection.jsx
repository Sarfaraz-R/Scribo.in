import PerformanceGraph from './PerformanceGraph';
import WeakAreas from './WeakAreas';

const PerformanceSection = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <PerformanceGraph />
      <WeakAreas />
    </div>
  );
};

export default PerformanceSection;