"use client"

import { useEffect, useRef } from "react"
import QRCodeStyling from "qr-code-styling"

interface QRCodeProps {
  value: string
  size?: number
  className?: string
}

export default function QRCode({ value, size = 300, className }: QRCodeProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return

    // Clear previous QR code
    while (ref.current.firstChild) {
      ref.current.removeChild(ref.current.firstChild)
    }

    const qrCode = new QRCodeStyling({
      width: size,
      height: size,
      type: "svg",
      data: value,
      dotsOptions: {
        color: "#8b5cf6", // Purple color
        type: "rounded",
      },
      cornersSquareOptions: {
        type: "extra-rounded",
        color: "#8b5cf6",
      },
      cornersDotOptions: {
        type: "dot",
        color: "#8b5cf6",
      },
      backgroundOptions: {
        color: "transparent",
      },
      imageOptions: {
        crossOrigin: "anonymous",
        margin: 10,
      },
    })

    qrCode.append(ref.current)
  }, [value, size])

  return <div ref={ref} className={className || ""} />
}

