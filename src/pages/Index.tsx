// src/pages/Index.tsx
import { useState, useEffect } from "react"; // (CHANGED) Import useEffect
import ChatMessage from "@/components/ChatMessage";
import ChatInput from "@/components/ChatInput";
import WelcomeScreen from "@/components/WelcomeScreen";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: string;
}

// (NEW) Define a type for our location state
interface Geolocation {
  lat: number;
  lon: number;
}

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  // (NEW) State to store the user's location
  const [location, setLocation] = useState<Geolocation | null>(null);

  // (NEW) This hook runs once when the component loads
  useEffect(() => {
    // Check if the browser supports geolocation
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // On success, update our state
          setLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          });
          console.log("Geolocation acquired:", position.coords);
        },
        (error) => {
          // Handle errors (e.g., user denied permission)
          console.error("Error getting geolocation:", error.message);
        }
      );
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  }, []); // The empty array ensures this runs only once

  const handleSendMessage = async (text: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      isUser: true,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, newMessage]);
    setIsLoading(true);

    try {
      const apiUrl = import.meta.env.VITE_API_URL + "/chat";
const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // (CHANGED) Send both the message AND the location
        body: JSON.stringify({
          message: text,
          location: location // This will be null if not acquired
        }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: data.reply,
        isUser: false,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, botResponse]);

    } catch (error) {
      console.error("Failed to fetch from backend:", error);
      const errorResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: "Sorry, I couldn't connect to the server. Please try again.",
        isUser: false,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {messages.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center p-4">
          <WelcomeScreen onSuggestionClick={handleSendMessage} />
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto px-4 py-6">
            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                message={message.text}
                isUser={message.isUser}
                timestamp={message.timestamp}
              />
            ))}
          </div>
        </div>
      )}

      <div className="w-full max-w-3xl mx-auto px-4 pb-4">
        <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default Index;