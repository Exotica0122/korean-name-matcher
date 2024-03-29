"use client";

import {
  AlertDialogFooter,
  AlertDialogHeader,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getKoreanLineCount } from "@/utils/koreanUtil";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { disassemble, isCompleteAll } from "hangul-js";
import Image from "next/image";
import { useRef, useState } from "react";

export default function Home() {
  const input1 = useRef<HTMLInputElement>(null);
  const [name1, setName1] = useState<string[][]>();

  const input2 = useRef<HTMLInputElement>(null);
  const [name2, setName2] = useState<string[][]>();

  const [output, setOutput] = useState<number[][]>([]);

  const [open, setOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");

  const onCalculate = () => {
    const name1Value = input1.current?.value;
    const name2Value = input2.current?.value;

    if (!name1Value) {
      setModalTitle("1번 문항의 입력 값이 없습니다!");
      setOpen(true);
      return;
    }

    if (!name2Value) {
      setModalTitle("2번 문항의 입력 값이 없습니다!");
      setOpen(true);
      return;
    }

    if (
      !isCompleteAll(name1Value) ||
      !isCompleteAll(name2Value) ||
      (name1Value.length !== 2 && name1Value.length !== 3) ||
      (name2Value.length !== 2 && name2Value.length !== 3)
    ) {
      setModalTitle("이름은 한글 2~3글자만 가능합니다.");
      setOpen(true);
      return;
    }

    const disVal1 = disassemble(name1Value, true);
    const disVal2 = disassemble(name2Value, true);

    setName1(disassemble(name1Value, true));
    setName2(disassemble(name2Value, true));

    const output1 = disVal1.map((val) => getKoreanLineCount(val));
    const output2 = disVal2.map((val) => getKoreanLineCount(val));

    const realOutput: number[][] = [[]];

    for (let i = 0; i < 3; ++i) {
      realOutput[0].push(output1[i] % 10);
      realOutput[0].push(output2[i] % 10);
    }

    const output = loop(realOutput);
    console.log(output);
    setOutput(output);
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
      <Image
        src={"/images/name-match.png"}
        alt={"재미로 보는 이름 궁합테스트"}
        height={700}
        width={700}
      />
      <h1 className="text-2xl font-bold">재미로 보는 이름 궁합 테스트</h1>
      <div className="flex gap-10">
        <Input
          type="text"
          className="text-black w-60"
          ref={input1}
          placeholder="이름1"
        />
        <Input
          type="text"
          className="text-black w-60"
          ref={input2}
          placeholder="이름2"
        />
      </div>
      <Button onClick={onCalculate}>결과 보기</Button>

      <AlertDialog open={open}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{modalTitle}</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setOpen(false)}>
              확인
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  );
}
