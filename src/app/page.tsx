"use client";

import { getKoreanLineCount } from "@/utils/koreanUtil";
import { disassemble, isCompleteAll } from "hangul-js";
import { useEffect, useRef, useState } from "react";

export default function Home() {
  const input1 = useRef<HTMLInputElement>(null);
  const [name1, setName1] = useState<string[][]>();

  const input2 = useRef<HTMLInputElement>(null);
  const [name2, setName2] = useState<string[][]>();

  const [output, setOutput] = useState<number[][]>([]);

  const onCalculate = () => {
    const name1Value = input1.current?.value;
    const name2Value = input2.current?.value;

    if (!name1Value) {
      alert("1번 문항의 입력 값이 없습니다!");
      return;
    }

    if (!name2Value) {
      alert("2번 문항의 입력 값이 없습니다!");
      return;
    }

    if (
      !isCompleteAll(name1Value) ||
      !isCompleteAll(name2Value) ||
      (name1Value.length < 1 && name1Value.length > 2) ||
      (name2Value.length < 1 && name2Value.length > 2)
    ) {
      alert("이름은 한글 2~3글자만 가능합니다.");
      return;
    }

    const disVal1 = disassemble(name1Value, true);
    const disVal2 = disassemble(name2Value, true);

    setName1(disassemble(name1Value, true));
    setName2(disassemble(name2Value, true));

    const output1 = disVal1.map((val) => getKoreanLineCount(val));
    const output2 = disVal2.map((val) => getKoreanLineCount(val));

    const realOutput: number[][] = [[]];

    console.log(output1);
    console.log(output2);

    for (let i = 0; i < 3; ++i) {
      realOutput[0].push(output1[i] % 10);
      realOutput[0].push(output2[i] % 10);
    }

    console.log(realOutput);

    const lol = loop(realOutput);

    console.log(lol);
  };

  const loop = (counts: number[][]): number[][] => {
    if (counts[counts.length - 1].length === 2) {
      counts[counts.length - 1].push();
      return counts;
    }

    const newArray = [];

    for (let i = 1; i < counts[counts.length - 1].length; ++i) {
      newArray.push(
        (counts[counts.length - 1][i - 1] + counts[counts.length - 1][i]) % 10
      );
    }

    counts.push(newArray);

    return loop(counts);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <input type="text" className="text-black" ref={input1} />
      <input type="text" className="text-black" ref={input2} />
      <button onClick={onCalculate}>Calculate</button>
    </main>
  );
}
