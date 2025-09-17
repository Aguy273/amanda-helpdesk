"use client"

import { FileText, ImageIcon, Video, Download, Eye, X, Play, Pause, Volume2, VolumeX, Maximize } from "lucide-react"
import type { ReportAttachment } from "@/types"
import { useState, useRef } from "react"

interface ReportAttachmentsProps {
  attachments: ReportAttachment[]
}

export function ReportAttachments({ attachments }: ReportAttachmentsProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [playingVideo, setPlayingVideo] = useState<string | null>(null)
  const [videoStates, setVideoStates] = useState<Record<string, { isPlaying: boolean; isMuted: boolean }>>({})
  const videoRefs = useRef<Record<string, HTMLVideoElement>>({})

  if (!attachments || attachments.length === 0) {
    return null
  }

  const getFileIcon = (type: ReportAttachment["type"]) => {
    switch (type) {
      case "image":
        return <ImageIcon className="w-5 h-5 text-blue-500" />
      case "video":
        return <Video className="w-5 h-5 text-purple-500" />
      case "document":
        return <FileText className="w-5 h-5 text-green-500" />
      default:
        return <FileText className="w-5 h-5 text-gray-500" />
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const handleVideoPlay = (attachmentId: string) => {
    const video = videoRefs.current[attachmentId]
    if (video) {
      if (video.paused) {
        video.play()
        setVideoStates((prev) => ({
          ...prev,
          [attachmentId]: { ...prev[attachmentId], isPlaying: true },
        }))
      } else {
        video.pause()
        setVideoStates((prev) => ({
          ...prev,
          [attachmentId]: { ...prev[attachmentId], isPlaying: false },
        }))
      }
    }
  }

  const handleVideoMute = (attachmentId: string) => {
    const video = videoRefs.current[attachmentId]
    if (video) {
      video.muted = !video.muted
      setVideoStates((prev) => ({
        ...prev,
        [attachmentId]: { ...prev[attachmentId], isMuted: video.muted },
      }))
    }
  }

  const handleVideoFullscreen = (attachmentId: string) => {
    const video = videoRefs.current[attachmentId]
    if (video && video.requestFullscreen) {
      video.requestFullscreen()
    }
  }

  const isImage = (filename: string) => {
    const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".bmp", ".webp", ".svg"]
    return imageExtensions.some((ext) => filename.toLowerCase().endsWith(ext))
  }

  const isVideo = (filename: string) => {
    const videoExtensions = [".mp4", ".webm", ".ogg", ".avi", ".mov", ".wmv", ".flv", ".mkv"]
    return videoExtensions.some((ext) => filename.toLowerCase().endsWith(ext))
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Lampiran ({attachments.length})</h3>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {attachments.map((attachment) => {
            const videoState = videoStates[attachment.id] || { isPlaying: false, isMuted: false }

            return (
              <div
                key={attachment.id}
                className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
              >
                {/* File Header */}
                <div className="p-4 bg-gray-50 border-b border-gray-200">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1 min-w-0">
                      <div className="flex-shrink-0 mt-1">{getFileIcon(attachment.type)}</div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-gray-900 truncate" title={attachment.name}>
                          {attachment.name}
                        </h4>
                        <p className="text-xs text-gray-500 mt-1">
                          {formatFileSize(attachment.size)} • {attachment.type}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          Diunggah{" "}
                          {new Date(attachment.uploadedAt).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>

                    <div className="flex space-x-2 ml-2">
                      {(attachment.type === "image" || isImage(attachment.name)) && (
                        <button
                          onClick={() => setSelectedImage(attachment.url)}
                          className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Lihat gambar"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => window.open(attachment.url, "_blank")}
                        className="p-2 text-gray-400 hover:text-green-500 hover:bg-green-50 rounded-lg transition-colors"
                        title="Download"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Media Content */}
                <div className="p-4">
                  {(attachment.type === "image" || isImage(attachment.name)) && (
                    <div className="relative group cursor-pointer" onClick={() => setSelectedImage(attachment.url)}>
                      <img
                        src={attachment.url || "/placeholder.svg"}
                        alt={attachment.name}
                        className="w-full h-48 object-cover rounded-lg border border-gray-200 group-hover:opacity-90 transition-opacity"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 rounded-lg flex items-center justify-center">
                        <Eye className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                  )}

                  {(attachment.type === "video" || isVideo(attachment.name)) && (
                    <div className="relative">
                      <video
                        ref={(el) => {
                          if (el) videoRefs.current[attachment.id] = el
                        }}
                        className="w-full h-48 object-cover rounded-lg border border-gray-200"
                        poster="/placeholder.svg"
                        onPlay={() =>
                          setVideoStates((prev) => ({
                            ...prev,
                            [attachment.id]: { ...prev[attachment.id], isPlaying: true },
                          }))
                        }
                        onPause={() =>
                          setVideoStates((prev) => ({
                            ...prev,
                            [attachment.id]: { ...prev[attachment.id], isPlaying: false },
                          }))
                        }
                      >
                        <source src={attachment.url} type="video/mp4" />
                        Browser Anda tidak mendukung video HTML5.
                      </video>

                      {/* Video Controls Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-lg opacity-0 hover:opacity-100 transition-opacity duration-200">
                        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleVideoPlay(attachment.id)}
                              className="p-2 bg-white/20 hover:bg-white/30 rounded-full text-white transition-colors"
                            >
                              {videoState.isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                            </button>
                            <button
                              onClick={() => handleVideoMute(attachment.id)}
                              className="p-2 bg-white/20 hover:bg-white/30 rounded-full text-white transition-colors"
                            >
                              {videoState.isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                            </button>
                          </div>
                          <button
                            onClick={() => handleVideoFullscreen(attachment.id)}
                            className="p-2 bg-white/20 hover:bg-white/30 rounded-full text-white transition-colors"
                          >
                            <Maximize className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {attachment.type === "document" && !isImage(attachment.name) && !isVideo(attachment.name) && (
                    <div className="flex items-center justify-center h-32 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                      <div className="text-center">
                        <FileText className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-500">Dokumen</p>
                        <p className="text-xs text-gray-400 mt-1">Klik download untuk membuka</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Image Lightbox Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-4xl max-h-full">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
            >
              <X className="w-8 h-8" />
            </button>
            <img
              src={selectedImage || "/placeholder.svg"}
              alt="Preview"
              className="max-w-full max-h-[80vh] object-contain rounded-lg"
            />
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
              <button
                onClick={() => window.open(selectedImage, "_blank")}
                className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg backdrop-blur-sm transition-colors flex items-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>Download</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
