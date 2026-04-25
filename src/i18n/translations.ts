// 中英文语言包
export type Lang = 'zh' | 'en'

export type TranslationKey =
  | 'nav.home' | 'nav.products' | 'nav.cart' | 'nav.login' | 'nav.register'
  | 'nav.admin' | 'nav.logout' | 'nav.hello' | 'nav.pricing' | 'nav.contact'
  | 'hero.title' | 'hero.subtitle' | 'hero.browse' | 'hero.login'
  | 'hero.newProduct' | 'hero.video' | 'hero.videoDesc'
  | 'product.title' | 'product.desc' | 'product.all' | 'product.none'
  | 'product.addToCart' | 'product.added' | 'product.quantity' | 'product.chooseFlavor'
  | 'product.params' | 'product.brand' | 'product.nicotine' | 'product.capacity'
  | 'product.puffs' | 'product.flavor' | 'product.size' | 'product.stock'
  | 'product.detail' | 'product.wholesale' | 'product.minOrder'
  | 'product.inquire' | 'product.specs'
  | 'brand.title' | 'brand.desc'
  | 'platform.title' | 'platform.desc'
  | 'video.title'
  | 'contact.title' | 'contact.desc' | 'contact.whatsapp' | 'contact.email'
  | 'contact.phone' | 'contact.address' | 'contact.wechat'
  | 'contact.inquire' | 'contact.inquireDesc' | 'contact.name'
  | 'contact.message' | 'contact.send' | 'contact.subscribed'
  | 'cart.title' | 'cart.empty' | 'cart.checkout' | 'cart.total' | 'cart.remove'
  | 'cart.flavor' | 'cart.continue'
  | 'footer.powered' | 'footer.rights' | 'footer.age'
  | 'register.title' | 'login.title'
  | 'product.newArrival'

