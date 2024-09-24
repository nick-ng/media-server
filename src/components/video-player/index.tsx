import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { useOptions } from "../../hooks/options-context";

import LeftControls from "./left-controls";
import RightControls from "./right-controls";

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
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(1);
  const [isVerticalLayout, setIsVerticalLayout] = useState(false);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const leftControlsRef = useRef<HTMLDivElement | null>(null);
  const bottomControlsRef = useRef<HTMLDivElement | null>(null);
  const volumeControlRef = useRef<HTMLInputElement | null>(null);
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
        const verticalLayout = window.innerHeight > window.innerWidth;

        const aspectRatio =
          (videoRef.current?.videoWidth || 1) /
          (videoRef.current?.videoHeight || 1);

        const controlsWidth = leftControlsRef.current?.offsetWidth || 50;
        const volumeControlWidth = volumeControlRef.current?.offsetWidth || 50;
        const progressControlsHeight =
          bottomControlsRef.current?.offsetHeight || 20;

        let width1 = window.innerWidth - controlsWidth * 2 + volumeControlWidth;
        let height2 = window.innerHeight - progressControlsHeight;

        if (verticalLayout) {
          width1 = window.innerWidth;
        }

        const height1 = width1 / aspectRatio;
        const width2 = aspectRatio * height2;

        const width = Math.min(width1, width2);
        const height = Math.min(height1, height2);

        setDimensions({
          width,
          height,
        });
        setIsVerticalLayout(verticalLayout);
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

      setCurrentTime(videoRef.current.currentTime);
      setDuration(videoRef.current.duration);
      setVideoStarted(!videoRef.current.paused);
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
    <div className="h-screen w-screen bg-gray-800" ref={containerRef}>
      <div className="relative flex w-screen items-center justify-around ">
        {!isVerticalLayout && (
          <>
            <LeftControls
              ref={leftControlsRef}
              onSeek={onSeek}
              videoEl={videoRef.current}
            />
            <input
              ref={volumeControlRef}
              style={{ writingMode: "vertical-lr", direction: "rtl" }}
              type="range"
              value={
                typeof videoRef.current?.volume === "number"
                  ? videoRef.current?.volume
                  : 0.5
              }
              max={1}
              step={0.01}
              onInput={(e) => {
                if (videoRef.current) {
                  videoRef.current.volume = parseFloat(e.currentTarget.value);
                }
              }}
              onWheel={(e) => {
                if (!videoRef.current) {
                  return;
                }

                if (e.deltaY === 0) {
                  return;
                }

                let volumeDelta = e.deltaY > 0 ? -0.05 : 0.05;

                if (e.shiftKey || e.altKey || e.ctrlKey || e.metaKey) {
                  volumeDelta = volumeDelta / 5;
                }

                const newVolume = videoRef.current.volume + volumeDelta;

                videoRef.current.volume = Math.max(0, Math.min(newVolume, 1));
              }}
            />
          </>
        )}
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
            onLoadedData={(_e) => {
              if (videoRef.current) {
                videoRef.current.volume = volume;
                onResize();
              }
            }}
            controls
            width={dimensions.width || 100}
            height={dimensions.height || 100}
            preload="auto"
          />
        )}
        {!isVerticalLayout && (
          <RightControls
            ref={leftControlsRef}
            onSeek={onSeek}
            videoEl={videoRef.current}
            containerEl={containerRef.current}
            videoStarted={videoStarted}
            onResize={onResize}
          />
        )}
      </div>
      <div
        className="flex flex-row justify-between gap-4  px-4 text-center text-white"
        ref={bottomControlsRef}
      >
        <span>{formatSeconds(currentTime)}</span>
        <input
          className="flex-grow"
          type="range"
          value={videoRef.current?.currentTime || 0}
          max={videoRef.current?.duration}
          step={0.01}
          onInput={(e) => {
            if (videoRef.current) {
              videoRef.current.currentTime = parseFloat(e.currentTarget.value);
            }
          }}
        />
        <span>{formatSeconds(duration)}</span>
      </div>
      {isVerticalLayout && (
        <div className="relative flex w-screen items-start justify-around ">
          <LeftControls
            ref={leftControlsRef}
            onSeek={onSeek}
            videoEl={videoRef.current}
          />
          <input
            ref={volumeControlRef}
            className="self-center"
            type="range"
            value={
              typeof videoRef.current?.volume === "number"
                ? videoRef.current?.volume
                : 0.5
            }
            max={1}
            step={0.01}
            onInput={(e) => {
              if (videoRef.current) {
                videoRef.current.volume = parseFloat(e.currentTarget.value);
              }
            }}
            onWheel={(e) => {
              if (!videoRef.current) {
                return;
              }

              if (e.deltaY === 0) {
                return;
              }

              let volumeDelta = e.deltaY > 0 ? -0.05 : 0.05;

              if (e.shiftKey || e.altKey || e.ctrlKey || e.metaKey) {
                volumeDelta = volumeDelta / 5;
              }

              const newVolume = videoRef.current.volume + volumeDelta;

              videoRef.current.volume = Math.max(0, Math.min(newVolume, 1));
            }}
          />
          <RightControls
            ref={leftControlsRef}
            onSeek={onSeek}
            videoEl={videoRef.current}
            containerEl={containerRef.current}
            videoStarted={videoStarted}
            onResize={onResize}
          />
        </div>
      )}
    </div>
  );
}
