import { NextResponse } from 'next/server'
import { createHash } from 'crypto'

export async function GET() {
  const cloudName = 'dlmgdbrte'
  const apiKey = '439615235726973'
  const apiSecret = 'gJPjgj7n9Fkf1zlfeXCDIZeb1jY'
  const uploadPreset = 'ecig_upload'
  const timestamp = Math.floor(Date.now() / 1000)
  const folder = 'ecig-wholesale'

  // 签名上传：参数必须按字典序排列，所有非文件参数都参与签名
  const params = [
    `api_key=${apiKey}`,
    `folder=${folder}`,
    `timestamp=${timestamp}`,
    `upload_preset=${uploadPreset}`,
  ]
  // 按字典序排序
  params.sort()

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
