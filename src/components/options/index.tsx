import {} from "react";
import { Link } from "react-router-dom";
import { useOptions } from "../../hooks/options-context";

export default function () {
	const { options, setOptions } = useOptions();
	return (
		<div>
			<h2>Options</h2>
			<table>
				<tbody>
					<tr>
						<td>
							<label htmlFor="show-help-option">Show Help</label>
						</td>
						<td>
							<input
								id="show-help-option"
								type="checkbox"
								checked={options.showHelp}
								onChange={(event) => {
									setOptions({ showHelp: event.currentTarget.checked });
								}}
							/>
						</td>
					</tr>
					<tr>
						<td>
							<label htmlFor="show-watch-option">Show Watch</label>
						</td>
						<td>
							<input
								id="show-watch-option"
								type="checkbox"
								checked={options.showWatch}
								onChange={(event) => {
									setOptions({ showWatch: event.currentTarget.checked });
								}}
							/>
						</td>
					</tr>
					<tr>
						<td>
							<label htmlFor="show-download-option">Show Download</label>
						</td>
						<td>
							<input
								id="show-download-option"
								type="checkbox"
								checked={options.showDownload}
								onChange={(event) => {
									setOptions({ showDownload: event.currentTarget.checked });
								}}
							/>
						</td>
					</tr>
				</tbody>
			</table>
			<Link to="/">Home</Link>
		</div>
	);
}
