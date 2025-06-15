import z from "zod";

export const fileSchema = z.object({
	type: z.literal("file"),
	fullPath: z.string(),
	filename: z.string(),
});

export type File = z.infer<typeof fileSchema>;

export type Directory = {
	type: "directory";
	fullPath: string;
	dirname: string;
	contents: (Directory | File)[];
};

export const dirSchema: z.ZodType<Directory> = z.object({
	type: z.literal("directory"),
	fullPath: z.string(),
	dirname: z.string(),
	contents: z.lazy(() => z.array(z.union([dirSchema, fileSchema]))),
});

export const contentsSchema = z.array(z.union([dirSchema, fileSchema]));
