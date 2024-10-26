"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ComboboxDemo } from "@/components/ui/combobox";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Loader2, Send } from "lucide-react";

const legends = [
  { value: "oppenheimer", label: "Oppenheimer" },
  { value: "anne-frank", label: "Anne Frank" },
];

export default function Component() {
  const [selectedLegend, setSelectedLegend] = useState("");
  const [input, setInput] = useState("");
  const [bttnclk, setBttnclk] = useState(false);
  const router = useRouter();

  const handleSend = () => {
    if (selectedLegend && input.trim()) {
      setBttnclk(true);
      // Simulate a delay before navigation
      setTimeout(() => {
        router.push(
          `/dash/chat/${selectedLegend}?message=${encodeURIComponent(
            input.trim()
          )}`
        );
      }, 1000);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen p-4 sm:p-8 font-[family-name:var(--font-geist-sans)] bg-background">
      <Card className="w-full max-w-3xl border border-foreground relative rounded-2xl flex flex-col z-50 bg-card shadow-lg overflow-hidden">
        <CardContent className="flex flex-col justify-center items-center p-8 space-y-6">
          <h1 className="text-3xl font-bold text-center">Chat with Legends</h1>
          <p className="text-center text-sm text-muted-foreground max-w-md">
            Select a legend and start a conversation with historical figures
            from the internet era
          </p>
          <ComboboxDemo
            legends={legends}
            onSelect={(value) => setSelectedLegend(value)}
          />
        </CardContent>
        <CardFooter className="border-t p-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex w-full items-center space-x-2"
          >
            <Input
              type="text"
              placeholder={
                selectedLegend
                  ? `Ask ${selectedLegend.split("-").join(" ")} a question...`
                  : "Select a legend to start chatting"
              }
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-grow rounded-xl py-7"
              disabled={!selectedLegend || bttnclk}
            />
            <Button
              type="submit"
              disabled={!selectedLegend || !input.trim() || bttnclk}
              onClick={handleSend}
              className="rounded-xl transition-all duration-200 ease-in-out"
            >
              {bttnclk ? (
                <Loader2 className="size-7 mr-2 animate-spin" />
              ) : (
                <Send className="size-7 mr-2" />
              )}
              {bttnclk ? "Starting..." : "Start Chat"}
            </Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  );
}
