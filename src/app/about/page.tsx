import { prisma } from '@/lib/prisma'
import Link from 'next/link'

export default async function AboutPage() {
  const settings = await prisma.setting.findMany()
  const settingMap = Object.fromEntries(settings.map(s => [s.key, s.value]))

  return (
    <div className="bg-white min-h-screen">
      {/* ============ HERO ============ */}
      <section className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-3 mb-6">
            <img src="/vaporx-logo.svg" alt="VAPOR-X" className="h-10 w-auto" />
            <h1 className="text-4xl font-bold">关于 <span className="text-amber-400">VAPOR-X</span></h1>
          </div>
          <p className="text-xl text-gray-300 max-w-3xl">
            美国领先的电子烟批发供应商 — 自2018年成立以来，已服务超过5000+批发客户
          </p>
        </div>
      </section>

      {/* ============ 品牌故事 ============ */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">我们的故事</h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  <strong className="text-gray-900">VAPOR-X</strong> 成立于2018年，总部位于美国加利福尼亚州洛杉矶。
                  我们从一家小型电子烟批发商起步，凭借着对产品质量的严格把控和对客户服务的执着追求，
                  迅速发展成为全美知名的电子烟批发供应商。
                </p>
                <p>
                  截至目前，我们已经与全球 <strong className="text-gray-900">50+</strong> 个知名电子烟品牌建立战略合作关系，
                  服务超过 <strong className="text-gray-900">5000+</strong> 批发客户，
                  覆盖全美48州及海外市场。
                </p>
                <p>
                  我们深知电子烟行业的快速变化，因此我们持续关注市场趋势，
                  不断扩充产品线，确保客户能够第一时间获取最新、最热销的产品。
                </p>
              </div>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link href="/products" className="inline-flex items-center px-6 py-3 bg-amber-500 hover:bg-amber-600 text-black font-bold rounded-lg transition">
                  浏览产品 →
                </Link>
                <Link href="/contact" className="inline-flex items-center px-6 py-3 border-2 border-amber-500 text-amber-600 hover:bg-amber-500 hover:text-black font-bold rounded-lg transition">
                  联系合作
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-amber-400/20 to-amber-600/10 border border-amber-200 flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="text-8xl mb-4">🏭</div>
                  <p className="text-2xl font-bold text-amber-600">VAPOR-X</p>
                  <p className="text-gray-500">美国电子烟批发首选</p>
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 bg-amber-500 text-black text-sm font-bold px-4 py-2 rounded-full shadow-lg">
                自 2018
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ 数据统计 ============ */}
      <section className="py-16 bg-gradient-to-r from-gray-900 to-gray-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">VAPOR-X 数字</h2>
            <p className="text-gray-400 mt-2">用数据说话</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: '2018', label: '成立年份', icon: '📅' },
              { number: '5000+', label: '服务客户', icon: '🤝' },
              { number: '50+', label: '合作品牌', icon: '🏷️' },
              { number: '48', label: '覆盖州数', icon: '🇺🇸' },
            ].map((stat, i) => (
              <div key={i} className="text-center p-6 rounded-xl bg-white/5 border border-white/10">
                <div className="text-4xl mb-3">{stat.icon}</div>
                <div className="text-3xl font-bold text-amber-400">{stat.number}</div>
                <div className="text-gray-400 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ 核心优势 ============ */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">为什么选择我们</h2>
            <p className="text-gray-600 mt-2">六大核心优势，让您的采购更简单</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: '✅', title: '正品保障', desc: '所有产品均从品牌方或授权经销商直接采购，提供正品保证' },
              { icon: '💰', title: '价格优势', desc: '批量采购享受阶梯折扣，价格远低于零售市场' },
              { icon: '🚚', title: '快速配送', desc: '全美48州配送，订单满$1000免运费' },
              { icon: '📦', title: '库存充足', desc: '洛杉矶大型仓库，热门产品现货供应' },
              { icon: '🌐', title: '海外直邮', desc: '支持国际配送，为海外客户提供便捷采购通道' },
              { icon: '💬', title: '客户支持', desc: '专业客服团队，WhatsApp/微信实时回复' },
            ].map((item, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md hover:border-amber-300 transition-all">
                <div className="text-3xl mb-3">{item.icon}</div>
                <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ 合作品牌 ============ */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">合作品牌</h2>
            <p className="text-gray-600 mt-2">与全球顶级品牌建立战略合作</p>
          </div>
          <div className="flex flex-wrap justify-center gap-6">
            {[
              { name: 'Elf Bar', color: 'bg-blue-50 border-blue-200 text-blue-600' },
              { name: 'Geek Bar', color: 'bg-green-50 border-green-200 text-green-600' },
              { name: 'SMOK', color: 'bg-red-50 border-red-200 text-red-600' },
              { name: 'JUUL', color: 'bg-purple-50 border-purple-200 text-purple-600' },
              { name: 'Vaporesso', color: 'bg-cyan-50 border-cyan-200 text-cyan-600' },
              { name: 'Lost Mary', color: 'bg-pink-50 border-pink-200 text-pink-600' },
              { name: 'Naked 100', color: 'bg-orange-50 border-orange-200 text-orange-600' },
              { name: 'ZYN', color: 'bg-gray-50 border-gray-200 text-gray-600' },
            ].map((brand) => (
              <span key={brand.name}
                className={`px-5 py-3 rounded-xl border font-bold text-base ${brand.color} hover:shadow-sm transition`}>
                {brand.name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ============ 我们的承诺 ============ */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">我们的承诺</h2>
            <p className="text-gray-400 mt-2">您的满意是我们最大的动力</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: '品质承诺', desc: '所有产品严格质检，确保正品出厂。如有质量问题，无条件退换货。' },
              { title: '价格承诺', desc: '批发价格透明公开，买贵退差价。量大从优，长期合作享受专属价格。' },
              { title: '服务承诺', desc: '24小时内回复所有询价，专业客服全程跟进订单，确保无忧采购。' },
            ].map((item, i) => (
              <div key={i} className="text-center p-8 rounded-xl bg-white/5 border border-white/10">
                <div className="text-4xl mb-4">🤝</div>
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ CTA ============ */}
      <section className="py-16 bg-gradient-to-r from-amber-500 to-amber-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-black mb-4">开始合作</h2>
          <p className="text-lg text-black/80 mb-8">
            添加我们的 {settingMap.whatsapp ? 'WhatsApp' : '微信'}，立即获取最新产品目录和批发报价单
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {settingMap.whatsapp && (
              <a href={`https://wa.me/${settingMap.whatsapp.replace(/[^0-9]/g, '')}`}
                 target="_blank" rel="noopener noreferrer"
                 className="inline-flex items-center px-8 py-4 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl transition text-lg shadow-lg">
                💬 WhatsApp 咨询
              </a>
            )}
            <Link href="/contact"
              className="inline-flex items-center px-8 py-4 bg-white hover:bg-gray-100 text-gray-900 font-bold rounded-xl transition text-lg shadow-lg">
              📝 在线询价
            </Link>
          </div>
          <div className="mt-6 text-sm text-black/60">
            或添加微信: <strong>{settingMap.wechat || 'vaporx_us'}</strong>
          </div>
        </div>
      </section>
    </div>
  )
}
