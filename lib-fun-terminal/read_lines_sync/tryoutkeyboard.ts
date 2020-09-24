import { input } from "./inputSync.ts";

(() => {
  console.log("-- DENO ADDER --");
  // get the next line throws if it reaches the EOF
  const num1 = input("Enter a number: ");
	javaSleep(3000);
  const num2 = input("Enter another number: ");
  console.log(
    `${String(num1)} + ${String(num2)} = ${Number(num1) + Number(num2)}`
  );
})();
