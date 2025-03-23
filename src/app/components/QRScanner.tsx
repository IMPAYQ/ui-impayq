"use client"

import { useState, useEffect, useRef } from "react"
import { ArrowLeft, Check, X, Loader2 } from "lucide-react"
import jsQR from "jsqr"

interface QRScannerProps {
  onScan: (data: string) => void
  onClose: () => void
}

export default function QRScanner({ onScan, onClose }: QRScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const [hasPermission, setHasPermission] = useState<boolean | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [scanningStage, setScanningStage] = useState<"searching" | "detecting" | "confirmed">("searching")

  useEffect(() => {
    if (scanningStage === "confirmed" && "Successfully scanned! Processing...") {
      onClose()
    }
  }, [scanningStage, onClose])

  // 1. Access the camera
  useEffect(() => {
    const startCamera = async () => {
      setIsLoading(true)
      try {
        const constraints = {
          video: {
            facingMode: "environment",
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
        }
        const stream = await navigator.mediaDevices.getUserMedia(constraints)
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          setHasPermission(true)
        }
      } catch (err) {
        console.error("Error accessing camera:", err)
        setHasPermission(false)
      } finally {
        setIsLoading(false)
      }
    }

    startCamera()

    // Cleanup: stop the camera when component unmounts
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
        tracks.forEach((track) => track.stop())
      }
    }
  }, [])

  // 2. Once the video is playing, start scanning frames using jsQR
  useEffect(() => {
    if (!videoRef.current || !canvasRef.current) return

    let isMounted = true // To stop scanning when component unmounts

    const video = videoRef.current
    const canvas = canvasRef.current
    const context = canvas.getContext("2d")

    // We'll update scanningStage from "searching" to "detecting"
    // once we start seeing frames.
    function scanFrame() {
      if (!isMounted || !video || !context) return

      // If video isn't ready, schedule another attempt
      if (video.readyState !== video.HAVE_ENOUGH_DATA) {
        requestAnimationFrame(scanFrame)
        return
      }

      // If video is playing, draw it on canvas & try to decode
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      context.drawImage(video, 0, 0, canvas.width, canvas.height)

      // Read the imageData from the canvas
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height)

      // Switch to "detecting" if not confirmed yet
      if (scanningStage === "searching") {
        setScanningStage("detecting")
      }

      const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: "dontInvert",
      })

      if (code && code.data) {
        // 3. If we found a QR code, we confirm & pass data out
        setScanningStage("confirmed")
        onScan(code.data)
        // Optionally: close the scanner automatically
        // onClose()
      } else {
        // No QR code found; keep scanning
        requestAnimationFrame(scanFrame)
      }
    }

    requestAnimationFrame(scanFrame)

    return () => {
      isMounted = false
    }
  }, [onScan, scanningStage])

  // 4. Loading or camera permission check
  if (isLoading) {
    return (
      <div
        className="fixed inset-0 z-50 flex flex-col items-center justify-center text-white"
        style={{ maxWidth: "28rem", margin: "0 auto", borderRadius: "var(--radius-3xl)", overflow: "hidden" }}
      >
        <div className="bg-black bg-opacity-90 w-full h-full flex flex-col items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mb-4"></div>
          <p>Accessing camera...</p>
        </div>
      </div>
    )
  }

  if (hasPermission === false) {
    return (
      <div
        className="fixed inset-0 z-50 flex flex-col items-center justify-center text-white p-6"
        style={{ maxWidth: "28rem", margin: "0 auto", borderRadius: "var(--radius-3xl)", overflow: "hidden" }}
      >
        <div className="bg-black bg-opacity-90 w-full h-full flex flex-col items-center justify-center p-6">
          <X size={48} className="text-red-500 mb-4" />
          <h3 className="text-xl font-bold mb-2">Camera Access Denied</h3>
          <p className="text-center mb-6">Please allow camera access to scan QR codes.</p>
          <button onClick={onClose} className="btn btn-primary">
            Close Scanner
          </button>
        </div>
      </div>
    )
  }

  // 5. Render the camera preview + scanning overlay
  return (
    <div
      className="fixed inset-0 z-50 flex flex-col"
      style={{ maxWidth: "28rem", margin: "0 auto", borderRadius: "var(--radius-3xl)", overflow: "hidden" }}
    >
      <div className="bg-black bg-opacity-90 w-full h-full flex flex-col">
        <div className="relative flex-1">
          {/* Camera feed */}
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="absolute inset-0 w-full h-full object-cover"
            // This helps the video load before scanning
            onLoadedMetadata={() => {
              if (scanningStage === "searching") {
                setScanningStage("detecting")
              }
            }}
          />

          {/* A hidden canvas to capture frames */}
          <canvas ref={canvasRef} className="hidden" />

          {/* Scanning overlay */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            {/* Scanner frame */}
            <div className="relative w-64 h-64 mb-8">
              <div
                className={`absolute inset-0 border-2 ${
                  scanningStage === "confirmed"
                    ? "border-green-500"
                    : scanningStage === "detecting"
                      ? "border-yellow-500"
                      : "border-white"
                } rounded-lg`}
              ></div>

              {/* Scanning animation */}
              {scanningStage !== "confirmed" && (
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-purple-500 animate-[scanline_2s_ease-in-out_infinite]"></div>
              )}

              {/* Corner markers */}
              <div
                className={`absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 ${
                  scanningStage === "confirmed"
                    ? "border-green-500"
                    : scanningStage === "detecting"
                      ? "border-yellow-500"
                      : "border-purple-500"
                }`}
              ></div>
              <div
                className={`absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 ${
                  scanningStage === "confirmed"
                    ? "border-green-500"
                    : scanningStage === "detecting"
                      ? "border-yellow-500"
                      : "border-purple-500"
                }`}
              ></div>
              <div
                className={`absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 ${
                  scanningStage === "confirmed"
                    ? "border-green-500"
                    : scanningStage === "detecting"
                      ? "border-yellow-500"
                      : "border-purple-500"
                }`}
              ></div>
              <div
                className={`absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 ${
                  scanningStage === "confirmed"
                    ? "border-green-500"
                    : scanningStage === "detecting"
                      ? "border-yellow-500"
                      : "border-purple-500"
                }`}
              ></div>

              {/* Scanning status indicator */}
              {scanningStage === "detecting" && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm flex items-center">
                    <Loader2 size={16} className="animate-spin mr-2" />
                    Detecting private QR code...
                  </div>
                </div>
              )}

              {/* Confirmation indicator */}
              {scanningStage === "confirmed" && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-green-500 text-white px-3 py-1 rounded-full text-sm flex items-center">
                    <Check size={16} className="mr-2" />
                    Private QR detected!
                  </div>
                </div>
              )}
            </div>

            <p className="text-white text-center px-6">
              {scanningStage === "searching" && "Position the private QR code within the frame"}
              {scanningStage === "detecting" && "Hold still, reading private QR code..."}
              {scanningStage === "confirmed" && "Successfully scanned! Processing..."}
            </p>
          </div>

          {/* Header */}
          <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between">
            <div className="flex items-center">
              <button onClick={onClose} className="btn btn-icon bg-black bg-opacity-50 text-white mr-2">
                <ArrowLeft size={24} />
              </button>
              <h3 className="text-white text-lg font-medium ml-4">Scan Private QR</h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

