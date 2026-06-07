import { twMerge } from "tailwind-merge";

export default function Skeleton({ className }: { className: string }) {
  return (
    <div
      className={twMerge("animate-pulse bg-slate-400 rounded-md", className)}
    ></div>
  );
}
