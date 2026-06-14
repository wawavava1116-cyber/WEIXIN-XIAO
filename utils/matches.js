const team = {
  canada: { cn: '加拿大', en: 'Canada', flag: '/assets/flags/ca.png' },
  bosnia: { cn: '波黑', en: 'Bosnia and Herzegovina', flag: '/assets/flags/ba.png' },
  usa: { cn: '美国', en: 'United States', flag: '/assets/flags/us.png' },
  paraguay: { cn: '巴拉圭', en: 'Paraguay', flag: '/assets/flags/py.png' },
  haiti: { cn: '海地', en: 'Haiti', flag: '/assets/flags/ht.png' },
  scotland: { cn: '苏格兰', en: 'Scotland', flag: '/assets/flags/sco.png' },
  australia: { cn: '澳大利亚', en: 'Australia', flag: '/assets/flags/au.png' },
  turkey: { cn: '土耳其', en: 'Türkiye', flag: '/assets/flags/tr.png' },
  brazil: { cn: '巴西', en: 'Brazil', flag: '/assets/flags/br.png' },
  morocco: { cn: '摩洛哥', en: 'Morocco', flag: '/assets/flags/ma.png' },
  qatar: { cn: '卡塔尔', en: 'Qatar', flag: '/assets/flags/qa.png' },
  switzerland: { cn: '瑞士', en: 'Switzerland', flag: '/assets/flags/ch.png' },
  ivoryCoast: { cn: '科特迪瓦', en: "Cote d'Ivoire", flag: '/assets/flags/ci.png' },
  ecuador: { cn: '厄瓜多尔', en: 'Ecuador', flag: '/assets/flags/ec.png' },
  germany: { cn: '德国', en: 'Germany', flag: '/assets/flags/de.png' },
  curacao: { cn: '库拉索', en: 'Curacao', flag: '/assets/flags/cw.png' },
  netherlands: { cn: '荷兰', en: 'Netherlands', flag: '/assets/flags/nl.png' },
  japan: { cn: '日本', en: 'Japan', flag: '/assets/flags/jp.png' },
  sweden: { cn: '瑞典', en: 'Sweden', flag: '/assets/flags/se.png' },
  tunisia: { cn: '突尼斯', en: 'Tunisia', flag: '/assets/flags/tn.png' },
  saudi: { cn: '沙特阿拉伯', en: 'Saudi Arabia', flag: '/assets/flags/sa.png' },
  uruguay: { cn: '乌拉圭', en: 'Uruguay', flag: '/assets/flags/uy.png' },
  spain: { cn: '西班牙', en: 'Spain', flag: '/assets/flags/es.png' },
  caboVerde: { cn: '佛得角', en: 'Cabo Verde', flag: '/assets/flags/cv.png' },
  iran: { cn: '伊朗', en: 'IR Iran', flag: '/assets/flags/ir.png' },
  newZealand: { cn: '新西兰', en: 'New Zealand', flag: '/assets/flags/nz.png' },
  belgium: { cn: '比利时', en: 'Belgium', flag: '/assets/flags/be.png' },
  egypt: { cn: '埃及', en: 'Egypt', flag: '/assets/flags/eg.png' },
  france: { cn: '法国', en: 'France', flag: '/assets/flags/fr.png' },
  senegal: { cn: '塞内加尔', en: 'Senegal', flag: '/assets/flags/sn.png' },
  iraq: { cn: '伊拉克', en: 'Iraq', flag: '/assets/flags/iq.png' },
  norway: { cn: '挪威', en: 'Norway', flag: '/assets/flags/no.png' },
  argentina: { cn: '阿根廷', en: 'Argentina', flag: '/assets/flags/ar.png' },
  algeria: { cn: '阿尔及利亚', en: 'Algeria', flag: '/assets/flags/dz.png' },
  austria: { cn: '奥地利', en: 'Austria', flag: '/assets/flags/at.png' },
  jordan: { cn: '约旦', en: 'Jordan', flag: '/assets/flags/jo.png' },
  ghana: { cn: '加纳', en: 'Ghana', flag: '/assets/flags/gh.png' },
  panama: { cn: '巴拿马', en: 'Panama', flag: '/assets/flags/pa.png' },
  england: { cn: '英格兰', en: 'England', flag: '/assets/flags/eng.png' },
  croatia: { cn: '克罗地亚', en: 'Croatia', flag: '/assets/flags/hr.png' },
  portugal: { cn: '葡萄牙', en: 'Portugal', flag: '/assets/flags/pt.png' },
  congoDr: { cn: '刚果民主共和国', en: 'Congo DR', flag: '/assets/flags/cd.png' },
  uzbekistan: { cn: '乌兹别克斯坦', en: 'Uzbekistan', flag: '/assets/flags/uz.png' },
  colombia: { cn: '哥伦比亚', en: 'Colombia', flag: '/assets/flags/co.png' },
  czechia: { cn: '捷克', en: 'Czechia', flag: '/assets/flags/cz.png' },
  southAfrica: { cn: '南非', en: 'South Africa', flag: '/assets/flags/za.png' },
  mexico: { cn: '墨西哥', en: 'Mexico', flag: '/assets/flags/mx.png' },
  korea: { cn: '韩国', en: 'Korea Republic', flag: '/assets/flags/kr.png' }
}

const teamProfile = {
  canada: { rank: 30, value: '€ 199M' },
  bosnia: { rank: 64, value: '€ 98M' },
  usa: { rank: 14, value: '€ 347M' },
  paraguay: { rank: 39, value: '€ 172M' },
  haiti: { rank: 83, value: '€ 31M' },
  scotland: { rank: 33, value: '€ 241M' },
  australia: { rank: 25, value: '€ 46M' },
  turkey: { rank: 26, value: '€ 356M' },
  brazil: { rank: 5, value: '€ 1,210M' },
  morocco: { rank: 12, value: '€ 376M' },
  qatar: { rank: 55, value: '€ 22M' },
  switzerland: { rank: 19, value: '€ 291M' },
  ivoryCoast: { rank: 42, value: '€ 318M' },
  ecuador: { rank: 24, value: '€ 276M' },
  germany: { rank: 9, value: '€ 782M' },
  curacao: { rank: 79, value: '€ 24M' },
  netherlands: { rank: 7, value: '€ 881M' },
  japan: { rank: 18, value: '€ 289M' },
  sweden: { rank: 31, value: '€ 228M' },
  tunisia: { rank: 41, value: '€ 62M' },
  saudi: { rank: 58, value: '€ 39M' },
  uruguay: { rank: 11, value: '€ 483M' },
  spain: { rank: 1, value: '€ 1,150M' },
  caboVerde: { rank: 71, value: '€ 58M' },
  iran: { rank: 20, value: '€ 72M' },
  newZealand: { rank: 89, value: '€ 21M' },
  belgium: { rank: 6, value: '€ 511M' },
  egypt: { rank: 32, value: '€ 162M' },
  france: { rank: 3, value: '€ 1,080M' },
  senegal: { rank: 17, value: '€ 314M' },
  iraq: { rank: 56, value: '€ 28M' },
  norway: { rank: 29, value: '€ 612M' },
  argentina: { rank: 2, value: '€ 806M' },
  algeria: { rank: 37, value: '€ 231M' },
  austria: { rank: 22, value: '€ 294M' },
  jordan: { rank: 68, value: '€ 19M' },
  ghana: { rank: 61, value: '€ 214M' },
  panama: { rank: 44, value: '€ 28M' },
  england: { rank: 4, value: '€ 1,340M' },
  croatia: { rank: 10, value: '€ 329M' },
  portugal: { rank: 8, value: '€ 1,020M' },
  congoDr: { rank: 49, value: '€ 147M' },
  uzbekistan: { rank: 57, value: '€ 41M' },
  colombia: { rank: 15, value: '€ 302M' },
  czechia: { rank: 38, value: '€ 186M' },
  southAfrica: { rank: 59, value: '€ 31M' },
  mexico: { rank: 16, value: '€ 207M' },
  korea: { rank: 23, value: '€ 188M' }
}

Object.keys(teamProfile).forEach((key) => {
  team[key].key = key
  team[key].rank = teamProfile[key].rank
  team[key].value = teamProfile[key].value
})

function makeAnalysis({ result, score, backup, total, order, homeForm, awayForm, homeNews, awayNews, tactics, h2h, risk, oneXtwo, handicap, marketTotal }) {
  return {
    conclusion: `${result}，主比分倾向 ${score}，备用比分 ${backup}。总进球区间 ${total}，更适合把节奏和阵容确认放在临场前再复核。`,
    market: {
      oneXtwo,
      handicap,
      total: marketTotal
    },
    form: {
      home: homeForm,
      away: awayForm
    },
    news: {
      home: homeNews,
      away: awayNews
    },
    tactics,
    h2h,
    order,
    risk
  }
}

