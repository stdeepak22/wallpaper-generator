'use client';

import React, { useState, useEffect } from 'react';
import { WallpaperLayout } from '@/app/components/WallpaperLayout';
import { WallpaperConfig, Theme, WidgetType, THEMES, IPHONE_MODELS } from '@/app/lib/config';

export default function Home() {
  const [mounted, setMounted] = useState(false);

  // Default Config
  const [config, setConfig] = useState<WallpaperConfig>({
    theme: 'dark',
    widget: 'donut',
    name: 'Lets do it! 🚀',
    timezone: 'UTC', // Will be hydrated on client
    customColor: '',
  });

  const [selectedModel, setSelectedModel] = useState(IPHONE_MODELS[3]);

  // Hydrate from localStorage and timezone on client mount
  useEffect(() => {
    setMounted(true);
    const userTz = Intl.DateTimeFormat().resolvedOptions().timeZone;

    // Load persisted state
    try {
      const savedConfig = localStorage.getItem('wallpaper-config');
      const savedModelName = localStorage.getItem('wallpaper-model');

      if (savedConfig) {
        setConfig(prev => ({ ...JSON.parse(savedConfig), timezone: userTz }));
      } else {
        setConfig(prev => ({ ...prev, timezone: userTz }));
      }

      if (savedModelName) {
        const found = IPHONE_MODELS.find(m => m.name === savedModelName);
        if (found) setSelectedModel(found);
      }
    } catch (e) {
      console.error('Failed to load from local storage', e);
      setConfig(prev => ({ ...prev, timezone: userTz }));
    }
  }, []);

  // Persist state on change
  useEffect(() => {
    if (mounted) {
      localStorage.setItem('wallpaper-config', JSON.stringify(config));
      localStorage.setItem('wallpaper-model', selectedModel.name);
    }
  }, [config, selectedModel, mounted]);

  const [generatedUrl, setGeneratedUrl] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Generate the URL based on current config
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams();
      params.set('theme', config.theme);
      params.set('widget', config.widget);
      params.set('name', config.name);
      // Note: For the URL we might want to let the server auto-detect if user wants that.
      // But here we are explicit.
      params.set('tz', config.timezone);
      if (config.customColor) params.set('color', config.customColor);

      params.set('width', selectedModel.width.toString());
      params.set('height', selectedModel.height.toString());

      const url = `${window.location.origin}/api/og?${params.toString()}`;
      setGeneratedUrl(url);
    }
  }, [config, selectedModel]);

  if (!mounted) return null;

  return (
    <main className="min-h-screen p-4 md:p-8 bg-neutral-900 text-white flex flex-col-reverse md:flex-row gap-8 items-start justify-center">

      {/* Editor Panel */}
      <div className="w-full md:w-96 flex flex-col gap-6 bg-neutral-800 p-6 rounded-2xl shadow-xl">
        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
          Wallpaper Generator
        </h1>

        {/* Device Model Section */}
        <section className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-neutral-400">Device Model</label>
          <select
            value={selectedModel.name}
            onChange={(e) => {
              const model = IPHONE_MODELS.find(m => m.name === e.target.value);
              if (model) setSelectedModel(model);
            }}
            className="bg-neutral-900 border border-neutral-700 rounded p-2 text-white focus:border-blue-500 outline-none"
          >
            {IPHONE_MODELS.map((model) => (
              <option key={model.name} value={model.name}>
                {model.name} ({model.width}x{model.height})
              </option>
            ))}
          </select>
        </section>

        {/* Theme Section */}
        <section className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-neutral-400">Theme</label>
          <div className="grid grid-cols-2 gap-2">
            {(Object.keys(THEMES) as Theme[]).map((t) => (
              <button
                key={t}
                onClick={() => setConfig({ ...config, theme: t })}
                className={`p-2 rounded border transition-all ${config.theme === t ? 'border-blue-500 bg-blue-500/10' : 'border-neutral-700 hover:border-neutral-500'}`}
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <div className="w-4 h-4 rounded-full" style={{ background: THEMES[t].bg }}></div>
                <span className="capitalize">{t}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Widget Section */}
        <section className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-neutral-400">Widget</label>
          <div className="flex gap-2 p-1 bg-neutral-900 rounded-lg">
            {(['donut', 'dots', 'text'] as WidgetType[]).map((w) => (
              <button
                key={w}
                onClick={() => setConfig({ ...config, widget: w })}
                className={`flex-1 py-2 text-sm rounded-md capitalize transition-colors ${config.widget === w ? 'bg-neutral-700 text-white shadow' : 'text-neutral-500 hover:text-white'}`}
              >
                {w}
              </button>
            ))}
          </div>
        </section>

        {/* Custom Color */}
        <section className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-neutral-400">Accent Color</label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={config.customColor || THEMES[config.theme].accent}
              onChange={(e) => setConfig({ ...config, customColor: e.target.value })}
              className="h-8 w-8 p-0 cursor-pointer border-none rounded-full overflow-hidden [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-none [&::-webkit-color-swatch]:rounded-full"
            />
            <button
              onClick={() => setConfig({ ...config, customColor: '' })}
              className="text-xs text-neutral-500 hover:text-white underline"
            >
              Reset to Theme
            </button>
          </div>
        </section>

        {/* Custom Text */}
        <section className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-neutral-400">Label Text</label>
          <input
            type="text"
            value={config.name}
            onChange={(e) => setConfig({ ...config, name: e.target.value })}
            className="bg-neutral-900 border border-neutral-700 rounded p-2 focus:border-blue-500 outline-none"
            maxLength={50}
          />
        </section>

        {/* Timezone Info */}
        <section className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-neutral-400">Timezone</label>
          <div className="text-xs text-neutral-500 bg-neutral-900 p-2 rounded break-all">
            {config.timezone}
          </div>
          <p className="text-[10px] text-neutral-600">
            Your browser detected this timezone. The generated link will use this unless modified.
          </p>
        </section>

        {/* Action Buttons */}
        <div className="pt-4 border-t border-neutral-700 flex flex-col gap-3">
          <div className="bg-neutral-900 p-3 rounded border border-neutral-700 flex flex-col gap-2">
            <span className="text-xs font-mono text-neutral-400 break-all line-clamp-2">
              {generatedUrl}
            </span>
            <button
              onClick={() => {
                navigator.clipboard.writeText(generatedUrl);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
              className={`text-white text-sm py-2 rounded font-medium transition-all transform active:scale-95 ${copied
                ? 'bg-green-600 hover:bg-green-500 shadow-[0_0_15px_rgba(22,163,74,0.5)]'
                : 'bg-blue-600 hover:bg-blue-500'
                }`}
            >
              {copied ? 'Copied! ✨' : 'Copy Link'}
            </button>
          </div>

          <a
            href={generatedUrl}
            target="_blank"
            rel="noreferrer"
            download="wallpaper.png" // 'download' attr works if same origin, but generic api link might just open in new tab
            className="text-center text-sm text-neutral-400 hover:text-white underline"
          >
            Open / Download Image
          </a>
        </div>

      </div>

      {/* Preview Panel */}
      <div
        className="relative h-[800px] bg-black rounded-[3rem] border-8 border-neutral-800 shadow-2xl overflow-hidden ring-1 ring-neutral-700 flex flex-col items-center justify-center transition-all duration-300 ease-in-out"
        style={{ aspectRatio: `${selectedModel.width}/${selectedModel.height}` }}
      >
        {/* Notch */}
        <div
          className={`absolute top-0 left-1/2 -translate-x-1/2 w-32 h-8 bg-black z-20 pointer-events-none transition-all duration-300 ${selectedModel.name.includes('13') || selectedModel.name.includes('14')
            ? 'rounded-b-xl'
            : 'mt-[15px] rounded-[22px]'
            }`}
        />

        {/* Live Component Scaled Down */}
        <div
          style={{
            width: `${selectedModel.width}px`,
            height: `${selectedModel.height}px`,
            transform: `scale(${800 / selectedModel.height})`,
            transformOrigin: 'center center',
            flexShrink: 0,
          }}
        >
          <WallpaperLayout config={config} model={selectedModel} />
        </div>
      </div>

    </main>
  );
}
