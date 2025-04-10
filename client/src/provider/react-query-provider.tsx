"use client";

import { useHandleMessage } from "@/hooks/use-handle-message";
import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import React from "react";

export default function ReactQueryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { messageApi } = useHandleMessage();
  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        queryCache: new QueryCache({
          onError: (error, query) => {
            console.log("Error: ", error);
            if (query.meta?.isShowError === false) {
              return;
            }
            if (query.meta?.errorMessage) {
              messageApi.error({
                error: query.meta.errorMessage as string,
              });
            } else {
              messageApi.error({
                error: "Có lỗi xảy ra: " + error.message,
              });
            }
          },
        }),
      })
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
