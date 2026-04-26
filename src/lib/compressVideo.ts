// 浏览器端压缩视频（使用 FFmpeg.wasm）
// 超过 90MB 的视频自动压缩到 ~80MB

const MAX_CLOUDINARY_SIZE = 95 * 1024 * 1024  // 留点余量，95MB
const TARGET_SIZE_MB = 80
const TARGET_SIZE_BYTES = TARGET_SIZE_MB * 1024 * 1024

export async function compressVideoIfNeeded(file: File): Promise<File> {
  // 未超过限制则不压缩
  if (file.size <= MAX_CLOUDINARY_SIZE) {
    console.log(`✅ 视频 ${file.name} (${(file.size / 1024 / 1024).toFixed(1)}MB) 未超过限制，直接上传`)
    return file
  }

  console.log(`⚙️ 视频 ${file.name} (${(file.size / 1024 / 1024).toFixed(1)}MB) 超过限制，准备压缩...`)

  try {
    const { FFmpeg } = await import('@ffmpeg/ffmpeg')
    const { fetchFile } = await import('@ffmpeg/util')

    const ffmpeg = new FFmpeg()
    
    // 显示进度
    ffmpeg.on('progress', ({ progress, time }) => {
      const pct = Math.round(progress * 100)
      console.log(`⏳ 压缩进度: ${pct}%`)
    })

    await ffmpeg.load()

    // 写输入文件
    const inputName = 'input' + getExtension(file.name)
    await ffmpeg.writeFile(inputName, await fetchFile(file))

    // 计算需要的压缩比
    const ratio = TARGET_SIZE_BYTES / file.size
    // bitrate 调整：用原始大小 * 比例 / 时长
    // 先用较低码率试试
    const crf = getCRF(ratio)

    console.log(`📊 压缩参数: 原大小=${(file.size / 1024 / 1024).toFixed(1)}MB, 目标=${TARGET_SIZE_MB}MB, CRF=${crf}`)

    // 获取视频时长用于精确控制
    await ffmpeg.exec(['-i', inputName, '-f', 'null', '-c', 'copy', '-map', '0:v:0', '-'])
    
    // 执行压缩 - 用 CRF + 最大码率控制
    const outputName = 'output.mp4'
    await ffmpeg.exec([
      '-i', inputName,
      '-c:v', 'libx264',
      '-preset', 'medium',          // 平衡压缩率和速度
      '-crf', String(crf),          // 质量参数（越高越小）
      '-c:a', 'aac',
      '-b:a', '128k',               // 音频码率
      '-movflags', '+faststart',    // 流式优化
      '-y',
      outputName
    ])

    // 读取压缩后的文件
    const data = await ffmpeg.readFile(outputName)
    const compressedBlob = new Blob([data], { type: 'video/mp4' })

    // 如果压缩后还是太大，再压缩一轮
    if (compressedBlob.size > MAX_CLOUDINARY_SIZE) {
      console.log(`⚠️ 第一次压缩后 ${(compressedBlob.size / 1024 / 1024).toFixed(1)}MB 仍然超过限制，二次压缩...`)
      
      const secondCrf = Math.min(crf + 6, 51)
      await ffmpeg.exec([
        '-i', outputName,
        '-c:v', 'libx264',
        '-preset', 'medium',
        '-crf', String(secondCrf),
        '-c:a', 'aac',
        '-b:a', '96k',
        '-movflags', '+faststart',
        '-y',
        'output2.mp4'
      ])

      const data2 = await ffmpeg.readFile('output2.mp4')
      const compressedBlob2 = new Blob([data2], { type: 'video/mp4' })
      
      const compressedFile = new File([compressedBlob2], file.name.replace(/\.[^.]+$/, '.mp4'), {
        type: 'video/mp4',
      })
      
      console.log(`✅ 二次压缩完成: ${(compressedBlob2.size / 1024 / 1024).toFixed(1)}MB`)
      return compressedFile
    }

    const compressedFile = new File([compressedBlob], file.name.replace(/\.[^.]+$/, '.mp4'), {
      type: 'video/mp4',
    })

    console.log(`✅ 压缩完成: ${(compressedBlob.size / 1024 / 1024).toFixed(1)}MB`)
    return compressedFile

  } catch (err: any) {
    console.error('❌ 压缩失败，返回原始文件:', err.message)
    return file
  }
}

function getExtension(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase()
  if (ext === 'mp4') return '.mp4'
  if (ext === 'webm') return '.webm'
  if (ext === 'mov') return '.mov'
  if (ext === 'ogg') return '.ogg'
  return '.mp4'
}

function getCRF(ratio: number): number {
  // ratio: 目标大小 / 原始大小
  if (ratio >= 0.8) return 23  // 轻微压缩
  if (ratio >= 0.6) return 26
  if (ratio >= 0.4) return 28
  if (ratio >= 0.25) return 30
  if (ratio >= 0.15) return 33
  return 35  // 重度压缩
}

export function isVideo(file: File): boolean {
  return file.type.startsWith('video/')
}

export function formatSize(bytes: number): string {
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(0) + 'KB'
  return (bytes / 1024 / 1024).toFixed(1) + 'MB'
}
