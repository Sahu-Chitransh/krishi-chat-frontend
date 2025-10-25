import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { UploadCloud, Loader2 } from "lucide-react";

const Classify = () => {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
      setResult(null); // Clear previous result
    }
  };

  const handleClassify = () => {
    if (!file) return;
    setIsLoading(true);
    setResult(null);

    // Simulate API call
    setTimeout(() => {
      // In a real app, you would send 'file' to your backend API
      // and get a real classification.
      setResult("Simulated Result: Powdery Mildew detected on the crop leaf.");
      setIsLoading(false);
    }, 2000);
  };

  return (
    // This container centers the card in the available space
    <div className="flex-1 flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-lg bg-card/80 backdrop-blur-md">
        <CardHeader>
          <CardTitle>Crop Disease Classification</CardTitle>
          <CardDescription>
            Upload an image of a crop leaf to identify diseases.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <label htmlFor="file-upload" className="text-sm font-medium">Choose a file</label>
          <Input
            id="file-upload"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="mt-1 file:text-foreground"
          />

          {file && (
            <p className="text-sm text-muted-foreground mt-2">
              Selected: {file.name}
            </p>
          )}

          <Button onClick={handleClassify} disabled={!file || isLoading} className="mt-4 w-full">
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <UploadCloud className="w-4 h-4 mr-2" />
            )}
            {isLoading ? "Analyzing..." : "Classify Image"}
          </Button>

          {result && (
            <div className="mt-6 p-4 rounded-md bg-secondary">
              <p className="font-semibold text-secondary-foreground">Classification Result:</p>
              <p className="text-secondary-foreground">{result}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Classify;