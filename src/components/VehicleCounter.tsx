import { useState, useEffect, useCallback } from 'react';
import { Bike, Car, Truck, Bus } from 'lucide-react';

interface VehicleType {
  id: string;
  name: string;
  nameTh: string;
  key: string;
  icon: React.ReactNode;
  colorClass: string;
  textColorClass: string;
}

const vehicleTypes: VehicleType[] = [
  {
    id: 'motorcycle',
    name: 'Motorcycle',
    nameTh: 'มอเตอร์ไซค์',
    key: 'a',
    icon: <Bike className="w-8 h-8" />,
    colorClass: 'motorcycle',
    textColorClass: 'text-motorcycle',
  },
  {
    id: 'car',
    name: 'Car',
    nameTh: 'รถยนต์',
    key: 's',
    icon: <Car className="w-8 h-8" />,
    colorClass: 'car',
    textColorClass: 'text-car',
  },
  {
    id: 'pickup',
    name: 'Pickup',
    nameTh: 'รถกระบะ',
    key: 'd',
    icon: <Truck className="w-8 h-8" />,
    colorClass: 'pickup',
    textColorClass: 'text-pickup',
  },
  {
    id: 'bus',
    name: 'Bus',
    nameTh: 'รถบัส',
    key: 'f',
    icon: <Bus className="w-8 h-8" />,
    colorClass: 'bus',
    textColorClass: 'text-bus',
  },
  {
    id: 'truck',
    name: 'Truck',
    nameTh: 'รถบรรทุก',
    key: 'g',
    icon: <Truck className="w-8 h-8" />,
    colorClass: 'truck',
    textColorClass: 'text-truck',
  },
];

interface CounterCardProps {
  vehicle: VehicleType;
  count: number;
  onIncrement: () => void;
  isPressed: boolean;
}

const CounterCard = ({ vehicle, count, onIncrement, isPressed }: CounterCardProps) => {
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    if (isPressed) {
      setAnimating(true);
      const timer = setTimeout(() => setAnimating(false), 200);
      return () => clearTimeout(timer);
    }
  }, [isPressed, count]);

  return (
    <button
      onClick={onIncrement}
      className={`counter-card ${vehicle.colorClass} w-full text-left focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background cursor-pointer`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`${vehicle.textColorClass}`}>
          {vehicle.icon}
        </div>
        <div className={`key-hint ${isPressed ? 'pressed' : ''}`}>
          {vehicle.key}
        </div>
      </div>
      
      <div className="space-y-1">
        <h3 className="text-lg font-semibold text-foreground">{vehicle.nameTh}</h3>
        <p className="text-sm text-muted-foreground">{vehicle.name}</p>
      </div>
      
      <div className={`count-number mt-4 ${vehicle.textColorClass} ${animating ? 'pulse-animation' : ''}`}>
        {count.toLocaleString()}
      </div>
    </button>
  );
};

const VehicleCounter = () => {
  const [counts, setCounts] = useState<Record<string, number>>(() => {
    const saved = localStorage.getItem('vehicleCounts');
    if (saved) {
      return JSON.parse(saved);
    }
    return vehicleTypes.reduce((acc, v) => ({ ...acc, [v.id]: 0 }), {});
  });
  
  const [pressedKeys, setPressedKeys] = useState<Record<string, boolean>>({});

  const incrementCount = useCallback((vehicleId: string) => {
    setCounts(prev => {
      const newCounts = { ...prev, [vehicleId]: (prev[vehicleId] || 0) + 1 };
      localStorage.setItem('vehicleCounts', JSON.stringify(newCounts));
      return newCounts;
    });
  }, []);

  const resetCounts = useCallback(() => {
    const zeroCounts = vehicleTypes.reduce((acc, v) => ({ ...acc, [v.id]: 0 }), {});
    setCounts(zeroCounts);
    localStorage.setItem('vehicleCounts', JSON.stringify(zeroCounts));
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      const vehicle = vehicleTypes.find(v => v.key === key);
      
      if (vehicle && !e.repeat) {
        setPressedKeys(prev => ({ ...prev, [key]: true }));
        incrementCount(vehicle.id);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      setPressedKeys(prev => ({ ...prev, [key]: false }));
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [incrementCount]);

  const totalCount = Object.values(counts).reduce((sum, count) => sum + count, 0);

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <header className="text-center mb-8 fade-in">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            ระบบนับรถ
          </h1>
          <p className="text-muted-foreground">
            กดปุ่มบนคีย์บอร์ดหรือคลิกที่การ์ดเพื่อนับ
          </p>
        </header>

        {/* Total Counter */}
        <div className="bg-card border border-border rounded-2xl p-6 mb-8 text-center fade-in" style={{ animationDelay: '0.1s' }}>
          <p className="text-muted-foreground text-sm uppercase tracking-wider mb-2">ยอดรวมทั้งหมด</p>
          <p className="count-number text-primary">{totalCount.toLocaleString()}</p>
        </div>

        {/* Vehicle Counters Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {vehicleTypes.map((vehicle, index) => (
            <div 
              key={vehicle.id} 
              className="fade-in" 
              style={{ animationDelay: `${0.15 + index * 0.05}s` }}
            >
              <CounterCard
                vehicle={vehicle}
                count={counts[vehicle.id] || 0}
                onIncrement={() => incrementCount(vehicle.id)}
                isPressed={pressedKeys[vehicle.key] || false}
              />
            </div>
          ))}
        </div>

        {/* Reset Button */}
        <div className="flex justify-center fade-in" style={{ animationDelay: '0.4s' }}>
          <button
            onClick={resetCounts}
            className="px-6 py-3 bg-secondary hover:bg-secondary/80 text-secondary-foreground rounded-xl font-medium transition-all duration-200 hover:scale-105 active:scale-95"
          >
            รีเซ็ตทั้งหมด
          </button>
        </div>

        {/* Keyboard Hints */}
        <div className="mt-12 text-center fade-in" style={{ animationDelay: '0.45s' }}>
          <p className="text-muted-foreground text-sm mb-4">คีย์ลัด</p>
          <div className="flex flex-wrap justify-center gap-4">
            {vehicleTypes.map(vehicle => (
              <div key={vehicle.id} className="flex items-center gap-2">
                <span className={`key-hint ${vehicle.textColorClass}`}>{vehicle.key}</span>
                <span className="text-sm text-muted-foreground">{vehicle.nameTh}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleCounter;
