import { Link } from "react-router-dom";

interface ListProps {
  className?: string;
  videos: string[];
  onMarkWatched?: (video: string) => void | Promise<void>;
}

export default function List({ className, videos, onMarkWatched }: ListProps) {
  return (
    <ul className={`${className} inline-block`}>
      {videos.length === 0 && <div>Nothing here.</div>}
      {videos.map((v) => (
        <li
          key={v}
          className="flex items-center justify-start rounded-lg p-1 odd:bg-gray-100 even:bg-gray-300"
        >
          <Link to={`/player/${encodeURIComponent(v)}`}>{v}</Link>
          <div className="grow" />
          <Link
            className="button-default ml-3 text-black no-underline dark:text-gray-200"
            to={`/player/${encodeURIComponent(v)}`}
          >
            Watch
          </Link>
          {typeof onMarkWatched === "function" && (
            <button
              className="button-default ml-3"
              onClick={() => {
                onMarkWatched(v);
              }}
            >
              Mark as Watched
            </button>
          )}
        </li>
      ))}
    </ul>
  );
}
