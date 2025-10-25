import { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
// CHANGED: We now need 'Pause' instead of 'Loader2'
import { Volume2, Pause } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  message: string;
  isUser: boolean;
  timestamp: string;
}

const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
};

const cleanTextForSpeech = (text: string) => {
  const emojiRegex = /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F900}-\u{1F9FF}]/gu;
  const markdownRegex = /[\\*\_~#`]/g;

  return text
    .replace(emojiRegex, '')
    .replace(markdownRegex, '')
    .replace(/\s+/g, ' ')
    .trim();
};

const ChatMessage = ({ message, isUser, timestamp }: Message) => {
  // isSpeaking now means "this message is actively playing or loading"
  const [isSpeaking, setIsSpeaking] = useState(false);

  const avatarName = isUser ? "You" : "Krishi Mitra";
  const avatarInitials = getInitials(avatarName);

  // (CHANGED) Updated logic for Play/Pause/Resume
  const handleSpeak = () => {
    // Check if speech is supported
    if (!('speechSynthesis' in window)) {
      return;
    }

    // 1. This component is actively speaking -> PAUSE
    if (isSpeaking && !speechSynthesis.paused) {
      speechSynthesis.pause();
      setIsSpeaking(false);
      return;
    }

    // 2. Speech is paused -> RESUME
    if (speechSynthesis.paused) {
      speechSynthesis.resume();
      setIsSpeaking(true); // Mark this component as active
      return;
    }

    // 3. This is a new play request
    window.speechSynthesis.cancel(); // Stop anything else

    const cleanMessage = cleanTextForSpeech(message);
    const utterance = new SpeechSynthesisUtterance(cleanMessage);

    // Set handlers to toggle state
    utterance.onstart = () => {
      setIsSpeaking(true);
    };
    // onend fires for both 'finish' and 'cancel'
    utterance.onend = () => {
      setIsSpeaking(false);
    };
    utterance.onerror = () => {
      setIsSpeaking(false);
      console.error("Speech synthesis error");
    };

    window.speechSynthesis.speak(utterance);
  };

  return (
    <div
      className={cn(
        "flex items-start gap-3 my-4",
        isUser && "justify-end"
      )}
    >
      {/* Avatar for Bot */}
      {!isUser && (
        <Avatar className="w-8 h-8 border flex-shrink-0">
          <AvatarFallback className="bg-chat-bot text-chat-bot-foreground text-xs">
            {avatarInitials}
          </AvatarFallback>
        </Avatar>
      )}

      {/* Message Bubble */}
      <div
        className={cn(
          "max-w-[70%] p-3 rounded-lg",
          "backdrop-blur-md border border-white/20",
          isUser
            ? "bg-chat-user text-chat-user-foreground"
            : "bg-chat-bot text-chat-bot-foreground"
        )}
      >
        <p className="text-sm whitespace-pre-wrap">{message}</p>

        <div className="flex items-center justify-end gap-2 mt-1">
          <p
            className={cn(
              "text-xs",
              isUser
                ? "text-muted-foreground"
                : "text-chat-bot-foreground/70" // <-- This is the correct line
            )}
          >
            {timestamp}
          </p>

          <Button
            variant="ghost"
            size="icon"
            onClick={handleSpeak}
            // (CHANGED) No longer disabled
            aria-label={isSpeaking ? "Pause message" : "Listen to message"}
            className={cn(
              "w-6 h-6 rounded-full",
              isUser
                ? "text-muted-foreground hover:bg-black/10 hover:text-foreground"
                : "text-chat-bot-foreground/70 hover:bg-white/20 hover:text-chat-bot-foreground"
            )}
          >
            {/* (CHANGED) Toggle between Pause and Volume icon */}
            {isSpeaking ? (
              <Pause className="w-4 h-4" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Avatar for User */}
      {isUser && (
        <Avatar className="w-8 h-8 border flex-shrink-0">
          <AvatarFallback className="bg-chat-user text-chat-user-foreground text-xs">
            {avatarInitials}
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
};

export default ChatMessage;