"use client";
import { useTheme } from 'next-themes'
import Image from 'next/image';
import React from 'react'

const ImageLogo = () => {
  const { theme } = useTheme();
  return (
    <Image src="/acadamn-logo.svg" className="object-contain" height={100} width={200} alt="logo" />
  )
}

export default ImageLogo