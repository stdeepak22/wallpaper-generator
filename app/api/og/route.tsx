/* eslint-disable @next/next/no-server-import-in-page */
import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';
import { WallpaperLayout } from '@/app/components/WallpaperLayout';
import { WallpaperConfig, Theme, WidgetType, IPHONE_MODELS } from '@/app/lib/config';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);

    // Extract Config from Query Params
    const theme = (searchParams.get('theme') || 'dark') as Theme;
    const widget = (searchParams.get('widget') || 'donut') as WidgetType;
    const name = searchParams.get('name') || '';
    const customColor = searchParams.get('color') || undefined;

    // Timezone resolution:
    // 1. Query Param
    // 2. Vercel Header
    // 3. Fallback to UTC
    const limitTz = searchParams.get('tz');
    const ipTz = request.headers.get('x-vercel-ip-timezone');
    const timezone = limitTz || ipTz || 'UTC';

    const config: WallpaperConfig = {
        theme,
        widget,
        name,
        timezone,
        customColor
    };

    // Dimensions
    // Default to 1080x1920 if not specified
    const width = parseInt(searchParams.get('width') || '1080');
    const height = parseInt(searchParams.get('height') || '1920');

    // Find matching model for styles
    const model = IPHONE_MODELS.find(m => m.width === width && m.height === height);

    return new ImageResponse(
        (
            <WallpaperLayout config={config} model={model} />
        ),
        {
            width,
            height,
            // headers: {
            //     'Cache-Control': 'public, max-age=3600, immutable',
            // }
        }
    );
}
