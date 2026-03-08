'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const values = [
  {
    id: 1,
    title: "Performance-Focused",
    description: "We don't just train; we engineer performance. Every workout is data-backed and results-oriented."
  },
  {
    id: 2,
    title: "Tech-Savvy",
    description: "Integration of cutting-edge biomechanics tracking and AI-driven insights for every member."
  },
  {
    id: 3,
    title: "Community-Driven",
    description: "A tribe of like-minded athletes pushing boundaries together. Your growth is our collective success."
  },
  {
    id: 4,
    title: "Athlete-Centric",
    description: "Everything we do puts the athlete first. From recovery suites to nutrition planning."
  }
];

// Staggered images that traverse the screen at specifically defined scroll intervals
const floatingImages = [
  // Phase 1 (0.0 - 0.3)
  { src: "/demo-images/heavy-zone.jpg", x: "-40%", yStart: "100vh", yEnd: "-100vh", range: [0, 0.35], scale: 0.8, zIndex: -1 },
  { src: "/demo-images/cardio.jpg", x: "40%", yStart: "120vh", yEnd: "-120vh", range: [0, 0.4], scale: 0.9, zIndex: -1 },

  // Phase 2 (0.3 - 0.6)
  { src: "/demo-images/coaching.jpg", x: "-30%", yStart: "100vh", yEnd: "-100vh", range: [0.25, 0.6], scale: 0.7, zIndex: -2 },
  { src: "/demo-images/recovery.jpg", x: "35%", yStart: "120vh", yEnd: "-120vh", range: [0.3, 0.65], scale: 0.8, zIndex: -2 },

  // Phase 3 (0.6 - 1.0)
  { src: "/demo-images/studio.jpg", x: "-50%", yStart: "100vh", yEnd: "-100vh", range: [0.55, 0.9], scale: 0.6, zIndex: -3 },
  { src: "/demo-images/analytics.jpg", x: "50%", yStart: "120vh", yEnd: "-120vh", range: [0.6, 1.0], scale: 0.7, zIndex: -3 },
];

export default function AboutScrollSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end']
  });

  return (
    <section ref={containerRef} className="relative h-[400vh] bg-slate-950 overflow-hidden">
      <div className="sticky top-0 h-screen flex flex-col justify-center items-center overflow-hidden">

        {/* Floating Images Background */}
        <div className="absolute inset-0 w-full h-full pointer-events-none">
          {floatingImages.map((img, i) => (
            <ParallaxImage key={i} img={img} progress={scrollYProgress} />
          ))}
        </div>

        {/* Decorative Background Elements */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-slate-950 -z-10" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60rem] h-[60rem] bg-neon/5 rounded-full blur-3xl -z-10" />

        <div className="relative z-10 text-center px-4 max-w-7xl mx-auto w-full">
          <div className="inline-block bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full text-sm font-semibold text-neon mb-16 border border-white/5">
            🚀 Our Values
          </div>

          <div className="relative h-[25rem] w-full flex items-center justify-center">
            {values.map((item, index) => {
              const step = 0.25; // Fixed step/duration for each item
              const start = index * 0.22; // Slight overlap
              const end = start + step;

              return (
                <ValueItem
                  key={item.id}
                  item={item}
                  progress={scrollYProgress}
                  range={[start, end]}
                />
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function ParallaxImage({ img, progress }: { img: any, progress: any }) {
  // Only animate (and be visible) during its specific range
  const [start, end] = img.range;

  const y = useTransform(progress, [start, end], [img.yStart, img.yEnd]);
  const opacity = useTransform(progress, [start, start + 0.05, end - 0.05, end], [0, 1, 1, 0]);

  return (
    <motion.div
      style={{ x: img.x, y, opacity, zIndex: img.zIndex || 0, scale: img.scale }}
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-[28rem] md:w-96 md:h-[32rem] rounded-2xl overflow-hidden grayscale hover:grayscale-0 transition-all duration-700 blur-[1px] hover:blur-none"
    >
      <img src={img.src} alt="Floating" className="w-full h-full object-cover" />
    </motion.div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function ValueItem({ item, progress, range }: { item: any, progress: any, range: [number, number] }) {
  const [start, end] = range;
  const duration = end - start;
  const peakStart = start + (duration * 0.2);
  const peakEnd = end - (duration * 0.2);

  // Fade in quickly, stay, fade out
  const opacity = useTransform(progress,
    [start, peakStart, peakEnd, end],
    [0, 1, 1, 0]
  );

  // Slide up continuously
  const y = useTransform(progress,
    [start, end],
    [100, -100]
  );

  // Scale up slightly as it centers, then down
  const scale = useTransform(progress,
    [start, peakStart, peakEnd, end],
    [0.8, 1, 1, 0.8]
  );

  return (
    <motion.div
      style={{ opacity, y, scale }}
      className="absolute inset-0 flex flex-col items-center justify-center px-4"
    >
      <h2 className="text-6xl md:text-9xl font-black text-white tracking-tighter mb-8 leading-none drop-shadow-2xl">
        {item.title}
      </h2>
      <p className="text-xl md:text-3xl text-slate-300 max-w-4xl mx-auto leading-relaxed font-medium">
        {item.description}
      </p>
    </motion.div>
  )
}
