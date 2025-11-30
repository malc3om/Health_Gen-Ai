'use client';

import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function HealthChallenge() {
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [isFullyComplete, setIsFullyComplete] = useState(false);
  const heartRef = useRef<HTMLDivElement>(null);
  const progressHeartRef = useRef<HTMLSpanElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const steps = [
    "Complete Profile Setup",
    "Connect Wearable Device",
    "Log First Symptom",
    "Schedule Initial Scan"
  ];

  const toggleStep = (index: number) => {
    if (completedSteps.includes(index)) {
      setCompletedSteps(completedSteps.filter(i => i !== index));
      setIsFullyComplete(false);
    } else {
      const newSteps = [...completedSteps, index];
      setCompletedSteps(newSteps);
      if (newSteps.length === steps.length) {
        setIsFullyComplete(true);
      }
    }
  };

  useEffect(() => {
    if (isFullyComplete && heartRef.current) {
      // Animation for the full heart
      gsap.fromTo(heartRef.current,
        { scale: 0.5, opacity: 0, rotation: -15 },
        {
          scale: 1,
          opacity: 1,
          rotation: 0,
          duration: 0.8,
          ease: "elastic.out(1, 0.5)",
          onComplete: () => {
            // Hover animation
            gsap.to(heartRef.current, {
              y: -10,
              duration: 1.5,
              repeat: -1,
              yoyo: true,
              ease: "sine.inOut"
            });
            // Continuous rotation for full heart
            gsap.to(heartRef.current, {
              rotationY: 360,
              duration: 6,
              repeat: -1,
              ease: "none"
            });
          }
        }
      );
    } else if (!isFullyComplete && progressHeartRef.current) {
      // Animation for the progress heart (incomplete state)
      // "Static and rotating" - Static position (no hover), rotating 3D
      gsap.to(progressHeartRef.current, {
        rotationY: 360,
        duration: 3,
        repeat: -1,
        ease: "linear"
      });
    }
  }, [isFullyComplete]);

  // Calculate health bar width (25% per step)
  const progressPercentage = (completedSteps.length / steps.length) * 100;

  return (
    <div ref={containerRef} className="w-full max-w-4xl mx-auto p-1">
      {/* Grey Box Container (The "Grey Box") */}
      <div className="relative border border-white/10 bg-white/5 backdrop-blur-sm rounded-lg p-8 overflow-hidden">

        {/* Grid Background Effect */}
        <div className="absolute inset-0 opacity-10 pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '20px 20px' }}>
        </div>

        <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center justify-between">

          {/* Left Side: Checklist & Health Bar (The "Red Box" area) */}
          <div className={`flex-1 w-full transition-all duration-500 ${isFullyComplete ? 'opacity-0 pointer-events-none absolute' : 'opacity-100 relative'}`}>
            <div className="border border-red-500/30 bg-red-900/10 rounded-lg p-6 backdrop-blur-md">
              <h3 className="text-red-400 font-mono text-sm tracking-widest mb-4 uppercase flex items-center gap-2">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                System Calibration
              </h3>

              {/* Health Bar */}
              <div className="w-full h-4 bg-black/50 border border-white/10 rounded-full mb-6 relative overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-red-900 via-red-600 to-red-500 transition-all duration-500 ease-out"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
                {/* Pixel grid overlay for the bar */}
                <div className="absolute inset-0 bg-[url('/grid.png')] opacity-20 bg-repeat"></div>
              </div>

              {/* Checklist */}
              <div className="space-y-3">
                {steps.map((step, index) => (
                  <label key={index} className="flex items-center gap-3 cursor-pointer group">
                    <div className={`w-5 h-5 border border-red-500/50 rounded flex items-center justify-center transition-all ${completedSteps.includes(index) ? 'bg-red-500 border-red-500' : 'bg-transparent group-hover:border-red-400'}`}>
                      {completedSteps.includes(index) && (
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <span className={`font-mono text-sm transition-colors ${completedSteps.includes(index) ? 'text-gray-500 line-through' : 'text-gray-300 group-hover:text-white'}`}>
                      {step}
                    </span>
                    <input
                      type="checkbox"
                      className="hidden"
                      checked={completedSteps.includes(index)}
                      onChange={() => toggleStep(index)}
                    />
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Right Side / Center: Heart Animation */}
          <div className={`flex-1 flex flex-col items-center justify-center transition-all duration-500 ${isFullyComplete ? 'scale-110' : 'scale-100'}`}>

            {/* Heart Container */}
            <div className="relative w-64 h-64 flex items-center justify-center">
              {isFullyComplete ? (
                // Full Pixel Heart
                <div ref={heartRef} className="relative">
                  <img
                    src="/images/heart-final-transparent.png"
                    alt="Full Heart"
                    className="w-48 h-48 object-contain rendering-pixelated"
                    style={{
                      imageRendering: 'pixelated',
                      filter: 'drop-shadow(0 0 2px rgba(255, 255, 255, 0.3)) drop-shadow(0 0 4px rgba(255, 255, 255, 0.1))' // Softer sticker outline effect
                    }}
                  />
                  <div className="absolute -inset-4 bg-red-500/20 blur-xl rounded-full -z-10 animate-pulse"></div>
                </div>
              ) : (
                // Progress Heart
                <div className="text-center opacity-50">
                  <div className="w-32 h-32 border-2 border-dashed border-red-500/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span ref={progressHeartRef} className="text-4xl inline-block">❤️</span>
                  </div>
                  <p className="font-mono text-xs text-red-500/50 tracking-widest">AWAITING DATA</p>
                </div>
              )}
            </div>

            {isFullyComplete && (
              <div className="text-center mt-4 animate-fade-in">
                <h2 className="text-2xl font-bold text-white mb-1 tracking-tight">SYSTEM OPTIMIZED</h2>
                <p className="text-red-400 font-mono text-xs tracking-[0.2em]">ALL VITALS NORMAL</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
