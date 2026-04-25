import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: '没有上传文件' }, { status: 400 })
    }

    const allowedTypes = [
      'image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml', 'image/avif',
      'video/mp4', 'video/webm', 'video/ogg', 'video/quicktime',
    ]
    const isImage = file.type.startsWith('image/')
    const isVideo = file.type.startsWith('video/')
    
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: '不支持的文件类型' }, { status: 400 })
    }

    const maxSize = isVideo ? 50 * 1024 * 1024 : 10 * 1024 * 1024 // 视频50MB, 图片10MB
    if (file.size > maxSize) {
      return NextResponse.json({ 
        error: `文件过大，${isVideo ? '视频最大支持 50MB' : '图片最大支持 10MB'}` 
      }, { status: 400 })
    }

    // 将文件转为 Base64 Data URL
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64 = buffer.toString('base64')
    const dataUrl = `data:${file.type};base64,${base64}`

    return NextResponse.json({ 
      url: dataUrl, 
      filename: file.name,
      type: isVideo ? 'video' : 'image',
      size: file.size,
      success: true 
    })
  } catch (error: any) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: error.message || '上传失败' }, { status: 500 })
  }
}
