// src/components/WelcomeScreen.tsx

interface WelcomeScreenProps {
  onSuggestionClick: (suggestion: string) => void;
}

const suggestions = [
  {
    title: "Crop recommendations",
    subtitle: "Get suggestions for best crops based on soil and season",
  },
  {
    title: "Pest identification",
    subtitle: "Upload photos to identify pests and diseases",
  },
  {
    title: "Weather insights",
    subtitle: "Get farming advice based on weather conditions",
  },
  {
    title: "Market prices",
    subtitle: "Check current crop prices and market trends",
  },
];

const WelcomeScreen = ({ onSuggestionClick }: WelcomeScreenProps) => {
  return (
    <div className="max-w-3xl w-full">
      <div className="text-center mb-12 animate-fade-in">
        <h1 className="text-4xl md:text-5xl font-light mb-2">
          <span className="text-foreground">Namaste, </span>
          <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent font-medium">
            Farmer
          </span>
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground font-light">
          How can I help you today?
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-slide-up">
        {suggestions.map((suggestion, index) => (
          <button
            key={index}
            onClick={() => onSuggestionClick(suggestion.title)}
            className="text-left p-5 rounded-lg
                       bg-card/80 backdrop-blur-md border border-white/20
                       hover:bg-card/90 transition-all duration-300"
          >
            <h3 className="font-semibold text-foreground mb-1">
              {suggestion.title}
            </h3>
            <p className="text-sm text-muted-foreground">
              {suggestion.subtitle}
            </p> {/* <-- This is the corrected line */}
          </button>
        ))}
      </div>
    </div>
  );
};

export default WelcomeScreen;