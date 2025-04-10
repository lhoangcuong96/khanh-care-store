import { Checkbox } from "@/components/ui/checkbox";
import { useFormContext } from "react-hook-form";

const suggestions = [
  {
    field: "productImages",
    label: "Thêm ít nhất 3 hình ảnh",
    isValid: (value?: Array<any>) => (value ? value.length >= 3 : false),
  },
  {
    field: "video",
    label: "Thêm video sản phẩm",
    isValid: (value?: any) => !!value,
  },
  {
    field: "name",
    label: "Tên sản phẩm có ít nhất 25-100 kí tự",
    isValid: (value?: string) =>
      value ? value.length > 25 && value.length < 100 : false,
  },
  {
    field: "description",
    label: "Thêm ít nhất 100 kí tự hoặc 1 hình ảnh trong mô tả sản phẩm",
    isValid: (value?: string) => (value ? value.length > 100 : false),
  },
  {
    field: "productImages",
    label: "Thêm thương hiệu",
    isValid: (value?: any) => !!value,
  },
];

export function SuggestionsSidebar() {
  const form = useFormContext();

  return (
    <div className="w-64 bg-slate-50 p-4 sticky top-16 h-fit">
      <h2 className="mb-4 text-lg font-semibold">Gợi ý điền Thông tin</h2>
      <ul className="space-y-2">
        {suggestions.map((suggestion, index) => {
          const value = form.getValues(suggestion.field);
          const isValid = suggestion.isValid(value);
          return (
            <li key={index} className="flex items-start gap-2">
              <Checkbox checked={isValid} />
              <span className="text-sm">{suggestion.label}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
