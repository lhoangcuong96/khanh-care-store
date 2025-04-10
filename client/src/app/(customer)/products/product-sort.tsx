import OutlineButton from "@/components/customer/UI/button/outline-button";

export function ProductSort() {
  const sortOptions = [
    { label: "Tên A-Z", value: "name-asc" },
    { label: "Tên Z-A", value: "name-desc" },
    { label: "Hàng mới", value: "new" },
    { label: "Giá thấp đến cao", value: "price-asc" },
    { label: "Giá cao xuống thấp", value: "price-desc" },
  ];

  return (
    <div className="flex items-center gap-2 mb-6">
      <span className="text-sm">Xếp theo:</span>
      {sortOptions.map((option) => (
        <OutlineButton
          key={option.value}
          variant="outline"
          size="sm"
          className="text-sm !h-8"
        >
          {option.label}
        </OutlineButton>
      ))}
    </div>
  );
}
