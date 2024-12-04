import cn from "@/utils/tw-merge";

export default function NoData({ className }: { className?: string }) {
  return (
    <div className={cn("p-xl", className)}>
      <div
        className={cn(
          "flex items-center justify-center bg-bgQuaternary rounded-lg h-20 text-textSecondary select-none",
        )}
      >
        No Data
      </div>
    </div>
  );
}
