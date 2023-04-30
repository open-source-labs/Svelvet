export const calculateRadius = (value1: number, value2: number, cornerRadius: number) =>
	Math.min(Math.abs(value1 || value2) / 2, cornerRadius);
