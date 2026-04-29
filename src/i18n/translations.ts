// 中英文语言包
export type Lang = 'zh' | 'en'

export type TranslationKey =
  // 产品
  | 'product.title' | 'product.desc' | 'product.all' | 'product.none'
  | 'product.addToCart' | 'product.added' | 'product.quantity' | 'product.chooseFlavor'
  | 'product.params' | 'product.brand' | 'product.nicotine' | 'product.capacity'
  | 'product.puffs' | 'product.flavor' | 'product.size' | 'product.stock'
  | 'product.detail' | 'product.wholesale' | 'product.pricing' | 'product.minOrder'
  | 'product.inquire' | 'product.specs' | 'product.newArrival'
  | 'product.notFound' | 'product.backToProducts' | 'product.filterByBrand'
  | 'product.productsCount' | 'product.comingSoon' | 'product.hot'
  | 'product.search' | 'product.viewAll' | 'product.wholesalerPrice' | 'product.storePrice'
  | 'product.shortBc5000' | 'product.shortPulse' | 'product.shortLostMary' | 'product.shortRaz' | 'product.shortMeloso' | 'product.shortElf600'
  | 'product.emptyDesc' | 'product.addInAdmin'
  // 品牌
  | 'brand.title' | 'brand.desc' | 'brand.partner' | 'brand.becomePartner'
  | 'brand.becomeDesc' | 'brand.noBrands' | 'brand.logo'
  // 平台
  | 'platform.title' | 'platform.desc' | 'platform.fallback1Title' | 'platform.fallback1Desc'
  | 'platform.fallback2Title' | 'platform.fallback2Desc'
  | 'platform.fallback3Title' | 'platform.fallback3Desc'
  | 'platform.fallback4Title' | 'platform.fallback4Desc'
  // 视频
  | 'video.title' | 'video.desc'
  // 联系
  | 'contact.title' | 'contact.desc' | 'contact.whatsapp' | 'contact.email'
  | 'contact.phone' | 'contact.address' | 'contact.wechat'
  | 'contact.inquire' | 'contact.inquireDesc' | 'contact.name'
  | 'contact.message' | 'contact.send' | 'contact.subscribed'
  | 'contact.company' | 'contact.submitInquiry'
  | 'contact.success' | 'contact.successDesc' | 'contact.error' | 'contact.errorDesc'
  | 'contact.hours' | 'contact.replyTime' | 'contact.wholesaleTip'
  | 'contact.minOrder' | 'contact.shippingInfo'
  // 购物车
  | 'cart.title' | 'cart.empty' | 'cart.emptyDesc' | 'cart.checkout' | 'cart.total'
  | 'cart.remove' | 'cart.flavor' | 'cart.continue' | 'cart.clear'
  | 'cart.itemsCount' | 'cart.submitInquiry' | 'cart.loading'
  | 'cart.loginRequired' | 'cart.loginRequiredDesc' | 'cart.goToLogin' | 'cart.browseProducts'
  // PI | 'pi.empty' | 'pi.emptyDesc' | 'pi.loading' | 'pi.loginRequired' | 'pi.itemsCount'
  // 注册
  | 'register.title' | 'register.desc' | 'register.name' | 'register.email'
  | 'register.password' | 'register.company' | 'register.address'
  | 'register.phone' | 'register.submit' | 'register.success' | 'register.error' | 'register.networkError'
  | 'register.haveAccount' | 'register.login' | 'register.customerType'
  | 'register.loading' | 'register.confirm' | 'register.loginNow'
  | 'register.passwordMismatch' | 'register.passwordTooShort'
  | 'register.companyAddress' | 'register.state' | 'register.wholesaler' | 'register.individual' | 'register.store'
  | 'register.optional' | 'register.emailPlaceholder' | 'register.passwordHint'
  | 'register.phonePlaceholder' | 'register.statePlaceholder' | 'register.addressPlaceholder'
  // 登录
  | 'login.title' | 'login.email' | 'login.password' | 'login.submit'
  | 'login.error' | 'login.noAccount' | 'login.register' | 'login.networkError'
  // 导航
  | 'nav.home' | 'nav.products' | 'nav.cart' | 'nav.login' | 'nav.register'
  | 'nav.admin' | 'nav.logout' | 'nav.hello' | 'nav.pricing' | 'nav.contact'
  | 'nav.brands' | 'nav.myOrders'
  // Hero
  | 'hero.title' | 'hero.subtitle' | 'hero.browse' | 'hero.login'
  | 'hero.newProduct' | 'hero.video' | 'hero.videoDesc'
  | 'hero.vaporDesc'
  | 'hero.previous' | 'hero.next' | 'hero.viewDetails' | 'hero.comingSoon' | 'hero.noVideoSupport' | 'hero.slide' | 'hero.productVideo'
  | 'hero.noProducts'
  // Orders
  | 'orders.title' | 'orders.desc' | 'orders.empty' | 'orders.emptyDesc' | 'orders.browse' | 'orders.loading'
  | 'orders.number' | 'orders.total' | 'orders.status' | 'orders.note'
  | 'orders.pending' | 'orders.processing' | 'orders.shipped' | 'orders.completed' | 'orders.cancelled'
  | 'orders.id' | 'orders.items' | 'orders.contact'
  // 关于
  | 'about.title'
  // 产品描述
  | 'product.elfbarBc5000' | 'product.geekBarPulse' | 'product.lostMary' | 'product.razTn9000' | 'product.geekBarMelosoMini' | 'product.elfbar600'
  | 'product.inStock'
  | 'products.emptyDesc' | 'products.withBrand' | 'products.brandSeries'
  // 底部
  | 'footer.siteDesc'
  // 语言切换
  | 'header.switchToEn' | 'header.switchToZh' | 'header.langLabel'
  // 关于
  | 'about.subtitle'
  // 品牌
  | 'brands.desc'
  // PI | 'pi.browseProducts'
  // 联系
  | 'contact.placeholder' | 'contact.wechatDesc' | 'contact.replyHour' | 'contact.shippingText'
  | 'contact.prefix'
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
    'nav.brands': '品牌',
    'nav.myOrders': '我的订单',
    'header.switchToEn': '切换到英文',
    'header.switchToZh': '切换到中文',
    'header.langLabel': '语言',

    // Hero
    'hero.title': '新品热荐',
    'hero.subtitle': '美国电子烟批发首选',
    'hero.browse': '浏览全部产品 →',
    'hero.login': '客户登录',
    'hero.newProduct': '新品',
    'hero.video': '新品视频',
    'hero.videoDesc': '后台 → 新品管理 上传',
    'hero.vaporDesc': '美国电子烟批发供应商',

    'hero.previous': '上一张',
    'hero.next': '下一张',
    'hero.viewDetails': '查看详情 →',
    'hero.comingSoon': '新品即将上线，敬请期待',
    'hero.noVideoSupport': '您的浏览器不支持视频播放',
    'hero.slide': '第',
    'hero.productVideo': '产品视频',
    'hero.noProducts': '暂无产品，请先在后台添加',
    'orders.title': '我的订单',
    'orders.desc': '查看您的采购订单状态',
    'orders.empty': '暂无订单',
    'orders.emptyDesc': '浏览产品目录并提交您的第一个采购订单',
    'orders.browse': '浏览产品',
    'orders.loading': '加载中...',
    'orders.number': '订单 #',
    'orders.total': '合计',
    'orders.status': '状态',
    'orders.note': '备注',
    'orders.pending': '待处理',
    'orders.processing': '处理中',
    'orders.shipped': '已发货',
    'orders.completed': '已完成',
    'orders.cancelled': '已取消',
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
    'product.pricing': '价格',
    'product.wholesalerPrice': '批发商价格',
    'product.storePrice': '店铺价格',
    'product.minOrder': '最低起订量: $500 | 全美48州免运费',
    'product.inquire': '批量采购？获取最优报价',
    'product.specs': '电子烟参数',
    'product.newArrival': '新品',
    'product.notFound': '产品未找到',
    'product.backToProducts': '← 返回产品中心',
    'product.filterByBrand': '品牌:',
    'product.productsCount': '款产品在售',
    'product.comingSoon': '即将上线',
    'product.hot': '热销',
    'product.search': '搜索',
    'product.viewAll': '查看全部 →',
    'product.shortBc5000': '5000口 | 50mg | 15ml | 17种口味',
    'product.shortPulse': '15000口 | 5%尼古丁 | LED显示屏 | 12种口味',
    'product.shortLostMary': '20000口 | 网状线圈 | 可调节气流 | 10种口味',
    'product.shortRaz': '9000口 | 数字电量显示 | 冰感体验',
    'product.shortMeloso': '600口 | 20mg尼古丁盐 | 1.2ml | 迷你便携',
    'product.shortElf600': '600口 | 20mg尼古丁盐 | 2ml | 经典入门款',
    'product.elfbarBc5000': 'ELF BAR BC5000 一次性电子烟，5000口大容量，内置可充电电池，17种丰富口味选择，为成年吸烟者提供便捷的即用即弃 vaping 体验。',
    'product.geekBarPulse': 'Geek Bar Pulse 15000口一次性电子烟，配备 LED 智能显示屏，实时显示电量与剩余口数，5%尼古丁强度，12种冰爽口味。',
    'product.lostMary': 'Lost Mary MO20000 Pro 20000口一次性电子烟，采用网状线圈技术，可调节气流系统，10种精选口味，超长续航 vaping 体验。',
    'product.razTn9000': 'RAZ TN9000 9000口一次性电子烟，配备数字电量显示屏幕，冰感体验系列，为追求品质的成年用户打造。',
    'product.geekBarMelosoMini': 'Geek Bar Meloso Mini 600口迷你一次性电子烟，20mg尼古丁盐，1.2ml烟油容量，小巧便携设计，适合入门用户。',
    'product.elfbar600': 'ELF BAR 600 600口经典一次性电子烟，20mg尼古丁盐，2ml烟油容量，经典入门款，多种畅销口味。',

    'product.emptyDesc': '浏览我们的产品目录，发现更多选择',
    'product.addInAdmin': '去后台添加产品 →',
    'products.emptyDesc': '浏览我们的产品目录，发现更多选择',
    'products.withBrand': '产品',
    'products.brandSeries': '系列产品批发',


    // 品牌
    'brand.title': '合作品牌',
    'brand.desc': 'VAPOR-X 与全球顶级电子烟品牌战略合作',
    'brand.partner': '合作品牌',
    'brand.becomePartner': '成为 VAPOR-X 合作伙伴',
    'brand.becomeDesc': '我们希望与更多优质品牌合作，为我们的客户提供更多选择。欢迎联系我们洽谈合作。',
    'brand.noBrands': '暂无品牌信息',
    'brand.logo': '标志',
    'brands.desc': '全球顶级电子烟品牌官方授权合作',

    // 平台
    'platform.title': '合作平台',
    'platform.desc': '多平台布局，助力您的电子烟业务全球拓展',
    'platform.fallback1Title': '厂家直供',
    'platform.fallback1Desc': '与顶级品牌直接合作，正品保障',
    'platform.fallback2Title': '全美配送',
    'platform.fallback2Desc': '覆盖48州，洛杉矶仓直发',
    'platform.fallback3Title': '批发价格',
    'platform.fallback3Desc': '最低$500起批，阶梯折扣',
    'platform.fallback4Title': '专属客服',
    'platform.fallback4Desc': '7x24小时在线支持',

    // 视频
    'video.title': '视频展示',
    'video.desc': '了解 VAPOR-X 的产品与服务',

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
    'contact.company': '公司名称',
    'contact.submitInquiry': '提交询价',
    'contact.success': '询价已提交成功！',
    'contact.successDesc': '我们的销售团队将在24小时内通过邮件联系您。',
    'contact.error': '提交失败，请重试',
    'contact.errorDesc': '如果问题持续，请直接通过 WhatsApp 或邮件联系我们。',
    'contact.hours': '周一至周五 9AM - 6PM PST',
    'contact.replyTime': '点击直接对话，回复最快',
    'contact.wholesaleTip': '💡 批发提示',
    'contact.minOrder': '最低起订量',
    'contact.shippingInfo': '全美48州免运费，订单满$1000起批',
    'contact.placeholder': '请描述您需要采购的产品、数量和您的需求...',
    'contact.wechatDesc': '扫码添加，获取产品目录和报价单',
    'contact.replyHour': '24小时内回复',
    'contact.shippingText': '全美48州免运费，订单满$1000起批',
    'contact.prefix': '24小时内回复，期待与您合作',

    // 购物车
    'cart.title': '购物车',
    'cart.empty': '购物车是空的',
    'cart.emptyDesc': '去浏览产品并添加到购物车',
    'cart.checkout': '去结算',
    'cart.total': '合计',
    'cart.remove': '删除',
    'cart.flavor': '口味',
    'cart.continue': '继续购物',
    'cart.clear': '清空购物车',
    'cart.itemsCount': '件商品',
    'cart.submitInquiry': '提交询价',
    'cart.loading': '加载中...',
    'cart.loginRequired': '请先登录',
    'cart.loginRequiredDesc': '登录后查看购物车',
    'cart.goToLogin': '去登录',
    'cart.browseProducts': '浏览产品',

    // PI

    // 注册
    'register.title': '注册账户',
    'register.desc': '注册 VAPOR-X 批发账户',
    'register.name': '姓名',
    'register.email': '邮箱',
    'register.password': '密码',
    'register.confirm': '确认密码',
    'register.phone': '电话',
    'register.company': '公司名称',
    'register.companyAddress': '公司地址',
    'register.state': '州/省',
    'register.wholesaler': '批发商',
    'register.individual': '个人客户',
    'register.store': '店铺',
    'register.optional': '可选',
    'register.emailPlaceholder': 'your@email.com',
    'register.passwordHint': '至少6位',
    'register.phonePlaceholder': '+1 (xxx) xxx-xxxx',
    'register.statePlaceholder': 'CA / NY / TX ...',
    'register.addressPlaceholder': 'Street, City, Zip',
    'register.submit': '注 册',
    'register.loading': '注册中...',
    'register.haveAccount': '已有账户？',
    'register.loginNow': '立即登录',
    'register.passwordMismatch': '两次输入的密码不一致',
    'register.passwordTooShort': '密码至少 6 位',

    // 登录
    'login.title': '客户登录',
    'login.desc': '登录您的 VAPOR-X 账户',
    'login.email': '邮箱',
    'login.password': '密码',
    'login.submit': '登 录',
    'login.loading': '登录中...',
    'login.noAccount': '还没有账户？',
    'login.registerNow': '立即注册',
    'login.adminEntry': '管理员入口',
    'login.adminLogin': '管理员后台登录',

    // Footer
    'footer.siteDesc': '美国电子烟批发供应商',
    'footer.powered': 'POWERED BY ALOKAIBI TRADING GROUP',
    'footer.rights': 'All Rights Reserved',
    'footer.age': '18+ 仅限成年批发客户',
    'footer.quickLinks': '快速链接',

    // About
    'about.title': '关于 VAPOR-X',
    'about.subtitle': '美国电子烟批发首选',
    'about.desc': '美国领先的电子烟批发供应商 — 自2018年成立以来，已服务超过5000+批发客户',
    'about.story': '我们的故事',
    'about.story1': '成立于2018年，总部位于美国加利福尼亚州洛杉矶。我们从一家小型电子烟批发商起步，凭借着对产品质量的严格把控和对客户服务的执着追求，迅速发展成为全美知名的电子烟批发供应商。',
    'about.story2': '截至目前，我们已经与全球 50+ 个知名电子烟品牌建立战略合作关系，服务超过 5000+ 批发客户，覆盖全美48州及海外市场。',
    'about.story3': '我们深知电子烟行业的快速变化，因此我们持续关注市场趋势，不断扩充产品线，确保客户能够第一时间获取最新、最热销的产品。',
    'about.stats': 'VAPOR-X 数字',
    'about.statsDesc': '用数据说话',
    'about.statsYear': '2018',
    'about.statsYearLabel': '成立年份',
    'about.statsCustomers': '5000+',
    'about.statsCustomersLabel': '服务客户',
    'about.statsBrands': '50+',
    'about.statsBrandsLabel': '合作品牌',
    'about.statsStates': '48',
    'about.statsStatesLabel': '覆盖州数',
    'about.whyUs': '为什么选择我们',
    'about.whyUsDesc': '六大核心优势，让您的采购更简单',
    'about.benefit1': '正品保障',
    'about.benefit1Desc': '所有产品均从品牌方或授权经销商直接采购，提供正品保证',
    'about.benefit2': '价格优势',
    'about.benefit2Desc': '批量采购享受阶梯折扣，价格远低于零售市场',
    'about.benefit3': '快速配送',
    'about.benefit3Desc': '全美48州配送，订单满$1000免运费',
    'about.benefit4': '库存充足',
    'about.benefit4Desc': '洛杉矶大型仓库，热门产品现货供应',
    'about.benefit5': '海外直邮',
    'about.benefit5Desc': '支持国际配送，为海外客户提供便捷采购通道',
    'about.benefit6': '客户支持',
    'about.benefit6Desc': '专业客服团队，WhatsApp/微信实时回复',
    'about.cooperation': '合作品牌',
    'about.cooperationDesc': '与全球顶级品牌建立战略合作',
    'about.promise': '我们的承诺',
    'about.promiseDesc': '您的满意是我们最大的动力',
    'about.promise1': '品质承诺',
    'about.promise1Desc': '所有产品严格质检，确保正品出厂。如有质量问题，无条件退换货。',
    'about.promise2': '价格承诺',
    'about.promise2Desc': '批发价格透明公开，买贵退差价。量大从优，长期合作享受专属价格。',
    'about.promise3': '服务承诺',
    'about.promise3Desc': '24小时内回复所有询价，专业客服全程跟进订单，确保无忧采购。',
    'about.cta': '开始合作',
    'about.ctaDesc': '添加我们的 WhatsApp，立即获取最新产品目录和批发报价单',
    'about.whatsappConsult': '💬 WhatsApp 咨询',
    'about.onlineInquiry': '📝 在线询价',
    'about.wechatAdd': '或添加微信',
    'about.browseProducts': '浏览产品 →',
    'about.contactCooperate': '联系合作',
    'about.since': '自 2018',

    // Admin
    'admin.dashboard': '仪表盘',
    'admin.home': '首页管理',
    'admin.hero': '新品管理',
    'admin.products': '产品管理',
    'admin.brands': '品牌管理',
    'admin.platforms': '平台管理',
    'admin.sections': '区块标题',
    'admin.settings': '系统设置',
    'admin.customers': '客户管理',
    'admin.admins': '管理员',
    'admin.pi': 'PI管理',
    'admin.categories': '分类管理',
    'admin.login': '管理员登录',
    'admin.save': '保存',
    'admin.cancel': '取消',
    'admin.delete': '删除',
    'admin.edit': '编辑',
    'admin.create': '新建',
    'admin.confirm': '确认',
    'admin.search': '搜索',
    'admin.loginTitle': '后台管理',
    'admin.loginDesc': 'VAPOR-X 批发管理平台',
    'admin.username': '用户名 / 邮箱',
    'admin.password': '密码',
    'admin.loginBtn': '登 录',
    'admin.loggingIn': '登录中...',
    'admin.loginError': '用户名或密码错误',
    'admin.networkError': '网络错误，请稍后重试',
    'admin.customerLogin': '客户登录入口',
    'admin.manageTitle': '管理员管理',
    'admin.email': '邮箱',
    'admin.role': '角色',
    'admin.actions': '操作',
    'admin.addAdmin': '新增管理员',
    'admin.editAdmin': '编辑管理员',
    'admin.deleteAdmin': '删除管理员',
    'admin.confirmDelete': '确认删除该管理员？',
    'admin.adminSaved': '管理员已保存',
    'admin.adminDeleted': '管理员已删除',
    'admin.superAdmin': '超级管理员',
    'admin.productAdmin': '产品管理员',

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
    'nav.brands': 'Brands',
    'nav.myOrders': 'My Orders',
    'header.switchToEn': 'Switch to English',
    'header.switchToZh': 'Switch to Chinese',
    'header.langLabel': 'Language',

    // Hero
    'hero.title': 'New Arrivals',
    'hero.subtitle': 'Premium Vape Wholesale USA',
    'hero.browse': 'Browse All Products →',
    'hero.login': 'Customer Login',
    'hero.newProduct': 'New',
    'hero.video': 'Video',
    'hero.videoDesc': 'Upload via Admin → Hero Management',
    'hero.vaporDesc': 'Premium Vape Wholesale Supplier USA',

    'hero.previous': 'Previous',
    'hero.next': 'Next',
    'hero.viewDetails': 'View Details →',
    'hero.comingSoon': 'New arrivals coming soon',
    'hero.noVideoSupport': 'Your browser does not support video',
    'hero.slide': 'Slide',
    'hero.productVideo': 'Product Video',
    'hero.noProducts': 'No products yet, add some in admin',
    'orders.title': 'My Orders',
    'orders.desc': 'Track your purchase orders',
    'orders.empty': 'No orders yet',
    'orders.emptyDesc': 'Browse our products and place your first order',
    'orders.browse': 'Browse Products',
    'orders.loading': 'Loading...',
    'orders.number': 'Order #',
    'orders.total': 'Total',
    'orders.status': 'Status',
    'orders.note': 'Note',
    'orders.pending': 'Pending',
    'orders.processing': 'Processing',
    'orders.shipped': 'Shipped',
    'orders.completed': 'Completed',
    'orders.cancelled': 'Cancelled',
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
    'product.pricing': 'Pricing',
    'product.wholesalerPrice': 'Wholesaler Price',
    'product.storePrice': 'Store Price',
    'product.inquire': 'Bulk Orders? Get Best Pricing',
    'product.specs': 'Vape Specifications',
    'product.newArrival': 'New Arrival',
    'product.notFound': 'Product Not Found',
    'product.backToProducts': '← Back to Products',
    'product.filterByBrand': 'Brand:',
    'product.productsCount': 'products available',
    'product.comingSoon': 'Coming Soon',
    'product.hot': 'HOT',
    'product.search': 'Search',
    'product.viewAll': 'View All →',
    'product.shortBc5000': '5000 puffs | 50mg | 15ml | 17 flavors',
    'product.shortPulse': '15000 puffs | 5% nicotine | LED display | 12 flavors',
    'product.shortLostMary': '20000 puffs | Mesh coil | Adjustable airflow | 10 flavors',
    'product.shortRaz': '9000 puffs | Digital battery display | Icy experience',
    'product.shortMeloso': '600 puffs | 20mg nicotine salt | 1.2ml | Mini portable',
    'product.shortElf600': '600 puffs | 20mg nicotine salt | 2ml | Classic entry',
    'product.elfbarBc5000': 'ELF BAR BC5000 disposable vape with 5000 puffs, built-in rechargeable battery, 17 rich flavors for a convenient puff-and-go experience.',
    'product.geekBarPulse': 'Geek Bar Pulse 15000-puff disposable vape with LED smart display showing battery and puff count, 5% nicotine, 12 icy flavors.',
    'product.lostMary': 'Lost Mary MO20000 Pro 20000-puff disposable vape with mesh coil technology, adjustable airflow system, 10 selected flavors.',
    'product.razTn9000': 'RAZ TN9000 9000-puff disposable vape with digital battery display screen, icy experience series, crafted for quality-seeking adult users.',
    'product.geekBarMelosoMini': 'Geek Bar Meloso Mini 600-puff mini disposable vape, 20mg nicotine salt, 1.2ml capacity, compact and portable design.',
    'product.elfbar600': 'ELF BAR 600 classic 600-puff disposable vape, 20mg nicotine salt, 2ml capacity, entry-level classic with popular flavors.',

    'product.emptyDesc': 'Browse our product catalog for more choices',
    'product.addInAdmin': 'Add products in admin →',
    'products.emptyDesc': 'Browse our product catalog for more choices',
    'products.withBrand': 'Products',
    'products.brandSeries': 'Wholesale Series',


    // 品牌
    'brand.title': 'Brand Partners',
    'brand.desc': 'VAPOR-X partners with top global vape brands',
    'brand.partner': 'Brand Partners',
    'brand.becomePartner': 'Become a VAPOR-X Partner',
    'brand.becomeDesc': 'We look forward to partnering with more quality brands to offer our customers more choices. Contact us to discuss cooperation.',
    'brand.noBrands': 'No brands yet',
    'brand.logo': 'Logo',
    'brands.desc': 'Official authorized partnerships with top global vape brands',

    // 平台
    'platform.title': 'Platforms',
    'platform.desc': 'Multi-platform reach to grow your vape business globally',
    'platform.fallback1Title': 'Factory Direct',
    'platform.fallback1Desc': 'Direct partnerships with top brands',
    'platform.fallback2Title': 'Nationwide Shipping',
    'platform.fallback2Desc': 'Covers 48 states, shipped from LA',
    'platform.fallback3Title': 'Wholesale Pricing',
    'platform.fallback3Desc': 'From $500 min order, tiered discounts',
    'platform.fallback4Title': '24/7 Support',
    'platform.fallback4Desc': 'Online support available 7x24',

    // 视频
    'video.title': 'Videos',
    'video.desc': 'Learn more about VAPOR-X products & services',

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
    'contact.company': 'Company Name',
    'contact.submitInquiry': 'Submit Inquiry',
    'contact.success': 'Inquiry Submitted Successfully!',
    'contact.successDesc': 'Our sales team will contact you within 24 hours.',
    'contact.error': 'Submission Failed. Please try again.',
    'contact.errorDesc': 'If the problem persists, please contact us via WhatsApp or Email.',
    'contact.hours': 'Mon-Fri 9AM - 6PM PST',
    'contact.replyTime': 'Click to chat, fastest response',
    'contact.wholesaleTip': '💡 Wholesale Tip',
    'contact.minOrder': 'Minimum Order',
    'contact.shippingInfo': 'Free shipping to 48 states, min order $1000',

    // 购物车
    'cart.title': 'Shopping Cart',
    'cart.empty': 'Your cart is empty',
    'cart.emptyDesc': 'Browse products and add them to your cart',
    'cart.checkout': 'Checkout',
    'cart.total': 'Total',
    'cart.remove': 'Remove',
    'cart.flavor': 'Flavor',
    'cart.continue': 'Continue Shopping',
    'cart.clear': 'Clear Cart',
    'cart.itemsCount': 'item(s)',
    'cart.submitInquiry': 'Submit Inquiry',
    'cart.loading': 'Loading...',
    'cart.loginRequired': 'Please Login First',
    'cart.loginRequiredDesc': 'Log in to view your cart',
    'cart.goToLogin': 'Go to Login',
    'cart.browseProducts': 'Browse Products',

    // PI

    // 注册
    'register.title': 'Customer Registration',
    'register.desc': 'Register for VAPOR-X Wholesale Account',
    'register.name': 'Full Name',
    'register.email': 'Email',
    'register.password': 'Password',
    'register.confirm': 'Confirm Password',
    'register.phone': 'Phone',
    'register.company': 'Company Name',
    'register.companyAddress': 'Company Address',
    'register.state': 'State',
    'register.wholesaler': 'Wholesaler',
    'register.individual': 'Individual',
    'register.store': 'Store',
    'register.optional': 'Optional',
    'register.emailPlaceholder': 'your@email.com',
    'register.passwordHint': 'min 6 characters',
    'register.phonePlaceholder': '+1 (xxx) xxx-xxxx',
    'register.statePlaceholder': 'CA / NY / TX ...',
    'register.addressPlaceholder': 'Street, City, Zip',
    'register.submit': 'Register',
    'register.loading': 'Registering...',
    'register.haveAccount': 'Already have an account?',
    'register.loginNow': 'Login Now',
    'register.passwordMismatch': 'Passwords do not match',
    'register.passwordTooShort': 'Password must be at least 6 characters',

    // 登录
    'login.title': 'Customer Login',
    'login.desc': 'Log in to your VAPOR-X account',
    'login.email': 'Email',
    'login.password': 'Password',
    'login.submit': 'Login',
    'login.loading': 'Logging in...',
    'login.noAccount': "Don't have an account?",
    'login.registerNow': 'Register Now',
    'login.adminEntry': 'Admin Entry',
    'login.adminLogin': 'Admin Login',

    // Footer
    'footer.siteDesc': '美国电子烟批发供应商',
    'footer.powered': 'POWERED BY ALOKAIBI TRADING GROUP',
    'footer.rights': 'All Rights Reserved',
    'footer.age': '18+ Adult Wholesale Customers Only',
    'footer.quickLinks': 'Quick Links',

    // About
    'about.title': 'About VAPOR-X',
    'about.subtitle': 'Premium Vape Wholesale USA',
    'about.desc': "America's Leading Vape Wholesale Supplier — Serving 5000+ wholesale clients since 2018",
    'about.story': 'Our Story',
    'about.story1': 'Founded in 2018 and headquartered in Los Angeles, California. We started as a small vape wholesaler and rapidly grew into a nationally recognized vape wholesale supplier through strict quality control and dedicated customer service.',
    'about.story2': 'To date, we have established strategic partnerships with 50+ renowned vape brands worldwide, serving 5000+ wholesale clients across all 48 US states and international markets.',
    'about.story3': 'We understand the rapidly changing vape industry. We continuously monitor market trends and expand our product lines to ensure our clients get the latest and most popular products first.',
    'about.stats': 'VAPOR-X By The Numbers',
    'about.statsDesc': 'Data speaks for itself',
    'about.statsYear': '2018',
    'about.statsYearLabel': 'Founded',
    'about.statsCustomers': '5000+',
    'about.statsCustomersLabel': 'Clients Served',
    'about.statsBrands': '50+',
    'about.statsBrandsLabel': 'Brand Partners',
    'about.statsStates': '48',
    'about.statsStatesLabel': 'States Covered',
    'about.whyUs': 'Why Choose Us',
    'about.whyUsDesc': '6 core advantages to make your procurement easier',
    'about.benefit1': 'Authentic Products',
    'about.benefit1Desc': 'All products sourced directly from brands or authorized distributors with authenticity guarantee',
    'about.benefit2': 'Competitive Pricing',
    'about.benefit2Desc': 'Tiered discounts for bulk orders, prices well below retail',
    'about.benefit3': 'Fast Shipping',
    'about.benefit3Desc': 'Nationwide shipping to 48 states, free shipping on orders over $1000',
    'about.benefit4': 'Ample Stock',
    'about.benefit4Desc': 'Large LA warehouse with popular products in stock',
    'about.benefit5': 'International Shipping',
    'about.benefit5Desc': 'Support international delivery for overseas clients',
    'about.benefit6': 'Customer Support',
    'about.benefit6Desc': 'Professional support team, real-time WhatsApp/WeChat response',
    'about.cooperation': 'Brand Partners',
    'about.cooperationDesc': 'Strategic partnerships with top global brands',
    'about.promise': 'Our Promise',
    'about.promiseDesc': 'Your satisfaction is our motivation',
    'about.promise1': 'Quality Promise',
    'about.promise1Desc': 'Strict QC on all products. Unconditional returns for quality issues.',
    'about.promise2': 'Price Promise',
    'about.promise2Desc': 'Transparent wholesale pricing. Price match guarantee. Exclusive pricing for long-term partners.',
    'about.promise3': 'Service Promise',
    'about.promise3Desc': 'All inquiries replied within 24 hours. Dedicated support throughout ordering process.',
    'about.cta': 'Start Partnering',
    'about.ctaDesc': 'Add us on WhatsApp now to get the latest product catalog and wholesale price list',
    'about.whatsappConsult': '💬 WhatsApp',
    'about.onlineInquiry': '📝 Online Inquiry',
    'about.wechatAdd': 'Or add WeChat',
    'about.browseProducts': 'Browse Products →',
    'about.contactCooperate': 'Contact Us',
    'about.since': 'Since 2018',

    // Admin
    'admin.dashboard': 'Dashboard',
    'admin.home': 'Home Content',
    'admin.hero': 'Hero Management',
    'admin.products': 'Products',
    'admin.brands': 'Brands',
    'admin.platforms': 'Platforms',
    'admin.sections': 'Sections',
    'admin.settings': 'Settings',
    'admin.customers': 'Customers',
    'admin.admins': 'Admins',
    'admin.pi': 'PI Management',
    'admin.categories': 'Categories',
    'admin.login': 'Admin Login',
    'admin.save': 'Save',
    'admin.cancel': 'Cancel',
    'admin.delete': 'Delete',
    'admin.edit': 'Edit',
    'admin.create': 'Create',
    'admin.confirm': 'Confirm',
    'admin.search': 'Search',

    'admin.loginTitle': 'Admin Panel',
    'admin.loginDesc': 'VAPOR-X Wholesale Management Platform',
    'admin.username': 'Username / Email',
    'admin.password': 'Password',
    'admin.loginBtn': 'Login',
    'admin.loggingIn': 'Logging in...',
    'admin.loginError': 'Invalid username or password',
    'admin.networkError': 'Network error, please try again',
    'admin.customerLogin': 'Customer Login',
    'admin.manageTitle': 'Admin Management',
    'admin.email': 'Email',
    'admin.role': 'Role',
    'admin.actions': 'Actions',
    'admin.addAdmin': 'Add Admin',
    'admin.editAdmin': 'Edit Admin',
    'admin.deleteAdmin': 'Delete Admin',
    'admin.confirmDelete': 'Are you sure you want to delete this admin?',
    'admin.adminSaved': 'Admin saved successfully',
    'admin.adminDeleted': 'Admin deleted successfully',
    'admin.superAdmin': 'Super Admin',
    'admin.productAdmin': 'Product Admin',
  },
}

// 获取翻译
export function getTranslation(key: TranslationKey, lang: Lang): string {
  return translations[lang][key] || key
}
