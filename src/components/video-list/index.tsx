import type { Directory, File } from "./schemas";

import z from "zod";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useOptions } from "../../hooks/options-context";
import { getUrl } from "../../utils";
import { contentsSchema, fileSchema } from "./schemas";
import List from "./list";
import Help from "./help";

export default function VideoList() {
	const { options } = useOptions();
	const { showHelp } = options;

	const [videos, setVideos] = useState<Directory["contents"]>([]);
	const [elementKey, setElementKey] = useState(
		Math.floor(Math.random() * 1000000000).toString()
	);

	useEffect(() => {
		(async () => {
			try {
				const url = getUrl("/media?version=3&exts=.mp4");
				const res = await fetch(url);
				const parsedRes = z
					.object({
						output: contentsSchema,
						flatFiles: z.array(fileSchema),
					})
					.parse(await res.json());

				setVideos(parsedRes.output);
			} catch (e) {
				console.error("Couldn't get list of videos.", e);
			}
		})();
	}, []);

	return (
		<div className="mx-2">
			<div className="">
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
