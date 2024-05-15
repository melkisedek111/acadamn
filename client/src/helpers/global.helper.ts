export function convertTo12hourFormat(time24: string): string {
	const [hours, minutes] = time24.split(":").map(Number);

	if (hours === 0) {
		return `12:${padZero(minutes)} AM`;
	} else if (hours < 12) {
		return `${hours}:${padZero(minutes)} AM`;
	} else if (hours === 12) {
		return `12:${padZero(minutes)} PM`;
	} else {
		return `${hours - 12}:${padZero(minutes)} PM`;
	}
}

function padZero(num: number): string {
	return num.toString().padStart(2, "0");
}
