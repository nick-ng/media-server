import type { Directory, File } from "./schemas";

import z from "zod";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useOptions } from "../../hooks/options-context";
import { contentsSchema, fileSchema } from "./schemas";
import List from "./list";
import Help from "./help";

export default function VideoList() {
	const { options, setOptions } = useOptions();
	const { showDownload, showHelp, showWatch, watchedVideos } = options;

	const [videos, setVideos] = useState<Directory["contents"]>([]);
	const [elementKey, setElementKey] = useState(
		Math.floor(Math.random() * 1000000000).toString()
	);
	const [flatVideos, setFlatVideos] = useState<File[]>([]);
	const newVideos = flatVideos.filter(
		(v) => !watchedVideos.includes(v.fullPath)
	);

	useEffect(() => {
		(async () => {
			try {
				let url = "/media?version=2";
				if (import.meta.env.VITE_PORT) {
					url = `${window.location.protocol}//${window.location.hostname}:${
						import.meta.env.VITE_PORT
					}/media?version=2`;
				}
				const res = await fetch(url);
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
		<div className="mx-2 flex flex-row justify-between">
			<div>
				<div>
					<Link to="/options">Options</Link>
				</div>
				<div className="flex items-center justify-start">
					<h2>All Videos</h2>
					<button
						className="ml-3 rounded border border-gray-300 bg-gray-800 px-2"
						onClick={() => {
							setElementKey(Math.floor(Math.random() * 1000000000).toString());
						}}
					>
						Collapse Directories
					</button>
				</div>
				<List key={elementKey} videos={videos} />
			</div>
			{showHelp && <Help />}
		</div>
	);
}
