type LeftControlsProps = {
	ref: React.MutableRefObject<HTMLDivElement | null>;
	onSeek: (deltaSeconds: number) => void | Promise<void>;
	videoEl: HTMLVideoElement | null;
};

export default function LeftControls({
	ref,
	onSeek,
	videoEl,
}: LeftControlsProps) {
	return (
		<div className="flex flex-col justify-center" ref={ref}>
			<button
				className="border border-white px-2 py-2 text-white"
				onClick={() => {
					onSeek(-10);
				}}
			>
				10s
			</button>
			<button
				className="border border-white px-2 py-2 text-white"
				onClick={() => {
					onSeek(-60);
				}}
			>
				1m
			</button>
			<button
				className="border border-white px-2 py-2 text-white"
				onClick={() => {
					onSeek(-300);
				}}
			>
				5m
			</button>
			<button
				className="border border-white px-2 py-2 text-white"
				onClick={() => {
					if (videoEl) {
						videoEl.pause();
						videoEl.currentTime = 0;
					}
				}}
			>
				⏹️
			</button>
		</div>
	);
}
