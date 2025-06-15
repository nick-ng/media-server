type RightControlsProps = {
	ref: React.MutableRefObject<HTMLDivElement | null>;
	onSeek: (deltaSeconds: number) => void | Promise<void>;
	videoEl: HTMLVideoElement | null;
	containerEl: HTMLDivElement | null;
	videoStarted: boolean;
	onResize: () => void | Promise<void>;
};

export default function RightControls({
	ref,
	onSeek,
	videoEl,
	videoStarted,
	containerEl,
	onResize,
}: RightControlsProps) {
	return (
		<div className="flex flex-col justify-center" ref={ref}>
			<button
				className="border border-white px-2 py-2 text-white"
				onClick={() => {
					if (document.fullscreenElement) {
						document.exitFullscreen();
					} else if (containerEl) {
						containerEl.requestFullscreen();
					}
					setTimeout(() => {
						onResize();
					}, -1);
				}}
			>
				📽️
			</button>
			<div className="h-4"></div>
			<button
				className="border border-white px-2 py-2 text-white"
				onClick={() => {
					onSeek(10);
				}}
			>
				10s
			</button>
			<button
				className="border border-white px-2 py-2 text-white"
				onClick={() => {
					onSeek(60);
				}}
			>
				1m
			</button>
			<button
				className="border border-white px-2 py-2 text-white"
				onClick={() => {
					onSeek(300);
				}}
			>
				5m
			</button>
			{!videoStarted && (
				<button
					className="border border-white px-2 py-2 text-white"
					onClick={() => {
						if (videoEl) {
							videoEl.play();
						}
					}}
				>
					▶️
				</button>
			)}
			{videoStarted && (
				<button
					className="border border-white px-2 py-2 text-white"
					onClick={() => {
						if (videoEl) {
							videoEl.pause();
						}
					}}
				>
					⏸️
				</button>
			)}
		</div>
	);
}