const matches = [
  {
    id: 'canada-bosnia-20260612',
    dateText: '6月12日 周五',
    group: 'B组',
    venue: 'Toronto Stadium',
    home: team.canada,
    away: team.bosnia,
    pick: { result: '加拿大不败，倾向小胜', score: '2-1', backup: '1-1', total: '2-3球' },
    analysis: makeAnalysis({
      result: '加拿大不败，倾向主胜',
      score: '2-1',
      backup: '1-1',
      total: '2-3球',
      order: '加拿大不败 > 加拿大0球/平手 > 2.5球附近谨慎看大',
      homeForm: '主场揭幕战动力强，前场速度和高压节奏是主要优势。',
      awayForm: '波黑经验不错，但客场抗压和边路回追会受到考验。',
      homeNews: '赛前需确认主力边锋与中卫健康状态，阵容完整时上限更高。',
      awayNews: '核心中前场若能首发，反击质量会明显提升；否则更偏防守。',
      tactics: '加拿大会主动提速抢开局，波黑更可能压低阵型等待定位球和二点球机会。',
      h2h: '正式大赛交锋参考有限，更多看东道主环境和临场节奏。',
      risk: '东道主首战压力、波黑定位球、加拿大后场出球失误。',
      oneXtwo: '主胜略优，平局有保护价值',
      handicap: '加拿大0球到-0.25更稳',
      marketTotal: '2.25/2.5球，偏2-3球'
    })
  },
  {
    id: 'usa-paraguay-20260612',
    dateText: '6月12日 周五',
    group: 'D组',
    venue: 'Los Angeles Stadium',
    home: team.usa,
    away: team.paraguay,
    pick: { result: '美国胜', score: '2-0', backup: '2-1', total: '2-3球' },
    analysis: makeAnalysis({
      result: '美国主胜',
      score: '2-0',
      backup: '2-1',
      total: '2-3球',
      order: '美国胜 > 美国-0.75 > 小心2.5大球追高',
      homeForm: '美国拥有主场环境和体能优势，中前场压迫质量稳定时很难限制。',
      awayForm: '巴拉圭对抗强、节奏硬，但阵地战创造力通常不如反击直接。',
      homeNews: '重点看主力边后卫和前腰是否健康，完整阵容下攻守平衡更好。',
      awayNews: '若主力中卫组合齐整，巴拉圭能把比赛拖入消耗战。',
      tactics: '美国适合用边路速度拉开宽度，巴拉圭会用身体对抗和定位球制造波动。',
      h2h: '历史交锋样本不适合直接定价，本场主场因素权重更高。',
      risk: '美国若久攻不下，巴拉圭定位球和黄牌尺度会改变比赛。',
      oneXtwo: '主胜方向更清晰',
      handicap: '美国-0.5到-0.75',
      marketTotal: '2.25球，主队先进球则有机会到3球'
    })
  },
  {
    id: 'haiti-scotland-20260613',
    dateText: '6月13日 周六',
    group: 'C组',
    venue: 'Boston Stadium',
    home: team.haiti,
    away: team.scotland,
    pick: { result: '苏格兰不败', score: '1-1', backup: '0-1', total: '1-2球' },
    analysis: makeAnalysis({
      result: '苏格兰不败，平局优先',
      score: '1-1',
      backup: '0-1',
      total: '1-2球',
      order: '苏格兰不败 > 小2.5 > 苏格兰0球',
      homeForm: '海地速度和冲击力在线，但大赛控场经验是疑问。',
      awayForm: '苏格兰体系成熟，身体对抗与定位球质量更稳。',
      homeNews: '重点确认锋线速度点是否首发，这是海地最主要的破局方式。',
      awayNews: '苏格兰中场硬度通常可靠，若主力前锋健康，胜面会提高。',
      tactics: '海地会打纵深，苏格兰更适合控制二点球和高空球。',
      h2h: '直接交锋意义有限，风格差异比历史记录更重要。',
      risk: '海地早早进球会让苏格兰被迫提速，比赛可能变开放。',
      oneXtwo: '平/客方向',
      handicap: '苏格兰0球更稳',
      marketTotal: '2/2.25球，倾向低比分'
    })
  },
  {
    id: 'australia-turkey-20260613',
    dateText: '6月13日 周六',
    group: 'D组',
    venue: 'BC Place Vancouver',
    home: team.australia,
    away: team.turkey,
    pick: { result: '土耳其不败', score: '1-2', backup: '1-1', total: '2-3球' },
    analysis: makeAnalysis({
      result: '土耳其不败，倾向客胜',
      score: '1-2',
      backup: '1-1',
      total: '2-3球',
      order: '土耳其0球 > 土耳其胜平 > 2.5球谨慎大',
      homeForm: '澳大利亚身体和定位球稳定，比赛下限不低。',
      awayForm: '土耳其脚下创造力更强，前场个人能力能制造质量机会。',
      homeNews: '关注中卫速度和后腰覆盖，面对土耳其肋部穿插压力较大。',
      awayNews: '若核心前腰和边锋组合首发，土耳其进攻层次更丰富。',
      tactics: '澳大利亚会争高点，土耳其需要用地面推进避开身体战。',
      h2h: '交锋参考较弱，本场更像风格对撞。',
      risk: '土耳其防守专注度、澳大利亚定位球、人工草/场地适应。',
      oneXtwo: '客胜略高，平局保护',
      handicap: '土耳其0球',
      marketTotal: '2.25/2.5球'
    })
  },
  {
    id: 'brazil-morocco-20260613',
    dateText: '6月13日 周六',
    group: 'C组',
    venue: 'New York New Jersey Stadium',
    home: team.brazil,
    away: team.morocco,
    pick: { result: '巴西小胜', score: '2-1', backup: '1-1', total: '2-3球' },
    analysis: makeAnalysis({
      result: '巴西胜，但优势不宜看得过大',
      score: '2-1',
      backup: '1-1',
      total: '2-3球',
      order: '巴西胜 > 摩洛哥受让 > 双方进球谨慎关注',
      homeForm: '巴西个人能力和阵地战爆点更强，强强战容错来自边路。',
      awayForm: '摩洛哥防守纪律和反击效率出色，能限制热门队的连续压迫。',
      homeNews: '巴西锋线首发选择会影响节奏，若攻击群完整，胜面提升。',
      awayNews: '摩洛哥边后卫与后腰健康很关键，决定反击推进质量。',
      tactics: '巴西控球，摩洛哥压缩中路后打边路反击，比赛不会轻松一边倒。',
      h2h: '近期强队对摩洛哥都不容易，历史标签不能替代战术判断。',
      risk: '巴西后场转换防守、摩洛哥反击、早段定位球。',
      oneXtwo: '主胜方向，但平局不可忽视',
      handicap: '巴西-0.5更合理，深盘风险高',
      marketTotal: '2.25/2.5球，偏2-3球'
    })
  },
  {
    id: 'qatar-switzerland-20260613',
    dateText: '6月13日 周六',
    group: 'B组',
    venue: 'San Francisco Bay Area Stadium',
    home: team.qatar,
    away: team.switzerland,
    pick: { result: '瑞士胜', score: '0-2', backup: '1-2', total: '2-3球' },
    analysis: makeAnalysis({
      result: '瑞士客胜',
      score: '0-2',
      backup: '1-2',
      total: '2-3球',
      order: '瑞士胜 > 瑞士-0.75 > 瑞士零封小防',
      homeForm: '卡塔尔组织性不错，但面对欧洲高强度逼抢会吃紧。',
      awayForm: '瑞士大赛稳定性强，中后场纪律和转换质量更可靠。',
      homeNews: '锋线效率决定能否把比赛拖住，早段失球会非常被动。',
      awayNews: '瑞士若主力中轴齐整，控场和防反都更成熟。',
      tactics: '瑞士会压迫卡塔尔后场出球，卡塔尔需要快速转移避开中路围抢。',
      h2h: '正式赛交锋有限，瑞士大赛经验优势更有参考价值。',
      risk: '瑞士进攻效率波动、卡塔尔反击速度、长途旅行适应。',
      oneXtwo: '客胜更优',
      handicap: '瑞士-0.5到-0.75',
      marketTotal: '2.25球，瑞士领先后节奏可能下降'
    })
  },
  {
    id: 'ivorycoast-ecuador-20260614',
    dateText: '6月14日 周日',
    group: 'E组',
    venue: 'Philadelphia Stadium',
    home: team.ivoryCoast,
    away: team.ecuador,
    pick: { result: '平局优先', score: '1-1', backup: '2-1', total: '2-3球' },
    analysis: makeAnalysis({
      result: '平局优先，科特迪瓦不败',
      score: '1-1',
      backup: '2-1',
      total: '2-3球',
      order: '科特迪瓦0球 > 平局 > 2.5小球',
      homeForm: '科特迪瓦身体强度与边路冲击突出，能制造禁区混乱。',
      awayForm: '厄瓜多尔跑动能力和转换速度强，防线年轻但压迫积极。',
      homeNews: '中锋与边锋状态决定终结效率。',
      awayNews: '后腰屏障和中卫组合若齐整，厄瓜多尔抗压能力不错。',
      tactics: '双方都喜欢速度和对抗，中场二点球会决定比赛走势。',
      h2h: '直接交锋少，风格和体能分配更关键。',
      risk: '比赛可能因早牌、点球或定位球突然打开。',
      oneXtwo: '平局与主队不败',
      handicap: '科特迪瓦0球',
      marketTotal: '2.25球'
    })
  },
  {
    id: 'germany-curacao-20260614',
    dateText: '6月14日 周日',
    group: 'E组',
    venue: 'Houston Stadium',
    home: team.germany,
    away: team.curacao,
    pick: { result: '德国胜', score: '3-0', backup: '2-0', total: '2-4球' },
    analysis: makeAnalysis({
      result: '德国主胜',
      score: '3-0',
      backup: '2-0',
      total: '2-4球',
      order: '德国胜 > 德国-1.5谨慎 > 德国零封',
      homeForm: '德国整体压制和控球能力更强，面对低位防守耐心是关键。',
      awayForm: '库拉索首次大赛阶段更看重防守密度和反击质量。',
      homeNews: '德国锋线效率和边后卫助攻状态会影响能否打穿深防。',
      awayNews: '库拉索需要主力门将与中卫高发挥才有机会保留悬念。',
      tactics: '德国会长期围攻，库拉索要守禁区肋部和第二落点。',
      h2h: '实力差距比历史交锋更有解释力。',
      risk: '德国若轮换或早早降速，深盘穿透风险升高。',
      oneXtwo: '主胜强势',
      handicap: '德国-1.5附近，追深需谨慎',
      marketTotal: '2.75/3球'
    })
  },
  {
    id: 'netherlands-japan-20260614',
    dateText: '6月14日 周日',
    group: 'F组',
    venue: 'Dallas Stadium',
    home: team.netherlands,
    away: team.japan,
    pick: { result: '荷兰不败', score: '2-1', backup: '1-1', total: '2-3球' },
    analysis: makeAnalysis({
      result: '荷兰不败，倾向小胜',
      score: '2-1',
      backup: '1-1',
      total: '2-3球',
      order: '荷兰0球/胜平 > 双方进球 > 2.5球附近观望',
      homeForm: '荷兰身体和中卫出球优势明显，前场能用高度与速度结合。',
      awayForm: '日本技术细腻、转换快，对强队反击效率一直有威胁。',
      homeNews: '荷兰核心中卫与边翼卫配置决定控场稳定性。',
      awayNews: '日本旅欧攻击手状态是能否破门的关键。',
      tactics: '荷兰压迫，日本用小范围配合打身后，比赛质量会高。',
      h2h: '双方风格相克，过往交锋只能作为节奏参考。',
      risk: '日本反击效率、荷兰边路身后空间、湿热环境消耗。',
      oneXtwo: '主胜略优，平局保护',
      handicap: '荷兰-0.25到-0.5',
      marketTotal: '2.5球，双方进球有热度'
    })
  },
  {
    id: 'sweden-tunisia-20260614',
    dateText: '6月14日 周日',
    group: 'F组',
    venue: 'Estadio Monterrey',
    home: team.sweden,
    away: team.tunisia,
    pick: { result: '瑞典小胜', score: '1-0', backup: '1-1', total: '1-2球' },
    analysis: makeAnalysis({
      result: '瑞典不败，倾向小胜',
      score: '1-0',
      backup: '1-1',
      total: '1-2球',
      order: '瑞典0球 > 小2.5 > 瑞典胜',
      homeForm: '瑞典高点和定位球优势明显，比赛风格更稳。',
      awayForm: '突尼斯防守韧性强，常能把强队拖入低比分。',
      homeNews: '瑞典锋线终结状态决定能否提前破局。',
      awayNews: '突尼斯后防完整度和门将发挥是守平关键。',
      tactics: '瑞典会用传中和二点球压迫，突尼斯压缩禁区等待反击。',
      h2h: '低比分倾向比历史交锋更有参考价值。',
      risk: '瑞典阵地战效率、突尼斯反击偷袭、定位球判罚。',
      oneXtwo: '主胜略优',
      handicap: '瑞典-0.25',
      marketTotal: '2/2.25球，偏小'
    })
  },
  {
    id: 'saudi-uruguay-20260615',
    dateText: '6月15日 周一',
    group: 'H组',
    venue: 'Miami Stadium',
    home: team.saudi,
    away: team.uruguay,
    pick: { result: '乌拉圭胜', score: '0-2', backup: '1-2', total: '2-3球' },
    analysis: makeAnalysis({
      result: '乌拉圭客胜',
      score: '0-2',
      backup: '1-2',
      total: '2-3球',
      order: '乌拉圭胜 > 乌拉圭-0.75 > 小防沙特进球',
      homeForm: '沙特脚下速度不错，但面对高强度身体对抗会承压。',
      awayForm: '乌拉圭攻防硬度和前场冲击力更完整。',
      homeNews: '沙特需确认边路快马和后腰健康，关系到反击质量。',
      awayNews: '乌拉圭主力锋线如齐整，禁区压迫优势明显。',
      tactics: '沙特会尝试快速反击，乌拉圭用高位压迫和身体优势压制。',
      h2h: '世界杯记忆不能直接复用，本场乌拉圭整体性更强。',
      risk: '迈阿密气候、乌拉圭犯规尺度、沙特反击效率。',
      oneXtwo: '客胜方向',
      handicap: '乌拉圭-0.75',
      marketTotal: '2.25球'
    })
  },
  {
    id: 'spain-caboverde-20260615',
    dateText: '6月15日 周一',
    group: 'H组',
    venue: 'Atlanta Stadium',
    home: team.spain,
    away: team.caboVerde,
    pick: { result: '西班牙胜', score: '3-0', backup: '2-0', total: '2-4球' },
    analysis: makeAnalysis({
      result: '西班牙主胜',
      score: '3-0',
      backup: '2-0',
      total: '2-4球',
      order: '西班牙胜 > 西班牙-1.5 > 西班牙零封',
      homeForm: '西班牙控球和前场压迫优势极大，能持续消耗对手。',
      awayForm: '佛得角大赛新军气质鲜明，反击速度是主要武器。',
      homeNews: '西班牙锋线首发和边路爆点决定穿盘能力。',
      awayNews: '佛得角防线完整度和体能分配是守住比分的关键。',
      tactics: '西班牙会把球压到前场，佛得角只能尽量减少禁区前失误。',
      h2h: '实力差距明显，历史交锋参考不如阵容深度。',
      risk: '西班牙把握机会效率、领先后的节奏管理、佛得角反击偷球。',
      oneXtwo: '主胜强势',
      handicap: '西班牙-1.5',
      marketTotal: '2.75/3球'
    })
  },
  {
    id: 'iran-newzealand-20260615',
    dateText: '6月15日 周一',
    group: 'G组',
    venue: 'Los Angeles Stadium',
    home: team.iran,
    away: team.newZealand,
    pick: { result: '伊朗胜', score: '1-0', backup: '2-0', total: '1-2球' },
    analysis: makeAnalysis({
      result: '伊朗小胜',
      score: '1-0',
      backup: '2-0',
      total: '1-2球',
      order: '伊朗胜 > 小2.5 > 伊朗-0.5',
      homeForm: '伊朗比赛经验和防守结构更成熟，善于低风险拿结果。',
      awayForm: '新西兰身体条件好，但阵地战创造力有限。',
      homeNews: '伊朗锋线老将状态和中场拦截质量决定上限。',
      awayNews: '新西兰中卫与门将若高发挥，可把比赛拉成低比分。',
      tactics: '伊朗控制风险，新西兰争高球和定位球，节奏不会太快。',
      h2h: '交锋参考不多，比赛会更接近资格赛式消耗。',
      risk: '伊朗进攻效率、新西兰定位球、早段心理压力。',
      oneXtwo: '主胜更稳',
      handicap: '伊朗-0.5',
      marketTotal: '2/2.25球，偏小'
    })
  },
  {
    id: 'belgium-egypt-20260615',
    dateText: '6月15日 周一',
    group: 'G组',
    venue: 'Seattle Stadium',
    home: team.belgium,
    away: team.egypt,
    pick: { result: '比利时不败', score: '2-1', backup: '1-1', total: '2-3球' },
    analysis: makeAnalysis({
      result: '比利时不败，倾向小胜',
      score: '2-1',
      backup: '1-1',
      total: '2-3球',
      order: '比利时0球/胜平 > 双方进球 > 比利时胜',
      homeForm: '比利时中前场创造力更丰富，但防守转换需要警惕。',
      awayForm: '埃及纪律性强，边路反击和头号球星单点爆破有威胁。',
      homeNews: '比利时后防健康状况会直接影响让球选择。',
      awayNews: '埃及核心攻击手若首发，双方进球概率明显提升。',
      tactics: '比利时控球组织，埃及让出球权后打身后空间。',
      h2h: '埃及曾多次给欧洲强队制造麻烦，不能按名气简单定价。',
      risk: '比利时防线速度、埃及反击、领先后的保守选择。',
      oneXtwo: '主胜略优，平局保护',
      handicap: '比利时-0.25到-0.5',
      marketTotal: '2.25/2.5球'
    })
  },
  {
    id: 'france-senegal-20260616',
    dateText: '6月16日 周二',
    group: 'I组',
    venue: 'New York New Jersey Stadium',
    home: team.france,
    away: team.senegal,
    pick: { result: '法国胜', score: '2-1', backup: '1-1', total: '2-3球' },
    analysis: makeAnalysis({
      result: '法国胜，但塞内加尔有进球机会',
      score: '2-1',
      backup: '1-1',
      total: '2-3球',
      order: '法国胜 > 双方进球 > 法国-0.75谨慎',
      homeForm: '法国阵容深度和转换冲击力顶级，前场能用个人能力解决问题。',
      awayForm: '塞内加尔身体、速度和防守纪律都强，不是软对手。',
      homeNews: '法国锋线组合与中场屏障健康度决定能否压住反击。',
      awayNews: '塞内加尔边锋和中锋状态影响反击质量。',
      tactics: '法国控球后寻找肋部，塞内加尔会用纵深和身体对抗反击。',
      h2h: '历史爆冷记忆会增加心理张力，但当前阵容质量法国仍占优。',
      risk: '法国防线身后、塞内加尔定位球、热门队首战慢热。',
      oneXtwo: '主胜方向',
      handicap: '法国-0.75附近，深盘不追',
      marketTotal: '2.5球，双方进球可关注'
    })
  },
  {
    id: 'iraq-norway-20260616',
    dateText: '6月16日 周二',
    group: 'I组',
    venue: 'Boston Stadium',
    home: team.iraq,
    away: team.norway,
    pick: { result: '挪威胜', score: '0-2', backup: '1-2', total: '2-3球' },
    analysis: makeAnalysis({
      result: '挪威客胜',
      score: '0-2',
      backup: '1-2',
      total: '2-3球',
      order: '挪威胜 > 挪威-0.75 > 挪威进球数大1.5',
      homeForm: '伊拉克对抗积极，防守时有韧性，但面对顶级中锋压力大。',
      awayForm: '挪威锋线冲击力强，纵深传递和禁区终结优势明显。',
      homeNews: '伊拉克后腰和中卫能否顶住高点是核心。',
      awayNews: '挪威头号前锋与组织核心若同时首发，胜面很高。',
      tactics: '挪威会直接攻击禁区，伊拉克需要压缩空间并保护第二落点。',
      h2h: '交锋样本有限，球员个人能力差距更重要。',
      risk: '挪威大赛经验、伊拉克反击、定位球防守。',
      oneXtwo: '客胜方向',
      handicap: '挪威-0.75',
      marketTotal: '2.5球上下'
    })
  },
  {
    id: 'argentina-algeria-20260616',
    dateText: '6月16日 周二',
    group: 'J组',
    venue: 'Kansas City Stadium',
    home: team.argentina,
    away: team.algeria,
    pick: { result: '阿根廷胜', score: '2-0', backup: '2-1', total: '2-3球' },
    analysis: makeAnalysis({
      result: '阿根廷主胜',
      score: '2-0',
      backup: '2-1',
      total: '2-3球',
      order: '阿根廷胜 > 阿根廷-1 > 小防2-1',
      homeForm: '阿根廷中场控制和比赛管理成熟，淘汰赛级别经验充足。',
      awayForm: '阿尔及利亚速度和个人突破不错，但防线稳定性需要验证。',
      homeNews: '阿根廷锋线配置与核心老将状态会影响进攻效率。',
      awayNews: '阿尔及利亚边路攻击手状态决定能否打出威胁。',
      tactics: '阿根廷会掌控节奏，阿尔及利亚需要用快速转换冲击身后。',
      h2h: '历史参考弱，阿根廷经验优势明显。',
      risk: '阿根廷首战节奏偏慢、阿尔及利亚速度、定位球偶发。',
      oneXtwo: '主胜强势',
      handicap: '阿根廷-1附近',
      marketTotal: '2.5球，偏2-3球'
    })
  },
  {
    id: 'austria-jordan-20260616',
    dateText: '6月16日 周二',
    group: 'J组',
    venue: 'San Francisco Bay Area Stadium',
    home: team.austria,
    away: team.jordan,
    pick: { result: '奥地利胜', score: '2-0', backup: '2-1', total: '2-3球' },
    analysis: makeAnalysis({
      result: '奥地利主胜',
      score: '2-0',
      backup: '2-1',
      total: '2-3球',
      order: '奥地利胜 > 奥地利-0.75 > 奥地利进球数大1.5',
      homeForm: '奥地利压迫体系成熟，节奏强度和中场覆盖优势明显。',
      awayForm: '约旦大赛新军冲劲足，反击和定位球是主要机会。',
      homeNews: '奥地利前场压迫点和中卫健康会影响零封概率。',
      awayNews: '约旦锋线速度点若首发，能制造少量反击威胁。',
      tactics: '奥地利高位逼抢，约旦长传找身后，比赛关键在第一脚出球。',
      h2h: '直接交锋价值有限，奥地利体系成熟度更关键。',
      risk: '奥地利转化率、约旦低位死守、早段黄牌。',
      oneXtwo: '主胜方向',
      handicap: '奥地利-0.75',
      marketTotal: '2.25/2.5球'
    })
  },
  {
    id: 'ghana-panama-20260617',
    dateText: '6月17日 周三',
    group: 'L组',
    venue: 'Toronto Stadium',
    home: team.ghana,
    away: team.panama,
    pick: { result: '加纳胜', score: '2-1', backup: '1-1', total: '2-3球' },
    analysis: makeAnalysis({
      result: '加纳不败，倾向小胜',
      score: '2-1',
      backup: '1-1',
      total: '2-3球',
      order: '加纳0球 > 加纳胜 > 双方进球',
      homeForm: '加纳个人能力和身体冲击更强，边路速度是优势。',
      awayForm: '巴拿马纪律性和拼抢强度不错，能把比赛拖得很硬。',
      homeNews: '加纳前场核心状态决定能否把优势变成进球。',
      awayNews: '巴拿马主力中卫和后腰健康是守平基础。',
      tactics: '加纳打速度，巴拿马压低阵型后找定位球。',
      h2h: '历史交锋参考有限，身体对抗会是主线。',
      risk: '加纳防守注意力、巴拿马定位球、比赛节奏被切碎。',
      oneXtwo: '主胜略优',
      handicap: '加纳-0.25',
      marketTotal: '2.25球'
    })
  },
  {
    id: 'england-croatia-20260617',
    dateText: '6月17日 周三',
    group: 'L组',
    venue: 'Dallas Stadium',
    home: team.england,
    away: team.croatia,
    pick: { result: '英格兰不败', score: '1-1', backup: '2-1', total: '2-3球' },
    analysis: makeAnalysis({
      result: '英格兰不败，平局权重高',
      score: '1-1',
      backup: '2-1',
      total: '2-3球',
      order: '英格兰0球/胜平 > 小心平局 > 2.5小球',
      homeForm: '英格兰阵容厚度强，但强强战开局常偏谨慎。',
      awayForm: '克罗地亚控场经验丰富，中场节奏管理仍然可靠。',
      homeNews: '英格兰锋线与后腰选择会决定进攻速度和防守平衡。',
      awayNews: '克罗地亚老将体能和中场完整度是最大变量。',
      tactics: '英格兰想用速度打身后，克罗地亚会控节奏降低来回冲刺。',
      h2h: '双方大赛恩怨足，心理和节奏管理比单场状态更重要。',
      risk: '英格兰临门一脚、克罗地亚中场控球、达拉斯气候消耗。',
      oneXtwo: '主胜略优，平局很热',
      handicap: '英格兰-0.25',
      marketTotal: '2.25/2.5球，偏谨慎'
    })
  },
  {
    id: 'portugal-congodr-20260617',
    dateText: '6月17日 周三',
    group: 'K组',
    venue: 'Houston Stadium',
    home: team.portugal,
    away: team.congoDr,
    pick: { result: '葡萄牙胜', score: '2-0', backup: '3-1', total: '2-4球' },
    analysis: makeAnalysis({
      result: '葡萄牙主胜',
      score: '2-0',
      backup: '3-1',
      total: '2-4球',
      order: '葡萄牙胜 > 葡萄牙-1 > 葡萄牙进球数大1.5',
      homeForm: '葡萄牙阵容技术含量高，边路和中路都有破密防手段。',
      awayForm: '刚果民主共和国身体强壮，反击和定位球会制造对抗压力。',
      homeNews: '葡萄牙前场轮换很多，首发组合影响进攻效率。',
      awayNews: '刚果民主共和国需要主力中卫与后腰完整才能扛住压迫。',
      tactics: '葡萄牙控球推进，刚果民主共和国压低空间后争转换。',
      h2h: '直接交锋参考弱，葡萄牙阵容深度优势更明显。',
      risk: '葡萄牙领先后降速、对手定位球、休斯敦湿热环境。',
      oneXtwo: '主胜强势',
      handicap: '葡萄牙-1',
      marketTotal: '2.75球'
    })
  },
  {
    id: 'uzbekistan-colombia-20260617',
    dateText: '6月17日 周三',
    group: 'K组',
    venue: 'Mexico City Stadium',
    home: team.uzbekistan,
    away: team.colombia,
    pick: { result: '哥伦比亚胜', score: '0-1', backup: '1-2', total: '1-3球' },
    analysis: makeAnalysis({
      result: '哥伦比亚客胜',
      score: '0-1',
      backup: '1-2',
      total: '1-3球',
      order: '哥伦比亚胜 > 小2.5 > 哥伦比亚-0.5',
      homeForm: '乌兹别克斯坦纪律好、整体性强，首次大赛会非常珍惜开局。',
      awayForm: '哥伦比亚个人能力和对抗质量更高，前场创造力占优。',
      homeNews: '乌兹别克斯坦门将和中卫发挥决定能否守住低比分。',
      awayNews: '哥伦比亚前腰与边锋若状态在线，破密防能力更强。',
      tactics: '乌兹别克斯坦会收缩阵型，哥伦比亚需要耐心寻找肋部空间。',
      h2h: '交锋样本少，本场更看哥伦比亚破低位能力。',
      risk: '墨西哥城海拔、哥伦比亚效率、乌兹别克斯坦反击。',
      oneXtwo: '客胜略优',
      handicap: '哥伦比亚-0.5',
      marketTotal: '2/2.25球，偏低比分'
    })
  },
  {
    id: 'czechia-southafrica-20260618',
    dateText: '6月18日 周四',
    group: 'A组',
    venue: 'Atlanta Stadium',
    home: team.czechia,
    away: team.southAfrica,
    pick: { result: '捷克不败', score: '1-1', backup: '2-1', total: '2-3球' },
    analysis: makeAnalysis({
      result: '捷克不败，平局优先',
      score: '1-1',
      backup: '2-1',
      total: '2-3球',
      order: '捷克0球 > 平局 > 2.5小球',
      homeForm: '捷克身体和定位球优势明显，但转换速度需要保护。',
      awayForm: '南非跑动积极，边路速度和反击能制造麻烦。',
      homeNews: '捷克中卫与高中锋健康决定定位球威胁。',
      awayNews: '南非前场速度点若齐整，反击质量会提升。',
      tactics: '捷克争高点和二点球，南非打快速推进，攻防转换会很关键。',
      h2h: '交锋参考有限，A组第二轮积分形势会影响保守程度。',
      risk: '双方首轮结果、南非反击、捷克防线回追。',
      oneXtwo: '主队不败',
      handicap: '捷克0球',
      marketTotal: '2.25球'
    })
  },
  {
    id: 'switzerland-bosnia-20260618',
    dateText: '6月18日 周四',
    group: 'B组',
    venue: 'Los Angeles Stadium',
    home: team.switzerland,
    away: team.bosnia,
    pick: { result: '瑞士胜', score: '2-0', backup: '2-1', total: '2-3球' },
    analysis: makeAnalysis({
      result: '瑞士主胜',
      score: '2-0',
      backup: '2-1',
      total: '2-3球',
      order: '瑞士胜 > 瑞士-0.75 > 小防波黑进球',
      homeForm: '瑞士稳定性和防守纪律更强，二轮战更看重拿分效率。',
      awayForm: '波黑有经验球员，但连续高强度比赛下防线压力大。',
      homeNews: '瑞士中轴完整时控场能力很可靠。',
      awayNews: '波黑前锋和定位球主罚手状态决定破门概率。',
      tactics: '瑞士会压迫波黑中后场，波黑依靠高点和定位球找机会。',
      h2h: '欧洲球队彼此熟悉，瑞士整体性仍更占优。',
      risk: '瑞士进攻耐心、波黑定位球、洛杉矶气候与恢复时间。',
      oneXtwo: '主胜方向',
      handicap: '瑞士-0.5到-0.75',
      marketTotal: '2.25球'
    })
  },
  {
    id: 'canada-qatar-20260618',
    dateText: '6月18日 周四',
    group: 'B组',
    venue: 'BC Place Vancouver',
    home: team.canada,
    away: team.qatar,
    pick: { result: '加拿大胜', score: '2-0', backup: '2-1', total: '2-3球' },
    analysis: makeAnalysis({
      result: '加拿大主胜',
      score: '2-0',
      backup: '2-1',
      total: '2-3球',
      order: '加拿大胜 > 加拿大-0.75 > 加拿大进球数大1.5',
      homeForm: '加拿大回到本土环境，速度和身体优势更容易兑现。',
      awayForm: '卡塔尔组织性尚可，但对抗和转换防守会吃紧。',
      homeNews: '加拿大边路核心若健康，持续冲击能压制卡塔尔。',
      awayNews: '卡塔尔需要中场控球点稳定，否则会被迫长时间防守。',
      tactics: '加拿大用宽度和纵深制造机会，卡塔尔尝试控球降速。',
      h2h: '直接参考有限，主场环境和体能优势更重要。',
      risk: '加拿大首战消耗、卡塔尔控球拖节奏、临场伤病。',
      oneXtwo: '主胜方向',
      handicap: '加拿大-0.75',
      marketTotal: '2.5球附近'
    })
  },
  {
    id: 'mexico-korea-20260618',
    dateText: '6月18日 周四',
    group: 'A组',
    venue: 'Estadio Guadalajara',
    home: team.mexico,
    away: team.korea,
    pick: { result: '墨西哥不败', score: '2-1', backup: '1-1', total: '2-3球' },
    analysis: makeAnalysis({
      result: '墨西哥不败，倾向小胜',
      score: '2-1',
      backup: '1-1',
      total: '2-3球',
      order: '墨西哥0球/胜平 > 双方进球 > 2.5球谨慎大',
      homeForm: '墨西哥在本土氛围下节奏感强，边路推进和压迫积极。',
      awayForm: '韩国技术和跑动能力出色，反击速度能冲击墨西哥身后。',
      homeNews: '墨西哥中前场创造点是否健康，会影响阵地战破局。',
      awayNews: '韩国核心前锋和前腰状态决定反击质量。',
      tactics: '墨西哥主动压上，韩国打快速转换，比赛可能出现双方进球。',
      h2h: '双方世界杯交锋有记忆点，但本场更看主场环境和二轮积分。',
      risk: '墨西哥压上后的身后空间、韩国反击、瓜达拉哈拉高强度气氛。',
      oneXtwo: '主队不败',
      handicap: '墨西哥-0.25',
      marketTotal: '2.25/2.5球'
    })
  },
  {
    id: 'brazil-haiti-20260619',
    dateText: '6月20日 周六',
    group: 'C组',
    venue: 'Philadelphia Stadium',
    home: team.brazil,
    away: team.haiti,
    pick: { result: '巴西胜', score: '3-0', backup: '2-0', total: '2-4球' },
    analysis: makeAnalysis({
      result: '巴西主胜',
      score: '3-0',
      backup: '2-0',
      total: '2-4球',
      order: '巴西胜 > 巴西-1.5谨慎 > 巴西零封',
      homeForm: '巴西整体个人能力、控球压迫和禁区创造力明显高于海地，面对低位防守时需要耐心打开边路。',
      awayForm: '海地速度和身体冲击有威胁，但持续防守质量和后场出球稳定性会被强队压迫放大。',
      homeNews: '巴西首轮后需要核对边锋和中场推进点体能；若攻击群齐整，主胜和零封方向更稳。',
      awayNews: '海地需要确认锋线速度点和中卫组合健康，若主力反击点缺阵，进球上限会明显下降。',
      tactics: '巴西会长时间围攻并利用边路一对一制造机会，海地更可能压低阵型等待反击和定位球。',
      h2h: '正式大赛直接交锋样本有限，本场更看阵容深度、控球压制和海地防线抗压。',
      risk: '巴西若早早轮换或进球后降速，深盘穿透存在波动；海地反击速度和定位球是主要冷门入口。',
      oneXtwo: '主胜方向清晰，不设置胜平负备选',
      handicap: '巴西-1.5附近，赢球优先，穿盘需看首发强度',
      marketTotal: '2.75/3球，巴西早进球则大球空间更高'
    })
  },
  {
    id: 'scotland-morocco-20260619',
    dateText: '6月20日 周六',
    group: 'C组',
    venue: 'Boston Stadium',
    home: team.scotland,
    away: team.morocco,
    pick: { result: '平局优先', score: '1-1', backup: '0-1', total: '1-2球' },
    analysis: makeAnalysis({
      result: '平局优先，摩洛哥不败',
      score: '1-1',
      backup: '0-1',
      total: '1-2球',
      order: '摩洛哥不败 > 平局 > 2.5小球',
      homeForm: '苏格兰身体对抗、定位球和二点球质量稳定，能把比赛拖进高强度消耗。',
      awayForm: '摩洛哥防守纪律和转换速度更成熟，面对欧洲身体流球队时反击质量有优势。',
      homeNews: '苏格兰需要核对中场硬度和锋线支点体能，若中前场消耗过大，后段推进会下降。',
      awayNews: '摩洛哥边后卫和后腰健康很关键，若两翼齐整，反击推进和防线保护都更可靠。',
      tactics: '苏格兰争高点和定位球，摩洛哥压缩中路后打边路转换，节奏可能偏谨慎。',
      h2h: '历史交锋参考有限，现阶段更看小组第二轮积分压力和双方防守稳定性。',
      risk: '早段定位球、黄牌尺度和摩洛哥边路身后空间会改变低比分节奏。',
      oneXtwo: '平局权重最高，客队不败保护',
      handicap: '摩洛哥受让或0球更稳',
      marketTotal: '2/2.25球，倾向小比分'
    })
  },
  {
    id: 'turkey-paraguay-20260619',
    dateText: '6月20日 周六',
    group: 'D组',
    venue: 'San Francisco Bay Area Stadium',
    home: team.turkey,
    away: team.paraguay,
    pick: { result: '土耳其胜', score: '2-1', backup: '1-1', total: '2-3球' },
    analysis: makeAnalysis({
      result: '土耳其胜，平局低权重保护',
      score: '2-1',
      backup: '1-1',
      total: '2-3球',
      order: '土耳其胜 > 平局保护 > 双方进球',
      homeForm: '土耳其中前场创造力和脚下能力更强，能通过前腰和边锋连续制造禁区前沿机会。',
      awayForm: '巴拉圭对抗硬、节奏直接，防守端韧性强，但阵地战创造力通常不如反击和定位球。',
      homeNews: '土耳其核心前腰、边锋和后腰保护情况需要赛前确认，若创造点齐整，主胜更有支撑。',
      awayNews: '巴拉圭中卫和防守型中场健康决定抗压下限，若主力屏障缺阵，禁区前沿压力会增大。',
      tactics: '土耳其主动控球提速，巴拉圭用身体对抗和定位球打断节奏，比赛可能有较多犯规和转换。',
      h2h: '交锋样本不宜直接定价，本场更看土耳其创造力能否避开巴拉圭的硬对抗。',
      risk: '土耳其后场专注度、巴拉圭定位球、裁判尺度和黄牌累积会影响胜负方向。',
      oneXtwo: '主胜略优，平局只作低权重备选',
      handicap: '土耳其-0.25到-0.5，深追需谨慎',
      marketTotal: '2.25/2.5球，双方进球可关注'
    })
  },
  {
    id: 'usa-australia-20260619',
    dateText: '6月20日 周六',
    group: 'D组',
    venue: 'Seattle Stadium',
    home: team.usa,
    away: team.australia,
    pick: { result: '美国胜', score: '2-0', backup: '2-1', total: '2-3球' },
    analysis: makeAnalysis({
      result: '美国主胜',
      score: '2-0',
      backup: '2-1',
      total: '2-3球',
      order: '美国胜 > 美国-0.75 > 2.5球谨慎',
      homeForm: '美国主场环境、冲刺速度和中前场压迫更有优势，能持续冲击澳大利亚后场出球。',
      awayForm: '澳大利亚身体和定位球稳定，但面对高节奏压迫时转身速度和中场出球会受到考验。',
      homeNews: '美国需要核对主力边后卫和中场屏障体能，若首发完整，攻守平衡更好。',
      awayNews: '澳大利亚门将、中卫和高点前锋状态关键，若高点不齐，定位球威胁会下降。',
      tactics: '美国用边路速度和前场压迫抢开局，澳大利亚更依赖长传、二点球和定位球制造波动。',
      h2h: '历史交锋参考有限，本场主场因素和小组第二轮积分压力权重更高。',
      risk: '美国若久攻不下，澳大利亚高球和定位球会放大风险；西雅图天气和场地适应也需临场确认。',
      oneXtwo: '主胜方向清晰，不设置胜平负备选',
      handicap: '美国-0.75附近，赢球优先，穿盘看早段效率',
      marketTotal: '2.25/2.5球，美国先入球则有到3球空间'
    })
  }
]

