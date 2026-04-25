import { prisma } from '@/lib/prisma'

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string; error?: string }>
}) {
  const [settings, params] = await Promise.all([
    prisma.setting.findMany(),
    searchParams,
  ])
  const settingMap = Object.fromEntries(settings.map(s => [s.key, s.value]))
  const success = params.success === 'true'
  const error = params.error === 'true'

  return (
    <div className="bg-white min-h-screen">
      <section className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold">联系我们</h1>
          <p className="mt-2 text-lg text-gray-300">24小时内回复，期待与您合作</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* 成功提示 */}
        {success && (
          <div className="mb-8 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3">
            <span className="text-2xl">✅</span>
            <div>
              <p className="font-semibold text-green-800">询价已提交成功！</p>
              <p className="text-sm text-green-600">我们的销售团队将在24小时内通过邮件联系您。</p>
            </div>
          </div>
        )}
        {/* 错误提示 */}
        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
            <span className="text-2xl">❌</span>
            <div>
              <p className="font-semibold text-red-800">提交失败，请重试</p>
              <p className="text-sm text-red-600">如果问题持续，请直接通过 WhatsApp 或邮件联系我们。</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* 联系表单 */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">发送询价</h2>
            <form action="/api/inquiries" method="POST" className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">姓名 *</label>
                  <input type="text" name="name" required
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">公司名称</label>
                  <input type="text" name="company"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none" />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">邮箱 *</label>
                  <input type="email" name="email" required
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">电话</label>
                  <input type="tel" name="phone"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">采购产品 / 需求描述 *</label>
                <textarea name="message" rows={5} required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
                  placeholder="请描述您需要采购的产品、数量和您的需求..."></textarea>
              </div>
              <button type="submit"
                className="w-full px-6 py-3 bg-amber-500 hover:bg-amber-600 text-black font-bold rounded-lg transition text-lg">
                提交询价
              </button>
            </form>
          </div>

          {/* 联系信息 */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">联系方式</h2>
            <div className="space-y-6">
              <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-xl">
                <div className="text-2xl">📍</div>
                <div>
                  <h3 className="font-semibold text-gray-900">公司地址</h3>
                  <p className="text-gray-600">{settingMap.address || '1234 Commerce Blvd, Los Angeles, CA 90001'}</p>
                </div>
              </div>
              <div className="flex items-start space-x-4 p-4 bg-green-50 rounded-xl border border-green-100">
                <div className="text-2xl">💬</div>
                <div>
                  <h3 className="font-semibold text-gray-900">WhatsApp</h3>
                  <a href={`https://wa.me/${(settingMap.whatsapp || '+13239260829').replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer"
                    className="text-green-600 hover:text-green-700 font-medium">{settingMap.whatsapp || '+13239260829'}</a>
                  <p className="text-sm text-gray-500">点击直接对话，回复最快</p>
                </div>
              </div>
              <div className="flex items-start space-x-4 p-4 bg-green-50 rounded-xl border border-green-100">
                <div className="text-2xl">💚</div>
                <div>
                  <h3 className="font-semibold text-gray-900">微信</h3>
                  <p className="text-green-600 font-medium">{settingMap.wechat || 'EA_YONG'}</p>
                  <p className="text-sm text-gray-500">扫码添加，获取产品目录和报价单</p>
                </div>
              </div>
              <div className="flex items-start space-x-4 p-4 bg-blue-50 rounded-xl border border-blue-100">
                <div className="text-2xl">📧</div>
                <div>
                  <h3 className="font-semibold text-gray-900">Email</h3>
                  <a href={`mailto:${settingMap.email || 'EOKAIBI@GMAIL.COM'}`} className="text-blue-600 hover:text-blue-700 font-medium">{settingMap.email || 'EOKAIBI@GMAIL.COM'}</a>
                  <p className="text-sm text-gray-500">24小时内回复</p>
                </div>
              </div>
              <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-xl">
                <div className="text-2xl">📞</div>
                <div>
                  <h3 className="font-semibold text-gray-900">电话</h3>
                  <p className="text-gray-600">{settingMap.phone || '+1 (555) 123-4567'}</p>
                  <p className="text-sm text-gray-500">周一至周五 9AM - 6PM PST</p>
                </div>
              </div>
            </div>

            <div className="mt-8 p-6 bg-amber-50 rounded-xl border border-amber-200">
              <h3 className="font-bold text-gray-900 mb-2">💡 批发提示</h3>
              <p className="text-sm text-gray-600">
                最低起订量: <strong>${settingMap.min_order || '500'}</strong><br/>
                {settingMap.shipping_info || '全美48州免运费，订单满$1000起批'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
