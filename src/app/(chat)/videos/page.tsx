import Link from "next/link";
import type { Video, ApiResponse } from "~/types/api";


export default async function VideoPage() {
  const videos = await getVideos();

  if (!videos) {
    return <div>Error fetching videos</div>;
  }

  //console.log(videos);

  return (
    <div>
      <h1>Videos</h1>
      <ul>
        {videos.map((video) => (
          <li key={video.id}>
            <Link href={`/video/${video.id}`}>{video.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

async function getVideos(): Promise<Video[] | null> {
  try {
    const response = await fetch(`${process.env.API_URL}/api/list-videos`);

    if (!response.ok) {
      console.error(response.statusText);
      return null;
    }

    const apiResponse = await response.json() as ApiResponse<Video[]>;
    const videos = apiResponse.data;

    if (!videos) {
      console.error(apiResponse.message);
      return null;
    }

    return videos;
  } catch (error) {
    console.error(error);
    return [];
  }
}
