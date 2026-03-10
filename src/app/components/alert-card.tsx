import { useState } from "react";
import { AlertCircle, ChevronDown, ChevronUp } from "lucide-react";
import { Card, CardContent } from "../components/ui/card";
import { cn } from "../components/ui/utils";

interface AlertCardProps {
  title: string;
  description: string;
  severity: "normal" | "warning" | "critical";
  expandable?: boolean;
}

export function AlertCard({ title, description, severity, expandable = true }: AlertCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const getSeverityColors = () => {
    switch (severity) {
      case "critical":
        return "border-red-500 bg-red-50 text-red-900";
      case "warning":
        return "border-yellow-500 bg-yellow-50 text-yellow-900";
      default:
        return "border-green-500 bg-green-50 text-green-900";
    }
  };

  const getIconColor = () => {
    switch (severity) {
      case "critical":
        return "text-red-600";
      case "warning":
        return "text-yellow-600";
      default:
        return "text-green-600";
    }
  };

  return (
    <Card className={cn("border-l-4", getSeverityColors())}>
      <CardContent className="p-4">
        <div
          className={cn(
            "flex items-start gap-3",
            expandable && "cursor-pointer"
          )}
          onClick={() => expandable && setIsExpanded(!isExpanded)}
        >
          <AlertCircle className={cn("w-5 h-5 flex-shrink-0 mt-0.5", getIconColor())} />
          <div className="flex-1">
            <h4 className="font-semibold">{title}</h4>
            <p className="text-sm mt-1 opacity-90">{description}</p>
            {isExpanded && expandable && (
              <div className="mt-3 pt-3 border-t border-current opacity-75">
                <p className="text-sm">
                  Your blood pressure reading of 140/90 is above the normal range. We recommend:
                </p>
                <ul className="text-sm mt-2 space-y-1 ml-4 list-disc">
                  <li>Reduce salt intake</li>
                  <li>Exercise regularly (30 min/day)</li>
                  <li>Monitor readings twice daily</li>
                  <li>Consult your physician if readings persist</li>
                </ul>
              </div>
            )}
          </div>
          {expandable && (
            <div className="flex-shrink-0">
              {isExpanded ? (
                <ChevronUp className="w-5 h-5" />
              ) : (
                <ChevronDown className="w-5 h-5" />
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}