import { NextResponse } from 'next/server'
import { createHash } from 'crypto'

export async function GET() {
  const cloudName = 'dlmgdbrte'
  const apiKey = '439615235726973'
  const apiSecret = 'gJPjgj7n9Fkf1zlfeXCDIZeb1jY'
  const uploadPreset = 'ecig_upload'
  const timestamp = Math.floor(Date.now() / 1000)

  // 构建签名：参数按字母排序 + API Secret
  const paramsStr = `timestamp=${timestamp}&upload_preset=${uploadPreset}${apiSecret}`
  const signature = createHash('sha1').update(paramsStr).digest('hex')

  return NextResponse.json({
    cloudName,
    apiKey,
    uploadPreset,
    timestamp,
    signature,
    folder: 'ecig-wholesale',
  })
}
