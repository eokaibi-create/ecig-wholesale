import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createHash } from 'crypto'

const CLOUD_NAME = 'dlmgdbrte'
const API_KEY = '439615235726973'
const API_SECRET = 'gJPjgj7n9Fkf1zlfeXCDIZeb1jY'
const UPLOAD_PRESET = 'ecig_upload'
const FOLDER = 'ecig-wholesale/brands'

async function uploadBase64ToCloudinary(base64Data: string, filename: string): Promise<string | null> {
  try {
    const matches = base64Data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/)
    if (!matches || matches.length !== 3) return null

    const mimeType = matches[1]
    const base64Content = matches[2]
    const timestamp = Math.floor(Date.now() / 1000)

    const params = [
      `folder=${FOLDER}`,
      `public_id=${filename}`,
      `timestamp=${timestamp}`,
      `upload_preset=${UPLOAD_PRESET}`,
    ]
    const signature = createHash('sha1')
      .update(params.join('&') + API_SECRET)
      .digest('hex')

    const formData = new URLSearchParams()
    formData.append('file', `data:${mimeType};base64,${base64Content}`)
    formData.append('api_key', API_KEY)
    formData.append('timestamp', String(timestamp))
    formData.append('upload_preset', UPLOAD_PRESET)
    formData.append('folder', FOLDER)
    formData.append('public_id', filename)
    formData.append('signature', signature)

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      { method: 'POST', body: formData, headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    )

    if (!response.ok) return null
    const data = await response.json()
    return data.secure_url
  } catch {
    return null
  }
}

export async function POST() {
  const results: { name: string; status: string; url?: string }[] = []
  let fixedCount = 0

  const brands = await prisma.brand.findMany()

  for (const brand of brands) {
    if (!brand.logo || !brand.logo.startsWith('data:')) {
      results.push({ name: brand.name, status: 'skipped' })
      continue
    }

    const filename = `brand-${brand.slug}`
    const cloudUrl = await uploadBase64ToCloudinary(brand.logo, filename)

    if (cloudUrl) {
      await prisma.brand.update({
        where: { id: brand.id },
        data: { logo: cloudUrl },
      })
      results.push({ name: brand.name, status: 'fixed', url: cloudUrl })
      fixedCount++
    } else {
      results.push({ name: brand.name, status: 'failed' })
    }
  }

  return NextResponse.json({
    success: true,
    fixed: fixedCount,
    total: brands.length,
    results,
  })
}
