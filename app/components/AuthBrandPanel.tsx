import Image from 'next/image';

export default function AuthBrandPanel() {
  return (
    <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center bg-page">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a0008] via-base to-[#120008]" />

      {/* Subtle accent glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-accent/5 blur-[120px]" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-12">
        <div className="w-24 h-24 relative mb-8">
          <Image
            src="/icon/adaptive-icon.png"
            alt="VibeWatch Logo"
            width={96}
            height={96}
            className="object-contain drop-shadow-lg"
            priority
          />
        </div>
        <h1 className="text-4xl font-bold text-primary tracking-tight mb-3">
          VibeWatch
        </h1>
        <p className="text-secondary text-lg max-w-xs leading-relaxed">
          Track your entertainment vibe. Discover, rate, and share your favorite movies and shows.
        </p>

        {/* Decorative dots */}
        <div className="flex gap-2 mt-10">
          <span className="w-2 h-2 rounded-full bg-accent/40" />
          <span className="w-2 h-2 rounded-full bg-accent/20" />
          <span className="w-2 h-2 rounded-full bg-accent/10" />
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-base to-transparent" />
    </div>
  );
}
