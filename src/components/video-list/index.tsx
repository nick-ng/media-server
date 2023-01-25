import z from "zod";
import { useEffect, useState } from "react";

import { useOptions } from "../../hooks/options-context";

import List from "./list";

export default function VideoList() {
  const { options, setOptions } = useOptions();
  const { watchedVideos } = options;

  const [videos, setVideos] = useState<string[]>([]);

  const newVideos = videos.filter((v) => !watchedVideos.includes(v));
  const oldVideos = videos.filter((v) => watchedVideos.includes(v));

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/media");
        const tempVideos = z.array(z.string()).parse(await res.json());

        setVideos(tempVideos);
      } catch (e) {
        console.error("Couldn't get list of videos.", e);
      }
    })();
  }, []);

  return (
    <div className="mx-2">
      <h1>Videos</h1>
      <h2>New Videos</h2>
      <List
        className="text-lg"
        videos={newVideos}
        onMarkWatched={(v) => {
          const tempWatchedVideos = new Set(watchedVideos);
          tempWatchedVideos.add(v);
          setOptions({ watchedVideos: [...tempWatchedVideos] });
        }}
      />
      <details>
        <summary>Old Videos</summary>
        <List videos={oldVideos} />
      </details>
    </div>
  );
}
