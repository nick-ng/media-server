import { } from "react"
import { useOptions } from "../../hooks/options-context"

export default function() {
	const { options, setOptions } = useOptions()
	return <div>
		<h2>Options</h2>
	</div>
}