const matchMeta = {
  'canada-bosnia-20260612': { dateText: '6月13日 周六', kickoff: '03:00', scheduleAt: '2026-06-13T03:00:00+08:00', weatherIcon: '☁️', weather: '21℃' },
  'usa-paraguay-20260612': { dateText: '6月13日 周六', kickoff: '09:00', scheduleAt: '2026-06-13T09:00:00+08:00', weatherIcon: '☀️', weather: '23℃' },
  'qatar-switzerland-20260613': { dateText: '6月14日 周日', kickoff: '03:00', scheduleAt: '2026-06-14T03:00:00+08:00', weatherIcon: '☀️', weather: '17℃' },
  'brazil-morocco-20260613': { dateText: '6月14日 周日', kickoff: '06:00', scheduleAt: '2026-06-14T06:00:00+08:00', weatherIcon: '☀️', weather: '24℃' },
  'haiti-scotland-20260613': { dateText: '6月14日 周日', kickoff: '09:00', scheduleAt: '2026-06-14T09:00:00+08:00', weatherIcon: '🌧️', weather: '19℃' },
  'australia-turkey-20260613': { dateText: '6月14日 周日', kickoff: '12:00', scheduleAt: '2026-06-14T12:00:00+08:00', weatherIcon: '☁️', weather: '18℃' },
  'germany-curacao-20260614': { dateText: '6月15日 周一', kickoff: '01:00', scheduleAt: '2026-06-15T01:00:00+08:00', weatherIcon: '☀️', weather: '31℃' },
  'netherlands-japan-20260614': { dateText: '6月15日 周一', kickoff: '04:00', scheduleAt: '2026-06-15T04:00:00+08:00', weatherIcon: '☀️', weather: '30℃' },
  'ivorycoast-ecuador-20260614': { dateText: '6月15日 周一', kickoff: '07:00', scheduleAt: '2026-06-15T07:00:00+08:00', weatherIcon: '☁️', weather: '25℃' },
  'sweden-tunisia-20260614': { dateText: '6月15日 周一', kickoff: '10:00', scheduleAt: '2026-06-15T10:00:00+08:00', weatherIcon: '☀️', weather: '28℃' },
  'spain-caboverde-20260615': { dateText: '6月16日 周二', kickoff: '00:00', scheduleAt: '2026-06-16T00:00:00+08:00', weatherIcon: '☁️', weather: '28℃' },
  'belgium-egypt-20260615': { dateText: '6月16日 周二', kickoff: '03:00', scheduleAt: '2026-06-16T03:00:00+08:00', weatherIcon: '☁️', weather: '16℃' },
  'saudi-uruguay-20260615': { dateText: '6月16日 周二', kickoff: '06:00', scheduleAt: '2026-06-16T06:00:00+08:00', weatherIcon: '⛈️', weather: '29℃' },
  'iran-newzealand-20260615': { dateText: '6月16日 周二', kickoff: '09:00', scheduleAt: '2026-06-16T09:00:00+08:00', weatherIcon: '☀️', weather: '22℃' },
  'france-senegal-20260616': { dateText: '6月17日 周三', kickoff: '03:00', scheduleAt: '2026-06-17T03:00:00+08:00', weatherIcon: '☀️', weather: '24℃' },
  'iraq-norway-20260616': { dateText: '6月17日 周三', kickoff: '06:00', scheduleAt: '2026-06-17T06:00:00+08:00', weatherIcon: '🌧️', weather: '20℃' },
  'argentina-algeria-20260616': { dateText: '6月17日 周三', kickoff: '09:00', scheduleAt: '2026-06-17T09:00:00+08:00', weatherIcon: '☀️', weather: '27℃' },
  'austria-jordan-20260616': { dateText: '6月17日 周三', kickoff: '12:00', scheduleAt: '2026-06-17T12:00:00+08:00', weatherIcon: '☀️', weather: '17℃' },
  'portugal-congodr-20260617': { dateText: '6月18日 周四', kickoff: '01:00', scheduleAt: '2026-06-18T01:00:00+08:00', weatherIcon: '☀️', weather: '32℃' },
  'england-croatia-20260617': { dateText: '6月18日 周四', kickoff: '04:00', scheduleAt: '2026-06-18T04:00:00+08:00', weatherIcon: '☀️', weather: '31℃' },
  'ghana-panama-20260617': { dateText: '6月18日 周四', kickoff: '07:00', scheduleAt: '2026-06-18T07:00:00+08:00', weatherIcon: '☁️', weather: '22℃' },
  'uzbekistan-colombia-20260617': { dateText: '6月18日 周四', kickoff: '10:00', scheduleAt: '2026-06-18T10:00:00+08:00', weatherIcon: '☀️', weather: '24℃' },
  'czechia-southafrica-20260618': { dateText: '6月19日 周五', kickoff: '00:00', scheduleAt: '2026-06-19T00:00:00+08:00', weatherIcon: '☁️', weather: '28℃' },
  'switzerland-bosnia-20260618': { dateText: '6月19日 周五', kickoff: '03:00', scheduleAt: '2026-06-19T03:00:00+08:00', weatherIcon: '☀️', weather: '22℃' },
  'canada-qatar-20260618': { dateText: '6月19日 周五', kickoff: '06:00', scheduleAt: '2026-06-19T06:00:00+08:00', weatherIcon: '☁️', weather: '18℃' },
  'mexico-korea-20260618': { dateText: '6月19日 周五', kickoff: '09:00', scheduleAt: '2026-06-19T09:00:00+08:00', weatherIcon: '☀️', weather: '26℃' },
  'brazil-haiti-20260619': { dateText: '6月20日 周六', kickoff: '00:00', scheduleAt: '2026-06-20T00:00:00+08:00', weatherIcon: '☁️', weather: '27℃' },
  'scotland-morocco-20260619': { dateText: '6月20日 周六', kickoff: '03:00', scheduleAt: '2026-06-20T03:00:00+08:00', weatherIcon: '🌧️', weather: '20℃' },
  'turkey-paraguay-20260619': { dateText: '6月20日 周六', kickoff: '06:00', scheduleAt: '2026-06-20T06:00:00+08:00', weatherIcon: '☀️', weather: '18℃' },
  'usa-australia-20260619': { dateText: '6月20日 周六', kickoff: '09:00', scheduleAt: '2026-06-20T09:00:00+08:00', weatherIcon: '☁️', weather: '17℃' }
}

