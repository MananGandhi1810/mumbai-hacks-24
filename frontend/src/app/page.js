import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col md:flex-row justify-center md:justify-around items-center h-screen p-4 sm:p-8 font-[family-name:var(--font-geist-sans)] bg-background">
      <div className="flex flex-col md:justify-center md:items-start p-8 space-y-6">
        <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold">
          Welcome to Sagas
        </h1>
        <p className="md:text-lg text-muted-foreground max-w-md">
          Sagas is a platform for learning about historic figures and their
          stories. Explore the world of legends and discover the fascinating
          tales of the past!
        </p>
        <a href="/dash">
          <Button className="rounded-xl">Explore Sagas</Button>
        </a>
      </div>
      <img
        src="/greek.png"
        className="w-1/2 md:w-1/3 opacity-50 order-first md:order-last"
        alt="Greek Legends"
      />
    </div>
  );
}
