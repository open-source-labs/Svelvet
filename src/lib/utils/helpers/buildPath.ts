export const buildPath = (string: string, xStep: number, yStep: number, arcString: string) =>
	string + ` l ${xStep} ${yStep} ` + arcString;
