import type { Directory } from "./schemas";

import { Link } from "react-router-dom";
import { useOptions } from "../../hooks/options-context";

interface ListProps {
	className?: string;
	thisClassName?: string;
	videos: Directory["contents"];
	hideList?: string[];
	showList?: string[];
	onMarkWatched?: (video: string) => void | Promise<void>;
}

const componentClassName =
	"border border-gray-600 rounded-lg p-1 odd:bg-gray-700 even:bg-gray-500";

export default function List({
	className,
	thisClassName,
	videos,
	onMarkWatched,
}: ListProps) {
	const { options } = useOptions();

	return (
		<div className={`${className || ""} ${thisClassName || ""}`}>
			{videos.length === 0 && <div>Nothing here.</div>}
			{videos.map((v) => {
				if (v.type === "file") {
					const { filename, fullPath } = v;
					return (
						<div
							key={fullPath}
							className={`${componentClassName} flex flex-row items-center`}
						>
							<Link
								className="px-1"
								to={`/player/${encodeURIComponent(fullPath)}`}
							>
								📽️ {filename}
							</Link>
							<div className="grow" />
							{options.showWatch && (
								<Link
									className="button-default ml-3 text-gray-200 no-underline"
									to={`/player/${encodeURIComponent(fullPath)}`}
								>
									Watch
								</Link>
							)}
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
							{options.showDownload && (
								<a
									className="ml-3"
									href={`media${fullPath}`}
									download={fullPath.split("/").pop()}
								>
									Download
								</a>
							)}
						</div>
					);
				}

				const { dirname, contents, fullPath } = v;

				return (
					<details key={fullPath} className={componentClassName}>
						<summary className="flex items-center justify-start no-underline">
							<span className="underline">📁 {dirname}</span>
							<div className="grow" />
						</summary>
						<List
							thisClassName="mt-1"
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
