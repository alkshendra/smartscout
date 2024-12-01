import React from 'react';
import { Palette } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { themeColors } from '../styles/theme';

export function ThemePicker() {
  const { currentTheme, setTheme } = useTheme();

  return (
    <div className="fixed bottom-4 right-4">
      <div className="relative group">
        <button
          className="p-3 rounded-full bg-surface-variant hover:bg-surface-variant/80 transition-colors"
          title="Change theme"
        >
          <Palette size={24} className="text-primary" />
        </button>
        <div className="absolute bottom-full right-0 mb-2 hidden group-hover:block">
          <div className="bg-white rounded-lg shadow-lg p-2 flex gap-2">
            {themeColors.map((color) => (
              <button
                key={color.id}
                onClick={() => setTheme(color)}
                className={`w-8 h-8 rounded-full transition-transform ${
                  currentTheme.id === color.id ? 'scale-110 ring-2 ring-offset-2' : ''
                }`}
                style={{ backgroundColor: color.primary }}
                title={color.name}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}