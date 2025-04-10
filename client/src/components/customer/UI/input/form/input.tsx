/* eslint-disable react/display-name */

import { Input } from "@/components/ui/input";
import { Ref } from "react";

const FormInput = (
  props: React.ComponentProps<"input"> & {
    error?: string;
  }
) => {
  const { error, className, ref, ...rest } = props;
  return (
    <Input
      {...rest}
      ref={ref as Ref<HTMLInputElement>}
      className={`!ring-inherit h-10 rounded-sm focus:!shadow-none ${
        error
          ? "!border-2 !border-red-500 focus:!border-red-500 focus-visible:!border-red-500 hover:!border-red-500"
          : " focus-visible:!border-lime-700 hover:!border-lime-700"
      } ${className} `}
    ></Input>
  );
};

FormInput.Password = (
  props: React.ComponentProps<"input"> & {
    error?: string;
  }
) => {
  const { error, className, ref, ...rest } = props;

  return (
    <Input
      {...rest}
      type="password"
      ref={ref as Ref<HTMLInputElement>}
      className={`!ring-inherit h-10 rounded-sm focus:!shadow-none  ${
        error
          ? "!border-2 !border-red-500 focus:!border-red-500 focus-visible:!border-red-500 hover:!border-red-500"
          : " focus-visible:!border-lime-700 hover:!border-lime-700"
      } ${className} `}
    />
  );
};

export default FormInput;
