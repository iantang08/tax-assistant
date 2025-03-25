"use client"

import type React from "react"

import { type ReactNode, useRef } from "react"

interface FileUploadProps {
  onFileSelect: (file: File) => void
  children: ReactNode
  disabled?: boolean
}

export default function FileUpload({ onFileSelect, children, disabled = false }: FileUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleClick = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      onFileSelect(file)
      // Reset the input so the same file can be uploaded again
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  return (
    <div onClick={handleClick} className={disabled ? "cursor-not-allowed" : "cursor-pointer"}>
      {children}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
        className="hidden"
        disabled={disabled}
      />
    </div>
  )
}

