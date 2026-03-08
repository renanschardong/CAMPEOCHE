import React, { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

export function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showVolume, setShowVolume] = useState(false);
  const [volume, setVolume] = useState(1.0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const volumeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, []);

  const handleVolumeMouseEnter = () => {
    if (volumeTimeoutRef.current) clearTimeout(volumeTimeoutRef.current);
    setShowVolume(true);
  };

  const handleVolumeMouseLeave = () => {
    volumeTimeoutRef.current = setTimeout(() => {
      setShowVolume(false);
    }, 500); // 500ms delay before closing
  };

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(err => console.log("Erro ao tocar áudio:", err));
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 group">
      <audio
        ref={audioRef}
        src="https://archive.org/download/uefa-champions-league-anthem/UEFA%20Champions%20League%20Anthem.mp3"
        loop
      />
      
      <div className={`flex items-center gap-3 bg-[#0e1e5b]/90 backdrop-blur-md border border-blue-500/30 p-2 pl-4 rounded-full shadow-[0_0_20px_rgba(0,0,0,0.5)] transition-all duration-500 ${isPlaying ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-70 hover:opacity-100'}`}>
        <div className="flex flex-col">
          <span className="text-[10px] uppercase tracking-[0.2em] text-blue-400 font-bold leading-none">Hino Oficial</span>
          <span className="text-xs text-white font-medium truncate max-w-[120px]">Champions League</span>
        </div>
        
        <div 
          className="relative flex items-center group/volume"
          onMouseEnter={handleVolumeMouseEnter}
          onMouseLeave={handleVolumeMouseLeave}
        >
          {showVolume && (
            <div className="absolute bottom-full right-0 pb-4 animate-in fade-in slide-in-from-bottom-2 duration-200">
              <div className="flex flex-col items-center gap-3 p-4 bg-[#0e1e5b] border border-blue-500/30 rounded-2xl shadow-2xl min-w-[60px]">
                <span className="text-[10px] font-bold text-blue-400 tabular-nums">
                  {Math.round(volume * 100)}%
                </span>
                <div className="h-32 flex items-center justify-center relative">
                  {/* Custom track for better visibility */}
                  <div className="absolute inset-y-0 w-1.5 bg-blue-900/50 rounded-full overflow-hidden">
                    <div 
                      className="absolute bottom-0 w-full bg-blue-400" 
                      style={{ height: `${volume * 100}%` }}
                    />
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume}
                    onChange={handleVolumeChange}
                    className="relative w-8 h-32 bg-transparent appearance-none cursor-pointer accent-blue-400 [writing-mode:bt-lr] [-webkit-appearance:slider-vertical] z-10"
                    style={{ 
                      WebkitAppearance: 'slider-vertical',
                    }}
                  />
                </div>
              </div>
            </div>
          )}
          
          <button
            onClick={togglePlay}
            className={`flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 ${
              isPlaying 
                ? 'bg-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.4)] animate-pulse' 
                : 'bg-blue-600 text-blue-100 hover:bg-blue-500'
            }`}
            title={isPlaying ? "Desligar Música" : "Ligar Música"}
          >
            {isPlaying ? (
              <Volume2 size={20} />
            ) : (
              <VolumeX size={20} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
