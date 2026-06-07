import { twMerge } from "tailwind-merge";

export default function Skeleton({ className }: { className: string }) {
  return (
    <div
      className={twMerge(
        "animate-pulse bg-black/20 border-2 border-black rounded-none",
        className,
      )}
    ></div>
  );
}
