export interface Widget {
  id: string;
  type: string;
  data: Record<string, any>;
}

export interface WidgetDefinition {
  type: string;
  label: string;
  icon: string;
  defaultData: Record<string, any>;
}

export const widgetDefinitions: WidgetDefinition[] = [
  {
    type: "text",
    label: "টেক্সট ব্লক",
    icon: "Type",
    defaultData: {
      text: "আপনার টেক্সট এখানে লিখুন...",
      fontSize: "base",
      fontWeight: "normal",
      textAlign: "left",
    },
  },
  {
    type: "heading",
    label: "শিরোনাম",
    icon: "Heading",
    defaultData: {
      text: "শিরোনাম",
      level: "h2",
      textAlign: "left",
    },
  },
  {
    type: "image",
    label: "ছবি",
    icon: "Image",
    defaultData: {
      src: "",
      alt: "",
      width: "full",
      rounded: "lg",
    },
  },
  {
    type: "button",
    label: "বাটন",
    icon: "MousePointer",
    defaultData: {
      text: "ক্লিক করুন",
      link: "#",
      variant: "primary",
      size: "default",
    },
  },
  {
    type: "spacer",
    label: "স্পেসার",
    icon: "SeparatorHorizontal",
    defaultData: {
      height: "40",
    },
  },
  {
    type: "divider",
    label: "ডিভাইডার",
    icon: "Minus",
    defaultData: {
      style: "solid",
      color: "border",
    },
  },
  {
    type: "video",
    label: "ভিডিও",
    icon: "Video",
    defaultData: {
      url: "",
      autoplay: false,
    },
  },
  {
    type: "columns",
    label: "কলাম",
    icon: "Columns",
    defaultData: {
      columns: 2,
      gap: "4",
      children: [[], []],
    },
  },
];

export const generateWidgetId = () => {
  return `widget-${Date.now()}-${Math.random().toString(36).substring(7)}`;
};
