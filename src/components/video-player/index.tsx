import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { useOptions } from "../../hooks/options-context";

export default function VideoPlayer() {
  const params = useParams();
  const { options, setOptions } = useOptions();
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [videoStarted, setVideoStarted] = useState(false);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const resizeTimeoutRef = useRef<number | null>(null);

  const { filename } = params;
  const { watchedVideos, volume } = options;

  useEffect(() => {
    const onResize = () => {
      if (typeof resizeTimeoutRef.current === "number") {
        clearTimeout(resizeTimeoutRef.current);
      }

      resizeTimeoutRef.current = setTimeout(() => {
        if (
          containerRef.current?.offsetWidth &&
          containerRef.current?.offsetHeight &&
          videoRef.current?.videoHeight &&
          videoRef.current?.videoWidth
        ) {
          const aspectRatio =
            videoRef.current?.videoWidth / videoRef.current?.videoHeight;

          const width1 = containerRef.current.offsetWidth;
          const height1 = width1 / aspectRatio;

          const height2 = containerRef.current.offsetHeight;
          const width2 = aspectRatio * height2;

          setDimensions({
            width: Math.min(width1, width2),
            height: Math.min(height1, height2),
          });
        }
      }, 200);
    };

    window.addEventListener("resize", onResize);

    const onKeyPress = (e: KeyboardEvent) => {
      if (e.key === " " || e.key === "k") {
        if (videoRef.current?.paused) {
          videoRef.current?.play();
        } else {
          videoRef.current?.pause();
        }
      }
    };
    window.addEventListener("keypress", onKeyPress);

    onResize();

    return () => {
      if (typeof resizeTimeoutRef.current === "number") {
        clearTimeout(resizeTimeoutRef.current);
      }

      window.removeEventListener("resize", onResize);
      window.removeEventListener("keypress", onKeyPress);
    };
  }, []);

  return (
    <div
      className="relative flex h-screen w-screen items-center justify-center bg-gray-800"
      ref={containerRef}
    >
      {!filename && (
        <div>
          Video not found. <Link to="/">Go back to video list</Link>
        </div>
      )}
      {filename && (
        <video
          src={`/media/${encodeURIComponent(filename)}`}
          ref={videoRef}
          onPlay={() => {
            const tempWatchedVideos = new Set(watchedVideos);
            tempWatchedVideos.add(filename);
            setOptions({ watchedVideos: [...tempWatchedVideos] });
            setVideoStarted(true);
          }}
          onVolumeChange={(e) => {
            setOptions({ volume: e.currentTarget.volume });
          }}
          onLoadedData={(e) => {
            if (videoRef.current) {
              videoRef.current.volume = volume;
            }
          }}
          controls
          width={dimensions.width || 100}
          height={dimensions.height || 100}
        />
      )}
      <div
        className={`absolute top-0 left-0 border border-gray-900 bg-white p-3 transition-opacity hover:opacity-100 ${
          videoStarted ? "opacity-0" : ""
        }`}
      >
        <Link to="/">Back to Video List</Link>
        <p>You can press Space to pause or unpause the video.</p>
      </div>
    </div>
  );
}
