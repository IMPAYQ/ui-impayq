"use client"

import { useState, useEffect, useRef } from "react"
import { ArrowLeft, Check, X, Loader2 } from "lucide-react"

interface QRScannerProps {
  onScan: (data: string) => void
  onClose: () => void
}

export default function QRScanner({ onScan, onClose }: QRScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [hasPermission, setHasPermission] = useState<boolean | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [scannerActive, setScannerActive] = useState(true)
  const [scanningStage, setScanningStage] = useState<"searching" | "detecting" | "confirmed">("searching")
  const [qrVisible, setQrVisible] = useState(false)

  // Simulate the QR code detection process
  useEffect(() => {
    if (!scannerActive) return

    // First show the QR code after a delay
    const showQrTimer = setTimeout(() => {
      setQrVisible(true)

      // Then start "detecting" it
      const detectingTimer = setTimeout(() => {
        setScanningStage("detecting")

        // Finally confirm the scan
        const confirmTimer = setTimeout(() => {
          setScanningStage("confirmed")

          // Process the scanned data
          const finalTimer = setTimeout(() => {
            const mockQrData = JSON.stringify({
              walletAddress: "0x1a2b3c4d5e6f7g8h9i0j",
              amount: "25.50",
              username: "John Doe",
              timestamp: new Date().toISOString(),
            })

            setScannerActive(false)
            onScan(mockQrData)
          }, 800)

          return () => clearTimeout(finalTimer)
        }, 1500)

        return () => clearTimeout(confirmTimer)
      }, 2000)

      return () => clearTimeout(detectingTimer)
    }, 2000)

    return () => clearTimeout(showQrTimer)
  }, [scannerActive, onScan, qrVisible])

  // Initialize camera
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

    // Cleanup function to stop camera when component unmounts
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
        tracks.forEach((track) => track.stop())
      }
    }
  }, [])

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

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col"
      style={{ maxWidth: "28rem", margin: "0 auto", borderRadius: "var(--radius-3xl)", overflow: "hidden" }}
    >
      <div className="bg-black bg-opacity-90 w-full h-full flex flex-col">
        <div className="relative flex-1">
          {/* Camera feed */}
          <video ref={videoRef} autoPlay playsInline muted className="absolute inset-0 w-full h-full object-cover" />

          {/* Scanning overlay */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            {/* Scanner frame */}
            <div className="relative w-64 h-64 mb-8">
              <div
                className={`absolute inset-0 border-2 ${scanningStage === "confirmed" ? "border-green-500" : scanningStage === "detecting" ? "border-yellow-500" : "border-white"} rounded-lg`}
              ></div>

              {/* Scanning animation */}
              {scanningStage !== "confirmed" && (
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-purple-500 animate-[scanline_2s_ease-in-out_infinite]"></div>
              )}

              {/* Corner markers */}
              <div
                className={`absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 ${scanningStage === "confirmed" ? "border-green-500" : scanningStage === "detecting" ? "border-yellow-500" : "border-purple-500"}`}
              ></div>
              <div
                className={`absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 ${scanningStage === "confirmed" ? "border-green-500" : scanningStage === "detecting" ? "border-yellow-500" : "border-purple-500"}`}
              ></div>
              <div
                className={`absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 ${scanningStage === "confirmed" ? "border-green-500" : scanningStage === "detecting" ? "border-yellow-500" : "border-purple-500"}`}
              ></div>
              <div
                className={`absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 ${scanningStage === "confirmed" ? "border-green-500" : scanningStage === "detecting" ? "border-yellow-500" : "border-purple-500"}`}
              ></div>

              {/* Simulated QR code */}
              {qrVisible && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-white p-2 rounded">
                    <svg width="180" height="180" viewBox="0 0 200 200">
                      <rect width="200" height="200" fill="white" />
                      {/* Simulated QR code pattern */}
                      <g fill="black">
                        {/* Position detection patterns */}
                        <rect x="20" y="20" width="40" height="40" />
                        <rect x="25" y="25" width="30" height="30" fill="white" />
                        <rect x="30" y="30" width="20" height="20" />

                        <rect x="140" y="20" width="40" height="40" />
                        <rect x="145" y="25" width="30" height="30" fill="white" />
                        <rect x="150" y="30" width="20" height="20" />

                        <rect x="20" y="140" width="40" height="40" />
                        <rect x="25" y="145" width="30" height="30" fill="white" />
                        <rect x="30" y="150" width="20" height="20" />

                        {/* Data modules (simplified) */}
                        <rect x="80" y="30" width="10" height="10" />
                        <rect x="100" y="30" width="10" height="10" />
                        <rect x="120" y="40" width="10" height="10" />
                        <rect x="70" y="50" width="10" height="10" />
                        <rect x="90" y="50" width="10" height="10" />
                        <rect x="110" y="60" width="10" height="10" />
                        <rect x="80" y="70" width="10" height="10" />
                        <rect x="100" y="80" width="10" height="10" />
                        <rect x="120" y="90" width="10" height="10" />
                        <rect x="70" y="100" width="10" height="10" />
                        <rect x="90" y="110" width="10" height="10" />
                        <rect x="110" y="120" width="10" height="10" />
                        <rect x="80" y="130" width="10" height="10" />
                        <rect x="100" y="140" width="10" height="10" />
                        <rect x="120" y="150" width="10" height="10" />
                        <rect x="130" y="70" width="10" height="10" />
                        <rect x="140" y="90" width="10" height="10" />
                        <rect x="150" y="110" width="10" height="10" />
                        <rect x="30" y="80" width="10" height="10" />
                        <rect x="40" y="100" width="10" height="10" />
                        <rect x="50" y="120" width="10" height="10" />
                      </g>
                    </svg>
                  </div>
                </div>
              )}

              {/* Scanning status indicator */}
              {scanningStage === "detecting" && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm flex items-center">
                    <Loader2 size={16} className="animate-spin mr-2" />
                    Detecting QR code...
                  </div>
                </div>
              )}

              {/* Confirmation indicator */}
              {scanningStage === "confirmed" && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-green-500 text-white px-3 py-1 rounded-full text-sm flex items-center">
                    <Check size={16} className="mr-2" />
                    QR code detected!
                  </div>
                </div>
              )}
            </div>

            <p className="text-white text-center px-6">
              {scanningStage === "searching" && "Position the QR code within the frame to scan"}
              {scanningStage === "detecting" && "Hold still, reading QR code..."}
              {scanningStage === "confirmed" && "Successfully scanned! Processing..."}
            </p>
          </div>

          {/* Header */}
          <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between">
            <div className="flex items-center">
              <button onClick={onClose} className="btn btn-icon bg-black bg-opacity-50 text-white mr-2">
                <ArrowLeft size={24} />
              </button>
              <h3 className="text-white text-lg font-medium ml-4">Scan Customer QR</h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

