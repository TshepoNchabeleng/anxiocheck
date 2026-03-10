import { Card, CardContent } from "../components/ui/card";
import { cn } from "../components/ui/utils";

interface HealthGaugeProps {
  value: number;
  min?: number;
  max?: number;
  label: string;
  unit?: string;
  className?: string;
}

export function HealthGauge({ value, min = 0, max = 200, label, unit = "BPM", className }: HealthGaugeProps) {
  const percentage = ((value - min) / (max - min)) * 100;
  
  const getStatusColor = () => {
    if (value < 60) return "text-blue-600";
    if (value <= 100) return "text-green-600";
    return "text-red-600";
  };

  const getStatusText = () => {
    if (value < 60) return "LOW";
    if (value <= 100) return "NORMAL";
    return "HIGH";
  };

  const getGradientColor = () => {
    if (value < 60) return "from-blue-400 to-blue-600";
    if (value <= 100) return "from-green-400 to-green-600";
    return "from-orange-400 to-red-600";
  };

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-lg">{label}</h3>
            <span className={cn("font-bold text-sm", getStatusColor())}>{getStatusText()}</span>
          </div>

          <div className="relative">
            <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={cn("h-full bg-gradient-to-r transition-all duration-500", getGradientColor())}
                style={{ width: `${Math.min(percentage, 100)}%` }}
              />
            </div>

            <div className="flex justify-between mt-2 text-xs text-gray-500">
              <span>{min}</span>
              <span>60</span>
              <span>100</span>
              <span>{max}</span>
            </div>
          </div>

          <div className="text-center">
            <div className="text-4xl font-bold text-gray-900">{Math.round(value)}</div>
            <div className="text-sm text-gray-500">{unit}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}