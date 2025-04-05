export function getForwardedName(forwardedMsg: any) {
	if (forwardedMsg.channel) return forwardedMsg.channel.name;
	if (forwardedMsg.group) return forwardedMsg.group.name;
	if (forwardedMsg.user) return forwardedMsg.user.name;
	return "Unknown";
}

export function getForwardedImg(forwardedMsg: any) {
	if (forwardedMsg.channel) return forwardedMsg.channel.imgURL;
	if (forwardedMsg.group) return forwardedMsg.group.imgURL;
	if (forwardedMsg.user) return forwardedMsg.user.imgURL;
	return "Unknown";
}