const venueAltitudes = {
  'Toronto Stadium': '76m',
  'Los Angeles Stadium': '38m',
  'Boston Stadium': '6m',
  'BC Place Vancouver': '2m',
  'New York New Jersey Stadium': '2m',
  'San Francisco Bay Area Stadium': '2m',
  'Philadelphia Stadium': '12m',
  'Houston Stadium': '15m',
  'Dallas Stadium': '163m',
  'Estadio Monterrey': '540m',
  'Miami Stadium': '2m',
  'Atlanta Stadium': '320m',
  'Seattle Stadium': '52m',
  'Kansas City Stadium': '270m',
  'Mexico City Stadium': '2240m',
  'Estadio Guadalajara': '1566m'
}

const predictionDiscipline = {
  'canada-bosnia-20260612': { result: '加拿大胜', resultBackup: '平局', oneXtwo: '主胜为主，平局作为低权重备选', order: '加拿大胜 > 平局保护 > 加拿大-0.25谨慎' },
  'haiti-scotland-20260613': { result: '苏格兰胜', resultBackup: '', score: '0-2', backup: '0-1', total: '1-2球', oneXtwo: '客胜方向，不设胜平负备选', handicap: '苏格兰-1.5属于深让，不能写苏格兰0球', order: '苏格兰胜 > 苏格兰-1.5谨慎 > 小2.5/2.75' },
  'australia-turkey-20260613': { result: '土耳其胜', resultBackup: '平局', oneXtwo: '客胜为主，平局低权重保护', order: '土耳其胜 > 平局保护 > 2.5球谨慎大' },
  'brazil-morocco-20260613': { result: '巴西胜', resultBackup: '', oneXtwo: '主胜方向，不再把平局列为胜平负备选', order: '巴西胜 > 巴西-0.5 > 双方进球谨慎关注' },
  'netherlands-japan-20260614': { result: '荷兰胜', resultBackup: '', oneXtwo: '主胜方向，不设胜平负备选', order: '荷兰胜 > 荷兰-0.5 > 2.5球谨慎大' },
  'belgium-egypt-20260615': { result: '比利时胜', resultBackup: '', oneXtwo: '主胜方向，不设胜平负备选', order: '比利时胜 > 比利时-0.5 > 2.5球谨慎大' },
  'england-croatia-20260617': { result: '平局优先，英格兰小胜备选', resultBackup: '英格兰胜', oneXtwo: '平局优先，主胜备选', order: '平局 > 英格兰胜 > 2.5小球' },
  'czechia-southafrica-20260618': { result: '平局优先，捷克小胜备选', resultBackup: '捷克胜', oneXtwo: '平局优先，主胜备选', order: '平局 > 捷克胜 > 2.5小球' },
  'mexico-korea-20260618': { result: '墨西哥胜', resultBackup: '平局', oneXtwo: '主胜为主，平局低权重保护', order: '墨西哥胜 > 平局保护 > 2.5球谨慎大' },
  'brazil-haiti-20260619': { result: '巴西胜', resultBackup: '', oneXtwo: '主胜方向清晰，不设置胜平负备选', order: '巴西胜 > 巴西-1.5谨慎 > 巴西零封' },
  'scotland-morocco-20260619': { result: '平局优先', resultBackup: '摩洛哥胜', oneXtwo: '平局优先，客胜作低权重备选', order: '摩洛哥不败 > 平局 > 2.5小球' },
  'turkey-paraguay-20260619': { result: '土耳其胜', resultBackup: '平局', oneXtwo: '主胜略优，平局低权重保护', order: '土耳其胜 > 平局保护 > 双方进球' },
  'usa-australia-20260619': { result: '美国胜', resultBackup: '', oneXtwo: '主胜方向清晰，不设置胜平负备选', order: '美国胜 > 美国-0.75 > 2.5球谨慎' }
}

