import React from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface ButtonProps {
  isLoading: boolean;
  className?: string;
  children: React.ReactNode;
}

const SubmitButton = ({ isLoading, className, children }: ButtonProps) => {
  return (
    <Button
      type="submit"
      disabled={isLoading}
      className={className ?? "bg-[#1b245e] text-white border-none rounded-[50px] cursor-pointer m-[10px] hover:bg-[#0056b3]"}
    >
      {isLoading ? (
        <div className="flex items-center gap-4">
          <Image
            src="/assets/icons/loader.svg"
            alt="loader"
            width={24}
            height={24}
            className="animate-spin"
          />
          ... تحميل
        </div>
      ) : (
        children
      )}
    </Button>
  );
};
export default SubmitButton;
