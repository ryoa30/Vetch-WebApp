import { useState, useEffect } from "react";
import { Input } from "./ui/input";

const formatIDR = (n: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n);

const parseIDR = (s: string) => {
  const digits = s.replace(/[^\d]/g, "");      // strip non-digits
  return digits ? parseInt(digits, 10) : 0;    // integer only
};

export function PriceInput({ value, onChange, className="" }) {
  const [display, setDisplay] = useState("");

  useEffect(() => {
    setDisplay(formatIDR(value ?? 0));
  }, [value]);

  const onValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const realValue = parseIDR(raw);
    onChange(realValue) // store as integer
    setDisplay(formatIDR(value));                   // keep formatted view
  };

  const onFocus = () => {
    // optional: show unformatted digits while editing
    setDisplay(String(value ?? ""));
  };

  const onBlur = () => {
    setDisplay(formatIDR(value ?? 0));
  };

  return (
    <Input
      type="text"
      inputMode="numeric"
      value={display}
      onChange={onValueChange}
      onFocus={onFocus}
      onBlur={onBlur}
      placeholder="Rp0"
      className={className}
    />
  );
}
