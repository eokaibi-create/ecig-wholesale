import { NextResponse } from 'next/server'
import { createHash } from 'crypto'

export async function GET() {
  const cloudName = 'dlmgdbrte'
  const apiKey = '439615235726973'
  const apiSecret = 'gJPjgj7n9Fkf1zlfeXCDIZeb1jY'
  const uploadPreset = 'ecig_upload'
  const timestamp = Math.floor(Date.now() / 1000)
  const folder = 'ecig-wholesale'

  // 签名上传：Cloudinary 要求的签名参数字符串为
  // 'folder=xxx&timestamp=xxx&upload_preset=xxx'
  // 不包含 api_key！参数按字母序排列
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
