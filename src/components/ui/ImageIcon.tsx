"use client"

import { useEffect, useState } from "react"

interface ImageIconProps {
  image: string
  fallbackImage?: string
}

const ImageIcon: React.FC<ImageIconProps> = ({ image, fallbackImage }) => {
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
        <img
          src={image}
          onError={() => setImageExists(false)}
          className=" text-blue-500"
          alt="Primary"
        />
      ) : fallbackImage ? (
        <img src={fallbackImage} className=" text-red-500" />
      ) : (
        <></>
      )}
    </div>
  )
}

export default ImageIcon
