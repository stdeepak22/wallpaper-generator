// Types for the Wallpaper Configuration

export type Theme = 'dark' | 'light' | 'midnight' | 'sunset';
export type WidgetType = 'donut' | 'dots' | 'text';

export interface WallpaperConfig {
  theme: Theme;
  widget: WidgetType;
  name: string;
  timezone: string; // IANA timezone string e.g. 'Asia/Kolkata'
  customColor?: string; // User selected color override
}

export const THEMES: Record<Theme, { bg: string; text: string; accent: string }> = {
  dark: { bg: '#000000', text: '#ffffff', accent: '#3b82f6' },
  light: { bg: '#ffffff', text: '#000000', accent: '#ef4444' },
  midnight: { bg: '#1e1b4b', text: '#e2e8f0', accent: '#818cf8' },
  sunset: { bg: '#4c0519', text: '#ffe4e6', accent: '#fb7185' },
};

export interface DeviceModel {
  name: string;
  width: number;
  height: number;
  styles: {
    headerSize: number;
    subHeaderSize: number;
    statSize: number;
    widgetSize: number;
    widgetTextSize: number;
    widgetLabelSize: number;
    donutStroke: number;
    dotSize: number;
    dotGap: number;
  };
}

enum deviceHeight {
  h2340 = 2340,
  h2556 = 2556,
  h2796 = 2796,
  h2622 = 2622,
  h2868 = 2868,
}

enum deviceWidth {
  w1080 = 1080,
  w1179 = 1179,
  w1290 = 1290,
  w1206 = 1206,
  w1320 = 1320,
}

const DEVICE_STYLES = [{
  width: deviceWidth.w1080,
  height: deviceHeight.h2340,
  styles: {
    headerSize: 65, subHeaderSize: 30, statSize: 46,
    widgetSize: 750, widgetTextSize: 120, widgetLabelSize: 48,
    donutStroke: 40, dotSize: 30, dotGap: 18
  },
},
{
  width: deviceWidth.w1179,
  height: deviceHeight.h2556,
  styles: {
    headerSize: 71, subHeaderSize: 32, statSize: 50,
    widgetSize: 790, widgetTextSize: 130, widgetLabelSize: 52,
    donutStroke: 44, dotSize: 30, dotGap: 20
  },
},

{
  width: deviceWidth.w1206,
  height: deviceHeight.h2622,
  styles: {
    headerSize: 72, subHeaderSize: 34, statSize: 52,
    widgetSize: 870, widgetTextSize: 145, widgetLabelSize: 57,
    donutStroke: 48, dotSize: 33, dotGap: 22
  },
},
{
  width: deviceWidth.w1290,
  height: deviceHeight.h2796,
  styles: {
    headerSize: 77, subHeaderSize: 36, statSize: 54,
    widgetSize: 870, widgetTextSize: 145, widgetLabelSize: 57,
    donutStroke: 48, dotSize: 33, dotGap: 22
  },
},
{
  width: deviceWidth.w1320,
  height: deviceHeight.h2868,
  styles: {
    headerSize: 79, subHeaderSize: 37, statSize: 55,
    widgetSize: 980, widgetTextSize: 155, widgetLabelSize: 60,
    donutStroke: 48, dotSize: 37, dotGap: 25
  },
},
];

const fillStyle = (model: Partial<DeviceModel>): DeviceModel => {
  const device = DEVICE_STYLES.find((device) => device.height === model.height && device.width === model.width);
  model.styles = device?.styles || DEVICE_STYLES[0].styles;
  return model as DeviceModel;
}

export const IPHONE_MODELS: DeviceModel[] = [
  {
    name: 'iPhone 17 Pro Max',
    width: deviceWidth.w1320,
    height: deviceHeight.h2868,
  },
  {
    name: 'iPhone 17 Pro',
    width: deviceWidth.w1206,
    height: deviceHeight.h2622,
  },
  {
    name: 'iPhone 17',
    width: deviceWidth.w1179,
    height: deviceHeight.h2556,
  },
  {
    name: 'iPhone 16 Pro Max',
    width: deviceWidth.w1320,
    height: deviceHeight.h2868,
  },
  {
    name: 'iPhone 16 Pro',
    width: deviceWidth.w1206,
    height: deviceHeight.h2622,
  },
  {
    name: 'iPhone 15 Plus / 15 Pro Max / 16 Plus',
    width: deviceWidth.w1290,
    height: deviceHeight.h2796,
  },
  {
    name: 'iPhone 15 / 15 Pro / 16',
    width: deviceWidth.w1179,
    height: deviceHeight.h2556,
  },
  {
    name: 'iPhone 13 Pro Max / 14 Plus / 14 Pro Max',
    width: deviceWidth.w1290,
    height: deviceHeight.h2796,
  },
  {
    name: 'iPhone 13 / 13 Pro / 14 / 14 Pro',
    width: deviceWidth.w1179,
    height: deviceHeight.h2556,
  },
  {
    name: 'iPhone 13 mini',
    width: deviceWidth.w1080,
    height: deviceHeight.h2340,
  },
].map(fillStyle);
