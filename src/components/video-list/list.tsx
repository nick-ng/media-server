import { Link } from "react-router-dom";

import type { Directory } from "./schemas";

interface ListProps {
  className?: string;
  videos: Directory["contents"];
  hideList?: string[];
  showList?: string[];
  onMarkWatched?: (video: string) => void | Promise<void>;
}

const componentClassName =
  "border border-gray-600 flex items-center justify-start rounded-lg p-1 odd:bg-gray-100 even:bg-gray-300 dark:odd:bg-gray-700 dark:even:bg-gray-500";

export default function List({ className, videos, onMarkWatched }: ListProps) {
  return (
    <div className={`${className} inline-block`}>
      {videos.length === 0 && <div>Nothing here.</div>}
      {videos.map((v) => {
        if (v.type === "file") {
          const { filename, fullPath } = v;
          return (
            <div key={fullPath} className={componentClassName}>
              <Link
                className="px-1"
                to={`/player/${encodeURIComponent(fullPath)}`}
              >
                {filename}
              </Link>
              <div className="grow" />
              <Link
                className="button-default ml-3 text-black no-underline dark:text-gray-200"
                to={`/player/${encodeURIComponent(fullPath)}`}
              >
                Watch
              </Link>
              {typeof onMarkWatched === "function" && (
                <button
                  className="button-default ml-3"
                  onClick={() => {
                    onMarkWatched(fullPath);
                  }}
                >
                  Mark as Watched
                </button>
              )}
            </div>
          );
        }

        const { dirname, contents, fullPath } = v;

        return (
          <details key={fullPath} className={componentClassName}>
            <summary className="flex items-center justify-start">
              <span className="capitalize">{dirname}</span>
              <div className="grow" />
              <div className="button-default ml-3 no-underline">
                Expand Directory
              </div>
            </summary>
            <List
              className={className}
              videos={contents}
              onMarkWatched={onMarkWatched}
            />
          </details>
        );
      })}
    </div>
  );
}
