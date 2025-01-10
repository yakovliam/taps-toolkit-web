import { Spinner } from "@/components/ui/spinner";

const LoadingPage = () => {
  return (
    <div className="flex flex-col items-center justify-start h-screen">
      <Spinner size="large" />
    </div>
  );
};

export default LoadingPage;
