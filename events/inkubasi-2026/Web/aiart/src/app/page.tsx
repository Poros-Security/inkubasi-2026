"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <main className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-20 pt-10 pb-24 w-full">
      <nav className="flex justify-between items-center mb-24">
        <div className="text-2xl font-black tracking-tighter leading-none">
          AI<br />ART
        </div>
        <button 
          onClick={() => router.push('/login')}
          className="px-6 py-2 rounded-full border border-gray-300 text-sm font-medium hover:bg-gray-50 transition-colors active:scale-95"
        >
          Login
        </button>
      </nav>

      {/* Hero Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        
        {/* Left Content */}
        <div className="flex flex-col items-start">
          <h1 className="text-5xl lg:text-6xl font-bold tracking-tight mb-4">
            Your AI Art,<br />
            <span className="mt-2 block">Crafted and Framed</span>
          </h1>
          <p className="text-gray-500 max-w-md mt-6 mb-10 text-sm md:text-base">
            Turn your ideas into unique AI art, crafted and framed to brighten any space.
          </p>
          
          <button 
            onClick={() => window.open('https://chat.openai.com/?model=gpt-4&q=buatkan ucapan idul fitri', '_blank')}
            className="bg-[#1f1f1f] text-white px-8 py-4 rounded-xl font-medium flex items-center gap-2 hover:bg-black transition-colors shadow-lg active:scale-95"
          >
            <span className="text-[#e2a8ff] text-xl">✨</span> Generate Now
          </button>
          
        </div>

        <div className="relative h-[600px] w-full rounded-2xl overflow-hidden shadow-2xl">
          <Image
            src="https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?auto=format&fit=crop&q=80&w=800"
            alt="Artist painting"
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>

      {/* Bottom Text Section */}
      <div className="mt-32">
        <h2 className="text-4xl lg:text-5xl font-bold tracking-tight">
          Quality.Strength.<br />
          Elegance. Perfection.
        </h2>
      </div>
    </main>
  );
}
