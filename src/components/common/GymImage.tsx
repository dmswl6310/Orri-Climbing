"use client";

import Image from "next/image";
import { useState } from "react";
import FallbackGymImage from "./FallbackGymImage";
import { isSupportedImageSource } from "@/utils/imageSource";

interface GymImageProps {
  src: string;
  alt: string;
  sizes: string;
  className?: string;
  priority?: boolean;
  dark?: boolean;
}

export default function GymImage(props: GymImageProps) {
  return <ImageWithFallback key={props.src} {...props} />;
}

function ImageWithFallback({ src, alt, sizes, className, priority = false, dark = false }: GymImageProps) {
  const [failed, setFailed] = useState(false);
  if (!isSupportedImageSource(src) || failed) return dark ? <div className="absolute inset-0 bg-slate-800" /> : <FallbackGymImage />;
  return <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className={className}
    onError={() => setFailed(true)} />;
}
