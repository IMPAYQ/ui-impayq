"use client"

interface PlaceholderImageProps {
  width: number
  height: number
  text?: string
  bgColor?: string
  textColor?: string
}

export default function PlaceholderImage({
  width,
  height,
  text = "",
  bgColor = "#8b5cf6",
  textColor = "#ffffff",
}: PlaceholderImageProps) {
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} xmlns="http://www.w3.org/2000/svg">
      <rect width={width} height={height} fill={bgColor} />
      {text && (
        <text
          x="50%"
          y="50%"
          dominantBaseline="middle"
          textAnchor="middle"
          fill={textColor}
          fontSize={width > 50 ? "14px" : "10px"}
          fontFamily="Arial, sans-serif"
        >
          {text}
        </text>
      )}
    </svg>
  )
}

