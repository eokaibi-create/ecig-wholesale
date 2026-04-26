import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: '没有上传文件' }, { status: 400 })
    }

    // 直接上传到 Cloudinary（无大小限制，200MB 内视频+图片）
    const cloudFormData = new FormData()
    cloudFormData.append('file', file)
    cloudFormData.append('upload_preset', 'ecig_upload')
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
    const isVideo = file.type.startsWith('video/')

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
    return NextResponse.json({ error: error.message || '上传失败' }, { status: 500 })
  }
}
