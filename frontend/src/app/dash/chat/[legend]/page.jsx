"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Trash2, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import axios from "axios";

const personColors = {
  oppenheimer: "border-red-100",
  "ratan-tata": "border-blue-100",
  "kalpana-chawla": "border-green-100",
  "anne-frank": "border-yellow-100",
};

const personImages = {
  oppenheimer: "/oppen.jpeg",
  "anne.frank": "/anne.jpg",
};

export default function ChatPage({ params: paramsPromise }) {
  const params = React.use(paramsPromise);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [chatHistory, setChatHistory] = useState([]);
  const [input, setInput] = useState("");
  const [isWaitingForResponse, setIsWaitingForResponse] = useState(false);
  const [isGeneratingText, setIsGeneratingText] = useState(false);
  const legend = params.legend.replace(/-/g, ".");
  const scrollAreaRef = useRef(null);
  const lastMessageRef = useRef(null);

  const handleSend = useCallback(
    async (message = input) => {
      if (message.trim() && !isWaitingForResponse) {
        const newMessage = {
          role: "user",
          prompt: message.trim(),
          character: legend,
        };
        setChatHistory((prev) => [...prev, newMessage]);
        setInput("");
        setIsWaitingForResponse(true);
        setIsGeneratingText(true);

        // Prepare the request body
        const requestBody = {
          prompt: message.trim(),
          history: chatHistory.map((msg) => ({
            prompt: msg.prompt,
            character: msg.character,
          })),
          character: legend,
        };

        try {
          // Make the API request
          const response = await axios.post(
            "http://localhost:4000/chat",
            requestBody,
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          if (response.status == 200) {
            const data = await response.data;
            const aiMessage = {
              role: "ai",
              prompt: data.response,
              character: legend,
            };
            setChatHistory((prev) => [...prev, aiMessage]);
          } else {
            console.error("Error:", response.statusText);
          }
        } catch (error) {
          console.error("Error:", error);
        } finally {
          setIsWaitingForResponse(false);
          setIsGeneratingText(false);
        }
      }
    },
    [input, legend, isWaitingForResponse, chatHistory]
  );

  const clearHistory = useCallback(() => {
    setChatHistory([]);
  }, []);

  useEffect(() => {
    const initialMessage = searchParams.get("message");
    if (initialMessage) {
      handleSend(initialMessage);
      router.replace(pathname, undefined, { shallow: true });
    }
  }, [searchParams, pathname, router, handleSend]);

  useEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatHistory]);

  return (
    <div className="flex flex-col justify-center items-center h-screen p-4 sm:p-8 font-[family-name:var(--font-geist-sans)] bg-background space-y-5">
      <Card
        className={`w-full max-w-3xl border-none ${personColors[legend]} relative rounded-2xl flex flex-col z-50 bg-card shadow-lg overflow-hidden`}
      >
        <CardContent className="flex flex-col p-4 overflow-hidden h-[80vh] md:h-[90vh] border-t">
          <div className="flex items-center mb-4">
            <Button variant="ghost" size="icon" asChild className="mr-2">
              <Link href="/dash">
                <ArrowLeft className="h-4 w-4" />
                <span className="sr-only">Back to home</span>
              </Link>
            </Button>
            <h1 className="text-2xl font-bold">
              Chat with {legend.split(".").join(" ")}
            </h1>
          </div>
          <ScrollArea
            className="h-full w-full max-w-5xl mx-auto"
            ref={scrollAreaRef}
          >
            {chatHistory.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                } mb-4`}
                ref={index === chatHistory.length - 1 ? lastMessageRef : null}
              >
                <div
                  className={`flex ${
                    message.role === "user" ? "flex-row-reverse" : "flex-row"
                  } items-start gap-2 max-w-[80%]`}
                >
                  <Avatar className="w-8 h-8">
                    <AvatarImage
                      src={
                        message.role === "user"
                          ? "/usr.jpeg"
                          : personImages[message.character]
                      }
                      className="h-full w-full object-cover"
                      alt={message.role === "user" ? "User" : message.character}
                    />
                    <AvatarFallback>
                      {message.role === "user" ? "U" : "AI"}
                    </AvatarFallback>
                  </Avatar>
                  <div
                    className={`rounded-2xl p-3 ${
                      message.role === "user"
                        ? "bg-blue-500 text-white"
                        : "bg-gray-100 text-black"
                    }`}
                  >
                    {message.prompt}
                  </div>
                </div>
              </div>
            ))}
            {isGeneratingText && (
              <div className="flex justify-start mb-4">
                <div className="flex flex-row items-start gap-2 max-w-[80%]">
                  <Avatar className="w-8 h-8">
                    <AvatarImage
                      src={personImages[legend]}
                      className="h-full w-full object-cover"
                      alt={legend}
                    />
                    <AvatarFallback>AI</AvatarFallback>
                  </Avatar>
                  <div className="rounded-2xl p-3 bg-gray-100 text-black">
                    <Loader2 className="h-6 w-6 animate-spin" />
                  </div>
                </div>
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="sticky bottom-4 flex w-full max-w-3xl items-center space-x-2 bg-card z-[99999999]"
      >
        <Input
          type="text"
          placeholder={`Chat with ${legend.split(".").join(" ")}...`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-grow rounded-xl py-6"
          disabled={isWaitingForResponse}
        />
        <Button
          type="submit"
          size="icon"
          className="rounded-xl"
          disabled={isWaitingForResponse || !input.trim()}
        >
          {isWaitingForResponse ? (
            <Loader2 className="h-6 w-6 animate-spin" />
          ) : (
            <Send className="size-6" />
          )}
          <span className="sr-only">Send</span>
        </Button>
        <Button
          type="button"
          size="icon"
          variant="outline"
          onClick={clearHistory}
          disabled={!chatHistory.length}
          className="rounded-xl"
        >
          <Trash2 className="size-6" />
          <span className="sr-only">Clear History</span>
        </Button>
      </form>
    </div>
  );
}
