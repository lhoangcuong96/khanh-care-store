"use client"

import { Phone } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function CallButton() {
  return (
    <a href="tel:0987694999" className="fixed bottom-6 right-6 z-50">
      <Button size="lg" className="h-14 w-14 rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg">
        <Phone className="h-6 w-6" />
        <span className="sr-only">Gọi ngay</span>
      </Button>
    </a>
  )
}