const injuryImpactNotes = {
  'mexico-korea-20260618': {
    home: '墨西哥首轮出现红牌停赛风险，相关球员下一场无缘出战，赛前需要核对官方停赛名单。若缺口在中后场，墨西哥高位压迫后的回追保护会下降，主胜方向保留，但不宜把盘口追得过深。',
    away: '韩国目前更关键的是锋线与前腰健康度。若核心攻击手首发，反击速度会放大墨西哥身后空间，因此平局只作为低权重保护，不在首页展示。'
  },
  'czechia-southafrica-20260618': {
    home: '捷克暂无明确新增停赛输入，主要看中卫和高中锋健康度。若高点齐整，定位球和二点球优势会提升。',
    away: '南非首轮有红牌停赛影响，下一场相关球员无法出战，防线轮换和中场拦截会受影响。速度反击仍有威胁，但阵型完整度下降，所以平局优先，南非不宜作为主方向。'
  },
  'haiti-scotland-20260613': {
    home: '海地需要确认锋线速度点和边翼卫身体状态；若主力速度点缺阵，反击威胁会明显下降。',
    away: '苏格兰重点看中锋、后腰和中卫轴线是否齐整。核心骨架完整时客胜方向更稳，深让仍需谨慎。'
  },
  'australia-turkey-20260613': {
    home: '澳大利亚需关注中卫转身速度和主力中锋健康度；若高点不齐，定位球优势会被削弱。',
    away: '土耳其核心前腰和边锋出勤决定进攻上限。若创造点首发，客胜优先；若缺阵，平局保护权重提高。'
  },
  'brazil-morocco-20260613': {
    home: '巴西需确认边锋群和中场推进点是否首发。若攻击群齐整，主胜方向清晰；若轮换偏保守，比分会更接近。',
    away: '摩洛哥边后卫和后腰健康度决定反击质量。若两翼齐整，巴西赢球但未必轻松穿盘。'
  },
  'qatar-switzerland-20260613': {
    home: '卡塔尔暂无确认核心停赛，重点看门将和中卫组合稳定性。若防线轮换，被瑞士压迫后出球风险较高。',
    away: '瑞士中轴线经验充足，若主力后腰和中卫齐整，客胜与低比分方向更稳。'
  }
}

