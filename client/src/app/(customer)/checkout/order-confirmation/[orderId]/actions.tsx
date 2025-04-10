"use client";

import { Button } from "@/components/ui/button";
import { routePath } from "@/constants/routes";
import { Printer } from "lucide-react";
import Link from "next/link";

export default function Actions() {
  return (
    <>
      <Link href={routePath.customer.home}>
        <Button size="lg">Tiếp tục mua hàng</Button>
      </Link>
      <Button variant="outline" size="lg" onClick={() => window.print()}>
        <Printer className="w-4 h-4 mr-2" />
        In
      </Button>
    </>
  );
}
