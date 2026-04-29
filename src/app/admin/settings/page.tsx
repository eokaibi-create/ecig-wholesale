import { prisma } from '@/lib/prisma'
import AdminLayout from '@/components/AdminLayout'
import { redirect } from 'next/navigation'

// 设置分组和友好名称
const settingGroups = [
  {
    title: '🏠 首页区块标题',
    desc: '修改首页各区块的标题和描述文字',
    keys: [
      { key: 'hero_title', label: '新品区块标题', default: '新品热荐' },
      { key: 'hero_desc', label: '新品区块描述', default: '' },
      { key: 'section_product_title', label: '产品中心标题', default: '产品中心' },
      { key: 'section_product_desc', label: '产品中心描述', default: '全系列产品，满足各类批发需求' },
      { key: 'section_brand_title', label: '合作品牌标题', default: '合作品牌' },
      { key: 'section_brand_desc', label: '合作品牌描述', default: 'VAPOR-X 与全球顶级电子烟品牌战略合作' },
      { key: 'section_platform_title', label: '合作平台标题', default: '合作平台' },
      { key: 'section_platform_desc', label: '合作平台描述', default: '多平台布局，助力您的电子烟业务全球拓展' },
      { key: 'section_contact_title', label: 'Contact Us Title', default: 'Contact Us' },
      { key: 'section_contact_desc', label: 'Contact Us Description', default: 'Reach out for wholesale pricing and product info' },
    ],
  },
  {
    title: '📞 联系方式',
    desc: '修改网站的各类联系方式',
    keys: [
      { key: 'whatsapp', label: 'WhatsApp 号码', default: '+13239260829' },
      { key: 'email', label: 'Email 地址', default: 'EOKAIBI@GMAIL.COM' },
      { key: 'phone', label: '电话', default: '+1 (323) 926-0829' },
      { key: 'wechat', label: '微信', default: 'EA_YONG' },
      { key: 'address', label: '公司地址', default: 'Los Angeles, CA' },
    ],
  },
  {
    title: '⚙️ 其他设置',
    desc: '网站基本信息和运营参数',
    keys: [
      { key: 'site_name', label: '站点名称', default: 'VAPOR-X USA' },
      { key: 'site_description', label: '站点描述', default: '美国电子烟批发供应商' },
      { key: 'site_logo', label: 'Logo URL', default: '/vaporx-logo.svg' },
      { key: 'min_order', label: '最低起订量($)', default: '500' },
    ],
  },
  {
    title: '📧 邮件通知',
    desc: '当客户提交询价时，系统会自动发送邮件通知到以下地址（需要在 Vercel 环境变量中设置 RESEND_API_KEY）',
    keys: [
      { key: 'admin_email', label: '管理员邮箱（接收通知）', default: 'EOKAIBI@GMAIL.COM' },
      { key: 'email_from', label: '发件人邮箱', default: 'onboarding@resend.dev' },
    ],
  },
]

export default async function AdminSettingsPage() {
  const settings = await prisma.setting.findMany({ orderBy: { key: 'asc' } })
  const settingMap = Object.fromEntries(settings.map(s => [s.key, s.value]))

  return (
    <AdminLayout active="系统设置">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">⚙️ 系统设置</h1>
        <p className="text-sm text-gray-500 mb-6">所有设置实时生效，修改后无需重启</p>

        <form action="/api/settings" method="POST" className="space-y-6">
          {settingGroups.map((group) => (
            <div key={group.title} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-1">{group.title}</h2>
              <p className="text-sm text-gray-500 mb-4">{group.desc}</p>
              
              <div className="space-y-3">
                {group.keys.map(({ key, label, default: defaultVal }) => (
                  <div key={key}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {label}
                      <span className="text-xs text-gray-400 ml-2">({key})</span>
                    </label>
                    <input
                      type="text"
                      name={key}
                      defaultValue={settingMap[key] || defaultVal || ''}
                      placeholder={defaultVal}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div className="flex justify-end">
            <button type="submit"
              className="px-8 py-3 bg-amber-500 hover:bg-amber-600 text-black font-bold rounded-lg transition text-lg">
              💾 保存所有设置
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  )
}
