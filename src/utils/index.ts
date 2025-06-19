export async function tryCatchPromise<T>(
	promise: PromiseLike<T>
): Promise<[T, null] | [null, any]> {
	try {
		const result = await promise;
		return [result, null];
	} catch (err) {
		return [null, err];
	}
}

export const getUrl = (urlPath: string): string => {
	if (import.meta.env.VITE_PORT) {
		return `${window.location.protocol}//${window.location.hostname}:${
			import.meta.env.VITE_PORT
		}${urlPath}`;
	}
	return urlPath;
};