export const translations: Record<Lang, Record<TranslationKey, string>> = {
  zh: {
    // 导航
    'nav.home': '首页',
    'nav.products': '产品中心',
    'nav.cart': '购物车',
    'nav.login': '客户登录',
    'nav.register': '注册',
    'nav.admin': '后台管理',
    'nav.logout': '退出登录',
    'nav.hello': '您好',
    'nav.pricing': '价格',
    'nav.contact': '联系我们',

    // Hero
    'hero.title': '新品热荐',
    'hero.subtitle': '美国电子烟批发首选',
    'hero.browse': '浏览全部产品 →',
    'hero.login': '客户登录',
    'hero.newProduct': '新品',
    'hero.video': '新品视频',
    'hero.videoDesc': '后台 → 新品管理 上传',

    // 产品
    'product.title': '产品中心',
    'product.desc': '全系列产品，满足各类批发需求',
    'product.all': '全部',
    'product.none': '暂无产品',
    'product.addToCart': '加入购物车',
    'product.added': '已加入购物车 ✓',
    'product.quantity': '数量',
    'product.chooseFlavor': '选择口味',
    'product.params': '产品参数',
    'product.brand': '品牌',
    'product.nicotine': '尼古丁含量',
    'product.capacity': '容量',
    'product.puffs': '口数',
    'product.flavor': '口味',
    'product.size': '尺寸/规格',
    'product.stock': '库存',
    'product.detail': '产品详情',
    'product.wholesale': '批发价 / 量大从优',
    'product.minOrder': '最低起订量: $500 | 全美48州免运费',
    'product.inquire': '批量采购？获取最优报价',
    'product.specs': '电子烟参数',

    // 品牌
    'brand.title': '合作品牌',
    'brand.desc': 'VAPOR-X 与全球顶级电子烟品牌战略合作',

    // 平台
    'platform.title': '合作平台',
    'platform.desc': '多平台布局，助力您的电子烟业务全球拓展',

    // 视频
    'video.title': '视频展示',

    // 联系
    'contact.title': '联系我们',
    'contact.desc': '欢迎联系我们获取最新批发报价和产品信息',
    'contact.whatsapp': 'WhatsApp',
    'contact.email': '邮箱',
    'contact.phone': '电话',
    'contact.address': '地址',
    'contact.wechat': '微信',
    'contact.inquire': '批发询价',
    'contact.inquireDesc': '留下您的信息，我们将在24小时内回复',
    'contact.name': '您的姓名',
    'contact.message': '询价内容（产品/数量/要求等）',
    'contact.send': '发送询价 →',
    'contact.subscribed': '已订阅',

    // 购物车
    'cart.title': '购物车',
    'cart.empty': '购物车是空的',
    'cart.checkout': '去结算',
    'cart.total': '合计',
    'cart.remove': '删除',
    'cart.flavor': '口味',
    'cart.continue': '继续购物',

    // Footer
    'footer.powered': 'POWERED BY ALOKAIBI TRADING GROUP',
    'footer.rights': 'All Rights Reserved',
    'footer.age': '18+ 仅限成年批发客户',

    // 注册登录
    'register.title': '客户注册',
    'login.title': '客户登录',

    'product.newArrival': '新品',
  },

  en: {
    // 导航
    'nav.home': 'Home',
    'nav.products': 'Products',
    'nav.cart': 'Cart',
    'nav.login': 'Customer Login',
    'nav.register': 'Register',
    'nav.admin': 'Admin Panel',
    'nav.logout': 'Logout',
    'nav.hello': 'Hello',
    'nav.pricing': 'Pricing',
    'nav.contact': 'Contact',

    // Hero
    'hero.title': 'New Arrivals',
    'hero.subtitle': 'Premium Vape Wholesale USA',
    'hero.browse': 'Browse All Products →',
    'hero.login': 'Customer Login',
    'hero.newProduct': 'New',
    'hero.video': 'Video',
    'hero.videoDesc': 'Upload via Admin → Hero Management',

    // 产品
    'product.title': 'Products',
    'product.desc': 'Full range of products for all wholesale needs',
    'product.all': 'All',
    'product.none': 'No products yet',
    'product.addToCart': 'Add to Cart',
    'product.added': 'Added to Cart ✓',
    'product.quantity': 'Qty',
    'product.chooseFlavor': 'Choose Flavor',
    'product.params': 'Specifications',
    'product.brand': 'Brand',
    'product.nicotine': 'Nicotine',
    'product.capacity': 'Capacity',
    'product.puffs': 'Puffs',
    'product.flavor': 'Flavor',
    'product.size': 'Size',
    'product.stock': 'Stock',
    'product.detail': 'Product Details',
    'product.wholesale': 'Wholesale Pricing',
    'product.minOrder': 'Min Order: $500 | Free Shipping Continental US',
    'product.inquire': 'Bulk Orders? Get Best Pricing',
    'product.specs': 'Vape Specifications',

    // 品牌
    'brand.title': 'Brand Partners',
    'brand.desc': 'VAPOR-X partners with top global vape brands',

    // 平台
    'platform.title': 'Platforms',
    'platform.desc': 'Multi-platform reach to grow your vape business globally',

    // 视频
    'video.title': 'Videos',

    // 联系
    'contact.title': 'Contact Us',
    'contact.desc': 'Reach out for wholesale pricing and product info',
    'contact.whatsapp': 'WhatsApp',
    'contact.email': 'Email',
    'contact.phone': 'Phone',
    'contact.address': 'Address',
    'contact.wechat': 'WeChat',
    'contact.inquire': 'Wholesale Inquiry',
    'contact.inquireDesc': 'Leave your info and we will reply within 24 hours',
    'contact.name': 'Your Name',
    'contact.message': 'Inquiry details (product/qty/requirements)',
    'contact.send': 'Send Inquiry →',
    'contact.subscribed': 'Subscribed',

    // 购物车
    'cart.title': 'Shopping Cart',
    'cart.empty': 'Your cart is empty',
    'cart.checkout': 'Checkout',
    'cart.total': 'Total',
    'cart.remove': 'Remove',
    'cart.flavor': 'Flavor',
    'cart.continue': 'Continue Shopping',

    // Footer
    'footer.powered': 'POWERED BY ALOKAIBI TRADING GROUP',
    'footer.rights': 'All Rights Reserved',
    'footer.age': '18+ Adult Wholesale Customers Only',

    // 注册登录
    'register.title': 'Customer Registration',
    'login.title': 'Customer Login',

    'product.newArrival': 'New Arrival',
  },
}

// 获取翻译
export function getTranslation(key: TranslationKey, lang: Lang): string {
  return translations[lang][key] || key
}
