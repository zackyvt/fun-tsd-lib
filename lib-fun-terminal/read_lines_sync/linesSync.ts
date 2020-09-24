import { TextProtoReader } from './deno_std/textproto/modSync.ts';
import { BufReader } from './deno_std/io/bufioSync.ts';

/** Yields a buffer of each line given from the reader. */
export function* linesBuffer(
	reader: Deno.SyncReader,
	bufferSize = 4096
): IterableIterator<Uint8Array> {
	const tpReader = new TextProtoReader(new BufReader(reader, bufferSize));
	let buffer: Uint8Array | typeof Deno.EOF | undefined;
	while (true) {
		if(buffer == Deno.EOF) {
			break;
		}
		buffer = tpReader.readLineSlice();
		if(buffer == Deno.EOF) {
			return;
		}
		yield buffer;
	}
}

/** Reads from a reader and yields each line as a str. */
export function* lines(
	reader: Deno.SyncReader,
	bufferSize = 4096
): IterableIterator<string> {
	const tpReader = new TextProtoReader(new BufReader(reader, bufferSize));
	let buffer: string | typeof Deno.EOF | undefined;
	while (true) {
		if (buffer == Deno.EOF){
			break;
		}
		buffer = tpReader.readLine();
		if(Deno.EOF === buffer) break;
		yield buffer;
	}
}
