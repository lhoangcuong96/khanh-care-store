"use client";

import { useToast } from "@/hooks/use-toast";
import { EntityError } from "@/lib/http";
import { UseFormSetError } from "react-hook-form";

export const useHandleMessage = () => {
  const { toast } = useToast();

  const handleError: ({
    title,
    error,
    setError,
    duration,
  }: {
    title?: string;
    error: EntityError | Error | string;
    setError?: UseFormSetError<any>;
    duration?: number;
  }) => void = ({ title, error, setError, duration }) => {
    if (error instanceof EntityError && setError) {
      error.payload.errors.forEach((item) => {
        setError(item.field, {
          type: "server",
          message: item.message,
        });
      });
    } else {
      const errorMessage =
        typeof error === "string" ? error : (error as Error).message;
      console.log(error);
      toast({
        variant: "destructive",
        title: title || "Đã có lỗi xảy ra",
        type: "foreground",
        description: errorMessage,
        duration: duration || 3000,
      });
    }
  };

  const handleSuccess = ({
    title,
    description,
    duration,
  }: {
    title?: string;
    description?: string;
    duration?: number;
  }) => {
    toast({
      title: title || "Thành công",
      variant: "success",
      type: "foreground",
      description: description || "Thành công",
      duration: duration || 1000,
    });
  };

  const handWarning = ({
    title,
    description,
    duration,
  }: {
    title: string;
    description: string;
    duration?: number;
  }) => {
    toast({
      variant: "destructive",
      title: title || "Warning",
      type: "foreground",
      description: description,
      duration: duration || 3000,
    });
  };

  const messageApi = {
    error: handleError,
    success: handleSuccess,
    warning: handWarning,
  };

  return { messageApi };
};
