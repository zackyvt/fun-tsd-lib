// Based on https://github.com/golang/go/blob/master/src/net/textproto/reader_test.go
// Copyright 2009 The Go Authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

import { BufReaderSync } from "../io/bufio.ts";
import { TextProtoReaderSync } from "./mod.ts";
import { StringReader } from "../io/readers.ts";
import { assert, assertEquals, assertThrows } from "../testing/asserts.ts";
const { test } = Deno;

function reader(s: string): TextProtoReaderSync {
  return new TextProtoReaderSync(new BufReaderSync(new StringReader(s)));
}

test({
  ignore: true,
  name: "[textproto] Reader : DotBytes",
  fn(): void {
    const _input =
      "dotlines\r\n.foo\r\n..bar\n...baz\nquux\r\n\r\n.\r\nanot.her\r\n";
    return;
  },
});

test("[textproto] ReadEmpty", () => {
  const r = reader("");
  const m = r.readMIMEHeader();
  assertEquals(m, null);
});

test("[textproto] Reader", () => {
  const r = reader("line1\nline2\n");
  let s = r.readLine();
  assertEquals(s, "line1");

  s = r.readLine();
  assertEquals(s, "line2");

  s = r.readLine();
  assert(s === null);
});

test({
  name: "[textproto] Reader : MIME Header",
  fn(): void {
    const input =
      "my-key: Value 1  \r\nLong-key: Even Longer Value\r\nmy-Key: " +
      "Value 2\r\n\n";
    const r = reader(input);
    const m = r.readMIMEHeader();
    assert(m !== null);
    assertEquals(m.get("My-Key"), "Value 1, Value 2");
    assertEquals(m.get("Long-key"), "Even Longer Value");
  },
});

test({
  name: "[textproto] Reader : MIME Header Single",
  fn(): void {
    const input = "Foo: bar\n\n";
    const r = reader(input);
    const m = r.readMIMEHeader();
    assert(m !== null);
    assertEquals(m.get("Foo"), "bar");
  },
});

test({
  name: "[textproto] Reader : MIME Header No Key",
  fn(): void {
    const input = ": bar\ntest-1: 1\n\n";
    const r = reader(input);
    const m = r.readMIMEHeader();
    assert(m !== null);
    assertEquals(m.get("Test-1"), "1");
  },
});

test({
  name: "[textproto] Reader : Large MIME Header",
  fn(): void {
    const data: string[] = [];
    // Go test is 16*1024. But seems it can't handle more
    for (let i = 0; i < 1024; i++) {
      data.push("x");
    }
    const sdata = data.join("");
    const r = reader(`Cookie: ${sdata}\r\n\r\n`);
    const m = r.readMIMEHeader();
    assert(m !== null);
    assertEquals(m.get("Cookie"), sdata);
  },
});

// Test that we don't read MIME headers seen in the wild,
// with spaces before colons, and spaces in keys.
test({
  name: "[textproto] Reader : MIME Header Non compliant",
  fn(): void {
    const input =
      "Foo: bar\r\n" +
      "Content-Language: en\r\n" +
      "SID : 0\r\n" +
      "Audio Mode : None\r\n" +
      "Privilege : 127\r\n\r\n";
    const r = reader(input);
    const m = r.readMIMEHeader();
    assert(m !== null);
    assertEquals(m.get("Foo"), "bar");
    assertEquals(m.get("Content-Language"), "en");
    // Make sure we drop headers with trailing whitespace
    assertEquals(m.get("SID"), null);
    assertEquals(m.get("Privilege"), null);
    // Not legal http header
    assertThrows((): void => {
      assertEquals(m.get("Audio Mode"), "None");
    });
  },
});

test({
  name: "[textproto] Reader : MIME Header Malformed",
  fn(): void {
    const input = [
      "No colon first line\r\nFoo: foo\r\n\r\n",
      " No colon first line with leading space\r\nFoo: foo\r\n\r\n",
      "\tNo colon first line with leading tab\r\nFoo: foo\r\n\r\n",
      " First: line with leading space\r\nFoo: foo\r\n\r\n",
      "\tFirst: line with leading tab\r\nFoo: foo\r\n\r\n",
      "Foo: foo\r\nNo colon second line\r\n\r\n",
    ];
    const r = reader(input.join(""));

    let err;
    try {
      r.readMIMEHeader();
    } catch (e) {
      err = e;
    }
    assert(err instanceof Deno.errors.InvalidData);
  },
});

test({
  name: "[textproto] Reader : MIME Header Trim Continued",
  fn(): void {
    const input =
      "" + // for code formatting purpose.
      "a:\n" +
      " 0 \r\n" +
      "b:1 \t\r\n" +
      "c: 2\r\n" +
      " 3\t\n" +
      "  \t 4  \r\n\n";
    const r = reader(input);
    let err;
    try {
      r.readMIMEHeader();
    } catch (e) {
      err = e;
    }
    assert(err instanceof Deno.errors.InvalidData);
  },
});

test({
  name: "[textproto] #409 issue : multipart form boundary",
  fn(): void {
    const input = [
      "Accept: */*\r\n",
      'Content-Disposition: form-data; name="test"\r\n',
      " \r\n",
      "------WebKitFormBoundaryimeZ2Le9LjohiUiG--\r\n\n",
    ];
    const r = reader(input.join(""));
    const m = r.readMIMEHeader();
    assert(m !== null);
    assertEquals(m.get("Accept"), "*/*");
    assertEquals(m.get("Content-Disposition"), 'form-data; name="test"');
  },
});

test({
  name: "[textproto] #4521 issue",
  fn() {
    const input = "abcdefghijklmnopqrstuvwxyz";
    const bufSize = 25;
    const tp = new TextProtoReaderSync(
      new BufReaderSync(new StringReader(input), bufSize)
    );
    const line = tp.readLine();
    assertEquals(line, input);
  },
});
