
'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { TextPlugin } from 'gsap/TextPlugin';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import HealthChallenge from '@/components/HealthChallenge';

// Register the TextPlugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(TextPlugin);
}

export default function LandingPage() {
  const healthRef = useRef<HTMLSpanElement>(null);
  const guardianRef = useRef<HTMLSpanElement>(null);
  const versionRef = useRef<HTMLSpanElement>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const bottomContentRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const navItems = [
    { name: 'OVERVIEW', href: '/dashboard' },
    { name: 'SYMPTOMS', href: '/symptom-checker' },
    { name: 'ANALYTICS', href: '/health-analytics' },
    { name: 'WEARABLES', href: '/wearables' },
    { name: 'PLAN', href: '/health-plan' },
    { name: 'TELEHEALTH', href: '/telehealth' },
  ];

  useEffect(() => {
    const tl = gsap.timeline();

    // Typing animation for "Health AI" - Slowed down for visibility
    tl.to(healthRef.current, {
      duration: 0.8,
      text: "Health AI",
      ease: "none",
      delay: 0.3,
      onComplete: () => {
        // After animation, set HTML to include red "AI"
        if (healthRef.current) {
          healthRef.current.innerHTML = 'Health <span class="text-red-500">AI</span>';
        }
      }
    });

    // Typing animation for "Guardian" - Slowed down for visibility
    tl.to(guardianRef.current, {
      duration: 1.0,
      text: "Guardian",
      ease: "none",
      delay: 0.2
    });

    // Fade in version
    tl.to(versionRef.current, {
      opacity: 1,
      duration: 0.4,
      delay: 0.15
    });

    // Fade in Navbar items
    tl.fromTo(navRef.current,
      { opacity: 0, y: -10 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }, // Reduced duration
      "-=0.3"
    );

    // Pop down animation for Hero Text
    tl.fromTo(".hero-text",
      { y: -50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.15,
        ease: "power3.out",
        onComplete: () => {
          // Trigger scramble effect on ALL hero text words
          document.querySelectorAll('.hero-text').forEach((el) => {
            const target = el as HTMLSpanElement;
            const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()";
            let iterations = 0;
            const originalText = target.dataset.value || target.innerText;

            const interval = setInterval(() => {
              target.innerText = originalText
                .split("")
                .map((letter, index) => {
                  if (index < iterations) {
                    return originalText[index];
                  }
                  return chars[Math.floor(Math.random() * chars.length)];
                })
                .join("");

              if (iterations >= originalText.length) {
                clearInterval(interval);
              }

              iterations += 1 / 2;
            }, 30);
          });
        }
      },
      "-=0.3"
    );

    // Rise up animation for Bottom Content
    tl.fromTo(bottomContentRef.current,
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: "power3.out" },
      "-=0.6"
    );

  }, [router]);

  const scrambleText = (e: any) => {
    const target = e.target as HTMLSpanElement;
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()";
    let iterations = 0;
    const originalText = target.dataset.value || target.innerText;

    // Clear any existing interval to prevent conflicts
    if (target.dataset.interval) {
      clearInterval(parseInt(target.dataset.interval));
    }

    const interval = setInterval(() => {
      target.innerText = originalText
        .split("")
        .map((letter, index) => {
          if (index < iterations) {
            return originalText[index];
          }
          return chars[Math.floor(Math.random() * chars.length)];
        })
        .join("");

      if (iterations >= originalText.length) {
        clearInterval(interval);
      }

      iterations += 1 / 2; // Slightly faster
    }, 30);

    target.dataset.interval = interval.toString();
  };

  return (
    <div className="min-h-screen bg-black flex flex-col relative overflow-hidden font-mono">
      {/* Subtle grid pattern background */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}></div>
      </div>

      {/* Navbar */}
      <nav className="relative z-10 mx-6 mt-6 px-8 py-4 flex justify-between items-center bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl">
        {/* Logo Section (Left) */}
        <div className="flex flex-col gap-1 select-none">
          <Link href="/" className="flex items-center gap-1 cursor-pointer">
            <span
              ref={healthRef}
              className="text-xl font-bold tracking-tighter text-white"
            ></span>
            <span className="text-xl font-bold text-gray-600">|</span>
            <span
              ref={guardianRef}
              className="text-xl font-bold tracking-tighter text-white"
            ></span>
          </Link>
          <span
            ref={versionRef}
            className="text-[10px] font-mono text-gray-500 tracking-widest ml-1 opacity-0"
          >
            1.0.0
          </span>
        </div>

        {/* Navigation Links (Right) - Dashboard Items */}
        <div ref={navRef} className="hidden md:flex items-center gap-8 opacity-0">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-xs font-mono text-gray-400 hover:text-white transition-colors tracking-wider flex items-center gap-2 group"
            >
              <span className="text-gray-700 group-hover:text-gray-500 transition-colors">{'</>'}</span>
              {item.name}
            </Link>
          ))}
          <div className="w-px h-4 bg-gray-800 mx-2"></div>
          <div className="flex items-center gap-2 text-xs font-mono text-blue-400 bg-white/10 px-3 py-1.5 rounded-none border border-white/10">
            <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></span>
            SYSTEM ONLINE
          </div>
        </div>
      </nav>

      {/* Main content area */}
      <div className="flex-1 relative z-10 flex items-center justify-center px-8 pb-20 h-full w-full">
        <div className="w-full max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center h-full">

          {/* Left Column: Headline */}
          <div className="order-1 lg:order-1 flex flex-col justify-center h-full">
            <div className="max-w-2xl">
              <h1 className="text-6xl md:text-8xl font-bold text-white leading-tight flex flex-col items-start tracking-tighter text-left">
                <span
                  className="hero-text opacity-0 inline-block cursor-pointer hover:text-gray-300 transition-colors"
                  data-value="Build"
                  onMouseEnter={scrambleText}
                >Build</span>
                <span
                  className="hero-text text-blue-400 opacity-0 inline-block cursor-pointer hover:text-white transition-colors"
                  data-value="Healthier"
                  onMouseEnter={scrambleText}
                >Healthier</span>
                <span
                  className="hero-text opacity-0 inline-block cursor-pointer hover:text-gray-300 transition-colors"
                  data-value="Futures"
                  onMouseEnter={scrambleText}
                >Futures</span>
              </h1>

              <div className="h-px w-full bg-gradient-to-r from-transparent via-white/20 to-transparent my-8"></div>

              <div className="grid grid-cols-3 gap-4 text-gray-400 font-mono text-xs text-left">
                <div>
                  <span className="text-gray-600 block mb-1 uppercase tracking-widest">01</span>
                  Diagnosis
                </div>
                <div>
                  <span className="text-gray-600 block mb-1 uppercase tracking-widest">01</span>
                  Monitoring
                </div>
                <div>
                  <span className="text-gray-600 block mb-1 uppercase tracking-widest">03</span>
                  Telehealth
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Health Challenge Box */}
          <div ref={bottomContentRef} className="opacity-0 order-2 lg:order-2 flex flex-col justify-center items-center h-full">
            <HealthChallenge />
          </div>

        </div>

        {/* Bottom Centered Button */}
        <div className="absolute bottom-12 left-0 right-0 flex justify-center z-20">
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-between w-full max-w-md px-6 py-4 border border-white/20 hover:border-white hover:bg-white/5 transition-all group bg-black/50 backdrop-blur-md"
          >
            <span className="font-mono text-white font-bold tracking-wider">ENTER DASHBOARD</span>
            <span className="text-white group-hover:translate-x-1 transition-transform">↗</span>
          </Link>
        </div>
      </div>

      {/* Bottom right corner text */}
      <div className="absolute bottom-8 right-8 z-10 hidden md:block">
        <p className="text-[10px] text-gray-700 font-mono tracking-[0.2em]">
          /// ONE PLATFORM, ANY AI GUARDIAN
        </p>
      </div>
    </div>
  );
}
