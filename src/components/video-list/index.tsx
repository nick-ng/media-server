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
  const [elementKey, setElementKey] = useState(
    Math.floor(Math.random() * 1000000000).toString()
  );
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
      <details open>
        <summary className="button-default">
          <span className="text-2xl">New Videos</span>{" "}
          <span>Click to expand/collapse</span>
        </summary>
        <div>
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
      <div className="my-1 flex items-center justify-start">
        <h2>All Videos</h2>
        <button
          className="ml-3 rounded border border-gray-600 bg-white px-2 dark:border-gray-300 dark:bg-gray-800"
          onClick={() => {
            setElementKey(Math.floor(Math.random() * 1000000000).toString());
          }}
        >
          Collapse Directories
        </button>
      </div>
      <List key={elementKey} videos={videos} />
    </div>
  );
}
