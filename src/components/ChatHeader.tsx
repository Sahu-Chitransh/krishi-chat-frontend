import { Sprout } from "lucide-react";

const ChatHeader = () => {
  return (
    <header className="bg-card/80 backdrop-blur-md border-b border-border shadow-sm">
      <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-3">
        <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-full shadow-md">
          <Sprout className="w-5 h-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-lg font-semibold text-foreground">Krishi Mitra</h1>
          <p className="text-xs text-muted-foreground">Your Agricultural Assistant</p>
        </div>
      </div>
    </header>
  );
};

export default ChatHeader;
