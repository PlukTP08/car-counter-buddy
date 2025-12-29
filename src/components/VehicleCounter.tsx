import { useState, useEffect, useCallback } from 'react';
import { Bike, Car, Truck, Bus, Plus, X, Clock, ChevronDown, ChevronUp, Pencil } from 'lucide-react';
import { format } from 'date-fns';
import { th } from 'date-fns/locale';

interface VehicleType {
  id: string;
  name: string;
  nameTh: string;
  key: string;
  colorClass: string;
  textColorClass: string;
  isCustom?: boolean;
}

interface CountLog {
  vehicleId: string;
  timestamp: Date;
  direction: 'in' | 'out';
}

interface DirectionCounts {
  in: number;
  out: number;
}

const defaultVehicleTypes: VehicleType[] = [
  {
    id: 'motorcycle',
    name: 'Motorcycle',
    nameTh: 'มอเตอร์ไซค์',
    key: 'a',
    colorClass: 'motorcycle',
    textColorClass: 'text-motorcycle',
  },
  {
    id: 'car',
    name: 'Car',
    nameTh: 'รถยนต์',
    key: 's',
    colorClass: 'car',
    textColorClass: 'text-car',
  },
  {
    id: 'pickup',
    name: 'Pickup',
    nameTh: 'รถกระบะ',
    key: 'd',
    colorClass: 'pickup',
    textColorClass: 'text-pickup',
  },
  {
    id: 'bus',
    name: 'Bus',
    nameTh: 'รถบัส',
    key: 'f',
    colorClass: 'bus',
    textColorClass: 'text-bus',
  },
  {
    id: 'truck',
    name: 'Truck',
    nameTh: 'รถบรรทุก',
    key: 'g',
    colorClass: 'truck',
    textColorClass: 'text-truck',
  },
];

const customColors = [
  { colorClass: 'custom1', textColorClass: 'text-custom1' },
  { colorClass: 'custom2', textColorClass: 'text-custom2' },
  { colorClass: 'custom3', textColorClass: 'text-custom3' },
  { colorClass: 'custom4', textColorClass: 'text-custom4' },
  { colorClass: 'custom5', textColorClass: 'text-custom5' },
];

const getVehicleIcon = (id: string) => {
  switch (id) {
    case 'motorcycle':
      return <Bike className="w-8 h-8" />;
    case 'car':
      return <Car className="w-8 h-8" />;
    case 'pickup':
    case 'truck':
      return <Truck className="w-8 h-8" />;
    case 'bus':
      return <Bus className="w-8 h-8" />;
    default:
      return <Car className="w-8 h-8" />;
  }
};

interface CounterCardProps {
  vehicle: VehicleType;
  countIn: number;
  countOut: number;
  onIncrement: (direction: 'in' | 'out') => void;
  onEdit: () => void;
  onDelete?: () => void;
  isPressed: 'in' | 'out' | null;
}

