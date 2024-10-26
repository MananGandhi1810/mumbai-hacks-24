import Link from "next/link";

export default function Navigation({ legendName }) {
  return (
    <header className="fixed top-0 flex h-12  items-center justify-between gap-4  bg-card px-8 md:px-10 z-[9999999] w-full rounded-2xl">
      <Link
        className="[text-wrap:balance] text-2xl  font-bold animate-in fade-in-50 duration-300 hover:underline decoration"
        href="/"
      >
        <span className="text-primary">SA</span>GAS
      </Link>
      {legendName && (
        <p className="text-sm sm:text-base font-medium truncate max-w-[150px] sm:max-w-none text-primary-foreground">
          {legendName}
        </p>
      )}
      <p className="font-[300] text-muted-foreground [text-wrap:balance] md:-mt-2 tracking-wider text-xs">
        Discover History&apos;s Legends
      </p>
    </header>
  );
}
