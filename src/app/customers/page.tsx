import { prisma } from '@/lib/prisma'
import Link from 'next/link'

export default async function CustomersPage() {
  const settings = await prisma.setting.findMany()
  const settingMap = Object.fromEntries(settings.map(s => [s.key, s.value]))

  return (
    <div className="bg-white min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold">客户服务</h1>
          <p className="mt-2 text-lg text-gray-300">为您提供全方位的采购支持与售后服务</p>
        </div>
      </section>

      {/* 为什么选我们 */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">批发合作优势</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: '💰', title: '有竞争力的价格', desc: '与一线品牌工厂直接合作，去掉中间环节，提供最具竞争力的批发价格' },
              { icon: '📋', title: '简化采购流程', desc: '在线选品、快速报价、一键下单，从询价到发货全程跟踪' },
              { icon: '🎁', title: '阶梯折扣', desc: '采购量越大折扣越高，长期合作客户享受专属优惠价格' },
              { icon: '🚚', title: '物流配送', desc: '全美48州覆盖，支持UPS/FedEx快递，3-5个工作日送达' },
              { icon: '🛡️', title: '正品保障', desc: '所有产品均为品牌正品，提供质量保证，假一赔十' },
              { icon: '💁', title: '专属客服', desc: '一对一客户经理服务，中英文双语支持，快速响应您的需求' },
            ].map((item, i) => (
              <div key={i} className="p-6 border border-gray-100 rounded-xl hover:shadow-md hover:border-amber-200 transition">
                <div className="text-4xl mb-3">{item.icon}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 采购流程 */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">采购流程</h2>
            <p className="mt-2 text-gray-600">简单四步，轻松采购</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { step: '01', title: '浏览选品', desc: '浏览产品目录，选择需要的商品' },
              { step: '02', title: '提交询价', desc: '填写询价单或直接联系客服获取报价' },
              { step: '03', title: '确认订单', desc: '确认价格与库存，支付定金' },
              { step: '04', title: '安排发货', desc: '支付尾款，安排物流配送' },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="w-16 h-16 bg-amber-500 text-black text-2xl font-bold rounded-full flex items-center justify-center mx-auto mb-4">{item.step}</div>
                <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">常见问题</h2>
          </div>
          <div className="space-y-4">
            {[
              { q: '最低起订量是多少？', a: '最低起订量为$500，首次合作客户建议订单$1000以上以享受更优价格。' },
              { q: '支持哪些支付方式？', a: '支持银行转账（Wire Transfer）、Zelle、PayPal（企业账户）、信用卡（+3%手续费）。' },
              { q: '发货后多久能收到？', a: '美国本土订单使用UPS/FedEx Ground，通常3-5个工作日送达。可加急至隔日达。' },
              { q: '是否支持样品？', a: '支持样品采购，请联系客服获取样品清单和价格。' },
              { q: '是否支持退货？', a: '产品质量问题支持退换货，请在收货后7天内联系客服处理。' },
            ].map((item, i) => (
              <details key={i} className="group border border-gray-200 rounded-xl overflow-hidden">
                <summary className="px-6 py-4 text-gray-900 font-semibold cursor-pointer hover:bg-gray-50 flex items-center justify-between">
                  {item.q}
                  <svg className="w-5 h-5 text-gray-400 group-open:rotate-180 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="px-6 py-4 border-t border-gray-100 text-gray-600">{item.a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* 联系方式 */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-8">联系我们</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-gray-800 rounded-xl">
              <div className="text-3xl mb-3">💬</div>
              <h3 className="font-bold mb-2">WhatsApp</h3>
              <a href={`https://wa.me/${settingMap.whatsapp?.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="text-amber-400 hover:text-amber-300">
                {settingMap.whatsapp || '+15559876543'}
              </a>
            </div>
            <div className="p-6 bg-gray-800 rounded-xl">
              <div className="text-3xl mb-3">💚</div>
              <h3 className="font-bold mb-2">微信</h3>
              <p className="text-amber-400">{settingMap.wechat || 'vaporx_us'}</p>
            </div>
            <div className="p-6 bg-gray-800 rounded-xl">
              <div className="text-3xl mb-3">📧</div>
              <h3 className="font-bold mb-2">Email</h3>
              <a href={`mailto:${settingMap.email}`} className="text-amber-400 hover:text-amber-300">{settingMap.email || 'info@vaporx.com'}</a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