function getDefaultInjuryImpact(match) {
  return {
    home: `${match.home.cn}暂无确认新增红牌停赛，赛前重点核对首发门将、中卫和核心进攻点。若关键位置临场缺阵，需要下调进攻效率或防线稳定性。`,
    away: `${match.away.cn}暂无确认新增红牌停赛，主要关注长途旅行后的轮换和核心球员健康度。若中前场主力不齐，比分倾向会更保守。`
  }
}

function getProbabilityLevel(percent) {
  if (percent >= 50) return 'green'
  if (percent >= 30) return 'yellow'
  if (percent >= 15) return 'orange'
  return 'red'
}

function makeProbabilityItem(key, label, value) {
  return {
    key,
    label,
    value,
    level: getProbabilityLevel(value),
    isSmall: value < 18
  }
}

function parseScoreValue(score) {
  const parts = String(score || '').split('-').map((item) => Number(item.trim()))
  if (parts.length !== 2 || parts.some(Number.isNaN)) return null
  return { home: parts[0], away: parts[1] }
}

function parseTeamValue(value) {
  const number = Number(String(value || '').replace(/[^0-9.]/g, ''))
  return Number.isNaN(number) ? 0 : number
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value))
}

function getHandicapValue(match) {
  const text = `${(match.analysis && match.analysis.market && match.analysis.market.handicap) || ''} ${(match.analysis && match.analysis.order) || ''}`
  const homeName = match.home.cn
  const awayName = match.away.cn
  const numberMatch = text.match(/-?\d+(?:\.\d+)?/)
  const line = numberMatch ? Math.abs(Number(numberMatch[0])) : 0
  if (!line) return 0
  if (text.includes(homeName) || text.includes('主')) return line
  if (text.includes(awayName) || text.includes('客')) return -line
  return 0
}

