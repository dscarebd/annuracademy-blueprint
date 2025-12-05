import { useDraggable } from "@dnd-kit/core";
import {
  Type,
  Heading,
  Image,
  MousePointer,
  SeparatorHorizontal,
  Minus,
  Video,
  Columns,
} from "lucide-react";
import { widgetDefinitions } from "./WidgetTypes";

const iconMap: Record<string, any> = {
  Type,
  Heading,
  Image,
  MousePointer,
  SeparatorHorizontal,
  Minus,
  Video,
  Columns,
};

interface DraggableWidgetProps {
  type: string;
  label: string;
  icon: string;
}

const DraggableWidget = ({ type, label, icon }: DraggableWidgetProps) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `new-widget-${type}`,
    data: { type, isNew: true },
  });

  const Icon = iconMap[icon] || Type;

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`p-3 rounded-lg border bg-card cursor-grab active:cursor-grabbing transition-all hover:border-primary hover:shadow-sm ${
        isDragging ? "opacity-50 shadow-lg" : ""
      }`}
    >
      <div className="flex flex-col items-center gap-2">
        <div className="p-2 rounded-lg bg-muted">
          <Icon className="w-5 h-5 text-primary" />
        </div>
        <span className="text-xs text-center font-medium">{label}</span>
      </div>
    </div>
  );
};

export const WidgetPanel = () => {
  return (
    <div className="p-4">
      <h3 className="font-semibold text-sm mb-3">উইজেট সমূহ</h3>
      <p className="text-xs text-muted-foreground mb-4">
        ড্র্যাগ করে এডিটরে ফেলুন
      </p>
      <div className="grid grid-cols-2 gap-2">
        {widgetDefinitions.map((widget) => (
          <DraggableWidget
            key={widget.type}
            type={widget.type}
            label={widget.label}
            icon={widget.icon}
          />
        ))}
      </div>
    </div>
  );
};
