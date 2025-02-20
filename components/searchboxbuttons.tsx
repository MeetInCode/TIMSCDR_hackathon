'use client';

import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SearchFormResetProps {
  onReset: () => void;
}

const SearchFormReset = ({ onReset }: SearchFormResetProps) => {
  return (
    <Button
      type="button"
      variant="outline"
      onClick={onReset}
      className="p-2 hover:bg-gray-100 rounded-lg"
    >
      <X size={20} className="text-gray-500" />
    </Button>
  );
};

export default SearchFormReset; 