function getTotalGoalLine(match) {
  const text = `${(match.analysis && match.analysis.market && match.analysis.market.total) || ''} ${(match.pick && match.pick.total) || ''}`
  const matches = text.match(/\d+(?:\.\d+)?/g)
  if (!matches || !matches.length) return 2.5
  const values = matches.map((item) => Number(item)).filter((item) => !Number.isNaN(item))
  return values.length ? values.reduce((sum, item) => sum + item, 0) / values.length : 2.5
}

function getStrengthScores(match) {
  const homeRank = Number(match.home.rank || 80)
  const awayRank = Number(match.away.rank || 80)
  const homeValue = parseTeamValue(match.home.value)
  const awayValue = parseTeamValue(match.away.value)
  const rankEdge = clamp((awayRank - homeRank) / 55, -0.9, 0.9)
  const valueEdge = homeValue && awayValue ? clamp(Math.log((homeValue + 20) / (awayValue + 20)) / 3, -0.9, 0.9) : 0
  const marketEdge = clamp(getHandicapValue(match) / 2, -0.75, 0.75)
  const homeContext = 0.06
  const edge = clamp(rankEdge * 0.42 + valueEdge * 0.38 + marketEdge * 0.2 + homeContext, -0.95, 0.95)
  return {
    edge,
    homePower: clamp(1 + edge, 0.25, 1.9),
    awayPower: clamp(1 - edge, 0.25, 1.9)
  }
}

function buildResultProbability(match) {
  const strength = getStrengthScores(match)
  const edge = strength.edge
  const drawBase = clamp(26 - Math.abs(edge) * 16, 12, 30)
  let home = (100 - drawBase) * (0.5 + edge * 0.42)
  let away = 100 - drawBase - home
  home = clamp(Math.round(home), 4, 88)
  away = clamp(Math.round(away), 4, 88)
  const draw = 100 - home - away
  const normalized = { home, draw, away }
  return [
    makeProbabilityItem('home', `${match.home.cn}胜`, normalized.home),
    makeProbabilityItem('draw', '平局', normalized.draw),
    makeProbabilityItem('away', `${match.away.cn}胜`, normalized.away)
  ]
}

function addGoalWeight(distribution, goals, weight) {
  const key = goals >= 3 ? '3+' : String(Math.max(0, goals))
  distribution[key] += weight
}

function normalizeGoalDistribution(distribution, order) {
  const total = order.reduce((sum, key) => sum + distribution[key], 0)
  let used = 0
  const values = order.map((key, index) => {
    const value = index === order.length - 1 ? 100 - used : Math.round(distribution[key] * 100 / total)
    used += value
    return makeProbabilityItem(key, key, value)
  })
  return values
}

function buildTeamGoalProbability(expectedGoals, order, shutoutPressure = 0) {
  const distribution = { '0': 10, '1': 18, '2': 12, '3+': 6 }
  if (shutoutPressure >= 0.75) {
    distribution['0'] += 104
    distribution['1'] += 4
  } else if (shutoutPressure >= 0.55) {
    distribution['0'] += 88
    distribution['1'] += 6
  } else if (shutoutPressure >= 0.35) {
    distribution['0'] += 70
    distribution['1'] += 8
  } else if (expectedGoals < 0.45) {
    distribution['0'] += 56
    distribution['1'] += 10
  } else if (expectedGoals < 0.75) {
    distribution['0'] += 42
    distribution['1'] += 16
  } else if (expectedGoals < 1.05) {
    distribution['0'] += 20
    distribution['1'] += 30
    distribution['2'] += 6
  } else if (expectedGoals < 1.65) {
    distribution['1'] += 30
    distribution['2'] += 20
    distribution['0'] += 6
  } else if (expectedGoals < 2.25) {
    distribution['2'] += 30
    distribution['3+'] += 18
    distribution['1'] += 10
  } else {
    distribution['3+'] += 36
    distribution['2'] += 20
  }
  return normalizeGoalDistribution(distribution, order)
}

function buildProbabilityAnalysis(match) {
  const homeOrder = ['3+', '2', '1', '0']
  const awayOrder = ['0', '1', '2', '3+']
  const strength = getStrengthScores(match)
  const totalLine = clamp(getTotalGoalLine(match), 1.75, 3.5)
  const handicapLine = Math.abs(getHandicapValue(match))
  const totalPower = strength.homePower + strength.awayPower
  const favoriteGap = Math.abs(strength.edge)
  const shutoutPressure = clamp((favoriteGap - 0.32) * 1.35 + Math.max(0, handicapLine - 0.75) * 0.34, 0, 1)
  const loserPenalty = shutoutPressure >= 0.75 ? 0.48 : shutoutPressure >= 0.55 ? 0.58 : favoriteGap > 0.55 ? 0.68 : favoriteGap > 0.38 ? 0.82 : 1
  const winnerBonus = favoriteGap > 0.55 ? 1.12 : favoriteGap > 0.38 ? 1.06 : 1
  const rawHomeExpected = totalLine * strength.homePower / totalPower
  const rawAwayExpected = totalLine * strength.awayPower / totalPower
  const homeExpected = strength.edge >= 0
    ? rawHomeExpected * winnerBonus
    : rawHomeExpected * loserPenalty
  const awayExpected = strength.edge >= 0
    ? rawAwayExpected * loserPenalty
    : rawAwayExpected * winnerBonus

  return {
    result: buildResultProbability(match),
    goals: {
      home: {
        team: match.home.cn,
        items: buildTeamGoalProbability(homeExpected, homeOrder, strength.edge < 0 ? shutoutPressure : 0)
      },
      away: {
        team: match.away.cn,
        items: buildTeamGoalProbability(awayExpected, awayOrder, strength.edge >= 0 ? shutoutPressure : 0)
      }
    }
  }
}

function applyPredictionRule(match) {
  const rule = predictionDiscipline[match.id]
  if (!rule) {
    match.pick.resultBackup = ''
    match.pick.resultBackupText = '胜平负备选：无'
    return
  }
  if (rule.result) {
    match.pick.result = rule.result
    match.analysis.conclusion = match.analysis.conclusion.replace(/^.*?，主比分倾向/, `${rule.result}，主比分倾向`)
  }
  if (rule.score) {
    match.pick.score = rule.score
    match.analysis.conclusion = match.analysis.conclusion.replace(/主比分倾向 [^，]+，/, `主比分倾向 ${rule.score}，`)
  }
  if (rule.backup) {
    match.pick.backup = rule.backup
    match.analysis.conclusion = match.analysis.conclusion.replace(/备用比分 [^。]+。/, `备用比分 ${rule.backup}。`)
  }
  if (rule.total) {
    match.pick.total = rule.total
    match.analysis.conclusion = match.analysis.conclusion.replace(/总进球区间 [^，]+，/, `总进球区间 ${rule.total}，`)
  }
  match.pick.resultBackup = rule.resultBackup || ''
  match.pick.resultBackupText = rule.resultBackup ? `胜平负备选：${rule.resultBackup}` : '胜平负备选：无'
  if (rule.oneXtwo) match.analysis.market.oneXtwo = rule.oneXtwo
  if (rule.handicap) match.analysis.market.handicap = rule.handicap
  if (rule.order) match.analysis.order = rule.order
}

matches.forEach((match) => {
  const meta = matchMeta[match.id] || { kickoff: '待定', weatherIcon: '⏱️', weather: '赛前更新' }
  match.dateText = meta.dateText || match.dateText
  match.kickoff = meta.kickoff
  match.scheduleAt = meta.scheduleAt || ''
  match.sortTime = meta.scheduleAt ? Date.parse(meta.scheduleAt) : 0
  match.weatherIcon = meta.weatherIcon
  match.weather = meta.weather
  match.altitude = venueAltitudes[match.venue] || '待定'
  const altitudeValue = parseInt(match.altitude, 10)
  match.altitudeLevel = Number.isNaN(altitudeValue) ? 'unknown' : altitudeValue < 100 ? 'low' : altitudeValue < 500 ? 'mid' : altitudeValue < 1500 ? 'high' : 'extreme'
  applyPredictionRule(match)
  match.analysis.injuryImpact = injuryImpactNotes[match.id] || getDefaultInjuryImpact(match)
  match.analysis.probability = buildProbabilityAnalysis(match)
})

