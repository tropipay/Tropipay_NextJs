"use client"

import { useEffect, useState } from "react"
import Image from "next/image"

interface ImageIconProps {
  image: string
  fallbackImage?: string
  width?: number
  height?: number
}

const ImageIcon: React.FC<ImageIconProps> = ({
  image,
  fallbackImage,
  width = 24,
  height = 24,
}) => {
  const [imageExists, setImageExists] = useState(true)

  useEffect(() => {
    const checkImage = async () => {
      try {
        const response = await fetch(image)
        if (!response.ok) {
          throw new Error("")
        }
      } catch (error) {
        setImageExists(false)
      }
    }

    checkImage()
  }, [image])

  return (
    <div>
      {imageExists ? (
        <Image
          src={image}
          onError={() => setImageExists(false)}
          className="text-blue-500"
          alt="Primary"
          width={width}
          height={height}
        />
      ) : fallbackImage ? (
        <Image
          src={fallbackImage}
          className="text-red-500"
          alt="Fallback"
          width={width}
          height={height}
        />
      ) : (
        <></>
      )}
    </div>
  )
}

export default ImageIcon
