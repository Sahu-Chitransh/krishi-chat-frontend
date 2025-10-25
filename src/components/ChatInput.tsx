import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Loader2, Mic } from "lucide-react"; // Import Mic icon
import { cn } from "@/lib/utils"; // Import 'cn' for conditional classes

// Check for the browser's Speech Recognition API
const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

const ChatInput = ({ onSendMessage, isLoading }: ChatInputProps) => {
  const [text, setText] = useState("");
  // (NEW) State for voice input
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const startText = useRef(""); // To store text before listening

  // (NEW) Effect to set up the speech recognition
  useEffect(() => {
    if (SpeechRecognition) {
      setIsSupported(true);
      const recognition = new SpeechRecognition();
      recognition.continuous = false; // Stop after one phrase
      recognition.interimResults = true; // Show results as they come
      recognition.lang = "en-US"; // You can set this to your user's language

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false);
      };

      // This is where the magic happens
      recognition.onresult = (event) => {
        let interimTranscript = "";
        let finalTranscript = "";

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        // Update the text area with the original text + new spoken text
        setText(startText.current + finalTranscript + interimTranscript);
      };

      recognitionRef.current = recognition;
    }
  }, []); // Run once on component mount

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim() && !isLoading) {
      onSendMessage(text);
      setText("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as React.FormEvent);
    }
  };

  // (NEW) Function to start/stop listening
  const handleMicToggle = () => {
    if (!recognitionRef.current || isLoading) return;

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      // Save the current text, add a space if needed
      const currentText = text.trim();
      startText.current = currentText.length > 0 ? currentText + " " : "";

      setText(startText.current); // Update text to show the space
      recognitionRef.current.start();
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-start gap-2 p-2 rounded-2xl border border-white/20
                 bg-card/80 backdrop-blur-md shadow-lg"
    >
      <Textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Enter a prompt here..."
        className="flex-1 bg-transparent border-none resize-none
                   focus-visible:ring-0 shadow-none text-base
                   text-foreground placeholder:text-muted-foreground"
        rows={1}
        // (CHANGED) Disable textarea while loading or listening
        disabled={isLoading || isListening}
      />

      {/* (NEW) Microphone Button */}
      {isSupported && (
        <Button
          type="button" // Important: not 'submit'
          size="icon"
          variant="ghost" // Use 'ghost' for a minimal look
          onClick={handleMicToggle}
          disabled={isLoading} // Disable if AI is processing
          aria-label={isListening ? "Stop listening" : "Start listening"}
          className={cn(
            "rounded-full flex-shrink-0",
            // (CHANGED) Use 'text-destructive' for a red "recording" effect
            isListening && "text-destructive animate-pulse"
          )}
        >
          <Mic className="w-5 h-5" />
        </Button>
      )}

      {/* Send Button */}
      <Button
        type="submit"
        size="icon"
        className="rounded-full flex-shrink-0 bg-primary text-primary-foreground
                   hover:bg-primary/90"
        // (CHANGED) Disable send button if loading or listening
        disabled={!text.trim() || isLoading || isListening}
      >
        {isLoading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <Send className="w-5 h-5" />
        )}
      </Button>
    </form>
  );
};

export default ChatInput;