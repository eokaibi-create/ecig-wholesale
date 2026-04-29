import { NextResponse } from 'next/server'
import { createHash } from 'crypto'

const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'dlmgdbrte'
const apiKey = process.env.CLOUDINARY_API_KEY
const apiSecret = process.env.CLOUDINARY_API_SECRET

export async function GET() {
  if (!apiKey || !apiSecret) {
    return NextResponse.json(
      { error: 'Cloudinary 未配置，请在 .env 中设置 CLOUDINARY_API_KEY 和 CLOUDINARY_API_SECRET' },
      { status: 500 }
    )
  }

  const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET || 'ecig_upload'
  const timestamp = Math.floor(Date.now() / 1000)
  const folder = 'ecig-wholesale'

  // 签名上传：Cloudinary 要求的签名参数字符串
  const params = [
    `folder=${folder}`,
    `timestamp=${timestamp}`,
    `upload_preset=${uploadPreset}`,
  ]
  const signature = createHash('sha1')
    .update(params.join('&') + apiSecret)
    .digest('hex')

  return NextResponse.json({
    cloudName,
    apiKey,
    uploadPreset,
    timestamp,
    folder,
    signature,
  })
}
