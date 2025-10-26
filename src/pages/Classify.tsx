import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { UploadCloud, Loader2 } from "lucide-react";

const Classify = () => {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<{ class: string, confidence: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
      setResult(null);
      setError(null);
    }
  };

  const handleClassify = async () => {
    if (!file) return;
    setIsLoading(true);
    setResult(null);
    setError(null);

    const formData = new FormData();
    formData.append('image', file);

    const apiUrl = import.meta.env.VITE_API_URL + "/classify";

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to classify");
      }

      setResult({
        class: data.predicted_class,
        confidence: data.confidence
      });

    } catch (err: any) {
      console.error("Classification error:", err);
      setError(err.message || "An unknown error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
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
            // This </p> tag was </Fp> before, which was a typo
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
              <p className="text-lg text-primary font-bold">{result.class}</p>
              <p className="text-sm text-muted-foreground">Confidence: {result.confidence}</p>
            </div>
          )}

          {error && (
            <div className="mt-6 p-4 rounded-md bg-destructive/20">
              <p className="font-semibold text-destructive">Error:</p>
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Classify;