"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MessageCircle, Phone, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { FaFacebookMessenger, FaTiktok } from "react-icons/fa";
import { SiZalo } from "react-icons/si";

export default function CallButton() {
  const [isOpen, setIsOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  const togglePopover = () => {
    setIsOpen(!isOpen);
  };

  // Handle clicks outside to close the popover
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    // Only add the event listener if the popover is open
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="fixed bottom-6 right-6 z-[60]" ref={containerRef}>
      {/* Contact options popover */}
      <div
        className={cn(
          "absolute bottom-16 right-0 bg-white rounded-lg shadow-lg p-3 transition-all duration-300",
          isOpen
            ? "opacity-100 scale-100"
            : "opacity-0 scale-90 pointer-events-none"
        )}
      >
        <div className="flex flex-col gap-3 items-center">
          {/* Phone */}
          <Link
            href="tel:0987694999"
            className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-600 hover:bg-blue-700 text-white transition-colors"
          >
            <Phone className="!h-5 !w-5" />
            <span className="sr-only">Gọi điện</span>
          </Link>

          {/* Zalo */}
          <Link
            href="https://zalo.me/0987694999"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-500 hover:bg-blue-600 text-white transition-colors"
          >
            <SiZalo className="!h-5 !w-5" />
            <span className="sr-only">Zalo</span>
          </Link>

          {/* Facebook */}
          <Link
            href="https://m.me/tahico"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-12 h-12 rounded-full bg-[#1877F2] hover:bg-[#0e6ae3] text-white transition-colors"
          >
            <FaFacebookMessenger className="!h-5 !w-5" />
            <span className="sr-only">Facebook Messenger</span>
          </Link>

          {/* TikTok */}
          <Link
            href="https://www.tiktok.com/@tahico"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-12 h-12 rounded-full bg-black hover:bg-gray-800 text-white transition-colors"
          >
            <FaTiktok className="!h-5 !w-5" />
            <span className="sr-only">TikTok</span>
          </Link>
        </div>
      </div>

      {/* Main button */}
      <Button
        size="lg"
        onClick={togglePopover}
        className={cn(
          "!h-14 !w-14 p-0 rounded-full shadow-lg transition-all duration-300",
          isOpen
            ? "bg-red-500 hover:bg-red-600"
            : "bg-blue-600 hover:bg-blue-700"
        )}
      >
        {isOpen ? (
          <X className="!h-6 !w-6" />
        ) : (
          <MessageCircle className="!h-6 !w-6" />
        )}
        <span className="sr-only">{isOpen ? "Đóng" : "Liên hệ"}</span>
      </Button>
    </div>
  );
}