const CounterCard = ({ vehicle, countIn, countOut, onIncrement, onEdit, onDelete, isPressed }: CounterCardProps) => {
  const [animatingIn, setAnimatingIn] = useState(false);
  const [animatingOut, setAnimatingOut] = useState(false);

  useEffect(() => {
    if (isPressed === 'in') {
      setAnimatingIn(true);
      const timer = setTimeout(() => setAnimatingIn(false), 200);
      return () => clearTimeout(timer);
    } else if (isPressed === 'out') {
      setAnimatingOut(true);
      const timer = setTimeout(() => setAnimatingOut(false), 200);
      return () => clearTimeout(timer);
    }
  }, [isPressed, countIn, countOut]);

  return (
    <div className={`counter-card ${vehicle.colorClass} relative`}>
      <div className="absolute top-2 right-2 flex gap-1 z-10">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
          className="p-1.5 rounded-full bg-secondary hover:bg-primary hover:text-primary-foreground transition-colors"
          title="แก้ไข"
        >
          <Pencil className="w-3.5 h-3.5" />
        </button>
        {vehicle.isCustom && onDelete && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="p-1.5 rounded-full bg-secondary hover:bg-destructive transition-colors"
            title="ลบ"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
      
      <div className="flex items-start justify-between mb-3">
        <div className={`${vehicle.textColorClass}`}>
          {getVehicleIcon(vehicle.id)}
        </div>
        <div className="flex gap-1">
          <div className={`key-hint ${isPressed === 'in' ? 'pressed' : ''}`} title="นับเข้า">
            {vehicle.key}
          </div>
          <div className={`key-hint ${isPressed === 'out' ? 'pressed' : ''}`} title="นับออก (Shift)">
            ⇧{vehicle.key}
          </div>
        </div>
      </div>
      
      <div className="space-y-1 mb-3">
        <h3 className="text-lg font-semibold text-foreground">{vehicle.nameTh}</h3>
        <p className="text-sm text-muted-foreground">{vehicle.name}</p>
      </div>
      
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => onIncrement('in')}
          className={`p-3 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 transition-all ${animatingIn ? 'pulse-animation' : ''}`}
        >
          <p className="text-xs text-emerald-400 font-medium mb-1">เข้า ↓</p>
          <p className={`text-2xl font-bold text-emerald-400`}>
            {countIn.toLocaleString()}
          </p>
        </button>
        <button
          onClick={() => onIncrement('out')}
          className={`p-3 rounded-xl bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500/30 transition-all ${animatingOut ? 'pulse-animation' : ''}`}
        >
          <p className="text-xs text-orange-400 font-medium mb-1">ออก ↑</p>
          <p className={`text-2xl font-bold text-orange-400`}>
            {countOut.toLocaleString()}
          </p>
        </button>
      </div>
      
      <div className="mt-3 pt-3 border-t border-border/50 text-center">
        <p className="text-xs text-muted-foreground">รวม</p>
        <p className={`text-xl font-bold ${vehicle.textColorClass}`}>
          {(countIn + countOut).toLocaleString()}
        </p>
      </div>
    </div>
  );
};

interface VehicleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (vehicle: Omit<VehicleType, 'id'> & { id?: string }) => void;
  usedKeys: string[];
  colorIndex: number;
  editingVehicle?: VehicleType | null;
}

const VehicleModal = ({ isOpen, onClose, onSave, usedKeys, colorIndex, editingVehicle }: VehicleModalProps) => {
  const [nameTh, setNameTh] = useState('');
  const [name, setName] = useState('');
  const [key, setKey] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (editingVehicle) {
      setNameTh(editingVehicle.nameTh);
      setName(editingVehicle.name);
      setKey(editingVehicle.key);
    } else {
      setNameTh('');
      setName('');
      setKey('');
    }
    setError('');
  }, [editingVehicle, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!nameTh.trim() || !name.trim() || !key.trim()) {
      setError('กรุณากรอกข้อมูลให้ครบ');
      return;
    }

    if (key.length !== 1 || !/[a-z]/i.test(key)) {
      setError('คีย์ลัดต้องเป็นตัวอักษร A-Z เท่านั้น');
      return;
    }

    const otherUsedKeys = editingVehicle 
      ? usedKeys.filter(k => k !== editingVehicle.key)
      : usedKeys;

    if (otherUsedKeys.includes(key.toLowerCase())) {
      setError('คีย์นี้ถูกใช้แล้ว กรุณาเลือกคีย์อื่น');
      return;
    }

    if (editingVehicle) {
      onSave({
        id: editingVehicle.id,
        nameTh: nameTh.trim(),
        name: name.trim(),
        key: key.toLowerCase(),
        colorClass: editingVehicle.colorClass,
        textColorClass: editingVehicle.textColorClass,
        isCustom: editingVehicle.isCustom,
      });
    } else {
      const color = customColors[colorIndex % customColors.length];
      onSave({
        nameTh: nameTh.trim(),
        name: name.trim(),
        key: key.toLowerCase(),
        ...color,
        isCustom: true,
      });
    }

    setNameTh('');
    setName('');
    setKey('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-2xl p-6 w-full max-w-md fade-in">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-foreground">
            {editingVehicle ? 'แก้ไขประเภทรถ' : 'เพิ่มประเภทรถใหม่'}
          </h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-secondary transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              ชื่อภาษาไทย
            </label>
            <input
              type="text"
              value={nameTh}
              onChange={(e) => setNameTh(e.target.value)}
              placeholder="เช่น รถจักรยาน"
              className="w-full px-4 py-3 bg-secondary border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              ชื่อภาษาอังกฤษ
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="เช่น Bicycle"
              className="w-full px-4 py-3 bg-secondary border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              คีย์ลัด (A-Z)
            </label>
            <input
              type="text"
              value={key}
              onChange={(e) => setKey(e.target.value.slice(0, 1))}
              placeholder="เช่น H"
              maxLength={1}
              className="w-full px-4 py-3 bg-secondary border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary font-mono uppercase"
            />
          </div>

          {error && (
            <p className="text-destructive text-sm">{error}</p>
          )}

          <button
            type="submit"
            className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:opacity-90 transition-opacity"
          >
            {editingVehicle ? 'บันทึกการแก้ไข' : 'เพิ่มประเภทรถ'}
          </button>
        </form>
      </div>
    </div>
  );
};

