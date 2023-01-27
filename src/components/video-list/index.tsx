import z from "zod";
import { useEffect, useState } from "react";

import type { Directory, File } from "./schemas";
import { useOptions } from "../../hooks/options-context";
import { contentsSchema, fileSchema } from "./schemas";
import List from "./list";

export default function VideoList() {
  const { options, setOptions } = useOptions();
  const { watchedVideos } = options;

  const [videos, setVideos] = useState<Directory["contents"]>([]);
  const [flatVideos, setFlatVideos] = useState<File[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/media?version=2");
        const parsedRes = z
          .object({
            output: contentsSchema,
            flatFiles: z.array(fileSchema),
          })
          .parse(await res.json());

        setVideos(parsedRes.output);
        setFlatVideos(parsedRes.flatFiles);
      } catch (e) {
        console.error("Couldn't get list of videos.", e);
      }
    })();
  }, []);

  return (
    <div className="mx-2">
      <details>
        <summary className="text-2xl">New Videos</summary>
        <div className="mt-1">
          <List
            className="text-lg"
            videos={flatVideos.filter(
              (v) => !watchedVideos.includes(v.fullPath)
            )}
            onMarkWatched={(v) => {
              const tempWatchedVideos = new Set(watchedVideos);
              tempWatchedVideos.add(v);
              setOptions({ watchedVideos: [...tempWatchedVideos] });
            }}
          />
        </div>
      </details>
      <h2>All Videos</h2>
      <List videos={videos} />
    </div>
  );
}
