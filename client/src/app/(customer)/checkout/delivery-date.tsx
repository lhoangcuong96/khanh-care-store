"use client";

import { vi } from "date-fns/locale";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

import { Card } from "@/components/ui/card";
import { periodOptions } from "@/constants/order";
import { upperFirst } from "lodash";
import { useFormContext } from "react-hook-form";
import { useState } from "react";

export default function DeliveryDate() {
  const [popoverOpen, setPopoverOpen] = useState(false);

  const methods = useFormContext();
  const { watch, setValue } = methods;

  const date = watch("shippingDate");
  const period = watch("shippingPeriod");

  const handleDateSelect = (date: Date | undefined) => {
    setValue("shippingDate", date);
    setPopoverOpen(false);
  };

  return (
    <Card className="p-6">
      <h3 className="font-medium mb-4">Thời gian giao hàng</h3>
      <div className="grid gap-4">
        <div className="grid gap-2">
          <div className="relative">
            <Input type="date" className="pl-10 text-sm hidden" />
            <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal bg-transparent hover:bg-transparent",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? (
                    upperFirst(format(date, "PPP", { locale: vi }))
                  ) : (
                    <span>Chọn 1 ngày</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={handleDateSelect}
                  initialFocus
                  locale={vi}
                  showOutsideDays
                  disabled={{ before: new Date() }}
                />
              </PopoverContent>
            </Popover>
          </div>
          <Select
            onValueChange={() => {
              setValue("shippingPeriod", period);
            }}
            value={period}
          >
            <SelectTrigger>
              <SelectValue placeholder="Chọn thời gian" />
            </SelectTrigger>
            <SelectContent>
              <SelectContent>
                {periodOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="invoice" />
          <label
            htmlFor="invoice"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Xuất hóa đơn công ty
          </label>
        </div>
        <p className="text-red-500">
          *Lưu ý nếu như không chọn ngày giao hàng thì chúng tôi sẽ mặc định
          chọn ngày hôm nay và buổi gần nhất
        </p>
      </div>
    </Card>
  );
}
