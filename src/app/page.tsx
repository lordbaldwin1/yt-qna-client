"use client";
import { useState } from "react";
import type { Video, ApiResponse } from "~/types/api";
export default function HomePage() {
  const [videoUrl, setVideoUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [videoData, setVideoData] = useState<Video | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/add-video", {
        method: "POST",
        body: JSON.stringify({ videoUrl }),
      });

    const data = await response.json() as ApiResponse<Video>;

    if (!response.ok) {
      setError(data.message || "An error occurred");
      return;
    }

      setVideoData(data.data || null);
      setIsLoading(false);
    } catch (error) {
      setError(error as string);
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <h1>YT QnA</h1>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          placeholder="Enter a YouTube video URL"
        />
        <button type="submit">Submit</button>
      </form>
      {videoData && (
        <div>
          <h2>Video Data</h2>
          <p>{videoData.id}</p>
          <p>{videoData.title}</p>
          <iframe src={videoData.embedUrl} />
        </div>
      )}
    </div>
  );
}
