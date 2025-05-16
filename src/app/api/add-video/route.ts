import { NextResponse } from "next/server";
import { env } from "~/env";
import type { Video, ApiResponse } from "~/types/api";

export async function POST(req: Request) {
  try {
    const { videoUrl } = await req.json();

    if (!videoUrl) {
      return NextResponse.json({ message: "Video URL is required" }, { status: 400 });
    }

    const response = await fetch(`${env.API_URL}/api/add-video`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ videoUrl }),
    });

    const data = await response.json() as ApiResponse<Video[]>;

    if (!response.ok) {
      console.error("Error adding video:", data.message);
      return NextResponse.json({message: data.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }

}