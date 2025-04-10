"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Spinner from "@/components/ui/spinner";
import { routePath } from "@/constants/routes";
import Link from "next/link";

export function Actions({ isLoading }: { isLoading: boolean }) {
  return (
    <Card className="p-6">
      <Button
        className="w-full mb-4"
        size="lg"
        type="submit"
        disabled={isLoading}
      >
        {isLoading ? <Spinner /> : "ĐẶT HÀNG"}
      </Button>

      <Link href={routePath.customer.cart}>
        <Button
          variant="outline"
          className="w-full"
          size="lg"
          disabled={isLoading}
        >
          Quay về giỏ hàng
        </Button>
      </Link>
    </Card>
  );
}
