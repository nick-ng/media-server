import { lazy, Suspense } from "react";
import { createBrowserRouter, RouterProvider, Link } from "react-router-dom";

const VideoList = lazy(() => import("./components/video-list"));
const VideoPlayer = lazy(() => import("./components/video-player"));
const Options = lazy(() => import("./components/options"));

const router = createBrowserRouter([
	{
		path: "/",
		element: <VideoList />,
		errorElement: (
			<div className="m-3">
				There's nothing here. <Link to="/">Go back to the video list</Link>
			</div>
		),
	},
	{
		path: "/options",
		element: <Options />,
	},
	{
		path: "/player/:filename",
		element: <VideoPlayer />,
	},
]);

export default function App() {
	return (
		<Suspense fallback={<div>Loading. Please Wait.</div>}>
			<RouterProvider router={router} />
		</Suspense>
	);
}
