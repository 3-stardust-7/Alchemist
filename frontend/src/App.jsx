export default function App() {
  return (
    <main className="min-h-screen bg-[#0a1628] font-sans">
      {/* ── HERO SECTION ── */}
      <section id="home" className="relative w-full min-h-screen overflow-hidden">
  
        {/* Blue gradient overlay — matches Figma teal/navy blend */}
        <div className="absolute inset-0 bg-gradient-to-r min-h-screen from-[#0d2250]/90 via-[#0e4a6e]/90 to-[#0a7a9a]/80" />

        {/* Extra depth layer */}
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/50 to-gray-500/30" />

        {/* Hero Content */}
        <div className="relative z-10 flex flex-col justify-center min-h-screen px-8 md:px-16 lg:px-24 pt-[100px]">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-tight mb-6">
              MEC
              <br />
              Association for
              <br />
              Computer Science
              <br />
              Students
            </h1>
            <p className="text-gray-300 text-base md:text-lg max-w-xl leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}