export function generateKey() {
	// returns a random key by converting a random number to a base 36 string and removing the leading 7 characters
	return Math.random().toString(36).substring(7);
}
