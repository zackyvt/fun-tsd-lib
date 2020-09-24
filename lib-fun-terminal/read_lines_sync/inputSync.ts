import { lines } from "./linesSync.ts";

/** Returns a python like input reader. */
export function inputReader(
	reader: Deno.SyncReader = Deno.stdin,
	writer: Deno.SyncWriter = Deno.stdout
) {
	const lineReader = lines(reader);
	/**
	 * Python like input reader. Returns an array containing at the first index
	 * the line read and at the second index a boolean indicating whether the eof
	 * has been reached.
	 */
	return function input(output: string): string | Deno.EOF {
		if (output) {
			writer.writeSync(new TextEncoder().encode(output));
		}
		const { value, done } = lineReader.next();
		if (done) {
			return Deno.EOF
		}
		return value;
	};
}

/**
 * Takes a string to output to stdout and returns a string
 * that was given on stdin. Returns Deno.EOF when end of file is reached.
 */
export const input = inputReader();
