import { hangulLineCountObject } from "@/constants/koreanLetterLineCountObject";

export const getKoreanLineCount = (val: string[]) => {
  return val.reduce(
    (count, currentValue) => (count += hangulLineCountObject[currentValue]),
    0
  );
};
