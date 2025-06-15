interface ImportMetaEnv {
	readonly VITE_PORT: string;
	// more env variables...
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
