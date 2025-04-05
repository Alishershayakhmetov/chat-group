export const formatLastActive = (isoString: string | undefined) => {
	if (isoString === undefined) return undefined;
	const date = new Date(isoString);
	return date.toLocaleString("en-US", {
		weekday: "short",
		hour: "2-digit",
		minute: "2-digit",
		second: "2-digit",
		hour12: true,
	});
};