const VehicleCounter = () => {
  const [vehicleTypes, setVehicleTypes] = useState<VehicleType[]>(() => {
    const saved = localStorage.getItem('vehicleTypes');
    if (saved) {
      return JSON.parse(saved);
    }
    return defaultVehicleTypes;
  });

  const [counts, setCounts] = useState<Record<string, DirectionCounts>>(() => {
    const saved = localStorage.getItem('vehicleCounts');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Migration: convert old format (number) to new format (DirectionCounts)
      const migrated: Record<string, DirectionCounts> = {};
      Object.keys(parsed).forEach(key => {
        if (typeof parsed[key] === 'number') {
          migrated[key] = { in: parsed[key], out: 0 };
        } else {
          migrated[key] = parsed[key];
        }
      });
      return migrated;
    }
    return defaultVehicleTypes.reduce((acc, v) => ({ ...acc, [v.id]: { in: 0, out: 0 } }), {});
  });

  const [logs, setLogs] = useState<CountLog[]>(() => {
    const saved = localStorage.getItem('vehicleLogs');
    if (saved) {
      return JSON.parse(saved).map((log: any) => ({
        ...log,
        timestamp: new Date(log.timestamp),
        direction: log.direction || 'in', // Migration for old logs
      }));
    }
    return [];
  });

  const [pressedKeys, setPressedKeys] = useState<Record<string, 'in' | 'out' | null>>({});
  const [showModal, setShowModal] = useState(false);
  const [showLogs, setShowLogs] = useState(false);
  const [customColorIndex, setCustomColorIndex] = useState(0);
  const [editingVehicle, setEditingVehicle] = useState<VehicleType | null>(null);

  const incrementCount = useCallback((vehicleId: string, direction: 'in' | 'out') => {
    const newLog: CountLog = {
      vehicleId,
      timestamp: new Date(),
      direction,
    };

    setCounts(prev => {
      const current = prev[vehicleId] || { in: 0, out: 0 };
      const newCounts = { 
        ...prev, 
        [vehicleId]: { 
          ...current, 
          [direction]: current[direction] + 1 
        } 
      };
      localStorage.setItem('vehicleCounts', JSON.stringify(newCounts));
      return newCounts;
    });

    setLogs(prev => {
      const newLogs = [newLog, ...prev].slice(0, 500);
      localStorage.setItem('vehicleLogs', JSON.stringify(newLogs));
      return newLogs;
    });
  }, []);

  const resetCounts = useCallback(() => {
    const zeroCounts = vehicleTypes.reduce((acc, v) => ({ ...acc, [v.id]: { in: 0, out: 0 } }), {});
    setCounts(zeroCounts);
    setLogs([]);
    localStorage.setItem('vehicleCounts', JSON.stringify(zeroCounts));
    localStorage.setItem('vehicleLogs', JSON.stringify([]));
  }, [vehicleTypes]);

  const saveVehicle = useCallback((vehicleData: Omit<VehicleType, 'id'> & { id?: string }) => {
    if (vehicleData.id) {
      // Editing existing vehicle
      setVehicleTypes(prev => {
        const updated = prev.map(v => 
          v.id === vehicleData.id 
            ? { ...v, nameTh: vehicleData.nameTh, name: vehicleData.name, key: vehicleData.key }
            : v
        );
        localStorage.setItem('vehicleTypes', JSON.stringify(updated));
        return updated;
      });
    } else {
      // Adding new vehicle
      const id = `custom_${Date.now()}`;
      const vehicle: VehicleType = { ...vehicleData, id } as VehicleType;
      
      setVehicleTypes(prev => {
        const updated = [...prev, vehicle];
        localStorage.setItem('vehicleTypes', JSON.stringify(updated));
        return updated;
      });

      setCounts(prev => {
        const updated = { ...prev, [id]: { in: 0, out: 0 } };
        localStorage.setItem('vehicleCounts', JSON.stringify(updated));
        return updated;
      });

      setCustomColorIndex(prev => prev + 1);
    }
    setEditingVehicle(null);
  }, []);

  const deleteVehicleType = useCallback((id: string) => {
    setVehicleTypes(prev => {
      const updated = prev.filter(v => v.id !== id);
      localStorage.setItem('vehicleTypes', JSON.stringify(updated));
      return updated;
    });

    setCounts(prev => {
      const { [id]: _, ...rest } = prev;
      localStorage.setItem('vehicleCounts', JSON.stringify(rest));
      return rest;
    });

    setLogs(prev => {
      const updated = prev.filter(log => log.vehicleId !== id);
      localStorage.setItem('vehicleLogs', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const openEditModal = useCallback((vehicle: VehicleType) => {
    setEditingVehicle(vehicle);
    setShowModal(true);
  }, []);

  const openAddModal = useCallback(() => {
    setEditingVehicle(null);
    setShowModal(true);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showModal) return; // Don't count when modal is open
      
      const key = e.key.toLowerCase();
      const vehicle = vehicleTypes.find(v => v.key === key);
      
      if (vehicle && !e.repeat) {
        const direction: 'in' | 'out' = e.shiftKey ? 'out' : 'in';
        setPressedKeys(prev => ({ ...prev, [key]: direction }));
        incrementCount(vehicle.id, direction);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      setPressedKeys(prev => ({ ...prev, [key]: null }));
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [incrementCount, vehicleTypes, showModal]);

  const totalIn = Object.values(counts).reduce((sum, c) => sum + (c?.in || 0), 0);
  const totalOut = Object.values(counts).reduce((sum, c) => sum + (c?.out || 0), 0);
  const totalCount = totalIn + totalOut;
  const usedKeys = vehicleTypes.map(v => v.key);

  const getVehicleName = (id: string) => {
    const vehicle = vehicleTypes.find(v => v.id === id);
    return vehicle?.nameTh || id;
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <header className="text-center mb-6 fade-in">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            ระบบนับรถ
          </h1>
          <p className="text-muted-foreground text-sm">
            กดปุ่มเพื่อนับเข้า • กด Shift+ปุ่มเพื่อนับออก
          </p>
        </header>

        {/* Keyboard Hints - Moved to top */}
        <div className="bg-card border border-border rounded-2xl p-4 mb-6 fade-in" style={{ animationDelay: '0.05s' }}>
          <p className="text-muted-foreground text-xs text-center mb-3 uppercase tracking-wider">คีย์ลัด</p>
          <div className="flex flex-wrap justify-center gap-3">
            {vehicleTypes.map(vehicle => (
              <div key={vehicle.id} className="flex items-center gap-1.5 bg-secondary/50 px-3 py-1.5 rounded-lg">
                <span className={`key-hint text-xs ${vehicle.textColorClass}`}>{vehicle.key}</span>
                <span className="text-xs text-muted-foreground">{vehicle.nameTh}</span>
              </div>
            ))}
          </div>
          <p className="text-muted-foreground text-xs text-center mt-2">
            กด <span className="font-mono bg-secondary px-1 rounded">Shift</span> ค้างไว้เพื่อนับรถออก
          </p>
        </div>

        {/* Total Counter */}
        <div className="bg-card border border-border rounded-2xl p-6 mb-6 fade-in" style={{ animationDelay: '0.1s' }}>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-emerald-400 text-xs uppercase tracking-wider mb-1">เข้า ↓</p>
              <p className="text-2xl md:text-3xl font-bold text-emerald-400">{totalIn.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs uppercase tracking-wider mb-1">รวมทั้งหมด</p>
              <p className="count-number text-primary">{totalCount.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-orange-400 text-xs uppercase tracking-wider mb-1">ออก ↑</p>
              <p className="text-2xl md:text-3xl font-bold text-orange-400">{totalOut.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Vehicle Counters Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {vehicleTypes.map((vehicle, index) => (
            <div 
              key={vehicle.id} 
              className="fade-in" 
              style={{ animationDelay: `${0.15 + index * 0.05}s` }}
            >
              <CounterCard
                vehicle={vehicle}
                countIn={counts[vehicle.id]?.in || 0}
                countOut={counts[vehicle.id]?.out || 0}
                onIncrement={(direction) => incrementCount(vehicle.id, direction)}
                onEdit={() => openEditModal(vehicle)}
                onDelete={vehicle.isCustom ? () => deleteVehicleType(vehicle.id) : undefined}
                isPressed={pressedKeys[vehicle.key] || null}
              />
            </div>
          ))}

          {/* Add New Vehicle Card */}
          <button
            onClick={openAddModal}
            className="counter-card border-dashed border-2 border-border hover:border-primary flex flex-col items-center justify-center min-h-[280px] transition-colors group"
          >
            <Plus className="w-12 h-12 text-muted-foreground group-hover:text-primary transition-colors mb-2" />
            <span className="text-muted-foreground group-hover:text-primary transition-colors font-medium">
              เพิ่มประเภทรถ
            </span>
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-8 fade-in" style={{ animationDelay: '0.4s' }}>
          <button
            onClick={() => setShowLogs(!showLogs)}
            className="flex items-center gap-2 px-6 py-3 bg-secondary hover:bg-secondary/80 text-secondary-foreground rounded-xl font-medium transition-all duration-200 hover:scale-105 active:scale-95"
          >
            <Clock className="w-5 h-5" />
            ประวัติการนับ
            {showLogs ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          <button
            onClick={resetCounts}
            className="px-6 py-3 bg-destructive/20 hover:bg-destructive/30 text-destructive rounded-xl font-medium transition-all duration-200 hover:scale-105 active:scale-95"
          >
            รีเซ็ตทั้งหมด
          </button>
        </div>

        {/* Logs Section */}
        {showLogs && (
          <div className="bg-card border border-border rounded-2xl p-6 mb-8 fade-in">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              ประวัติการนับล่าสุด
            </h3>
            {logs.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">ยังไม่มีประวัติการนับ</p>
            ) : (
              <div className="max-h-64 overflow-y-auto space-y-2">
                {logs.slice(0, 50).map((log, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between py-2 px-4 bg-secondary/50 rounded-lg"
                  >
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-0.5 rounded ${log.direction === 'in' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-orange-500/20 text-orange-400'}`}>
                        {log.direction === 'in' ? 'เข้า' : 'ออก'}
                      </span>
                      <span className="font-medium text-foreground">{getVehicleName(log.vehicleId)}</span>
                    </div>
                    <span className="text-sm text-muted-foreground font-mono">
                      {format(new Date(log.timestamp), 'dd MMM yyyy HH:mm:ss', { locale: th })}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>

      {/* Vehicle Modal */}
      <VehicleModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingVehicle(null);
        }}
        onSave={saveVehicle}
        usedKeys={usedKeys}
        colorIndex={customColorIndex}
        editingVehicle={editingVehicle}
      />
    </div>
  );
};

export default VehicleCounter;
