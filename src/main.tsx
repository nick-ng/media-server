import React from "react";
import ReactDOM from "react-dom/client";
import OptionsContextProvider from "./hooks/options-context";
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
	<React.StrictMode>
		<OptionsContextProvider>
			<App />
		</OptionsContextProvider>
	</React.StrictMode>
);
