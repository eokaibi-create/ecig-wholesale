// 浏览器内置视频压缩（使用 MediaRecorder API，无需额外下载）
// Cloudinary 免费版上传限制 ≈ 100MB，超过此大小的视频自动压缩

const MAX_SIZE = 95 * 1024 * 1024 // 95MB — Cloudinary 免费限制约 100MB，留余量
const TARGET_SIZE = 80 * 1024 * 1024 // 目标压缩到 80MB

export async function compressVideoIfNeeded(file: File): Promise<File> {
 // 仅对 MP4 视频尝试压缩，.mov/.webm 等直接上传让 Cloudinary 处理
 if (file.type !== "video/mp4") return file
 if (file.size <= MAX_SIZE) {
 console.log(` 视频 ${(file.size / 1024 / 1024).toFixed(1)}MB，在限制内，无需压缩`)
 return file
 }

 console.log(` 视频超过限制: ${(file.size / 1024 / 1024).toFixed(1)}MB > 95MB，开始压缩`)

 return new Promise((resolve) => {
 try {
 const video = document.createElement('video')
 video.muted = true
 video.playsInline = true
 const url = URL.createObjectURL(file)
 video.src = url

 let done = false
 const finish = (f: File) => {
 if (!done) { done = true; resolve(f) }
 }

 video.onloadedmetadata = () => {
 const duration = video.duration
 if (!duration || duration <= 0 || !isFinite(duration)) return finish(file)

 // 目标大小 80MB，根据视频时长计算码率
 const targetBits = TARGET_SIZE * 8
 const videoBitrate = Math.floor((targetBits / duration) * 0.85)

 try { video.currentTime = 0.1 } catch {}

 video.onseeked = () => {
 try {
 const stream = (video as any).captureStream?.()
 if (!stream || !stream.getVideoTracks || stream.getVideoTracks().length === 0) {
 return finish(file)
 }

 const types = [
 'video/webm;codecs=vp9,opus',
 'video/webm;codecs=vp8,opus',
 'video/webm',
 ]
 let mimeType = 'video/webm'
 for (const t of types) {
 if (MediaRecorder.isTypeSupported(t)) {
 mimeType = t
 break
 }
 }

 const chunks: Blob[] = []
 let chunksSize = 0

 const recorder = new MediaRecorder(stream, {
 mimeType,
 videoBitsPerSecond: Math.max(videoBitrate, 500000),
 })

 recorder.ondataavailable = (e) => {
 if (e.data.size > 0) {
 chunks.push(e.data)
 chunksSize += e.data.size
 }
 }

 recorder.onstop = () => {
 const blob = new Blob(chunks, { type: 'video/mp4' })
 URL.revokeObjectURL(url)
 try { stream.getTracks().forEach((t: MediaStreamTrack) => t.stop()) } catch {}
 try { video.remove() } catch {}

 if (blob.size > 0 && blob.size < file.size) {
 const newFile = new File([blob], file.name.replace(/\.[^.]+$/, '.mp4'), { type: 'video/mp4' })
 console.log(` 压缩完成: ${(file.size / 1024 / 1024).toFixed(1)}MB → ${(blob.size / 1024 / 1024).toFixed(1)}MB`)
 finish(newFile)
 } else {
 console.log(' 压缩未变小，返回原文件')
 finish(file)
 }
 }

 recorder.onerror = () => finish(file)
 recorder.start(1000)

 video.play().then(() => {
 video.onended = () => {
 if (recorder.state === 'recording') recorder.stop()
 }
 }).catch(() => finish(file))

 setTimeout(() => {
 if (recorder.state === 'recording') {
 try { video.pause() } catch {}
 recorder.stop()
 }
 }, duration * 1000 + 10000)

 } catch { finish(file) }
 }

 setTimeout(() => {
 if (!done) finish(file)
 }, 5000)
 }

 video.onerror = () => finish(file)
 } catch { resolve(file) }
 })
}

export function isVideo(file: File): boolean {
 return file.type.startsWith('video/')
}

export function formatSize(bytes: number): string {
 if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(0) + 'KB'
 return (bytes / 1024 / 1024).toFixed(1) + 'MB'
}
