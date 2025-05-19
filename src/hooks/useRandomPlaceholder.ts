import { useState, useEffect } from "react";

export function useRandomPlaceholder(
	placeholders: string[],
	dependencies: any[] = []
) {
	const [message, setMessage] = useState(() => {
		return placeholders[Math.floor(Math.random() * placeholders.length)];
	});

	useEffect(() => {
		if (placeholders.length > 0) {
			const random =
				placeholders[Math.floor(Math.random() * placeholders.length)];
			setMessage(random);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, dependencies);

	return message;
}
