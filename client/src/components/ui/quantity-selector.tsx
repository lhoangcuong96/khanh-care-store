"use client";

import { Minus, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const QuantitySelector = ({
  id,
  quantity,
  onUpdateQuantity,
  className = "",
}: {
  id: string;
  quantity: number;
  onUpdateQuantity: (id: string, quantity: number) => void;
  className?: string;
}) => {
  return (
    <div
      className={`grid grid-cols-[max-content_auto_max-content] items-center ${className} border border-lime-700 p-[2px] rounded-sm`}
    >
      <Button
        variant="outline"
        size="icon"
        className="h-7 w-7 text-white bg-lime-600 hover:bg-lime-700 hover:text-white"
        onClick={() => {
          onUpdateQuantity(id, Math.max(1, quantity - 1));
        }}
      >
        <Minus className="h-4 w-4" />
      </Button>
      <Input
        type="number"
        value={quantity}
        onChange={(e) =>
          onUpdateQuantity(id, Math.max(1, Number(e.target.value)))
        }
        className="!w-12 !h-7 text-center border-none py-0"
      />
      <Button
        variant="outline"
        size="icon"
        className="h-7 w-7 text-white bg-lime-600 hover:bg-lime-700 hover:text-white"
        onClick={() => onUpdateQuantity(id, quantity + 1)}
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default QuantitySelector;
