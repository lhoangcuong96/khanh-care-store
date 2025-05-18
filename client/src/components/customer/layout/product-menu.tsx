"use client";

import { Card } from "@/components/ui/card";
import { useAppContext } from "@/provider/app-provider";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { MdOutlineArrowForwardIos } from "react-icons/md";

export function ProductMenu() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const { categories } = useAppContext();

  // Handle click outside to close sub-card
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenIdx(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <Card className="rounded-sm p-0" ref={menuRef}>
      <div className="flex relative">
        {/* Sidebar */}
        <div className="w-56 bg-slate-500 text-white py-2 rounded-l-sm relative z-10">
          {categories.map((cat, idx) => (
            <div
              key={cat.id}
              className={`flex items-center px-4 py-2 cursor-pointer hover:bg-slate-600 ${
                openIdx === idx ? "bg-slate-600" : ""
              }`}
              onMouseMove={() => setOpenIdx(idx)}
            >
              <span className="font-semibold">{cat.name}</span>
              {cat.children && cat.children.length > 0 && (
                <span className="ml-2">
                  <MdOutlineArrowForwardIos />
                </span>
              )}
            </div>
          ))}
        </div>
        {/* Sub-card for children */}
        {openIdx !== null &&
          categories[openIdx]?.children &&
          categories[openIdx].children.length > 0 && (
            <div
              className="absolute left-56 top-0 bg-white shadow-lg rounded-r-sm p-4 min-w-[260px] z-20"
              style={{ minHeight: categories.length * 44 }}
            >
              <div className="font-semibold mb-2 text-slate-700">
                {categories[openIdx].name}
              </div>
              <ul className="space-y-1">
                {categories[openIdx].children.map((child) => (
                  <li key={child.id}>
                    <Link
                      href={`#`}
                      className="hover:text-green-600 text-gray-700 text-sm"
                    >
                      {child.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
      </div>
    </Card>
  );
}