const finishedReviewSource = [
  { id: 'australia-turkey-review', matchId: 'australia-turkey-20260613', homeTeam: 'australia', awayTeam: 'turkey', home: '澳大利亚', away: '土耳其', dateText: '6月14日 周日', kickoff: '12:00', group: 'D组', venue: 'BC Place Vancouver', endedAtSort: 202606141400, score: '2-0', resultMain: '土耳其胜', resultBackup: '平局', scoreMain: '1-2', scoreBackup: '1-1', resultMainCorrect: false, resultBackupCorrect: false, scoreMainCorrect: false, scoreBackupCorrect: false, retainOnHome: true },
  { id: 'haiti-scotland-review', matchId: 'haiti-scotland-20260613', homeTeam: 'haiti', awayTeam: 'scotland', home: '海地', away: '苏格兰', dateText: '6月14日 周日', kickoff: '09:00', group: 'C组', venue: 'Boston Stadium', endedAtSort: 202606141100, score: '0-1', resultMain: '苏格兰胜', resultBackup: '', scoreMain: '0-2', scoreBackup: '0-1', resultMainCorrect: true, resultBackupCorrect: false, scoreMainCorrect: false, scoreBackupCorrect: true, retainOnHome: true },
  { id: 'brazil-morocco-review', matchId: 'brazil-morocco-20260613', homeTeam: 'brazil', awayTeam: 'morocco', home: '巴西', away: '摩洛哥', dateText: '6月14日 周日', kickoff: '06:00', group: 'C组', venue: 'New York New Jersey Stadium', endedAtSort: 202606140800, score: '1-1', resultMain: '巴西胜', resultBackup: '', scoreMain: '2-1', scoreBackup: '1-1', resultMainCorrect: false, resultBackupCorrect: false, scoreMainCorrect: false, scoreBackupCorrect: true, retainOnHome: true },
  { id: 'qatar-switzerland-review', matchId: 'qatar-switzerland-20260613', homeTeam: 'qatar', awayTeam: 'switzerland', home: '卡塔尔', away: '瑞士', dateText: '6月14日 周日', kickoff: '03:00', group: 'B组', venue: 'San Francisco Bay Area Stadium', endedAtSort: 202606140500, score: '1-1', resultMain: '瑞士胜', resultBackup: '', scoreMain: '0-2', scoreBackup: '1-2', resultMainCorrect: false, resultBackupCorrect: false, scoreMainCorrect: false, scoreBackupCorrect: false, retainOnHome: true },
  { id: 'usa-paraguay-review', matchId: 'usa-paraguay-20260612', homeTeam: 'usa', awayTeam: 'paraguay', home: '美国', away: '巴拉圭', dateText: '6月13日 周六', kickoff: '09:00', group: 'D组', venue: 'Los Angeles Stadium', endedAtSort: 202606131130, score: '4-1', resultMain: '美国胜', resultBackup: '', scoreMain: '2-0', scoreBackup: '2-1', resultMainCorrect: true, resultBackupCorrect: false, scoreMainCorrect: false, scoreBackupCorrect: false, retainOnHome: true },
  { id: 'canada-bosnia-review', matchId: 'canada-bosnia-20260612', homeTeam: 'canada', awayTeam: 'bosnia', home: '加拿大', away: '波黑', dateText: '6月13日 周六', kickoff: '03:00', group: 'B组', venue: 'Toronto Stadium', endedAtSort: 202606130600, score: '1-1', resultMain: '加拿大胜', resultBackup: '平局', scoreMain: '2-1', scoreBackup: '1-1', resultMainCorrect: false, resultBackupCorrect: true, scoreMainCorrect: false, scoreBackupCorrect: true },
  { id: 'korea-czechia-review', matchId: 'korea-czechia-20260612', homeTeam: 'korea', awayTeam: 'czechia', home: '韩国', away: '捷克', dateText: '6月13日 周六', kickoff: '03:00', group: 'A组', venue: 'Estadio Guadalajara', endedAtSort: 202606130500, score: '2-1', resultMain: '韩国胜', resultBackup: '', scoreMain: '2-1', scoreBackup: '1-1', resultMainCorrect: true, resultBackupCorrect: false, scoreMainCorrect: true, scoreBackupCorrect: false },
  { id: 'mexico-southafrica-review', matchId: 'mexico-southafrica-20260612', homeTeam: 'mexico', awayTeam: 'southAfrica', home: '墨西哥', away: '南非', dateText: '6月13日 周六', kickoff: '00:00', group: 'A组', venue: 'Mexico City Stadium', endedAtSort: 202606130200, score: '2-0', resultMain: '墨西哥胜', resultBackup: '', scoreMain: '2-0', scoreBackup: '1-0', resultMainCorrect: true, resultBackupCorrect: false, scoreMainCorrect: true, scoreBackupCorrect: false }
]

function getPredictionWeight(mainCorrect, backupCorrect) {
  if (mainCorrect) return 100
  if (backupCorrect) return 50
  return 0
}

function getPercentLevel(percent) {
  if (percent >= 100) return 'p100'
  if (percent >= 75) return 'p75'
  if (percent >= 50) return 'p50'
  if (percent >= 25) return 'p25'
  return 'p0'
}

function sortKeyToLocalMs(sortKey) {
  const text = String(sortKey || '')
  if (text.length < 12) return 0
  const year = Number(text.slice(0, 4))
  const month = Number(text.slice(4, 6))
  const day = Number(text.slice(6, 8))
  const hour = Number(text.slice(8, 10))
  const minute = Number(text.slice(10, 12))
  return Date.parse(`${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}T${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:00+08:00`)
}

const finishedMatches = finishedReviewSource.map((item) => {
  const resultWeight = getPredictionWeight(item.resultMainCorrect, item.resultBackupCorrect)
  const scoreWeight = getPredictionWeight(item.scoreMainCorrect, item.scoreBackupCorrect)
  const percentValue = (resultWeight + scoreWeight) / 2
  return {
    ...item,
    resultMainClass: item.resultMainCorrect ? 'review-ok' : 'review-bad',
    resultBackupClass: item.resultBackupCorrect ? 'review-ok' : 'review-bad',
    scoreMainClass: item.scoreMainCorrect ? 'review-ok' : 'review-bad',
    scoreBackupClass: item.scoreBackupCorrect ? 'review-ok' : 'review-bad',
    percent: `${percentValue}%`,
    percentLevel: getPercentLevel(percentValue),
    endedAtMs: sortKeyToLocalMs(item.endedAtSort)
  }
}).sort((a, b) => (b.endedAtSort || 0) - (a.endedAtSort || 0))

const finishedMatchIds = finishedMatches.map((item) => item.matchId).filter(Boolean)
matches.forEach((match) => {
  match.isFinished = finishedMatchIds.indexOf(match.id) !== -1
})

function makeHistoryFallback(review) {
  const home = team[review.homeTeam]
  const away = team[review.awayTeam]
  if (!home || !away) return null
  const resultBackupText = review.resultBackup || '无'
  return {
    id: review.matchId,
    dateText: review.dateText,
    kickoff: review.kickoff,
    group: review.group,
    venue: review.venue,
    weatherIcon: '✓',
    weather: '已结束',
    altitude: venueAltitudes[review.venue] || '待定',
    altitudeLevel: review.venue === 'Mexico City Stadium' || review.venue === 'Estadio Guadalajara' ? 'extreme' : 'low',
    isFinished: true,
    home,
    away,
    pick: { result: review.resultMain, score: review.scoreMain, backup: review.scoreBackup, total: '复盘场次' },
    analysis: makeAnalysis({
      result: `${review.resultMain}，胜平负备选 ${resultBackupText}`,
      score: review.scoreMain,
      backup: review.scoreBackup,
      total: '已完赛复盘',
      order: `胜负主选 ${review.resultMain}，胜负备选 ${resultBackupText}，比分主选 ${review.scoreMain}，比分备选 ${review.scoreBackup}。`,
      homeForm: `实际比分 ${review.score}，本场预测命中率 ${review.percent}。`,
      awayForm: `复盘结果：胜负主选${review.resultMainCorrect ? '命中' : '未中'}，胜负备选${review.resultBackupCorrect ? '命中' : '未中'}。`,
      homeNews: '历史复盘场次以赛后结果校验预测模型，不再作为赛前投注依据。',
      awayNews: '历史复盘仅用于回看预测质量。',
      tactics: `比分主选${review.scoreMainCorrect ? '命中' : '未中'}，比分备选${review.scoreBackupCorrect ? '命中' : '未中'}。`,
      h2h: '该页面展示历史预测记录和赛后校验。',
      risk: '历史结果不代表未来比赛结果。',
      oneXtwo: `${review.resultMain} / ${resultBackupText}`,
      handicap: `命中率 ${review.percent}`,
      marketTotal: `实际比分 ${review.score}`
    })
  }
}

const upcomingMatches = matches.filter((match) => !match.isFinished)
const recentFinishedHomeMatches = finishedMatches.filter((review) => {
  if (!review.retainOnHome || !review.endedAtMs) return false
  return Date.now() - review.endedAtMs <= 60 * 60 * 1000
}).slice(0, 10).map((review) => {
  const match = matches.find((item) => item.id === review.matchId) || makeHistoryFallback(review)
  return match && { ...match, matchStatus: 'finished', statusText: '完赛', liveScore: review.score, phaseText: '全场结束', finishDetectedAt: review.endedAtMs, review }
}).filter(Boolean)
const historyMatches = finishedMatches.map((review) => {
  const match = matches.find((item) => item.id === review.matchId) || makeHistoryFallback(review)
  return match && { ...match, review }
}).filter(Boolean).slice(0, 10)
const reviewSuccessValue = finishedMatches.length ? finishedMatches.reduce((sum, item) => sum + parseFloat(item.percent), 0) / finishedMatches.length : 0
const reviewSuccessRate = `${reviewSuccessValue.toFixed(1)}%`
const reviewSummary = `${finishedMatches.length} 场已复盘`

module.exports = {
  matches,
  upcomingMatches,
  recentFinishedHomeMatches,
  historyMatches,
  finishedMatches,
  reviewSuccessRate,
  reviewSummary
}
