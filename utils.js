import fs from "node:fs/promises";
import path from "path";

const ENDS_WITH_BLOCKLIST = [".md", ".json"];

export const walkDir = async (
	startDir,
	includedExtensions = [],
	currentDir = ""
) => {
	const tempDir = await fs.readdir(startDir);

	const output = [];
	const flatFiles = [];

	for (const item of tempDir) {
		const itemPath = path.resolve(startDir, item);
		const a = await fs.lstat(itemPath);

		const fullPath = `${currentDir}/${item}`;

		if (a.isDirectory()) {
			const temp = await walkDir(itemPath, includedExtensions, fullPath);
			output.push({
				type: "directory",
				dirname: item,
				fullPath,
				contents: temp.output,
			});
			flatFiles.push(...temp.flatFiles);
		} else if (
			includedExtensions.length === 0
				? ENDS_WITH_BLOCKLIST.every((m) => !item.endsWith(m))
				: includedExtensions.some((extension) => item.endsWith(extension))
		) {
			output.push({
				type: "file",
				filename: item,
				fullPath,
			});
			flatFiles.push({
				type: "file",
				filename: item,
				fullPath,
			});
		}
	}

	return { output, flatFiles };
};
