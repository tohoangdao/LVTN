import CircularProgress from "../common/CircularProgress";
import cn from "@/utils/tw-merge";

function LoadingComponent() {
  return (
    <div className={cn("w-full h-1/2 max-h-[385px]")}>
      <div className={cn("w-fit mx-auto")}>
        <CircularProgress />
      </div>
    </div>
  );
}

export default LoadingComponent;
