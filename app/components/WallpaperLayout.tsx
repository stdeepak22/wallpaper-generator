import React from 'react';
import { WallpaperConfig, THEMES, DeviceModel } from '@/app/lib/config';
import { getYearProgress } from '@/app/lib/time';

// Ensure we are using standard HTML/CSS styles compatible with Satori
// Flexbox is key.

export function WallpaperLayout({ config, model }: { config: WallpaperConfig, model?: DeviceModel }) {
    const theme = THEMES[config.theme] || THEMES.dark;
    const progress = getYearProgress(config.timezone);

    const activeColor = config.customColor || theme.accent;

    // Defaults (iPhone 13 mini / 1080p baseline)
    const s = model?.styles || {
        headerSize: 65,
        subHeaderSize: 28,
        statSize: 42,
        widgetSize: 680,
        widgetTextSize: 120,
        widgetLabelSize: 48,
        donutStroke: 40,
        dotSize: 25,
        dotGap: 18
    };

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '100%',
                backgroundColor: theme.bg,
                color: theme.text,
                padding: '160px 20px 80px 20px',
                fontFamily: 'sans-serif',
            }}
        >
            <div style={{ height: '25%' }}>
            </div>
            {/* Header Area */}
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                minHeight: '100px'
            }}>
                <p style={{
                    fontSize: `${s.headerSize}px`, // Dynamic
                    fontWeight: 800,
                    textAlign: 'center',
                    lineHeight: 1.1,
                    padding: '0 40px',
                }}>
                    {config.name}
                </p>
            </div>

            {/* Main Widget */}
            <div style={{
                display: 'flex',
                flex: 1,
                alignItems: 'flex-start',
                justifyContent: 'center',
                width: '100%',
                padding: '20px 0'
            }}>
                {config.widget === 'donut' && (
                    <DonutWidget progress={progress} color={activeColor} size={s.widgetSize * 0.80} textSize={s.widgetTextSize} strokeWidth={s.donutStroke} />
                )}
                {config.widget === 'dots' && (
                    <DotsWidget progress={progress} color={activeColor} muted={theme.text} width={s.widgetSize} dotSize={s.dotSize} gap={s.dotGap} />
                )}
                {config.widget === 'text' && (
                    <TextWidget progress={progress} color={activeColor} textSize={s.widgetTextSize} labelSize={s.widgetLabelSize} />
                )}
            </div>
            {/* Footer / Stats */}
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                width: '100%',
                fontSize: `${s.statSize}px`,
                fontWeight: 'bold',
                marginBottom: '90px'
            }}>
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                }}>
                    <span style={{
                        fontSize: `${s.subHeaderSize}px`,
                        opacity: 0.6,
                        marginBottom: '8px'
                    }}>
                        Passed
                    </span>
                    <span style={{ color: activeColor }}>{progress.percentage}%</span>
                </div>
                <div style={{ width: '50px' }}></div>
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                }}>
                    <span style={{
                        fontSize: `${s.subHeaderSize}px`,
                        opacity: 0.6,
                        marginBottom: '8px'
                    }}>
                        Remaining
                    </span>
                    <span style={{ color: activeColor }}>{progress.daysLeft}</span>
                </div>
            </div>

            {/* Timestamp Footer */}
            <div style={{
                display: 'flex',
                bottom: '0px',
                fontSize: '32px',
                opacity: 0.9,
            }}>
                generated at - {progress.generatedAt}
            </div>
        </div>
    );
}

function DonutWidget({ progress, color, size, textSize, strokeWidth }: { progress: any, color: string, size: number, textSize: number, strokeWidth: number }) {
    const center = size / 2;
    const radius = center - strokeWidth;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (parseFloat(progress.percentage) / 100) * circumference;

    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative'
        }}>
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                {/* Background Circle */}
                <circle
                    cx={center}
                    cy={center}
                    r={radius}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={strokeWidth}
                    opacity="0.1"
                />
                {/* Progress Circle */}
                <circle
                    cx={center}
                    cy={center}
                    r={radius}
                    fill="none"
                    stroke={color}
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    transform={`rotate(-90 ${center} ${center})`}
                />
            </svg>
            <div style={{
                position: 'absolute',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
            }}>
                <span style={{
                    fontSize: `${textSize}px`,
                    fontWeight: 'bold'
                }}>
                    {progress.year}
                </span>
            </div>
        </div>
    );
}

function DotsWidget({ progress, color, muted, width, dotSize, gap }: { progress: any, color: string, muted: string, width: number, dotSize: number, gap: number }) {
    const dots = Array.from({ length: progress.totalDays }, (_, i) => i < progress.dayOfYear);
    return (
        <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            width: `${width}px`,
            gap: `${gap}px`,
            justifyContent: 'flex-start',
            alignContent: 'flex-start'
        }}>
            {dots.map((isPassed, i) => (
                <div
                    key={i}
                    style={{
                        width: `${dotSize}px`,
                        height: `${dotSize}px`,
                        borderRadius: '50%',
                        backgroundColor: isPassed ? color : muted,
                        opacity: isPassed ? 1 : 0.15,
                    }}
                />
            ))}
        </div>
    );
}

function TextWidget({ progress, color, textSize, labelSize }: { progress: any, color: string, textSize: number, labelSize: number }) {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            marginTop: '25%'
        }}>
            <span style={{
                fontSize: `${textSize}px`,
                fontWeight: 900,
                lineHeight: 1,
                color: color
            }}>
                {progress.daysLeft}
            </span>
            <span style={{
                fontSize: `${labelSize}px`,
                marginTop: '20px'
            }}>
                DAYS LEFT
            </span>
        </div>
    );
}
