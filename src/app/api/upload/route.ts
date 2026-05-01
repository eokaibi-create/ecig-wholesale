import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth'

const ALLOWED_TYPES = [
  'image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif',
  'video/mp4', 'video/webm', 'video/quicktime',
]
const MAX_FILE_SIZE = 200 * 1024 * 1024 // 200MB (videos can be large)
const MAX_IMAGE_SIZE = 10 * 1024 * 1024  // 10MB for images

export async function POST(request: NextRequest) {
  try {
    // 验证管理员权限
    const auth = await requireAdmin(request)
    if (!auth.authorized) {
      return NextResponse.json({ error: auth.error!.message }, { status: auth.error!.status })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: '没有上传文件' }, { status: 400 })
    }

    // 🔒 文件类型验证
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({
        error: `不支持的文件类型: ${file.type}。仅支持: JPG, PNG, WebP, GIF, AVIF, MP4, WebM 格式`,
      }, { status: 400 })
    }

    // 🔒 文件大小验证
    const isVideo = file.type.startsWith('video/')
    const maxSize = isVideo ? MAX_FILE_SIZE : MAX_IMAGE_SIZE
    if (file.size > maxSize) {
      const maxSizeMB = maxSize / (1024 * 1024)
      return NextResponse.json({
        error: `文件过大（${(file.size / (1024 * 1024)).toFixed(1)}MB），${isVideo ? '视频' : '图片'}最大 ${maxSizeMB}MB`,
      }, { status: 400 })
    }

    // 上传到 Cloudinary
    const cloudFormData = new FormData()
    cloudFormData.append('file', file)
    cloudFormData.append('upload_preset', process.env.CLOUDINARY_UPLOAD_PRESET || 'ecig_upload')
    cloudFormData.append('folder', 'ecig-wholesale')

    const cloudRes = await fetch('https://api.cloudinary.com/v1_1/dlmgdbrte/auto/upload', {
      method: 'POST',
      body: cloudFormData,
    })

    if (!cloudRes.ok) {
      const err = await cloudRes.text()
      console.error('Cloudinary error:', err)
      return NextResponse.json({ error: '上传到云存储失败' }, { status: 500 })
    }

    const data = await cloudRes.json()

    return NextResponse.json({
      url: data.secure_url,
      publicId: data.public_id,
      filename: file.name,
      type: isVideo ? 'video' : 'image',
      size: file.size,
      success: true,
    })
  } catch (error: any) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: '上传失败' }, { status: 500 })
  }
}
