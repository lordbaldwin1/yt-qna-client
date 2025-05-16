import type { ApiResponse, Video } from "~/types/api";
import { WebSocketClient } from "~/app/components/web-socket-client";

export default async function VideoPage({ params }: { params: Promise<{ videoId: string }> }) {
  const { videoId } = await params;
  const urlDecodedVideoId = decodeURIComponent(videoId);

  const video = await getVideo(urlDecodedVideoId);

  if (!video) {
    return <div>Error fetching video</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Video: {video.title}</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="aspect-video mb-4">
            <iframe 
              src={video.embedUrl} 
              className="w-full h-full rounded-lg" 
              allowFullScreen 
            />
          </div>
          
          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-2">Description</h2>
            <p className="text-gray-700 whitespace-pre-wrap">{video.description}</p>
          </div>
        </div>
        
        <div className="lg:col-span-1">
          <WebSocketClient videoId={videoId} />
        </div>
      </div>
    </div>
  );
}

async function getVideo(videoId: string): Promise<Video | null> {
  try {
    const response = await fetch(`${process.env.API_URL}/api/get-video/${videoId}`);

    if (!response.ok) {
      console.error(`Failed to fetch video: ${response.status} ${response.statusText}`);
      return null;
    }
    
    const apiResponse = await response.json() as ApiResponse<Video>;
    const videoDetails = apiResponse.data;

    if (!videoDetails) {
      console.error(apiResponse.message || "No video details returned");
      return null;
    }

    return videoDetails;
  } catch (error) {
    console.error("Error fetching video:", error);
    return null;
  }
}

