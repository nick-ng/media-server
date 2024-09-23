import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { useOptions } from "../../hooks/options-context";

const formatSeconds = (seconds: number): string => {
  let remainingSeconds = seconds;

  const hours = Math.floor(remainingSeconds / (60 * 60));
  remainingSeconds = remainingSeconds % (60 * 60);
  const minutes = Math.floor(remainingSeconds / 60);
  remainingSeconds = remainingSeconds % 60;
  const secondsOnly = Math.floor(remainingSeconds + 0.5);

  return `${hours}:${minutes.toString().padStart(2, "0")}:${secondsOnly
    .toString()
    .padStart(2, "0")}`;
};

export default function VideoPlayer() {
  const params = useParams();
  const { options, setOptions } = useOptions();
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [videoStarted, setVideoStarted] = useState(false);
  const [timingString, setTimingString] = useState("");

  const containerRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const leftControlsRef = useRef<HTMLDivElement | null>(null);
  const resizeTimeoutRef = useRef<number | null>(null);
  const videoPropertiesRef = useRef<{ seeking: boolean }>({ seeking: false });

  const onResize = useCallback(() => {
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

        const controlsWidth = leftControlsRef.current?.offsetWidth || 50;

        const width = Math.min(width1, width2) - controlsWidth * 2;

        console.log("width", width);

        setDimensions({
          width,
          height: Math.min(height1, height2),
        });
      }
    }, 200);
  }, [setDimensions]);

  const onSeek = useCallback((seconds: number) => {
    if (!videoRef.current) {
      return;
    }

    if (videoPropertiesRef.current.seeking) {
      return;
    }

    const newTime = videoRef.current.currentTime + seconds;

    videoRef.current.currentTime = newTime;
  }, []);

  const { filename } = params;
  const { watchedVideos, volume } = options;

  useEffect(() => {
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

    videoRef.current?.addEventListener("seeking", () => {
      videoPropertiesRef.current.seeking = true;
    });

    videoRef.current?.addEventListener("seeked", () => {
      videoPropertiesRef.current.seeking = false;
    });

    onResize();

    const timerInterval = setInterval(() => {
      if (!videoRef.current) {
        return;
      }

      setTimingString(
        `${formatSeconds(videoRef.current.currentTime)} / ${formatSeconds(
          videoRef.current.duration
        )}`
      );
    }, 333);

    return () => {
      if (typeof resizeTimeoutRef.current === "number") {
        clearTimeout(resizeTimeoutRef.current);
      }

      window.removeEventListener("resize", onResize);
      window.removeEventListener("keypress", onKeyPress);

      clearInterval(timerInterval);
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
      <div className="flex flex-col justify-center" ref={leftControlsRef}>
        <button
          className="border border-white px-2 py-4 text-white"
          onClick={() => {
            onSeek(-1);
          }}
        >
          1s
        </button>
        <button
          className="border border-white px-2 py-4 text-white"
          onClick={() => {
            onSeek(-10);
          }}
        >
          10s
        </button>
        <button
          className="border border-white px-2 py-4 text-white"
          onClick={() => {
            onSeek(-60);
          }}
        >
          1m
        </button>
        <button
          className="border border-white px-2 py-4 text-white"
          onClick={() => {
            onSeek(-300);
          }}
        >
          5m
        </button>
      </div>
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
          onLoadedData={(_e) => {
            if (videoRef.current) {
              videoRef.current.volume = volume;
              onResize();
            }
          }}
          controls
          width={dimensions.width || 100}
          height={dimensions.height || 100}
        />
      )}
      <div className="flex flex-col justify-center">
        <button
          className="border border-white px-2 py-4 text-white"
          onClick={() => {
            onSeek(1);
          }}
        >
          1s
        </button>
        <button
          className="border border-white px-2 py-4 text-white"
          onClick={() => {
            onSeek(10);
          }}
        >
          10s
        </button>
        <button
          className="border border-white px-2 py-4 text-white"
          onClick={() => {
            onSeek(60);
          }}
        >
          1m
        </button>
        <button
          className="border border-white px-2 py-4 text-white"
          onClick={() => {
            onSeek(300);
          }}
        >
          5m
        </button>
      </div>
      <div
        className={`absolute top-0 left-0 border border-gray-900 bg-white p-3 transition-opacity hover:opacity-100 ${
          videoStarted ? "opacity-0" : ""
        }`}
      >
        <Link to="/">Back to Video List</Link>
        <p>You can press Space to pause or unpause the video.</p>
      </div>
      <div className="absolute bottom-0 left-0 right-0 m-auto text-center text-white">
        {timingString}
      </div>
    </div>
  );
}
