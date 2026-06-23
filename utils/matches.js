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
    pick: { result: '加拿大胜', score: '2-1', backup: '1-1', total: '2-3球', resultBackup: '平局', resultBackupText: '胜平负备选：平局' },
    analysis: makeAnalysis({
      result: '加拿大胜',
      score: '2-1',
      backup: '1-1',
      total: '2-3球',
      order: '加拿大胜 > 平局保护 > 加拿大-0.25谨慎',
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
    pick: { result: '苏格兰胜', score: '0-2', backup: '0-1', total: '1-2球', resultBackup: '', resultBackupText: '胜平负备选：无' },
    analysis: makeAnalysis({
      result: '苏格兰胜',
      score: '0-2',
      backup: '0-1',
      total: '1-2球',
      order: '苏格兰胜 > 苏格兰-1.5谨慎 > 小2.5/2.75',
      homeForm: '海地速度和冲击力在线，但大赛控场经验是疑问。',
      awayForm: '苏格兰体系成熟，身体对抗与定位球质量更稳。',
      homeNews: '重点确认锋线速度点是否首发，这是海地最主要的破局方式。',
      awayNews: '苏格兰中场硬度通常可靠，若主力前锋健康，胜面会提高。',
      tactics: '海地会打纵深，苏格兰更适合控制二点球和高空球。',
      h2h: '直接交锋意义有限，风格差异比历史记录更重要。',
      risk: '海地早早进球会让苏格兰被迫提速，比赛可能变开放。',
      oneXtwo: '平/客方向',
      handicap: '苏格兰-1.5属于深让，不能写苏格兰0球',
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
    pick: { result: '土耳其胜', score: '1-2', backup: '1-1', total: '2-3球', resultBackup: '平局', resultBackupText: '胜平负备选：平局' },
    analysis: makeAnalysis({
      result: '土耳其胜',
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
    pick: { result: '平局', score: '1-1', backup: '2-1', total: '2-3球', resultBackup: '科特迪瓦胜', resultBackupText: '胜平负备选：科特迪瓦胜' },
    analysis: makeAnalysis({
      result: '平局',
      score: '1-1',
      backup: '2-1',
      total: '2-3球',
      order: '平局 > 科特迪瓦胜 > 2-3球',
      homeForm: '科特迪瓦身体强度与边路冲击突出，能制造禁区混乱。',
      awayForm: '厄瓜多尔跑动能力和转换速度强，防线年轻但压迫积极。',
      homeNews: '中锋与边锋状态决定终结效率。',
      awayNews: '后腰屏障和中卫组合若齐整，厄瓜多尔抗压能力不错。',
      tactics: '双方都喜欢速度和对抗，中场二点球会决定比赛走势。',
      h2h: '直接交锋少，风格和体能分配更关键。',
      risk: '比赛可能因早牌、点球或定位球突然打开。',
      oneXtwo: '平局主选，科特迪瓦胜作低权重备选',
      handicap: '科特迪瓦0球只作受让保护，最终推荐拆成平局主选与科特迪瓦胜备选',
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
    pick: { result: '荷兰胜', score: '2-1', backup: '1-1', total: '2-3球', resultBackup: '', resultBackupText: '胜平负备选：无' },
    analysis: makeAnalysis({
      result: '荷兰胜',
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
      result: '瑞典胜',
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
    pick: { result: '比利时胜', score: '2-1', backup: '1-1', total: '2-3球', resultBackup: '', resultBackupText: '胜平负备选：无' },
    analysis: makeAnalysis({
      result: '比利时胜',
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
      result: '加纳胜',
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
    pick: { result: '平局', score: '1-1', backup: '2-1', total: '2-3球', resultBackup: '英格兰胜', resultBackupText: '胜平负备选：英格兰胜' },
    analysis: makeAnalysis({
      result: '平局',
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
    pick: { result: '平局', score: '1-1', backup: '2-1', total: '2-3球', resultBackup: '捷克胜', resultBackupText: '胜平负备选：捷克胜' },
    analysis: makeAnalysis({
      result: '平局',
      score: '1-1',
      backup: '2-1',
      total: '2-3球',
      order: '平局 > 捷克胜 > 2.5小球',
      homeForm: '捷克身体和定位球优势明显，但转换速度需要保护。',
      awayForm: '南非跑动积极，边路速度和反击能制造麻烦。',
      homeNews: '捷克中卫与高中锋健康决定定位球威胁。',
      awayNews: '南非前场速度点若齐整，反击质量会提升。',
      tactics: '捷克争高点和二点球，南非打快速推进，攻防转换会很关键。',
      h2h: '交锋参考有限，A组第二轮积分形势会影响保守程度。',
      risk: '双方首轮结果、南非反击、捷克防线回追。',
      oneXtwo: '平局主选，捷克胜作低权重备选',
      handicap: '捷克0球只作受让保护，最终推荐拆成平局主选与捷克胜备选',
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
    pick: { result: '墨西哥胜', score: '2-1', backup: '1-1', total: '2-3球', resultBackup: '平局', resultBackupText: '胜平负备选：平局' },
    analysis: makeAnalysis({
      result: '墨西哥胜',
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
      oneXtwo: '主胜为主，平局低权重保护',
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
    pick: { result: '平局', score: '1-1', backup: '0-1', total: '1-2球', resultBackup: '摩洛哥胜', resultBackupText: '胜平负备选：摩洛哥胜' },
    analysis: makeAnalysis({
      result: '平局',
      score: '1-1',
      backup: '0-1',
      total: '1-2球',
      order: '平局 > 摩洛哥胜 > 2.5小球',
      homeForm: '苏格兰身体对抗、定位球和二点球质量稳定，能把比赛拖进高强度消耗。',
      awayForm: '摩洛哥防守纪律和转换速度更成熟，面对欧洲身体流球队时反击质量有优势。',
      homeNews: '苏格兰需要核对中场硬度和锋线支点体能，若中前场消耗过大，后段推进会下降。',
      awayNews: '摩洛哥边后卫和后腰健康很关键，若两翼齐整，反击推进和防线保护都更可靠。',
      tactics: '苏格兰争高点和定位球，摩洛哥压缩中路后打边路转换，节奏可能偏谨慎。',
      h2h: '历史交锋参考有限，现阶段更看小组第二轮积分压力和双方防守稳定性。',
      risk: '早段定位球、黄牌尺度和摩洛哥边路身后空间会改变低比分节奏。',
      oneXtwo: '平局主选，摩洛哥胜作低权重备选',
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

function makeRollingMatch({ id, group, venue, home, away, result, resultBackup = '', score, backup, total, order, homeForm, awayForm, homeNews, awayNews, tactics, risk, oneXtwo, handicap, marketTotal }) {
  return {
    id,
    dateText: '赛前更新',
    group,
    venue,
    home: team[home],
    away: team[away],
    pick: {
      result,
      score,
      backup,
      total,
      resultBackup,
      resultBackupText: resultBackup ? `胜平负备选：${resultBackup}` : '胜平负备选：无'
    },
    analysis: makeAnalysis({
      result,
      score,
      backup,
      total,
      order,
      homeForm,
      awayForm,
      homeNews,
      awayNews,
      tactics,
      h2h: '小组赛第二轮和第三轮更受积分形势、轮换强度和停赛影响，历史交锋只作低权重参考。',
      risk,
      oneXtwo,
      handicap,
      marketTotal
    })
  }
}

matches.push(
  makeRollingMatch({
    id: 'netherlands-sweden-20260620',
    group: 'F组',
    venue: 'Houston Stadium',
    home: 'netherlands',
    away: 'sweden',
    result: '荷兰胜',
    resultBackup: '平局',
    score: '2-1',
    backup: '1-1',
    total: '2-3球',
    order: '荷兰胜 > 平局保护 > 2-3球',
    homeForm: '荷兰首轮与日本战平后需要主动抢分，边翼卫和中卫出球仍是推进优势。',
    awayForm: '瑞典首轮大胜突尼斯，定位球和禁区终结状态很好，但面对荷兰控球压力更大。',
    homeNews: '荷兰要核对中卫与边翼卫体能，若主力中轴齐整，主胜更有支撑。',
    awayNews: '瑞典高中锋和二点球能力是主要威胁，若锋线保持首轮效率，平局价值上升。',
    tactics: '荷兰控球压迫，瑞典更依赖高点、定位球和反击二点，比赛有双方进球空间。',
    risk: '瑞典定位球、荷兰后场转换保护、休斯敦湿热环境。',
    oneXtwo: '荷兰胜主选，平局作低权重备选',
    handicap: '荷兰-0.25到-0.5，深盘谨慎',
    marketTotal: '2.25/2.5球，偏2-3球'
  }),
  makeRollingMatch({
    id: 'germany-ivorycoast-20260620',
    group: 'E组',
    venue: 'Toronto Stadium',
    home: 'germany',
    away: 'ivoryCoast',
    result: '德国胜',
    score: '2-1',
    backup: '2-0',
    total: '2-3球',
    order: '德国胜 > 德国-0.75谨慎 > 2-3球',
    homeForm: '德国首轮大胜后信心高，但第二轮可能更重视节奏管理。',
    awayForm: '科特迪瓦首轮赢球，身体对抗和边路冲击能给德国防线制造压力。',
    homeNews: '德国锋线和中场轮换需要赛前确认，若大幅轮换，穿盘信心下降。',
    awayNews: '科特迪瓦边锋和中锋健康度决定反击质量，防线核心若齐整能限制大比分。',
    tactics: '德国控球围攻，科特迪瓦用速度和身体对抗打转换。',
    risk: '德国领先后降速、科特迪瓦反击、定位球防守。',
    oneXtwo: '德国胜方向清晰，不设置胜平负备选',
    handicap: '德国-0.75到-1，赢球优先，穿盘看首发强度',
    marketTotal: '2.5球，偏2-3球'
  }),
  makeRollingMatch({
    id: 'ecuador-curacao-20260620',
    group: 'E组',
    venue: 'Kansas City Stadium',
    home: 'ecuador',
    away: 'curacao',
    result: '厄瓜多尔胜',
    score: '2-0',
    backup: '2-1',
    total: '2-3球',
    order: '厄瓜多尔胜 > 厄瓜多尔-0.75 > 2-3球',
    homeForm: '厄瓜多尔首轮小负后抢分压力很大，跑动和转换速度仍有优势。',
    awayForm: '库拉索首轮大败后需要先修复防线，抗压和出球稳定性是短板。',
    homeNews: '厄瓜多尔后腰屏障和边路攻击点健康时，攻防转换更完整。',
    awayNews: '库拉索门将和中卫需要高发挥，若再次早失球，比赛会被拉开。',
    tactics: '厄瓜多尔用高强度逼抢和边路速度压制，库拉索低位防守等待反击。',
    risk: '厄瓜多尔终结效率、库拉索反击偷球、黄牌尺度。',
    oneXtwo: '厄瓜多尔胜方向清晰，不设置胜平负备选',
    handicap: '厄瓜多尔-0.75附近',
    marketTotal: '2.25/2.5球'
  }),
  makeRollingMatch({
    id: 'tunisia-japan-20260620',
    group: 'F组',
    venue: 'Estadio Guadalajara',
    home: 'tunisia',
    away: 'japan',
    result: '日本胜',
    resultBackup: '平局',
    score: '0-1',
    backup: '1-1',
    total: '1-2球',
    order: '日本胜 > 平局保护 > 1-2球',
    homeForm: '突尼斯首轮大败后会更重视防守密度，比赛姿态大概率收缩。',
    awayForm: '日本首轮逼平荷兰，技术推进和快速转换状态不错。',
    homeNews: '突尼斯需要确认防线是否轮换，若中卫组合不稳，低位防守质量会下降。',
    awayNews: '日本旅欧攻击手体能和首发情况决定破密防效率。',
    tactics: '日本耐心控球寻找肋部，突尼斯压低阵型争取定位球和反击。',
    risk: '日本久攻不下、突尼斯定位球、瓜达拉哈拉高海拔消耗。',
    oneXtwo: '日本胜主选，平局作低比分保护',
    handicap: '日本-0.25到-0.5',
    marketTotal: '2/2.25球，倾向小比分'
  }),
  makeRollingMatch({
    id: 'spain-saudi-20260621',
    group: 'H组',
    venue: 'Atlanta Stadium',
    home: 'spain',
    away: 'saudi',
    result: '西班牙胜',
    score: '2-0',
    backup: '3-0',
    total: '2-3球',
    order: '西班牙胜 > 西班牙-1.5谨慎 > 2-3球',
    homeForm: '西班牙首轮被逼平后需要提升终结效率，控球和压迫优势仍然明显。',
    awayForm: '沙特首轮逼平乌拉圭，反击速度和韧性值得重视。',
    homeNews: '西班牙边路爆点和前锋首发选择会直接影响大胜概率。',
    awayNews: '沙特后腰和中卫体能是关键，若连续被压迫，禁区前沿会承压。',
    tactics: '西班牙持续控球压制，沙特用快速反击和边路速度寻找身后。',
    risk: '西班牙终结效率、沙特反击、领先后比赛管理。',
    oneXtwo: '西班牙胜方向清晰，不设置胜平负备选',
    handicap: '西班牙-1.25到-1.5，穿盘看早段进球',
    marketTotal: '2.75球，偏2-3球'
  }),
  makeRollingMatch({
    id: 'belgium-iran-20260621',
    group: 'G组',
    venue: 'Los Angeles Stadium',
    home: 'belgium',
    away: 'iran',
    result: '比利时胜',
    resultBackup: '平局',
    score: '2-1',
    backup: '1-1',
    total: '2-3球',
    order: '比利时胜 > 平局保护 > 2-3球',
    homeForm: '比利时首轮被埃及逼平后需要主动争胜，中前场创造力仍优于伊朗。',
    awayForm: '伊朗首轮2-2显示进攻效率不错，但防线面对高质量肋部推进会承压。',
    homeNews: '比利时需要核对核心组织者和中卫健康，防线速度决定平局风险。',
    awayNews: '伊朗锋线和定位球主罚者若齐整，仍有破门空间。',
    tactics: '比利时控球压迫，伊朗低位防守后争取反击和定位球。',
    risk: '比利时防守转换、伊朗定位球、洛杉矶天气和恢复时间。',
    oneXtwo: '比利时胜主选，平局低权重保护',
    handicap: '比利时-0.5附近',
    marketTotal: '2.25/2.5球'
  }),
  makeRollingMatch({
    id: 'uruguay-caboverde-20260621',
    group: 'H组',
    venue: 'Miami Stadium',
    home: 'uruguay',
    away: 'caboVerde',
    result: '乌拉圭胜',
    score: '2-0',
    backup: '2-1',
    total: '2-3球',
    order: '乌拉圭胜 > 乌拉圭-1谨慎 > 2-3球',
    homeForm: '乌拉圭首轮平局后需要抢三分，高压和纵向推进会继续制造禁区压力。',
    awayForm: '佛得角首轮守住西班牙后信心提升，但连续防强队消耗很大。',
    homeNews: '乌拉圭锋线和后腰拦截状态决定压迫质量。',
    awayNews: '佛得角门将和中卫组合若延续高发挥，比赛可能被压低。',
    tactics: '乌拉圭用高压和身体对抗持续冲击，佛得角低位防守后打速度点。',
    risk: '佛得角门将状态、乌拉圭犯规尺度、迈阿密湿热环境。',
    oneXtwo: '乌拉圭胜方向清晰，不设置胜平负备选',
    handicap: '乌拉圭-0.75到-1',
    marketTotal: '2.25/2.5球'
  }),
  makeRollingMatch({
    id: 'newzealand-egypt-20260621',
    group: 'G组',
    venue: 'BC Place Vancouver',
    home: 'newZealand',
    away: 'egypt',
    result: '埃及胜',
    resultBackup: '平局',
    score: '1-2',
    backup: '1-1',
    total: '2-3球',
    order: '埃及胜 > 平局保护 > 2-3球',
    homeForm: '新西兰首轮打出2-2，身体对抗和高球威胁仍在。',
    awayForm: '埃及首轮逼平比利时，防守纪律和反击单点能力有支撑。',
    homeNews: '新西兰高点中锋和中卫健康度决定攻防下限。',
    awayNews: '埃及核心攻击手若首发，反击质量明显高于新西兰。',
    tactics: '新西兰争高球和定位球，埃及压缩空间后用速度打转换。',
    risk: '新西兰定位球、埃及进攻依赖单点、温哥华旅行恢复。',
    oneXtwo: '埃及胜主选，平局作低权重保护',
    handicap: '埃及-0.25附近',
    marketTotal: '2.25球'
  }),
  makeRollingMatch({
    id: 'caboverde-saudi-20260626',
    group: 'H组',
    venue: 'Houston Stadium',
    home: 'caboVerde',
    away: 'saudi',
    result: '平局',
    resultBackup: '沙特阿拉伯胜',
    score: '1-1',
    backup: '0-1',
    total: '1-2球',
    order: '平局 > 沙特阿拉伯胜 > 1-2球',
    homeForm: '佛得角首轮守住西班牙，防守纪律和门将状态是主要资产，末轮仍会先保证阵型。',
    awayForm: '沙特首轮逼平乌拉圭，低位防守和反击速度具备拿分能力，但连续硬仗体能压力不小。',
    homeNews: '佛得角需要继续确认门将和中卫健康，若中轴完整，低比分韧性很强。',
    awayNews: '沙特后腰和边翼卫体能决定反击质量，若比分落后，阵型前压会留下身后空间。',
    tactics: '佛得角低位防守和定位球争点，沙特尝试边路反击和禁区前沿二点球。',
    risk: '双方都可能根据同组另一场实时比分调整风险，平局价值和末段开放程度波动大。',
    oneXtwo: '平局主选，沙特胜低权重备选',
    handicap: '沙特0到-0.25谨慎',
    marketTotal: '2/2.25球，倾向低比分'
  }),
  makeRollingMatch({
    id: 'uruguay-spain-20260626',
    group: 'H组',
    venue: 'Estadio Guadalajara',
    home: 'uruguay',
    away: 'spain',
    result: '西班牙胜',
    resultBackup: '平局',
    score: '1-2',
    backup: '1-1',
    total: '2-3球',
    order: '西班牙胜 > 平局保护 > 2-3球',
    homeForm: '乌拉圭高压和纵向推进强，但面对西班牙控球会出现较多无球防守时间。',
    awayForm: '西班牙首轮被逼平后必须提升终结效率，若第二轮拿到三分，末轮会更重视控球管理。',
    homeNews: '乌拉圭锋线和后腰体能决定逼抢强度，若中前场轮换不足，后程防守会承压。',
    awayNews: '西班牙边路爆点和中场控制是胜负核心，若 Lamine Yamal、Olmo 等攻击点首发，客胜权重上升。',
    tactics: '乌拉圭用身体和高压打断节奏，西班牙用控球和肋部配合消耗对手。',
    risk: '同组积分形势可能让双方接受平局，西班牙终结效率和乌拉圭反抢犯规尺度是关键。',
    oneXtwo: '西班牙胜主选，平局作低权重保护',
    handicap: '西班牙-0.25到-0.5谨慎',
    marketTotal: '2.25/2.5球，偏2-3球'
  }),
  makeRollingMatch({
    id: 'newzealand-belgium-20260626',
    group: 'G组',
    venue: 'BC Place Vancouver',
    home: 'newZealand',
    away: 'belgium',
    result: '比利时胜',
    resultBackup: '',
    score: '0-2',
    backup: '1-2',
    total: '2-3球',
    order: '比利时胜 > 比利时-0.75谨慎 > 2-3球',
    homeForm: '新西兰身体对抗和高球威胁稳定，但面对比利时肋部推进时防线横移压力会更大。',
    awayForm: '比利时中前场创造力更强，末轮若仍需抢分，Doku 和 De Bruyne 一侧会持续制造机会。',
    homeNews: '新西兰中卫和高点中锋健康度决定定位球威胁，若主力高点缺阵，抗压下限下降。',
    awayNews: '比利时核心组织者和中卫身体状态仍需确认，若中轴齐整，客胜方向更稳。',
    tactics: '新西兰争高球和定位球，比利时通过边路一对一和肋部传切制造高质量射门。',
    risk: '比利时防守转换和新西兰定位球；若比利时已提前出线，轮换会降低穿盘信心。',
    oneXtwo: '比利时胜方向清晰，不设置胜平负备选',
    handicap: '比利时-0.75附近，穿盘看末轮战意',
    marketTotal: '2.25/2.5球'
  }),
  makeRollingMatch({
    id: 'egypt-iran-20260626',
    group: 'G组',
    venue: 'Seattle Stadium',
    home: 'egypt',
    away: 'iran',
    result: '埃及胜',
    resultBackup: '平局',
    score: '1-0',
    backup: '1-1',
    total: '1-2球',
    order: '埃及胜 > 平局保护 > 1-2球',
    homeForm: '埃及防守纪律和反击单点能力稳定，末轮对直接竞争对手会更重视先不丢球。',
    awayForm: '伊朗首轮进攻效率不错，但防线面对速度反击时仍有身后风险。',
    homeNews: '埃及核心攻击手健康时，反击和定位球质量明显提升。',
    awayNews: '伊朗中锋和定位球主罚者是主要威胁，后腰保护决定能否压住埃及反击。',
    tactics: '双方都会重视中路保护，埃及更依赖反击爆点，伊朗更多用定位球和二点球。',
    risk: '末轮出线形势可能让比赛节奏偏谨慎；若早进球，另一方被迫压上后总进球上限会抬高。',
    oneXtwo: '埃及胜主选，平局低权重保护',
    handicap: '埃及-0.25谨慎',
    marketTotal: '2/2.25球，偏1-2球'
  }),
  makeRollingMatch({
    id: 'argentina-austria-20260622',
    group: 'J组',
    venue: 'Dallas Stadium',
    home: 'argentina',
    away: 'austria',
    result: '阿根廷胜',
    resultBackup: '平局',
    score: '2-1',
    backup: '1-1',
    total: '2-3球',
    order: '阿根廷胜 > 平局保护 > 2-3球',
    homeForm: '阿根廷首轮3-0后状态稳定，比赛管理和关键球能力仍是强项。',
    awayForm: '奥地利首轮3-1，高压和二次进攻质量好，能给强队制造节奏压力。',
    homeNews: '阿根廷核心老将和后腰屏障体能需要核对，若轮换偏多，平局概率上升。',
    awayNews: '奥地利前场压迫点健康时，能限制阿根廷后场出球。',
    tactics: '阿根廷控节奏和打肋部，奥地利高压逼抢争取把比赛拉快。',
    risk: '奥地利高压、阿根廷轮换、达拉斯气候消耗。',
    oneXtwo: '阿根廷胜主选，平局低权重保护',
    handicap: '阿根廷-0.5到-0.75，深盘谨慎',
    marketTotal: '2.5球，偏2-3球'
  }),
  makeRollingMatch({
    id: 'france-iraq-20260622',
    group: 'I组',
    venue: 'Philadelphia Stadium',
    home: 'france',
    away: 'iraq',
    result: '法国胜',
    score: '3-0',
    backup: '2-0',
    total: '2-3球',
    order: '法国胜 > 法国-1.5谨慎 > 2-3球',
    homeForm: '法国首轮3-1后进攻状态良好，速度和个人能力优势明显。',
    awayForm: '伊拉克首轮1-4后防线暴露明显，面对法国转换会继续承压。',
    homeNews: '法国锋线轮换和中卫健康决定是否追大比分。',
    awayNews: '伊拉克后腰与中卫若无法恢复稳定，禁区前沿会被持续打穿。',
    tactics: '法国用速度和肋部推进制造连续机会，伊拉克低位防守并争取定位球。',
    risk: '法国轮换、领先后降速、伊拉克定位球。',
    oneXtwo: '法国胜方向清晰，不设置胜平负备选',
    handicap: '法国-1.25到-1.5，穿盘看首发强度',
    marketTotal: '2.75球，偏2-3球'
  }),
  makeRollingMatch({
    id: 'norway-senegal-20260622',
    group: 'I组',
    venue: 'New York New Jersey Stadium',
    home: 'norway',
    away: 'senegal',
    result: '挪威胜',
    resultBackup: '平局',
    score: '2-1',
    backup: '1-1',
    total: '2-3球',
    order: '挪威胜 > 平局保护 > 2-3球',
    homeForm: '挪威首轮4-1，锋线冲击和禁区终结状态很好。',
    awayForm: '塞内加尔首轮输给法国但身体对抗和反击仍具威胁。',
    homeNews: '挪威头号中锋和组织核心若齐整，主胜支撑强。',
    awayNews: '塞内加尔边路和中卫状态决定能否限制挪威高点。',
    tactics: '挪威直接攻击禁区，塞内加尔用身体对抗和边路反击回应。',
    risk: '塞内加尔反击、挪威后场出球、定位球对抗。',
    oneXtwo: '挪威胜主选，平局低权重保护',
    handicap: '挪威-0.25到-0.5',
    marketTotal: '2.5球附近'
  }),
  makeRollingMatch({
    id: 'jordan-algeria-20260622',
    group: 'J组',
    venue: 'San Francisco Bay Area Stadium',
    home: 'jordan',
    away: 'algeria',
    result: '阿尔及利亚胜',
    resultBackup: '平局',
    score: '1-2',
    backup: '1-1',
    total: '2-3球',
    order: '阿尔及利亚胜 > 平局保护 > 2-3球',
    homeForm: '约旦首轮失利后抢分压力大，反击和定位球是主要机会。',
    awayForm: '阿尔及利亚首轮0-3输给阿根廷，但边路速度和个人能力仍优于约旦。',
    homeNews: '约旦锋线速度点和门将状态是保留悬念的关键。',
    awayNews: '阿尔及利亚需要确认防线轮换，若中卫组合稳定，客胜更稳。',
    tactics: '约旦低位防守，阿尔及利亚用边路突破和肋部传切制造机会。',
    risk: '阿尔及利亚防线失误、约旦定位球、晚场体能消耗。',
    oneXtwo: '阿尔及利亚胜主选，平局低权重保护',
    handicap: '阿尔及利亚-0.5附近',
    marketTotal: '2.25球'
  }),
  makeRollingMatch({
    id: 'portugal-uzbekistan-20260623',
    group: 'K组',
    venue: 'Houston Stadium',
    home: 'portugal',
    away: 'uzbekistan',
    result: '葡萄牙胜',
    score: '2-0',
    backup: '3-1',
    total: '2-3球',
    order: '葡萄牙胜 > 葡萄牙-1谨慎 > 2-3球',
    homeForm: '葡萄牙首轮被逼平后需要主动争胜，控球和边路爆点仍明显占优。',
    awayForm: '乌兹别克斯坦首轮1-3输球，组织性不错但防线抗压不足。',
    homeNews: '葡萄牙前场轮换和核心老将体能需核对，若首发强度高，主胜更稳。',
    awayNews: '乌兹别克斯坦门将和中卫组合必须高发挥，否则会被持续压制。',
    tactics: '葡萄牙控球压迫，乌兹别克斯坦低位防守后打反击。',
    risk: '葡萄牙终结效率、乌兹别克斯坦反击、休斯敦湿热。',
    oneXtwo: '葡萄牙胜方向清晰，不设置胜平负备选',
    handicap: '葡萄牙-1附近，穿盘谨慎',
    marketTotal: '2.5球，偏2-3球'
  }),
  makeRollingMatch({
    id: 'england-ghana-20260623',
    group: 'L组',
    venue: 'Boston Stadium',
    home: 'england',
    away: 'ghana',
    result: '英格兰胜',
    resultBackup: '平局',
    score: '2-1',
    backup: '1-1',
    total: '2-3球',
    order: '英格兰胜 > 平局保护 > 2-3球',
    homeForm: '英格兰首轮4-2进攻火力充足，但防守暴露出转换问题。',
    awayForm: '加纳首轮小胜，身体对抗、速度和定位球都能制造麻烦。',
    homeNews: '英格兰后腰保护和中卫状态需要重点核对，若轮换后防，失球风险上升。',
    awayNews: '加纳前场速度点若健康，能持续攻击英格兰身后空间。',
    tactics: '英格兰控球和边路推进，加纳压缩中路后打速度反击。',
    risk: '英格兰防守转换、加纳定位球、波士顿天气。',
    oneXtwo: '英格兰胜主选，平局低权重保护',
    handicap: '英格兰-0.75，赢球与穿盘分开看',
    marketTotal: '2.5球，双方进球可关注'
  }),
  makeRollingMatch({
    id: 'panama-croatia-20260623',
    group: 'L组',
    venue: 'Toronto Stadium',
    home: 'panama',
    away: 'croatia',
    result: '克罗地亚胜',
    score: '0-2',
    backup: '1-2',
    total: '2-3球',
    order: '克罗地亚胜 > 克罗地亚-0.75 > 2-3球',
    homeForm: '巴拿马首轮小负，防守韧性和定位球仍有一定威胁。',
    awayForm: '克罗地亚首轮失四球后必须反弹，中场控球和经验仍明显优于巴拿马。',
    homeNews: '巴拿马中卫和后腰体能决定能否拖住节奏。',
    awayNews: '克罗地亚老将体能和中卫轮换需要核对，但控场质量仍占优。',
    tactics: '克罗地亚控球降速，巴拿马低位防守争定位球。',
    risk: '克罗地亚体能、巴拿马定位球、早段心理压力。',
    oneXtwo: '克罗地亚胜方向清晰，不设置胜平负备选',
    handicap: '克罗地亚-0.75附近',
    marketTotal: '2.25/2.5球'
  }),
  makeRollingMatch({
    id: 'colombia-congodr-20260623',
    group: 'K组',
    venue: 'Estadio Guadalajara',
    home: 'colombia',
    away: 'congoDr',
    result: '哥伦比亚胜',
    resultBackup: '平局',
    score: '2-1',
    backup: '1-1',
    total: '2-3球',
    order: '哥伦比亚胜 > 平局保护 > 2-3球',
    homeForm: '哥伦比亚首轮3-1后进攻状态不错，边路和前场个人能力占优。',
    awayForm: '刚果民主共和国首轮逼平葡萄牙，身体对抗和反击质量值得重视。',
    homeNews: '哥伦比亚前腰和边锋体能决定破密防效率。',
    awayNews: '刚果民主共和国中卫和后腰若齐整，能把比赛拖入高对抗。',
    tactics: '哥伦比亚控球推进，刚果民主共和国依靠身体和速度打转换。',
    risk: '刚果民主共和国反击、哥伦比亚后场失误、高海拔消耗。',
    oneXtwo: '哥伦比亚胜主选，平局低权重保护',
    handicap: '哥伦比亚-0.5附近',
    marketTotal: '2.25/2.5球'
  }),
  makeRollingMatch({
    id: 'switzerland-canada-20260624',
    group: 'B组',
    venue: 'BC Place Vancouver',
    home: 'switzerland',
    away: 'canada',
    result: '平局',
    resultBackup: '加拿大胜',
    score: '1-1',
    backup: '1-2',
    total: '2-3球',
    order: '平局 > 加拿大胜 > 2-3球',
    homeForm: '瑞士结构稳定，防守纪律好，第三轮更重视小组出线安全。',
    awayForm: '加拿大主场环境和速度优势明显，若前两轮积分压力大，会更主动。',
    homeNews: '瑞士中轴体能和轮换决定控场稳定性。',
    awayNews: '加拿大边路核心和中锋状态决定能否冲开瑞士防线。',
    tactics: '瑞士控风险，加拿大用速度和主场气势提节奏。',
    risk: '小组积分形势、加拿大压上后的身后空间、瑞士定位球。',
    oneXtwo: '平局主选，加拿大胜作低权重备选',
    handicap: '加拿大受让或0球更稳',
    marketTotal: '2.25球'
  }),
  makeRollingMatch({
    id: 'bosnia-qatar-20260624',
    group: 'B组',
    venue: 'Seattle Stadium',
    home: 'bosnia',
    away: 'qatar',
    result: '波黑胜',
    resultBackup: '平局',
    score: '2-1',
    backup: '1-1',
    total: '2-3球',
    order: '波黑胜 > 平局保护 > 2-3球',
    homeForm: '波黑经验和身体对抗更好，但比赛节奏稳定性一般。',
    awayForm: '卡塔尔组织性尚可，若小组末轮需要抢分会更主动。',
    homeNews: '波黑前锋和定位球主罚者健康时，禁区威胁更高。',
    awayNews: '卡塔尔中场控球点和中卫组合需要保持完整。',
    tactics: '波黑争高点和定位球，卡塔尔控球降速后寻找边路。',
    risk: '卡塔尔控球拖慢比赛、波黑后场速度、末轮积分形势。',
    oneXtwo: '波黑胜主选，平局低权重保护',
    handicap: '波黑-0.25附近',
    marketTotal: '2.25球'
  }),
  makeRollingMatch({
    id: 'scotland-brazil-20260624',
    group: 'C组',
    venue: 'Miami Stadium',
    home: 'scotland',
    away: 'brazil',
    result: '巴西胜',
    score: '0-2',
    backup: '1-2',
    total: '2-3球',
    order: '巴西胜 > 巴西-0.75 > 2-3球',
    homeForm: '苏格兰身体和定位球能制造麻烦，但阵地战创造力有限。',
    awayForm: '巴西个人能力和边路爆点更强，若前两轮积分不满会保持进攻强度。',
    homeNews: '苏格兰中卫和门将状态决定能否拖住低比分。',
    awayNews: '巴西边锋和前腰体能需要核对，若主力齐整，客胜更稳。',
    tactics: '苏格兰低位硬抗和争高球，巴西用边路单点和二次进攻压制。',
    risk: '苏格兰定位球、巴西轮换、迈阿密湿热环境。',
    oneXtwo: '巴西胜方向清晰，不设置胜平负备选',
    handicap: '巴西-0.75到-1',
    marketTotal: '2.5球，偏2-3球'
  }),
  makeRollingMatch({
    id: 'morocco-haiti-20260624',
    group: 'C组',
    venue: 'Atlanta Stadium',
    home: 'morocco',
    away: 'haiti',
    result: '摩洛哥胜',
    score: '2-0',
    backup: '2-1',
    total: '2-3球',
    order: '摩洛哥胜 > 摩洛哥-0.75 > 2-3球',
    homeForm: '摩洛哥防守纪律和反击质量更成熟，面对海地有控风险优势。',
    awayForm: '海地速度不差，但连续面对高强度比赛后防线稳定性是疑问。',
    homeNews: '摩洛哥边后卫和后腰健康时，攻守转换更完整。',
    awayNews: '海地锋线速度点若不齐，反击威胁会被明显压低。',
    tactics: '摩洛哥控制防线距离后打转换，海地需要依赖速度和定位球。',
    risk: '海地反击、摩洛哥领先后保守、亚特兰大湿热。',
    oneXtwo: '摩洛哥胜方向清晰，不设置胜平负备选',
    handicap: '摩洛哥-0.75附近',
    marketTotal: '2.25球'
  }),
  makeRollingMatch({
    id: 'czechia-mexico-20260624',
    group: 'A组',
    venue: 'Mexico City Stadium',
    home: 'czechia',
    away: 'mexico',
    result: '墨西哥胜',
    resultBackup: '平局',
    score: '1-2',
    backup: '1-1',
    total: '2-3球',
    order: '墨西哥胜 > 平局保护 > 2-3球',
    homeForm: '捷克身体和定位球优势稳定，但面对墨西哥主场气氛和海拔会承压。',
    awayForm: '墨西哥本土作战，压迫和边路推进更有优势。',
    homeNews: '捷克高中锋和中卫健康决定定位球威胁。',
    awayNews: '墨西哥中前场创造点和后腰保护是关键。',
    tactics: '墨西哥主动压上，捷克利用高点和定位球回应。',
    risk: '墨西哥压上后的身后空间、捷克定位球、墨西哥城海拔。',
    oneXtwo: '墨西哥胜主选，平局低权重保护',
    handicap: '墨西哥-0.5附近',
    marketTotal: '2.25/2.5球'
  }),
  makeRollingMatch({
    id: 'southafrica-korea-20260624',
    group: 'A组',
    venue: 'Estadio Guadalajara',
    home: 'southAfrica',
    away: 'korea',
    result: '韩国胜',
    resultBackup: '平局',
    score: '1-2',
    backup: '1-1',
    total: '2-3球',
    order: '韩国胜 > 平局保护 > 2-3球',
    homeForm: '南非跑动和边路速度有威胁，但防线完整度和停赛影响需要持续核对。',
    awayForm: '韩国技术、跑动和反击速度更成熟，第三轮抢分能力更强。',
    homeNews: '南非若仍受红牌停赛影响，防线轮换会降低抗压质量。',
    awayNews: '韩国核心前锋和前腰健康时，反击效率更高。',
    tactics: '南非打速度和身体，韩国用快速传切和身后冲刺制造机会。',
    risk: '南非反击、韩国防守定位球、末轮积分形势。',
    oneXtwo: '韩国胜主选，平局低权重保护',
    handicap: '韩国-0.25到-0.5',
    marketTotal: '2.25球'
  }),
  makeRollingMatch({
    id: 'ecuador-germany-20260625',
    group: 'E组',
    venue: 'New York New Jersey Stadium',
    home: 'ecuador',
    away: 'germany',
    result: '德国胜',
    score: '1-2',
    backup: '0-2',
    total: '2-3球',
    order: '德国胜 > 德国-0.75谨慎 > 2-3球',
    homeForm: '厄瓜多尔身体强度和转换速度不差，但面对德国持续控球和肋部推进时，防线横移压力会很大。',
    awayForm: '德国首轮大胜后进攻状态打开，若第二轮延续效率，末轮仍有争夺头名和保持节奏的动力。',
    homeNews: '厄瓜多尔后腰屏障和边路回追是关键，若防线吃牌或轮换，禁区前沿保护会下降。',
    awayNews: '德国锋线和前腰轮换需要赛前确认，即使部分轮换，阵容深度仍能支撑客胜方向。',
    tactics: '厄瓜多尔会争取身体对抗和快速推进，德国更可能通过控球压迫、边路倒三角和二次进攻制造机会。',
    risk: '德国若提前锁定出线后轮换，穿盘信心下降；厄瓜多尔定位球和反击仍有一球空间。',
    oneXtwo: '德国胜方向更清晰，不设置胜平负备选',
    handicap: '德国-0.75附近，赢球优先，穿深盘看首发强度',
    marketTotal: '2.5球附近，倾向2-3球'
  }),
  makeRollingMatch({
    id: 'curacao-ivorycoast-20260625',
    group: 'E组',
    venue: 'Philadelphia Stadium',
    home: 'curacao',
    away: 'ivoryCoast',
    result: '科特迪瓦胜',
    resultBackup: '平局',
    score: '1-2',
    backup: '1-1',
    total: '2-3球',
    order: '科特迪瓦胜 > 平局保护 > 2-3球',
    homeForm: '库拉索首轮防线承压明显，若第二轮仍无法改善出球，末轮会继续被高强度冲击。',
    awayForm: '科特迪瓦身体对抗、边路速度和禁区冲击更强，末轮若仍需积分，主动性会更足。',
    homeNews: '库拉索门将和中卫组合需要高水平发挥，定位球防守是主要隐患。',
    awayNews: '科特迪瓦需关注锋线可用性和边锋体能；若攻击手齐整，客胜支撑更强。',
    tactics: '库拉索低位防守争取反击，科特迪瓦用身体和边路爆点持续压迫，比赛后段体能差距可能放大。',
    risk: '科特迪瓦若临门一脚效率不高，平局会抬头；库拉索反击和定位球是主要冷门入口。',
    oneXtwo: '科特迪瓦胜主选，平局作为低权重保护',
    handicap: '科特迪瓦-0.5到-0.75，赢球优先，不追过深',
    marketTotal: '2.25/2.5球，倾向2-3球'
  }),
  makeRollingMatch({
    id: 'japan-sweden-20260625',
    group: 'F组',
    venue: 'Dallas Stadium',
    home: 'japan',
    away: 'sweden',
    result: '平局',
    resultBackup: '瑞典胜',
    score: '1-1',
    backup: '1-2',
    total: '2-3球',
    order: '平局 > 瑞典胜 > 2-3球',
    homeForm: '日本技术推进和转换速度稳定，面对高大球队时需要避免定位球和二点球连续丢失。',
    awayForm: '瑞典首轮进攻效率很高，高点、定位球和禁区终结是明确优势，但面对日本控球会被拉开移动。',
    homeNews: '日本旅欧攻击手和边后卫体能决定推进质量，若中场完整，平局支撑较强。',
    awayNews: '瑞典锋线高点和中卫健康是核心，若主力中轴齐整，客胜备选价值上升。',
    tactics: '日本控球拆解，瑞典争高点和定位球，比赛很可能在技术流与身体流之间形成拉锯。',
    risk: '瑞典定位球、早段进球会改变节奏；日本若久攻不下，后场身高劣势会被放大。',
    oneXtwo: '平局主选，瑞典胜作为身体和定位球优势的备选',
    handicap: '瑞典0到-0.25谨慎，日本受让方向有韧性',
    marketTotal: '2.25/2.5球，倾向2-3球'
  }),
  makeRollingMatch({
    id: 'tunisia-netherlands-20260625',
    group: 'F组',
    venue: 'Kansas City Stadium',
    home: 'tunisia',
    away: 'netherlands',
    result: '荷兰胜',
    score: '0-2',
    backup: '1-2',
    total: '2-3球',
    order: '荷兰胜 > 荷兰-0.75 > 2-3球',
    homeForm: '突尼斯若前两轮承压，末轮会更重视防守密度，但进攻端创造力仍偏有限。',
    awayForm: '荷兰控球推进和边翼卫参与度更高，若仍需抢分，阵地战压制会持续。',
    homeNews: '突尼斯中卫和后腰体能是关键，若防线轮换，禁区前保护会下降。',
    awayNews: '荷兰中轴和边翼卫健康时，推进层次更完整，客胜方向更稳。',
    tactics: '突尼斯压低阵型等待定位球和反击，荷兰通过边路宽度与肋部传切持续制造机会。',
    risk: '荷兰若轮换或提前出线，比分上限降低；突尼斯定位球和低位消耗会拖慢节奏。',
    oneXtwo: '荷兰胜方向清晰，不设置胜平负备选',
    handicap: '荷兰-0.75附近，赢球优先，穿盘谨慎',
    marketTotal: '2.25/2.5球，倾向2-3球'
  }),
  makeRollingMatch({
    id: 'turkey-usa-20260625',
    group: 'D组',
    venue: 'Los Angeles Stadium',
    home: 'turkey',
    away: 'usa',
    result: '美国胜',
    resultBackup: '平局',
    score: '1-2',
    backup: '1-1',
    total: '2-3球',
    order: '美国胜 > 平局保护 > 2-3球',
    homeForm: '土耳其创造力强，但首轮防守转换暴露问题，面对美国速度和压迫会继续承压。',
    awayForm: '美国主场环境、体能和前场压迫优势明显，若核心攻击手恢复，末轮仍有头名竞争动力。',
    homeNews: '土耳其前腰和后腰保护需要赛前确认，若中场屏障不稳，美国反击会很直接。',
    awayNews: '美国需继续关注 Pulisic 小腿情况；若无法首发，客胜仍在但平局保护要保留。',
    tactics: '土耳其控球创造机会，美国用高压和边路速度打转换，比赛节奏可能较开放。',
    risk: '美国核心伤情、土耳其定位球和中前场个人能力会增加波动。',
    oneXtwo: '美国胜主选，平局作为伤情和末轮轮换保护',
    handicap: '美国-0.25到-0.5，赢球优先，不追深盘',
    marketTotal: '2.5球附近，倾向2-3球'
  }),
  makeRollingMatch({
    id: 'paraguay-australia-20260625',
    group: 'D组',
    venue: 'San Francisco Bay Area Stadium',
    home: 'paraguay',
    away: 'australia',
    result: '澳大利亚胜',
    resultBackup: '平局',
    score: '1-2',
    backup: '1-1',
    total: '2-3球',
    order: '澳大利亚胜 > 平局保护 > 2-3球',
    homeForm: '巴拉圭对抗和定位球稳定，但首轮大比分失利后防线需要修复，末轮若必须抢分会留下空间。',
    awayForm: '澳大利亚首轮赢球提升信心，身体对抗、定位球和团队纪律能支撑不败方向。',
    homeNews: '巴拉圭中卫和防守型中场健康决定抗压下限，若主力屏障不齐，禁区前沿会暴露。',
    awayNews: '澳大利亚高点前锋和中卫组合是核心，若保持完整，客胜备选价值较高。',
    tactics: '巴拉圭直接推进和定位球制造冲击，澳大利亚争二点球并用边路传中打消耗。',
    risk: '双方身体对抗强，红黄牌和定位球可能改变走势；澳大利亚若满足出线条件，进攻主动性可能下降。',
    oneXtwo: '澳大利亚胜主选，平局作为低比分保护',
    handicap: '澳大利亚0到-0.25，受让不败逻辑更稳，客胜只作浅盘',
    marketTotal: '2.25/2.5球，倾向2-3球'
  }),
  makeRollingMatch({
    id: 'norway-france-20260626',
    group: 'I组',
    venue: 'Boston Stadium',
    home: 'norway',
    away: 'france',
    result: '法国胜',
    resultBackup: '平局',
    score: '1-2',
    backup: '1-1',
    total: '2-3球',
    order: '法国胜 > 平局保护 > 2-3球',
    homeForm: '挪威前两轮连续赢球，哈兰德支点和冲刺威胁很强，但面对法国的边路速度和中前场压迫，防线回追质量会被放大检验。',
    awayForm: '法国同样两连胜且净胜球占优，中前场个人能力和转换速度仍是小组内最高档，末轮争第一仍有主动进攻动力。',
    homeNews: '挪威需要赛前确认中卫和防守型中场体能，若主力屏障轮换，法国反击空间会更大。',
    awayNews: '法国要关注锋线轮换和边后卫负荷；若核心攻击手首发，客胜权重维持高位。',
    tactics: '挪威会用长传和定位球找高点，法国更依赖边路一对一和肋部直塞，节奏可能在转换中被拉开。',
    risk: '双方均已占据出线主动，临场轮换和小组第一计算会影响进攻投入，平局需要保留。',
    oneXtwo: '法国胜主选，平局作为低权重保护',
    handicap: '法国-0.25到-0.5；赢球优先，穿盘不追深',
    marketTotal: '2.5球附近，倾向2-3球'
  }),
  makeRollingMatch({
    id: 'senegal-iraq-20260626',
    group: 'I组',
    venue: 'Toronto Stadium',
    home: 'senegal',
    away: 'iraq',
    result: '塞内加尔胜',
    resultBackup: '',
    score: '2-0',
    backup: '2-1',
    total: '2-3球',
    order: '塞内加尔胜 > 塞内加尔-0.75谨慎 > 2-3球',
    homeForm: '塞内加尔前两轮都能制造进攻回合，身体对抗和边路速度明显优于伊拉克，末轮仍需赢球抢第三名排名。',
    awayForm: '伊拉克连续承压后防线暴露明显，面对塞内加尔的冲击和定位球，禁区保护压力会很大。',
    homeNews: '塞内加尔重点确认中锋和两翼体能，若主力攻击线齐整，主胜稳定性更高。',
    awayNews: '伊拉克中后场若继续缺少速度保护，防线身后会被反复打击。',
    tactics: '塞内加尔利用边路推进和二点球压制，伊拉克更可能低位防守后寻找定位球。',
    risk: '塞内加尔若久攻不下会留下反击空间，但整体实力和对抗优势仍支撑主胜。',
    oneXtwo: '塞内加尔胜方向清晰，不设置胜平负备选',
    handicap: '塞内加尔-0.75；赢球优先，穿盘看早段进球',
    marketTotal: '2.25/2.5球，倾向2-3球'
  }),
  makeRollingMatch({
    id: 'panama-england-20260627',
    group: 'L组',
    venue: 'New York New Jersey Stadium',
    home: 'panama',
    away: 'england',
    result: '英格兰胜',
    resultBackup: '',
    score: '0-2',
    backup: '1-2',
    total: '2-3球',
    order: '英格兰胜 > 英格兰-1谨慎 > 2-3球',
    homeForm: '巴拿马防守纪律不错但整体控球和前场质量不足，面对英格兰持续压迫时出球压力会很大。',
    awayForm: '英格兰阵容厚度明显，末轮即使有轮换也能维持控球和定位球优势。',
    homeNews: '巴拿马需要确认中卫和门将状态，若被迫早早退守，后段体能消耗会放大。',
    awayNews: '英格兰可能轮换锋线和边路，但替补深度仍足以保持客胜方向。',
    tactics: '巴拿马低位防守压缩中路，英格兰用边路传中、定位球和禁区二点球争取打开局面。',
    risk: '英格兰若提前锁定名次，节奏可能下降，深盘不宜过度追高。',
    oneXtwo: '英格兰胜方向清晰，不设置胜平负备选',
    handicap: '英格兰-1附近；赢球优先，穿盘谨慎',
    marketTotal: '2.5球附近，倾向2-3球'
  }),
  makeRollingMatch({
    id: 'croatia-ghana-20260627',
    group: 'L组',
    venue: 'Philadelphia Stadium',
    home: 'croatia',
    away: 'ghana',
    result: '克罗地亚胜',
    resultBackup: '平局',
    score: '2-1',
    backup: '1-1',
    total: '2-3球',
    order: '克罗地亚胜 > 平局保护 > 2-3球',
    homeForm: '克罗地亚经验和中场控节奏能力更好，末轮卡位战会更重视比赛管理。',
    awayForm: '加纳速度和冲击力强，反击能制造波动，但防线落位和中场保护仍不够稳定。',
    homeNews: '克罗地亚要确认中场核心体能，若轮换幅度过大，控球优势会下降。',
    awayNews: '加纳关注边锋健康和中卫停牌风险，若后场人员不整，客场抗压难度增加。',
    tactics: '克罗地亚通过中场传控控制节奏，加纳利用边路速度和定位球寻找一球空间。',
    risk: '加纳反击效率高，克罗地亚赢面更高但平局保护仍有必要。',
    oneXtwo: '克罗地亚胜主选，平局低权重保护',
    handicap: '克罗地亚-0.25到-0.5；赢球优先，不追深盘',
    marketTotal: '2.25/2.5球，倾向2-3球'
  }),
  makeRollingMatch({
    id: 'colombia-portugal-20260627',
    group: 'K组',
    venue: 'Miami Stadium',
    home: 'colombia',
    away: 'portugal',
    result: '葡萄牙胜',
    resultBackup: '平局',
    score: '1-2',
    backup: '1-1',
    total: '2-3球',
    order: '葡萄牙胜 > 平局保护 > 2-3球',
    homeForm: '哥伦比亚身体对抗和转换速度都强，能够限制葡萄牙的连续控球，但防线身后空间仍可能被利用。',
    awayForm: '葡萄牙前场技术和替补深度更好，面对强对抗球队仍能通过边路和定位球制造稳定机会。',
    homeNews: '哥伦比亚重点核对中卫和后腰黄牌、体能风险，若保护不足，葡萄牙肋部会有空间。',
    awayNews: '葡萄牙若核心攻击手首发，客胜权重提高；若大幅轮换，平局权重上调。',
    tactics: '哥伦比亚以身体压迫和快速反击应对，葡萄牙通过边中结合与定位球寻找破门。',
    risk: '双方都有出线计算，比赛可能在领先后降速，平局保护必须保留。',
    oneXtwo: '葡萄牙胜主选，平局低权重保护',
    handicap: '葡萄牙-0.25到-0.5；赢球优先，穿盘谨慎',
    marketTotal: '2.5球附近，倾向2-3球'
  }),
  makeRollingMatch({
    id: 'congodr-uzbekistan-20260627',
    group: 'K组',
    venue: 'Atlanta Stadium',
    home: 'congoDr',
    away: 'uzbekistan',
    result: '刚果民主共和国胜',
    resultBackup: '平局',
    score: '2-1',
    backup: '1-1',
    total: '2-3球',
    order: '刚果民主共和国胜 > 平局保护 > 2-3球',
    homeForm: '刚果民主共和国对抗和纵向推进优势明显，末轮面对乌兹别克斯坦有更强的抢分主动性。',
    awayForm: '乌兹别克斯坦组织能力不差，但面对高强度身体对抗时，后场出球和禁区保护会受压。',
    homeNews: '刚果民主共和国需要确认锋线和中卫健康，若主力齐整，主胜稳定性更好。',
    awayNews: '乌兹别克斯坦若中场核心被限制，前场支援会明显下降。',
    tactics: '刚果民主共和国用对抗和二次进攻压制，乌兹别克斯坦通过控球降速和边路传中寻找机会。',
    risk: '乌兹别克斯坦具备控球韧性，若比赛节奏被压低，平局可能性上升。',
    oneXtwo: '刚果民主共和国胜主选，平局低权重保护',
    handicap: '刚果民主共和国-0.25；主胜优先，不追深盘',
    marketTotal: '2.25/2.5球，倾向2-3球'
  }),
  makeRollingMatch({
    id: 'algeria-austria-20260627',
    group: 'J组',
    venue: 'Kansas City Stadium',
    home: 'algeria',
    away: 'austria',
    result: '奥地利胜',
    resultBackup: '平局',
    score: '1-2',
    backup: '1-1',
    total: '2-3球',
    order: '奥地利胜 > 平局保护 > 2-3球',
    homeForm: '阿尔及利亚转换和边路推进有威胁，但面对奥地利高压时，中后场出球会被持续测试。',
    awayForm: '奥地利整体压迫和跑动更成体系，首轮即使输给阿根廷也展现了前场逼抢质量。',
    homeNews: '阿尔及利亚重点确认边后卫和防守型中场体能，若保护不足，奥地利二次进攻会很直接。',
    awayNews: '奥地利需要确认高强度压迫后的体能状态，若主力中前场齐整，客胜权重更高。',
    tactics: '阿尔及利亚会寻找边路反击，奥地利用高位压迫和快速前插压缩对手出球空间。',
    risk: '阿尔及利亚反击速度能制造一球空间，奥地利赢面更高但平局保护保留。',
    oneXtwo: '奥地利胜主选，平局低权重保护',
    handicap: '奥地利-0.25到-0.5；赢球优先，穿盘谨慎',
    marketTotal: '2.5球附近，倾向2-3球'
  }),
  makeRollingMatch({
    id: 'jordan-argentina-20260627',
    group: 'J组',
    venue: 'Dallas Stadium',
    home: 'jordan',
    away: 'argentina',
    result: '阿根廷胜',
    resultBackup: '',
    score: '0-3',
    backup: '0-2',
    total: '2-3球',
    order: '阿根廷胜 > 阿根廷-1.5谨慎 > 2-3球',
    homeForm: '约旦前两轮防守压力都很大，面对阿根廷的控球和前场压迫，出球与禁区保护会继续承压。',
    awayForm: '阿根廷两连胜后仍有争小组第一和调整状态需求，阵容深度足以维持强客胜方向。',
    homeNews: '约旦重点确认中卫和门将负荷，若早段丢球，比赛会被迫打开。',
    awayNews: '阿根廷可能进行部分轮换，但核心体系完整时，控球和终结优势仍明显。',
    tactics: '约旦低位防守争取定位球，阿根廷用中路渗透、边路倒三角和定位球持续压制。',
    risk: '阿根廷若提前领先后降速，深盘穿透存在不确定，胜负方向仍清晰。',
    oneXtwo: '阿根廷胜方向清晰，不设置胜平负备选',
    handicap: '阿根廷-1.5谨慎；赢球优先，穿深盘看首发强度',
    marketTotal: '2.5/3球，倾向2-3球'
  })
)

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
  'usa-australia-20260619': { dateText: '6月20日 周六', kickoff: '03:00', scheduleAt: '2026-06-20T03:00:00+08:00', weatherIcon: '☁️', weather: '17℃' },
  'scotland-morocco-20260619': { dateText: '6月20日 周六', kickoff: '06:00', scheduleAt: '2026-06-20T06:00:00+08:00', weatherIcon: '🌧️', weather: '20℃' },
  'brazil-haiti-20260619': { dateText: '6月20日 周六', kickoff: '08:30', scheduleAt: '2026-06-20T08:30:00+08:00', weatherIcon: '☁️', weather: '27℃' },
  'turkey-paraguay-20260619': { dateText: '6月20日 周六', kickoff: '11:00', scheduleAt: '2026-06-20T11:00:00+08:00', weatherIcon: '☀️', weather: '18℃' },
  'netherlands-sweden-20260620': { dateText: '6月21日 周日', kickoff: '01:00', scheduleAt: '2026-06-21T01:00:00+08:00', weatherIcon: '☀️', weather: '31℃' },
  'germany-ivorycoast-20260620': { dateText: '6月21日 周日', kickoff: '04:00', scheduleAt: '2026-06-21T04:00:00+08:00', weatherIcon: '☁️', weather: '22℃' },
  'ecuador-curacao-20260620': { dateText: '6月21日 周日', kickoff: '08:00', scheduleAt: '2026-06-21T08:00:00+08:00', weatherIcon: '☀️', weather: '29℃' },
  'tunisia-japan-20260620': { dateText: '6月21日 周日', kickoff: '12:00', scheduleAt: '2026-06-21T12:00:00+08:00', weatherIcon: '☀️', weather: '26℃' },
  'spain-saudi-20260621': { dateText: '6月22日 周一', kickoff: '00:00', scheduleAt: '2026-06-22T00:00:00+08:00', weatherIcon: '☁️', weather: '28℃' },
  'belgium-iran-20260621': { dateText: '6月22日 周一', kickoff: '03:00', scheduleAt: '2026-06-22T03:00:00+08:00', weatherIcon: '☀️', weather: '24℃' },
  'uruguay-caboverde-20260621': { dateText: '6月22日 周一', kickoff: '06:00', scheduleAt: '2026-06-22T06:00:00+08:00', weatherIcon: '⛈️', weather: '29℃' },
  'newzealand-egypt-20260621': { dateText: '6月22日 周一', kickoff: '09:00', scheduleAt: '2026-06-22T09:00:00+08:00', weatherIcon: '☁️', weather: '18℃' },
  'caboverde-saudi-20260626': { dateText: '6月27日 周六', kickoff: '08:00', scheduleAt: '2026-06-27T08:00:00+08:00', weatherIcon: '☁️', weather: '31℃' },
  'uruguay-spain-20260626': { dateText: '6月27日 周六', kickoff: '08:00', scheduleAt: '2026-06-27T08:00:00+08:00', weatherIcon: '☀️', weather: '25℃' },
  'newzealand-belgium-20260626': { dateText: '6月27日 周六', kickoff: '11:00', scheduleAt: '2026-06-27T11:00:00+08:00', weatherIcon: '☁️', weather: '18℃' },
  'egypt-iran-20260626': { dateText: '6月27日 周六', kickoff: '11:00', scheduleAt: '2026-06-27T11:00:00+08:00', weatherIcon: '☁️', weather: '17℃' },
  'argentina-austria-20260622': { dateText: '6月23日 周二', kickoff: '01:00', scheduleAt: '2026-06-23T01:00:00+08:00', weatherIcon: '☀️', weather: '31℃' },
  'france-iraq-20260622': { dateText: '6月23日 周二', kickoff: '05:00', scheduleAt: '2026-06-23T05:00:00+08:00', weatherIcon: '☁️', weather: '25℃' },
  'norway-senegal-20260622': { dateText: '6月23日 周二', kickoff: '08:00', scheduleAt: '2026-06-23T08:00:00+08:00', weatherIcon: '☀️', weather: '24℃' },
  'jordan-algeria-20260622': { dateText: '6月23日 周二', kickoff: '11:00', scheduleAt: '2026-06-23T11:00:00+08:00', weatherIcon: '☀️', weather: '20℃' },
  'portugal-uzbekistan-20260623': { dateText: '6月24日 周三', kickoff: '01:00', scheduleAt: '2026-06-24T01:00:00+08:00', weatherIcon: '☀️', weather: '32℃' },
  'england-ghana-20260623': { dateText: '6月24日 周三', kickoff: '04:00', scheduleAt: '2026-06-24T04:00:00+08:00', weatherIcon: '🌧️', weather: '20℃' },
  'panama-croatia-20260623': { dateText: '6月24日 周三', kickoff: '07:00', scheduleAt: '2026-06-24T07:00:00+08:00', weatherIcon: '☁️', weather: '21℃' },
  'colombia-congodr-20260623': { dateText: '6月24日 周三', kickoff: '10:00', scheduleAt: '2026-06-24T10:00:00+08:00', weatherIcon: '☀️', weather: '26℃' },
  'switzerland-canada-20260624': { dateText: '6月25日 周四', kickoff: '03:00', scheduleAt: '2026-06-25T03:00:00+08:00', weatherIcon: '☁️', weather: '18℃' },
  'bosnia-qatar-20260624': { dateText: '6月25日 周四', kickoff: '03:00', scheduleAt: '2026-06-25T03:00:00+08:00', weatherIcon: '☁️', weather: '17℃' },
  'scotland-brazil-20260624': { dateText: '6月25日 周四', kickoff: '06:00', scheduleAt: '2026-06-25T06:00:00+08:00', weatherIcon: '⛈️', weather: '29℃' },
  'morocco-haiti-20260624': { dateText: '6月25日 周四', kickoff: '06:00', scheduleAt: '2026-06-25T06:00:00+08:00', weatherIcon: '☁️', weather: '28℃' },
  'czechia-mexico-20260624': { dateText: '6月25日 周四', kickoff: '09:00', scheduleAt: '2026-06-25T09:00:00+08:00', weatherIcon: '☀️', weather: '24℃' },
  'southafrica-korea-20260624': { dateText: '6月25日 周四', kickoff: '09:00', scheduleAt: '2026-06-25T09:00:00+08:00', weatherIcon: '☀️', weather: '26℃' },
  'ecuador-germany-20260625': { dateText: '6月26日 周五', kickoff: '04:00', scheduleAt: '2026-06-26T04:00:00+08:00', weatherIcon: '☀️', weather: '25℃' },
  'curacao-ivorycoast-20260625': { dateText: '6月26日 周五', kickoff: '04:00', scheduleAt: '2026-06-26T04:00:00+08:00', weatherIcon: '☁️', weather: '27℃' },
  'japan-sweden-20260625': { dateText: '6月26日 周五', kickoff: '07:00', scheduleAt: '2026-06-26T07:00:00+08:00', weatherIcon: '☀️', weather: '31℃' },
  'tunisia-netherlands-20260625': { dateText: '6月26日 周五', kickoff: '07:00', scheduleAt: '2026-06-26T07:00:00+08:00', weatherIcon: '☀️', weather: '29℃' },
  'turkey-usa-20260625': { dateText: '6月26日 周五', kickoff: '10:00', scheduleAt: '2026-06-26T10:00:00+08:00', weatherIcon: '☀️', weather: '23℃' },
  'paraguay-australia-20260625': { dateText: '6月26日 周五', kickoff: '10:00', scheduleAt: '2026-06-26T10:00:00+08:00', weatherIcon: '☀️', weather: '20℃' },
  'norway-france-20260626': { dateText: '6月27日 周六', kickoff: '03:00', scheduleAt: '2026-06-27T03:00:00+08:00', weatherIcon: '☁️', weather: '22℃' },
  'senegal-iraq-20260626': { dateText: '6月27日 周六', kickoff: '03:00', scheduleAt: '2026-06-27T03:00:00+08:00', weatherIcon: '☁️', weather: '24℃' },
  'panama-england-20260627': { dateText: '6月28日 周日', kickoff: '05:00', scheduleAt: '2026-06-28T05:00:00+08:00', weatherIcon: '☁️', weather: '24℃' },
  'croatia-ghana-20260627': { dateText: '6月28日 周日', kickoff: '05:00', scheduleAt: '2026-06-28T05:00:00+08:00', weatherIcon: '☁️', weather: '26℃' },
  'colombia-portugal-20260627': { dateText: '6月28日 周日', kickoff: '07:30', scheduleAt: '2026-06-28T07:30:00+08:00', weatherIcon: '🌦️', weather: '29℃' },
  'congodr-uzbekistan-20260627': { dateText: '6月28日 周日', kickoff: '07:30', scheduleAt: '2026-06-28T07:30:00+08:00', weatherIcon: '☀️', weather: '28℃' },
  'algeria-austria-20260627': { dateText: '6月28日 周日', kickoff: '10:00', scheduleAt: '2026-06-28T10:00:00+08:00', weatherIcon: '☀️', weather: '28℃' },
  'jordan-argentina-20260627': { dateText: '6月28日 周日', kickoff: '10:00', scheduleAt: '2026-06-28T10:00:00+08:00', weatherIcon: '☀️', weather: '31℃' }
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

const modelWeights = {
  correctScoreOdds: 12,
  goalEfficiency: 17,
  marketLines: 16,
  squadNews: 13,
  rankValue: 7,
  recentForm: 10,
  coachTactics: 8,
  headToHead: 3,
  context: 5,
  betfairFlow: 9
}

const betfairMarketSnapshot = {
  'france-senegal-20260616': { marketId: '1.251397403', totalMatched: 425920, delayed: true, odds: { home: 1.525, draw: 4.65, away: 7.7 }, probability: { home: 66, draw: 21, away: 13 } },
  'iraq-norway-20260616': { marketId: '1.256162419', totalMatched: 432077, delayed: true, odds: { home: 16.75, draw: 7.7, away: 1.235 }, probability: { home: 6, draw: 13, away: 81 } },
  'argentina-algeria-20260616': { marketId: '1.251397542', totalMatched: 162392, delayed: true, odds: { home: 1.455, draw: 4.75, away: 9.5 }, probability: { home: 69, draw: 21, away: 10 } },
  'austria-jordan-20260616': { marketId: '1.251397681', totalMatched: 198541, delayed: true, odds: { home: 1.395, draw: 5.55, away: 9.5 }, probability: { home: 72, draw: 17, away: 11 } },
  'ghana-panama-20260617': { marketId: '1.251399584', totalMatched: 94463, delayed: true, odds: { home: 2.27, draw: 3.475, away: 3.625 }, probability: { home: 44, draw: 29, away: 27 } },
  'england-croatia-20260617': { marketId: '1.251399725', totalMatched: 125012, delayed: true, odds: { home: 1.775, draw: 3.925, away: 5.55 }, probability: { home: 56, draw: 26, away: 18 } },
  'portugal-congodr-20260617': { marketId: '1.256138762', totalMatched: 197777, delayed: true, odds: { home: 1.32, draw: 6.1, away: 13.25 }, probability: { home: 76, draw: 16, away: 8 } },
  'uzbekistan-colombia-20260617': { marketId: '1.251384486', totalMatched: 52049, delayed: true, odds: { home: 10.75, draw: 5.05, away: 1.405 }, probability: { home: 9, draw: 20, away: 71 } },
  'czechia-southafrica-20260618': { marketId: '1.258056757', totalMatched: 712840, delayed: true, odds: { home: 1.89, draw: 3.7, away: 5 }, probability: { home: 53, draw: 27, away: 20 } },
  'switzerland-bosnia-20260618': { marketId: '1.257503620', totalMatched: 372878, delayed: true, odds: { home: 1.6, draw: 4.4, away: 6.8 }, probability: { home: 63, draw: 23, away: 15 } },
  'canada-qatar-20260618': { marketId: '1.257503759', totalMatched: 296097, delayed: true, odds: { home: 1.32, draw: 6.2, away: 13.5 }, probability: { home: 76, draw: 16, away: 8 } },
  'mexico-korea-20260618': { marketId: '1.257503897', totalMatched: 196168, delayed: true, odds: { home: 2.14, draw: 3.4, away: 4.2 }, probability: { home: 47, draw: 29, away: 24 } },
  'usa-australia-20260619': { marketId: '1.251401910', totalMatched: 1305025, delayed: true, odds: { home: 1.65, draw: 4.6, away: 5.7 }, probability: { home: 61, draw: 22, away: 18 }, oddsMovement: { draw: 'steam', away: 'drift' } },
  'scotland-morocco-20260619': { marketId: '1.258058492', totalMatched: 347156, delayed: true, odds: { home: 5.9, draw: 3.7, away: 1.79 }, probability: { home: 17, draw: 27, away: 56 }, oddsMovement: { home: 'drift', draw: 'steam', away: 'drift' } },
  'brazil-haiti-20260619': { marketId: '1.258055706', totalMatched: 288884, delayed: true, odds: { home: 1.12, draw: 12.5, away: 30 }, probability: { home: 89, draw: 8, away: 3 }, oddsMovement: { home: 'steam', away: 'drift' } },
  'turkey-paraguay-20260619': { marketId: '1.258055656', totalMatched: 173758, delayed: true, odds: { home: 2.14, draw: 3.5, away: 4.1 }, probability: { home: 47, draw: 29, away: 25 }, oddsMovement: { home: 'drift', away: 'steam' } },
  'netherlands-sweden-20260620': { marketId: '1.257505065', totalMatched: 236174, delayed: true, odds: { home: 1.77, draw: 4.2, away: 5 }, probability: { home: 56, draw: 24, away: 20 } },
  'ecuador-curacao-20260620': { marketId: '1.257505345', totalMatched: 319199, delayed: true, odds: { home: 1.16, draw: 10.5, away: 27 }, probability: { home: 87, draw: 10, away: 4 }, oddsMovement: { home: 'steam' } },
  'tunisia-japan-20260620': { marketId: '1.257505483', totalMatched: 184527, delayed: true, odds: { home: 7, draw: 4.1, away: 1.63 }, probability: { home: 14, draw: 24, away: 61 }, oddsMovement: { away: 'steam' } },
  'spain-saudi-20260621': { marketId: '1.257505885', totalMatched: 300979, delayed: true, odds: { home: 1.13, draw: 12.5, away: 29 }, probability: { home: 89, draw: 8, away: 4 }, oddsMovement: { home: 'steam' } },
  'belgium-iran-20260621': { marketId: '1.258433364', totalMatched: 171900, delayed: true, odds: { home: 1.48, draw: 5, away: 8.4 }, probability: { home: 68, draw: 20, away: 12 } },
  'uruguay-caboverde-20260621': { marketId: '1.257506024', totalMatched: 604531, delayed: true, odds: { home: 1.5, draw: 4.4, away: 9.6 }, probability: { home: 67, draw: 23, away: 10 } },
  'newzealand-egypt-20260621': { marketId: '1.257504035', totalMatched: 76245, delayed: true, odds: { home: 6.4, draw: 4.3, away: 1.65 }, probability: { home: 16, draw: 23, away: 61 } },
  'argentina-austria-20260622': { marketId: '1.257506162', totalMatched: 869445, delayed: true, odds: { home: 1.52, draw: 4.5, away: 8.6 }, probability: { home: 66, draw: 22, away: 12 }, oddsMovement: { home: 'steam', away: 'drift' } },
  'france-iraq-20260622': { marketId: '1.258432180', totalMatched: 295367, delayed: true, odds: { home: 1.11, draw: 14, away: 44 }, probability: { home: 91, draw: 7, away: 2 }, oddsMovement: { home: 'steam', away: 'drift' } },
  'norway-senegal-20260622': { marketId: '1.257506304', totalMatched: 458051, delayed: true, odds: { home: 2.3, draw: 3.7, away: 3.45 }, probability: { home: 44, draw: 27, away: 29 }, oddsMovement: { home: 'steam', away: 'drift' } },
  'jordan-algeria-20260622': { marketId: '1.257506467', totalMatched: 127664, delayed: true, odds: { home: 6.6, draw: 4.5, away: 1.58 }, probability: { home: 15, draw: 22, away: 63 }, oddsMovement: { away: 'steam' } },
  'portugal-uzbekistan-20260623': { marketId: '1.258056400', totalMatched: 156813, delayed: true, odds: { home: 1.23, draw: 7.8, away: 18.5 }, probability: { home: 82, draw: 13, away: 5 }, oddsMovement: { away: 'drift' } },
  'england-ghana-20260623': { marketId: '1.257506605', totalMatched: 125011, delayed: true, odds: { home: 1.25, draw: 7.2, away: 16 }, probability: { home: 80, draw: 14, away: 6 } },
  'panama-croatia-20260623': { marketId: '1.257506750', totalMatched: 22639, delayed: true, odds: { home: 7.2, draw: 4.2, away: 1.6 }, probability: { home: 14, draw: 24, away: 62 } },
  'switzerland-canada-20260624': { marketId: '1.258370047', totalMatched: 67788, delayed: true, odds: { home: 2.58, draw: 3.2, away: 3.35 }, probability: { home: 39, draw: 31, away: 30 } },
  'scotland-brazil-20260624': { marketId: '1.258369771', totalMatched: 32640, delayed: true, odds: { home: 8.8, draw: 5.5, away: 1.42 }, probability: { home: 11, draw: 18, away: 70 }, oddsMovement: { away: 'steam' } },
  'morocco-haiti-20260624': { marketId: '1.258422667', totalMatched: 22359, delayed: true, odds: { home: 1.22, draw: 8, away: 19 }, probability: { home: 82, draw: 13, away: 5 }, oddsMovement: { home: 'steam' } },
  'czechia-mexico-20260624': { marketId: '1.258427197', totalMatched: 259614, delayed: true, odds: { home: 4, draw: 4.2, away: 1.97 }, probability: { home: 25, draw: 24, away: 51 } },
  'ecuador-germany-20260625': { marketId: '1.258423084', totalMatched: 176804, delayed: true, odds: { home: 3.8, draw: 4.2, away: 2 }, probability: { home: 26, draw: 24, away: 50 } },
  'japan-sweden-20260625': { marketId: '1.258426921', totalMatched: 93719, delayed: true, odds: { home: 1.97, draw: 3.6, away: 4.6 }, probability: { home: 51, draw: 28, away: 22 } },
  'tunisia-netherlands-20260625': { marketId: '1.258423448', totalMatched: 29899, delayed: true, odds: { home: 25, draw: 10.5, away: 1.16 }, probability: { home: 4, draw: 10, away: 86 }, oddsMovement: { away: 'steam' } },
  'paraguay-australia-20260625': { marketId: '1.258369633', totalMatched: 248324, delayed: true, odds: { home: 2.96, draw: 2.4, away: 4.1 }, probability: { home: 34, draw: 42, away: 24 } },
  'caboverde-saudi-20260626': { marketId: '1.258424121', totalMatched: 99473, delayed: true, odds: { home: 2.5, draw: 3.7, away: 3.05 }, probability: { home: 40, draw: 27, away: 33 }, oddsMovement: { home: 'steam', away: 'drift' } },
  'uruguay-spain-20260626': { marketId: '1.258423940', totalMatched: 23487, delayed: true, odds: { home: 7.8, draw: 4.5, away: 1.54 }, probability: { home: 13, draw: 22, away: 65 }, oddsMovement: { away: 'steam' } },
  'newzealand-belgium-20260626': { marketId: '1.258421820', totalMatched: 8792, delayed: true, odds: { home: 16, draw: 7.4, away: 1.25 }, probability: { home: 6, draw: 14, away: 80 }, oddsMovement: { away: 'steam', home: 'drift' } },
  'egypt-iran-20260626': { marketId: '1.258433587', totalMatched: 30785, delayed: true, odds: { home: 2.5, draw: 2.82, away: 4 }, probability: { home: 40, draw: 35, away: 25 } }
}

const predictionDiscipline = {
  'canada-bosnia-20260612': { result: '加拿大胜', resultBackup: '平局', oneXtwo: '主胜为主，平局作为低权重备选', order: '加拿大胜 > 平局保护 > 加拿大-0.25谨慎' },
  'haiti-scotland-20260613': { result: '苏格兰胜', resultBackup: '', score: '0-2', backup: '0-1', total: '1-2球', oneXtwo: '客胜方向，不设胜平负备选', handicap: '苏格兰-1.5属于深让，不能写苏格兰0球', order: '苏格兰胜 > 苏格兰-1.5谨慎 > 小2.5/2.75' },
  'australia-turkey-20260613': { result: '土耳其胜', resultBackup: '平局', oneXtwo: '客胜为主，平局低权重保护', order: '土耳其胜 > 平局保护 > 2.5球谨慎大' },
  'brazil-morocco-20260613': { result: '巴西胜', resultBackup: '', oneXtwo: '主胜方向，不再把平局列为胜平负备选', order: '巴西胜 > 巴西-0.5 > 双方进球谨慎关注' },
  'netherlands-japan-20260614': { result: '荷兰胜', resultBackup: '', oneXtwo: '主胜方向，不设胜平负备选', order: '荷兰胜 > 荷兰-0.5 > 2.5球谨慎大' },
  'ivorycoast-ecuador-20260614': { result: '平局', resultBackup: '科特迪瓦胜', oneXtwo: '平局主选，科特迪瓦胜作低权重备选', handicap: '科特迪瓦0球只作受让保护，最终推荐拆成平局主选与科特迪瓦胜备选', order: '平局 > 科特迪瓦胜 > 2-3球' },
  'germany-curacao-20260614': { result: '德国胜', resultBackup: '', total: '2-3球', oneXtwo: '主胜方向清晰，不设置胜平负备选', order: '德国胜 > 德国-1.5谨慎 > 2-3球' },
  'spain-caboverde-20260615': { result: '西班牙胜', resultBackup: '', score: '2-0', backup: '3-0', total: '2-3球', oneXtwo: '主胜方向清晰，不设置胜平负备选', handicap: '西班牙控球压制强，但若早早领先会更重视比赛管理，西班牙-1.5可看但不宜追深', order: '西班牙胜 > 西班牙-1.5谨慎 > 2-3球' },
  'belgium-egypt-20260615': { result: '比利时胜', resultBackup: '', score: '2-1', backup: '2-0', total: '2-3球', oneXtwo: '主胜方向清晰，不设置胜平负备选', handicap: '比利时进攻端更完整，但埃及反击和定位球会限制穿盘确定性', order: '比利时胜 > 比利时-0.75谨慎 > 2-3球' },
  'saudi-uruguay-20260615': { result: '乌拉圭胜', resultBackup: '', score: '1-3', backup: '0-2', total: '3-4球', oneXtwo: '客胜方向清晰，不设置胜平负备选', handicap: '乌拉圭在贝尔萨高压和纵向推进下进球上限更高，但沙特主场式环境和反击有破门窗口', order: '乌拉圭胜 > 乌拉圭-1谨慎 > 3-4球' },
  'iran-newzealand-20260615': { result: '伊朗胜', resultBackup: '', score: '1-0', backup: '2-0', total: '1-2球', oneXtwo: '主胜方向清晰，不设置胜平负备选', handicap: '伊朗强在控制风险和定位球，教练打法偏稳，主胜优先但不追大比分', order: '伊朗胜 > 小2.5 > 1-2球' },
  'france-senegal-20260616': { result: '法国胜', resultBackup: '', score: '2-0', backup: '2-1', total: '2-3球', oneXtwo: '主胜方向清晰，不设置胜平负备选', handicap: '法国个人能力和转换效率更高，但塞内加尔防线身体对抗强，赢球与大胜要分开', order: '法国胜 > 法国-0.75 > 2-3球' },
  'iraq-norway-20260616': { result: '挪威胜', resultBackup: '', score: '0-2', backup: '1-2', total: '2-3球', oneXtwo: '客胜方向清晰，不设置胜平负备选', handicap: '挪威锋线冲击力明显，伊拉克低位防守能拖节奏但难完全限制禁区终结', order: '挪威胜 > 挪威-0.75 > 2-3球' },
  'argentina-algeria-20260616': { result: '阿根廷胜', resultBackup: '', score: '2-0', backup: '2-1', total: '2-3球', oneXtwo: '主胜方向清晰，不设置胜平负备选', handicap: '阿根廷更擅长控节奏和保护领先，强队稳赢但不机械放大比分', order: '阿根廷胜 > 阿根廷-1谨慎 > 2-3球' },
  'austria-jordan-20260616': { result: '奥地利胜', resultBackup: '', score: '3-1', backup: '2-0', total: '3-4球', oneXtwo: '主胜方向清晰，不设置胜平负备选', handicap: '奥地利高压打法会制造连续射门和二次进攻，约旦若被迫出球更容易出现失误', order: '奥地利胜 > 奥地利-1 > 3-4球' },
  'england-croatia-20260617': { result: '英格兰胜', resultBackup: '平局', score: '2-1', backup: '1-1', total: '2-3球', oneXtwo: 'Betfair主胜约56%，平局约26%，英格兰胜从备选上调为主选，平局保留低权重保护', handicap: '英格兰个体优势明显，但克罗地亚控球和中场保护能降低比赛回合数，主胜优先但穿深盘谨慎', order: '英格兰胜 > 平局保护 > 2-3球' },
  'portugal-congodr-20260617': { result: '葡萄牙胜', resultBackup: '', score: '3-1', backup: '2-0', total: '3-4球', oneXtwo: '主胜方向清晰，不设置胜平负备选', handicap: '葡萄牙进攻点多，刚果民主共和国反击有身体优势但防线横移压力大', order: '葡萄牙胜 > 葡萄牙-1 > 3-4球' },
  'ghana-panama-20260617': { result: '加纳胜', resultBackup: '平局', score: '2-1', backup: '1-1', total: '2-3球', oneXtwo: '主胜略优，平局低权重保护', handicap: '加纳前场冲击力更好，但巴拿马对抗和定位球会制造波动', order: '加纳胜 > 平局保护 > 2-3球' },
  'uzbekistan-colombia-20260617': { result: '哥伦比亚胜', resultBackup: '', score: '0-2', backup: '1-2', total: '2-3球', oneXtwo: '客胜方向清晰，不设置胜平负备选', handicap: '哥伦比亚边路和前场个人能力更强，但乌兹别克斯坦低位组织会压低上限', order: '哥伦比亚胜 > 哥伦比亚-0.75 > 2-3球' },
  'czechia-southafrica-20260618': { result: '捷克胜', resultBackup: '平局', score: '2-1', backup: '1-1', total: '2-3球', oneXtwo: '捷克胜主选，平局低权重保护', handicap: '参考捷克-0.25到-0.5；捷克定位球和高点占优，但南非反击仍有威胁，赢球优先，不追深盘', order: '捷克胜 > 平局保护 > 2-3球' },
  'switzerland-bosnia-20260618': { result: '瑞士胜', resultBackup: '', score: '1-0', backup: '2-0', total: '1-2球', oneXtwo: '瑞士胜方向清晰，不设置胜平负备选', handicap: '参考瑞士-0.75；瑞士结构稳定，波黑中卫伤情压低客队上限，瑞士赢球强于穿深盘', order: '瑞士胜 > 小2.5 > 1-2球' },
  'canada-qatar-20260618': { result: '加拿大胜', resultBackup: '', score: '2-1', backup: '2-0', total: '2-3球', oneXtwo: '加拿大胜方向清晰，不设置胜平负备选', handicap: '参考加拿大-1；加拿大速度和主场环境优势明显，但Davies出场时间仍需控制，主胜可保留，穿盘谨慎', order: '加拿大胜 > 加拿大-1谨慎 > 2-3球' },
  'mexico-korea-20260618': { result: '墨西哥胜', resultBackup: '平局', score: '2-1', backup: '1-1', total: '2-3球', oneXtwo: '墨西哥胜主选，平局低权重保护', handicap: '参考墨西哥-0.25；主场和海拔有利，但Montes停赛、Quiñones伤情疑问削弱深盘信心', order: '墨西哥胜 > 平局保护 > 2-3球' },
  'brazil-haiti-20260619': { result: '巴西胜', resultBackup: '', score: '4-0', backup: '3-0', total: '3-4球', oneXtwo: '巴西胜方向极强；必发成交放大且巴西赔率走低，主胜权重继续抬升，不设置胜平负备选', handicap: '参考巴西-2；巴西边路爆点和禁区终结优势很大，海地若无法持续低位防守，比分上限会被放大', order: '巴西胜 > 巴西-2 > 3-4球' },
  'scotland-morocco-20260619': { result: '摩洛哥胜', resultBackup: '平局', score: '0-1', backup: '1-1', total: '1-2球', oneXtwo: '摩洛哥胜主选，但必发成交上升时摩洛哥赔率从低走高，客胜权重下调，平局保护需要保留', handicap: '参考摩洛哥-0.5到-0.75；摩洛哥防守和反击质量更好，但赔率漂移后不追深盘', order: '摩洛哥胜 > 平局保护 > 1-2球' },
  'turkey-paraguay-20260619': { result: '土耳其胜', resultBackup: '平局', score: '2-1', backup: '1-1', total: '2-3球', oneXtwo: '土耳其胜主选，但必发成交放大时主胜赔率走高，主胜权重显著降低，平局保护上调', handicap: '参考土耳其-0.25；土耳其创造力更强，但赔率漂移和巴拉圭对抗会让比赛保持悬念，主胜只适合浅盘', order: '土耳其胜 > 平局保护 > 2-3球' },
  'usa-australia-20260619': { result: '美国胜', resultBackup: '', score: '2-1', backup: '2-0', total: '2-3球', oneXtwo: '美国胜方向清晰；必发成交量高且主胜赔率稳定，澳大利亚赔率走高，主胜仍是主线', handicap: '参考美国-0.75到-1；美国高节奏压迫能制造更多机会，但Pulisic伤情让穿深盘谨慎', order: '美国胜 > 美国-0.75 > 2-3球' },
  'netherlands-sweden-20260620': { result: '荷兰胜', resultBackup: '平局', score: '2-1', backup: '1-1', total: '2-3球', oneXtwo: '荷兰胜主选，平局低权重保护；必发胜/平/负约56/24/20，荷兰首轮只拿1分后争胜需求更强，瑞典首轮大胜后保平价值也不低', handicap: '参考荷兰-0.5；荷兰需要主动压上争取小组主动权，但瑞典定位球和反击会限制穿盘上限', order: '荷兰胜 > 平局保护 > 2-3球' },
  'ecuador-curacao-20260620': { result: '厄瓜多尔胜', resultBackup: '', score: '2-0', backup: '3-0', total: '2-3球', oneXtwo: '厄瓜多尔胜方向清晰；必发胜/平/负约87/10/4，厄瓜多尔首轮输球后必须拿三分，主胜权重继续放大', handicap: '参考厄瓜多尔-1.75；库拉索首轮大比分失利后防线压力很高，但深盘仍需防领先后的节奏管理', order: '厄瓜多尔胜 > 厄瓜多尔-1.75谨慎 > 2-3球' },
  'tunisia-japan-20260620': { result: '日本胜', resultBackup: '', score: '0-2', backup: '1-2', total: '2-3球', oneXtwo: '日本胜方向上调；必发胜/平/负约14/24/62，日本首轮拿分后若本场取胜基本掌握出线主动，突尼斯首轮失利必须冒险', handicap: '参考日本-0.75；日本传控和边路速度更稳定，突尼斯若压出来会留下身后空间', order: '日本胜 > 日本-0.75 > 2-3球' },
  'spain-saudi-20260621': { result: '西班牙胜', resultBackup: '', score: '2-0', backup: '3-0', total: '2-3球', oneXtwo: '西班牙胜方向极强；必发胜/平/负约89/8/4，首轮0-0后西班牙必须提升禁区效率，主胜权重明显高于平局保护', handicap: '参考西班牙-1.5；沙特预计低位5-4-1保护禁区，西班牙赢球清晰，但穿深盘取决于早段进球和边路爆点效率', order: '西班牙胜 > 西班牙-1.5谨慎 > 2-3球' },
  'belgium-iran-20260621': { result: '比利时胜', resultBackup: '平局', score: '2-1', backup: '1-1', total: '2-3球', oneXtwo: '比利时胜主选，平局低权重保护；必发胜/平/负约68/20/12，比利时优势清晰但首轮防守转换问题仍让平局尾部保留', handicap: '参考比利时-0.75；比利时肋部和边路创造更强，伊朗定位球和反击有一球空间，赢球优先但不追过深', order: '比利时胜 > 平局保护 > 2-3球' },
  'uruguay-caboverde-20260621': { result: '乌拉圭胜', resultBackup: '平局', score: '1-0', backup: '1-1', total: '1-2球', oneXtwo: '乌拉圭胜主选，平局低权重保护；必发胜/平/负约67/23/11，乌拉圭需要三分，但佛得角守住西班牙后低位防守权重上调', handicap: '参考乌拉圭-0.75到-1；乌拉圭高压和身体对抗占优，但佛得角门将和中卫状态会压低比分上限', order: '乌拉圭胜 > 平局保护 > 1-2球' },
  'newzealand-egypt-20260621': { result: '埃及胜', resultBackup: '平局', score: '1-2', backup: '1-1', total: '2-3球', oneXtwo: '埃及胜主选，平局保护；必发胜/平/负约16/24/61，埃及反击质量和个人能力高于新西兰，但成交量偏薄，保留平局尾部', handicap: '参考埃及-0.5；新西兰高球和定位球能制造波动，埃及赢球优先但不宜放大比分', order: '埃及胜 > 平局保护 > 2-3球' },
  'argentina-austria-20260622': { result: '阿根廷胜', resultBackup: '平局', score: '2-1', backup: '1-1', total: '2-3球', oneXtwo: '阿根廷胜主选，平局低权重保护；必发胜/平/负约66/22/12，成交量约869K，主胜赔率继续压低，主胜权重上调但奥地利高压仍保留平局尾部', handicap: '参考阿根廷-0.75；主胜热度增强，赢球优先，穿盘仍看阿根廷首发强度和奥地利前压后的回追质量', order: '阿根廷胜 > 平局保护 > 2-3球' },
  'france-iraq-20260622': { result: '法国胜', resultBackup: '', score: '3-0', backup: '2-0', total: '2-3球', oneXtwo: '法国胜方向清晰，不设置胜平负备选；必发胜/平/负约91/7/2，成交量约265K，市场继续给出强主胜定价', handicap: '参考法国-1.5；伊拉克首轮防线被打穿后，本场法国赢球清晰，穿深盘取决于锋线轮换和领先后的降速程度', order: '法国胜 > 法国-1.5谨慎 > 2-3球' },
  'norway-senegal-20260622': { result: '挪威胜', resultBackup: '平局', score: '2-1', backup: '1-1', total: '2-3球', oneXtwo: '挪威胜主选，平局低权重保护；必发胜/平/负约44/27/29，成交量约457K，挪威从浅主胜方向获得支持，但塞内加尔反击仍压住深胜预期', handicap: '参考挪威-0.25到-0.5；赢球优先但不追深盘，塞内加尔身体对抗和定位球会让一球差更合理', order: '挪威胜 > 平局保护 > 2-3球' },
  'jordan-algeria-20260622': { result: '阿尔及利亚胜', resultBackup: '平局', score: '1-2', backup: '1-1', total: '2-3球', oneXtwo: '阿尔及利亚胜主选，平局低权重保护；必发胜/平/负约15/23/63，成交量约127K，客胜定价稳定但流动性中等', handicap: '参考阿尔及利亚-0.5；客胜方向清晰，约旦定位球和低位反击使平局保护仍需保留', order: '阿尔及利亚胜 > 平局保护 > 2-3球' },
  'portugal-uzbekistan-20260623': { result: '葡萄牙胜', resultBackup: '', score: '2-0', backup: '3-1', total: '2-3球', oneXtwo: '葡萄牙胜方向清晰，不设置胜平负备选；必发胜/平/负约82/13/5，成交量约156K，主胜定价强且客胜继续被压低', handicap: '参考葡萄牙-1到-1.25；葡萄牙赢球优先，穿盘看早段进球和前场首发强度', order: '葡萄牙胜 > 葡萄牙-1谨慎 > 2-3球' },
  'england-ghana-20260623': { result: '英格兰胜', resultBackup: '平局', score: '2-1', backup: '1-1', total: '2-3球', oneXtwo: '英格兰胜主选，平局低权重保护；必发胜/平/负约80/14/6，成交量约125K，主胜优势明显但首轮丢球问题使平局尾部保留', handicap: '参考英格兰-0.75到-1；赢球和穿盘分开看，加纳速度和定位球有一球空间', order: '英格兰胜 > 平局保护 > 2-3球' },
  'panama-croatia-20260623': { result: '克罗地亚胜', resultBackup: '', score: '0-2', backup: '1-2', total: '2-3球', oneXtwo: '克罗地亚胜方向清晰，不设置胜平负备选；必发胜/平/负约14/24/63，成交量约22K，客胜定价占优但流动性偏薄', handicap: '参考克罗地亚-0.75；克罗地亚反弹动机强，但成交量不足时穿盘信心不宜放大', order: '克罗地亚胜 > 克罗地亚-0.75谨慎 > 2-3球' },
  'colombia-congodr-20260623': { result: '哥伦比亚胜', resultBackup: '平局', score: '2-1', backup: '1-1', total: '2-3球', oneXtwo: '哥伦比亚胜主选，平局低权重保护；本轮 Betfair 未匹配到有效市场，暂以实力、首轮状态和公开盘口为主', handicap: '参考哥伦比亚-0.5；刚果民主共和国身体对抗和反击会制造波动，主胜优先但保留平局保护', order: '哥伦比亚胜 > 平局保护 > 2-3球' },
  'ecuador-germany-20260625': { result: '德国胜', resultBackup: '', score: '1-2', backup: '0-2', total: '2-3球', oneXtwo: '德国胜方向清晰，不设置胜平负备选', handicap: '德国-0.75附近，赢球优先，穿深盘看首发强度', order: '德国胜 > 德国-0.75谨慎 > 2-3球' },
  'curacao-ivorycoast-20260625': { result: '科特迪瓦胜', resultBackup: '平局', score: '1-2', backup: '1-1', total: '2-3球', oneXtwo: '科特迪瓦胜主选，平局作为低权重保护', handicap: '科特迪瓦-0.5到-0.75，赢球优先，不追过深', order: '科特迪瓦胜 > 平局保护 > 2-3球' },
  'japan-sweden-20260625': { result: '平局', resultBackup: '瑞典胜', score: '1-1', backup: '1-2', total: '2-3球', oneXtwo: '平局主选，瑞典胜作为身体和定位球优势的备选', handicap: '瑞典0到-0.25谨慎，日本受让方向有韧性', order: '平局 > 瑞典胜 > 2-3球' },
  'tunisia-netherlands-20260625': { result: '荷兰胜', resultBackup: '', score: '0-2', backup: '1-2', total: '2-3球', oneXtwo: '荷兰胜方向清晰，不设置胜平负备选', handicap: '荷兰-0.75附近，赢球优先，穿盘谨慎', order: '荷兰胜 > 荷兰-0.75 > 2-3球' },
  'turkey-usa-20260625': { result: '美国胜', resultBackup: '平局', score: '0-2', backup: '1-1', total: '1-2球', oneXtwo: '美国胜主选，平局低权重保护；美国两连胜且已凭相互战绩锁定D组第一，末轮可能轮换但整体节奏和板凳深度仍占优，土耳其两连败后士气和出线概率明显下滑', handicap: '美国-0.25到-0.5谨慎；美国已锁定小组第一，赢球优先但不追深盘，土耳其若开放进攻会暴露身后空间', order: '美国胜 > 平局保护 > 1-2球' },
  'paraguay-australia-20260625': { result: '平局', resultBackup: '巴拉圭胜', score: '1-1', backup: '1-0', total: '1-2球', oneXtwo: '平局主选，巴拉圭胜低权重备选；巴拉圭击败土耳其后与澳大利亚形成直接出线卡位，澳大利亚至少要抢分，巴拉圭保平也具备较高价值', handicap: '澳大利亚0到-0.25谨慎；巴拉圭少打一人仍能守住土耳其，防守韧性上调，比赛更可能低比分', order: '平局 > 巴拉圭胜 > 1-2球' },
  'norway-france-20260626': { result: '法国胜', resultBackup: '平局', score: '1-2', backup: '1-1', total: '2-3球', oneXtwo: '法国胜主选，平局低权重保护；法国净胜球领先，挪威必须争胜，比赛会给法国反击留下空间', handicap: '法国-0.25到-0.5；赢球优先，穿盘不追深', order: '法国胜 > 平局保护 > 2-3球' },
  'senegal-iraq-20260626': { result: '塞内加尔胜', resultBackup: '', score: '2-0', backup: '2-1', total: '2-3球', oneXtwo: '塞内加尔胜方向清晰，不设置胜平负备选；伊拉克连续承压，塞内加尔仍需赢球争第三名排名', handicap: '塞内加尔-0.75；赢球优先，穿盘看早段进球', order: '塞内加尔胜 > 塞内加尔-0.75谨慎 > 2-3球' },
  'panama-england-20260627': { result: '英格兰胜', resultBackup: '', score: '0-2', backup: '1-2', total: '2-3球', oneXtwo: '英格兰胜方向清晰，不设置胜平负备选；阵容厚度和定位球优势明显', handicap: '英格兰-1附近；赢球优先，穿盘谨慎', order: '英格兰胜 > 英格兰-1谨慎 > 2-3球' },
  'croatia-ghana-20260627': { result: '克罗地亚胜', resultBackup: '平局', score: '2-1', backup: '1-1', total: '2-3球', oneXtwo: '克罗地亚胜主选，平局低权重保护；加纳速度能制造波动，但克罗地亚控场和比赛管理更稳', handicap: '克罗地亚-0.25到-0.5；赢球优先，不追深盘', order: '克罗地亚胜 > 平局保护 > 2-3球' },
  'colombia-portugal-20260627': { result: '葡萄牙胜', resultBackup: '平局', score: '1-2', backup: '1-1', total: '2-3球', oneXtwo: '葡萄牙胜主选，平局低权重保护；哥伦比亚身体对抗强，葡萄牙技术和替补深度占优', handicap: '葡萄牙-0.25到-0.5；赢球优先，穿盘谨慎', order: '葡萄牙胜 > 平局保护 > 2-3球' },
  'congodr-uzbekistan-20260627': { result: '刚果民主共和国胜', resultBackup: '平局', score: '2-1', backup: '1-1', total: '2-3球', oneXtwo: '刚果民主共和国胜主选，平局低权重保护；身体对抗和纵向推进优势更明显', handicap: '刚果民主共和国-0.25；主胜优先，不追深盘', order: '刚果民主共和国胜 > 平局保护 > 2-3球' },
  'algeria-austria-20260627': { result: '奥地利胜', resultBackup: '平局', score: '1-2', backup: '1-1', total: '2-3球', oneXtwo: '奥地利胜主选，平局低权重保护；整体压迫和跑动体系更完整，但阿尔及利亚反击保留平局尾部', handicap: '奥地利-0.25到-0.5；赢球优先，穿盘谨慎', order: '奥地利胜 > 平局保护 > 2-3球' },
  'jordan-argentina-20260627': { result: '阿根廷胜', resultBackup: '', score: '0-3', backup: '0-2', total: '2-3球', oneXtwo: '阿根廷胜方向清晰，不设置胜平负备选；约旦连续承压，阿根廷即使轮换仍具明显控球和终结优势', handicap: '阿根廷-1.5谨慎；赢球优先，穿深盘看首发强度', order: '阿根廷胜 > 阿根廷-1.5谨慎 > 2-3球' }
}

const coachStyleNotes = {
  'spain-caboverde-20260615': '教练打法与攻防端：西班牙更强调控球、压迫和边路传中，进攻稳定但领先后会控制风险；佛得角若深守，西班牙主胜清晰但大比分上限不宜机械放大。',
  'belgium-egypt-20260615': '教练打法与攻防端：比利时前场个人能力和肋部推进更强，埃及反击速度与定位球能制造一球空间，因此主胜倾向保留但穿盘不宜过深。',
  'saudi-uruguay-20260615': '教练打法与攻防端：乌拉圭在贝尔萨式高压和纵向推进下进攻回合数高，沙特防线若被迫连续出球，失误会放大比分；但沙特反击也有破门窗口。',
  'iran-newzealand-20260615': '教练打法与攻防端：伊朗更重视阵型完整、定位球和比赛管理，新西兰低位防守会压低节奏，所以更像主胜小比分而不是开放大球。',
  'france-senegal-20260616': '教练打法与攻防端：法国转换速度和个人能力优势明显，塞内加尔身体对抗与防线纪律较好，法国赢面高但不等于必然大胜穿深盘。',
  'iraq-norway-20260616': '教练打法与攻防端：挪威锋线冲击和禁区终结更强，伊拉克低位防守能拖慢节奏但难持续限制高点和身后冲刺。',
  'argentina-algeria-20260616': '教练打法与攻防端：阿根廷擅长控节奏和保护领先，阿尔及利亚反击能力不弱，因此主胜更稳，比分不盲目放大。',
  'austria-jordan-20260616': '教练打法与攻防端：奥地利高压和二次进攻会制造连续射门，约旦若出球受压容易出现防线断点，进球上限高于普通实力模型。',
  'england-croatia-20260617': '教练打法与攻防端：英格兰个体优势明显但比赛管理偏谨慎，克罗地亚中场控球和降速能力强，强强对话更容易形成低回合拉锯。',
  'portugal-congodr-20260617': '教练打法与攻防端：葡萄牙进攻点丰富且边中结合强，刚果民主共和国身体和反击能回击，但防线横移会承压，比分上限略高。',
  'ghana-panama-20260617': '教练打法与攻防端：加纳速度和个人突破更有威胁，巴拿马对抗、定位球和防守韧性会把比赛维持在一球差附近。',
  'uzbekistan-colombia-20260617': '教练打法与攻防端：哥伦比亚边路和前场个人能力占优，乌兹别克斯坦更偏组织防守和中低位反击，客胜优先但进球数不追高。',
  'czechia-southafrica-20260618': '教练打法与攻防端：捷克高点、定位球和直接打法能针对南非防线轮换；南非有速度反击，但停赛与阵型完整度下降让捷克胜面上升。',
  'switzerland-bosnia-20260618': '教练打法与攻防端：瑞士结构稳定、攻守转换风险低，波黑若压低阵型会限制大比分，瑞士更像稳胜小比分。',
  'canada-qatar-20260618': '教练打法与攻防端：加拿大速度和纵深冲击更直接，卡塔尔组织性不差但回追保护压力大，主胜可期但仍需防一球差。',
  'mexico-korea-20260618': '教练打法与攻防端：墨西哥高压和主场海拔能制造压迫优势，韩国反击速度会拉高双方进球概率，主胜但平局保留低权重。',
  'brazil-haiti-20260619': '教练打法与攻防端：巴西边路爆点、禁区终结和连续进攻能力明显高出一档，海地若无法长期摆出有效低位防线，比分容易被放大。',
  'scotland-morocco-20260619': '教练打法与攻防端：摩洛哥防守纪律和反击质量更好，苏格兰身体对抗和定位球能拖慢比赛，低比分更合理。',
  'turkey-paraguay-20260619': '教练打法与攻防端：土耳其脚下创造力更强，巴拉圭硬度和定位球会制造波动，比赛有双方进球可能但不宜过度追大。',
  'usa-australia-20260619': '教练打法与攻防端：美国高节奏压迫和边路速度能制造更多机会，澳大利亚定位球威胁明显但阵地战创造力有限。'
}

const injuryImpactNotes = {
  'mexico-korea-20260618': {
    home: 'Cesar Montes 首轮染红停赛，墨西哥中卫高点、定位球防守和回追保护下降；Edson Alvarez 预计回撤中卫，Erik Lira 留在后腰保护。Julian Quinones 首战进球后因不适被换下，预计可出场但需赛前确认，因此墨西哥主胜保留，亚盘只看浅让。',
    away: 'Kim Tae-Hyeon 和 Bae Jun-Ho 已恢复合练，可作为后防和前场轮换补充；韩国核心仍是 Son Heung-Min、Lee Kang-in 和 Hwang In-beom 的转换速度。无人机事件未直接影响训练内容，但增加赛前干扰，平局仅作低权重保护。'
  },
  'czechia-southafrica-20260618': {
    home: '捷克暂无公开新增红牌停赛，Ladislav Krejci 等高点完整时，定位球和二点球优势会更明显；首战暴露边路回追问题，仍需避免被南非速度点反击。',
    away: 'Sphephelo "Yaya" Sithole 和 Themba Zwane 首轮染红，本场停赛。Sithole 缺阵削弱中场拦截和二次落点保护，Zwane 缺阵降低前场持球和反击衔接，南非需要轮换中轴，阵型完整度下降。'
  },
  'switzerland-bosnia-20260618': {
    home: '瑞士赛前更需要确认中前场轮换和边路体能，整体暂无足以改变主胜方向的重大伤停。球队结构稳定，领先后更可能降低节奏管理比赛。',
    away: 'Nidal Celik 训练中受伤并被 Arjan Malic 补招替换，Sead Kolasinac 首战末段带伤离场仍需赛前确认。波黑中卫和左侧防守若轮换，瑞士定位球、二次进攻和边路传中会更有威胁。'
  },
  'canada-qatar-20260618': {
    home: 'Alphonso Davies 已恢复训练并被确认可出场，但此前腿筋伤后久未比赛，预计仍需控制出场时间；若不能首发或只能替补，加拿大左路爆点会下降，但主场、速度和身体强度仍支撑主胜。',
    away: '卡塔尔组织性不差，但面对加拿大纵深冲击和主场节奏，边后卫回追压力较大。若加拿大早进球，卡塔尔被迫压上后会让2-3球区间更稳。'
  },
  'brazil-haiti-20260619': {
    home: 'Neymar 右小腿伤势仍未恢复到完整合练，本场不宜按首发处理；Gabriel Magalhaes、Bruno Guimaraes 和 Raphinha 曾单独训练，需赛前确认负荷。即便 Neymar 缺阵，Vinicius Junior、Raphinha、Luiz Henrique 和 Matheus Cunha 仍足以支撑巴西强势进攻。',
    away: '海地暂无公开新增红牌停赛或明确伤停姓名，预计继续低位防守。若 Johnny Placide 和中卫线顶不住连续传中与二次进攻，比分上限会被放大。'
  },
  'usa-australia-20260619': {
    home: 'Christian Pulisic 小腿受撞后被列为每日观察，若无法首发，Sebastian Berhalter 可能补位，美国前场一对一和最后一传会下降；若 Pulisic 正常出场，美国高压和边路推进仍是主胜基础。',
    away: '澳大利亚暂无公开新增红牌停赛姓名，Harry Souttar、Alessandro Circati 和定位球体系仍是主要抵抗点。若美国早段压迫成功，澳大利亚阵地战创造力不足会被放大。'
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

const publicReferenceNotes = {
  'czechia-southafrica-20260618': '南非 Sithole、Zwane 红牌停赛',
  'switzerland-bosnia-20260618': '波黑 Nidal Celik 伤缺，Kolasinac 伤情待确认',
  'canada-qatar-20260618': 'Alphonso Davies 可出场但需控制负荷',
  'mexico-korea-20260618': '韩国训练无人机事件；墨西哥 Montes 停赛',
  'brazil-haiti-20260619': 'Neymar 小腿伤势仍未完整合练',
  'usa-australia-20260619': 'Christian Pulisic 小腿伤情每日观察'
}

const groupSituationNotes = {
  'netherlands-sweden-20260620': '小组形势：荷兰首轮只拿1分，本场争胜才能重新掌握前二主动；瑞典首轮大胜后保平即可保持较舒服位置，因此荷兰进攻动力更强但也要防瑞典反击。',
  'ecuador-curacao-20260620': '小组形势：厄瓜多尔首轮输球后本场必须争三分，库拉索首轮大比分失利后净胜球压力极大，若再输基本失去前二主动。',
  'tunisia-japan-20260620': '小组形势：日本首轮拿分后本场赢球基本锁住出线主动，突尼斯首轮失利后不能只守平，后程冒险会增加日本反击空间。',
  'scotland-brazil-20260624': '小组形势：巴西与摩洛哥同积4分，巴西保平大概率即可晋级；苏格兰3分在手但末轮若不能赢巴西，出线会更多依赖第三名比较。',
  'morocco-haiti-20260624': '小组形势：摩洛哥击败苏格兰后已到4分，面对两连败海地只要不犯错即可锁住晋级主动，比赛管理权重高于无脑大胜。',
  'turkey-usa-20260625': '小组形势：美国两连胜积6分，澳大利亚或巴拉圭最多追到6分，但美国已分别击败澳大利亚和巴拉圭，按本届同分先看相互战绩的规则已经锁定D组第一；末轮有轮换空间。土耳其两连败后主动权基本丢失，比赛心态更容易被先丢球放大。',
  'paraguay-australia-20260625': '小组形势：巴拉圭击败土耳其后追到3分，澳大利亚同样3分，这场是第三轮直接卡位战，巴拉圭保平价值上升，澳大利亚必须避免输球。'
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

function applyRelativeProbabilityLevels(items, levels) {
  const ranked = items
    .map((item, index) => ({ item, index }))
    .sort((a, b) => {
      const diff = b.item.value - a.item.value
      return diff || a.index - b.index
    })
  ranked.forEach((entry, index) => {
    entry.item.level = levels[index] || levels[levels.length - 1]
  })
  return items
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

function getBetfairMarket(match) {
  return betfairMarketSnapshot[match.id] || null
}

function getBetfairEdge(match) {
  const market = getBetfairMarket(match)
  if (!market || !market.probability) return 0
  const movement = market.oddsMovement || {}
  const homeDriftPenalty = movement.home === 'drift' ? 0.08 : 0
  const awayDriftPenalty = movement.away === 'drift' ? 0.08 : 0
  const homeSteamBonus = movement.home === 'steam' ? 0.04 : 0
  const awaySteamBonus = movement.away === 'steam' ? 0.04 : 0
  return clamp((market.probability.home - market.probability.away) / 100 - homeDriftPenalty + awayDriftPenalty + homeSteamBonus - awaySteamBonus, -0.9, 0.9)
}

function getBetfairBlendWeight(match) {
  const market = getBetfairMarket(match)
  if (!market) return 0
  const liquidityWeight = clamp((market.totalMatched || 0) / 220000, 0.28, 0.72)
  const delayedPenalty = market.delayed ? 0.88 : 1
  return clamp(liquidityWeight * delayedPenalty, 0.22, 0.68)
}

function blendWithBetfairProbability(match, probability) {
  const market = getBetfairMarket(match)
  if (!market || !market.probability) return probability
  const weight = getBetfairBlendWeight(match)
  let home = Math.round(probability.home * (1 - weight) + market.probability.home * weight)
  let draw = Math.round(probability.draw * (1 - weight) + market.probability.draw * weight)
  let away = 100 - home - draw
  const movement = market.oddsMovement || {}
  if (movement.home === 'drift') {
    const penalty = Math.min(5, Math.max(2, Math.round(weight * 7)))
    home = Math.max(4, home - penalty)
    draw += Math.ceil(penalty / 2)
    away += Math.floor(penalty / 2)
  }
  if (movement.away === 'drift') {
    const penalty = Math.min(5, Math.max(2, Math.round(weight * 7)))
    away = Math.max(4, away - penalty)
    draw += Math.ceil(penalty / 2)
    home += Math.floor(penalty / 2)
  }
  if (away < 4) {
    away = 4
    draw = 100 - home - away
  }
  if (draw < 8) {
    draw = 8
    away = 100 - home - draw
  }
  return { home, draw, away }
}

function getBetfairMarketText(match) {
  const market = getBetfairMarket(match)
  if (!market) return ''
  return `Betfair交易所参考：成交量约${Math.round((market.totalMatched || 0) / 1000)}K，胜/平/负归一化概率${market.probability.home}%/${market.probability.draw}%/${market.probability.away}%${market.delayed ? '，数据带延迟' : ''}`
}

function getBetfairImpactText(match) {
  const market = getBetfairMarket(match)
  if (!market || !market.probability) return ''
  const matchedK = Math.round((market.totalMatched || 0) / 1000)
  const liquidityText = matchedK >= 300 ? '成交量较高' : matchedK >= 120 ? '成交量中等' : '成交量偏薄'
  const movement = market.oddsMovement || {}
  const movementText = movement.home === 'drift'
    ? `；${match.home.cn}成交放大但赔率走高，主胜权重下调`
    : movement.away === 'drift'
      ? `；${match.away.cn}成交放大但赔率走高，客胜权重下调`
      : movement.home === 'steam'
        ? `；${match.home.cn}赔率走低，主胜热度增强`
        : movement.away === 'steam'
          ? `；${match.away.cn}赔率走低，客胜热度增强`
          : ''
  const backup = match.pick && match.pick.resultBackup ? `，但${match.pick.resultBackup}保护仍要保留` : ''
  return `必发影响：${liquidityText}，约${matchedK}K成交；胜/平/负归一化为${market.probability.home}%/${market.probability.draw}%/${market.probability.away}%${movementText}，对${match.pick.result}形成校准${backup}${market.delayed ? '。当前数据带延迟，只作为赛前权重参考。' : '。'}`
}

function getStrengthScores(match) {
  const homeRank = Number(match.home.rank || 80)
  const awayRank = Number(match.away.rank || 80)
  const homeValue = parseTeamValue(match.home.value)
  const awayValue = parseTeamValue(match.away.value)
  const rankEdge = clamp((awayRank - homeRank) / 55, -0.9, 0.9)
  const valueEdge = homeValue && awayValue ? clamp(Math.log((homeValue + 20) / (awayValue + 20)) / 3, -0.9, 0.9) : 0
  const marketEdge = clamp(getHandicapValue(match) / 2, -0.75, 0.75)
  const rankValueEdge = rankEdge * 0.45 + valueEdge * 0.55
  const betfairEdge = getBetfairEdge(match)
  const contextEdge = 0.25
  const activeWeight = modelWeights.rankValue + modelWeights.marketLines + modelWeights.betfairFlow + modelWeights.context
  const edge = clamp((
    rankValueEdge * modelWeights.rankValue +
    marketEdge * modelWeights.marketLines +
    betfairEdge * modelWeights.betfairFlow +
    contextEdge * modelWeights.context
  ) / activeWeight, -0.95, 0.95)
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
  const normalized = blendWithBetfairProbability(match, { home, draw, away })
  return applyRelativeProbabilityLevels([
    makeProbabilityItem('home', `${match.home.cn}胜`, normalized.home),
    makeProbabilityItem('draw', '平局', normalized.draw),
    makeProbabilityItem('away', `${match.away.cn}胜`, normalized.away)
  ], ['green', 'yellow', 'red'])
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
  return applyRelativeProbabilityLevels(values, ['green', 'yellow', 'orange', 'red'])
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
  match.analysis.betfairImpact = getBetfairImpactText(match)
  match.analysis.injuryImpact = injuryImpactNotes[match.id] || getDefaultInjuryImpact(match)
  match.analysis.publicReference = publicReferenceNotes[match.id] || '无公开参考信息'
  if (coachStyleNotes[match.id]) {
    match.analysis.tactics = `${match.analysis.tactics} ${coachStyleNotes[match.id]}`
  }
  if (groupSituationNotes[match.id]) {
    match.analysis.h2h = `${match.analysis.h2h} ${groupSituationNotes[match.id]}`
    match.analysis.risk = `${match.analysis.risk} ${groupSituationNotes[match.id]}`
  }
  match.analysis.probability = buildProbabilityAnalysis(match)
})

const finishedReviewSource = [
  { id: 'jordan-algeria-review', matchId: 'jordan-algeria-20260622', homeTeam: 'jordan', awayTeam: 'algeria', home: '约旦', away: '阿尔及利亚', dateText: '6月23日 周二', kickoff: '11:00', group: 'J组', venue: 'San Francisco Bay Area Stadium', endedAtSort: 202606231300, score: '1-2', resultMain: '阿尔及利亚胜', resultBackup: '平局', scoreMain: '1-2', scoreBackup: '1-1', totalPick: '2-3球', resultMainCorrect: true, resultBackupCorrect: false, scoreMainCorrect: true, scoreBackupCorrect: false },
  { id: 'norway-senegal-review', matchId: 'norway-senegal-20260622', homeTeam: 'norway', awayTeam: 'senegal', home: '挪威', away: '塞内加尔', dateText: '6月23日 周二', kickoff: '08:00', group: 'I组', venue: 'New York New Jersey Stadium', endedAtSort: 202606231000, score: '3-2', resultMain: '挪威胜', resultBackup: '平局', scoreMain: '2-1', scoreBackup: '1-1', totalPick: '2-3球', resultMainCorrect: true, resultBackupCorrect: false, scoreMainCorrect: false, scoreBackupCorrect: false },
  { id: 'france-iraq-review', matchId: 'france-iraq-20260622', homeTeam: 'france', awayTeam: 'iraq', home: '法国', away: '伊拉克', dateText: '6月23日 周二', kickoff: '05:00', group: 'I组', venue: 'Philadelphia Stadium', endedAtSort: 202606230700, score: '3-0', resultMain: '法国胜', resultBackup: '', scoreMain: '3-0', scoreBackup: '2-0', totalPick: '2-3球', resultMainCorrect: true, resultBackupCorrect: false, scoreMainCorrect: true, scoreBackupCorrect: false },
  { id: 'argentina-austria-review', matchId: 'argentina-austria-20260622', homeTeam: 'argentina', awayTeam: 'austria', home: '阿根廷', away: '奥地利', dateText: '6月23日 周二', kickoff: '01:00', group: 'J组', venue: 'Dallas Stadium', endedAtSort: 202606230300, score: '2-0', resultMain: '阿根廷胜', resultBackup: '平局', scoreMain: '2-1', scoreBackup: '1-1', totalPick: '2-3球', resultMainCorrect: true, resultBackupCorrect: false, scoreMainCorrect: false, scoreBackupCorrect: false },
  { id: 'newzealand-egypt-review', matchId: 'newzealand-egypt-20260621', homeTeam: 'newZealand', awayTeam: 'egypt', home: '新西兰', away: '埃及', dateText: '6月22日 周一', kickoff: '09:00', group: 'G组', venue: 'BC Place Vancouver', endedAtSort: 202606221100, score: '1-3', resultMain: '埃及胜', resultBackup: '平局', scoreMain: '1-2', scoreBackup: '1-1', totalPick: '2-3球', resultMainCorrect: true, resultBackupCorrect: false, scoreMainCorrect: false, scoreBackupCorrect: false },
  { id: 'uruguay-caboverde-review', matchId: 'uruguay-caboverde-20260621', homeTeam: 'uruguay', awayTeam: 'caboVerde', home: '乌拉圭', away: '佛得角', dateText: '6月22日 周一', kickoff: '06:00', group: 'H组', venue: 'Miami Stadium', endedAtSort: 202606220800, score: '2-2', resultMain: '乌拉圭胜', resultBackup: '平局', scoreMain: '1-0', scoreBackup: '1-1', totalPick: '1-2球', resultMainCorrect: false, resultBackupCorrect: true, scoreMainCorrect: false, scoreBackupCorrect: false },
  { id: 'belgium-iran-review', matchId: 'belgium-iran-20260621', homeTeam: 'belgium', awayTeam: 'iran', home: '比利时', away: '伊朗', dateText: '6月22日 周一', kickoff: '03:00', group: 'G组', venue: 'Los Angeles Stadium', endedAtSort: 202606220500, score: '0-0', resultMain: '比利时胜', resultBackup: '平局', scoreMain: '2-1', scoreBackup: '1-1', totalPick: '2-3球', resultMainCorrect: false, resultBackupCorrect: true, scoreMainCorrect: false, scoreBackupCorrect: false },
  { id: 'spain-saudi-review', matchId: 'spain-saudi-20260621', homeTeam: 'spain', awayTeam: 'saudi', home: '西班牙', away: '沙特阿拉伯', dateText: '6月22日 周一', kickoff: '00:00', group: 'H组', venue: 'Atlanta Stadium', endedAtSort: 202606220200, score: '4-0', resultMain: '西班牙胜', resultBackup: '', scoreMain: '2-0', scoreBackup: '3-0', totalPick: '2-3球', resultMainCorrect: true, resultBackupCorrect: false, scoreMainCorrect: false, scoreBackupCorrect: false },
  { id: 'tunisia-japan-review', matchId: 'tunisia-japan-20260620', homeTeam: 'tunisia', awayTeam: 'japan', home: '突尼斯', away: '日本', dateText: '6月21日 周日', kickoff: '12:00', group: 'F组', venue: 'Estadio Guadalajara', endedAtSort: 202606211400, score: '0-4', resultMain: '日本胜', resultBackup: '', scoreMain: '0-2', scoreBackup: '1-2', totalPick: '2-3球', resultMainCorrect: true, resultBackupCorrect: false, scoreMainCorrect: false, scoreBackupCorrect: false, retainOnHome: true },
  { id: 'ecuador-curacao-review', matchId: 'ecuador-curacao-20260620', homeTeam: 'ecuador', awayTeam: 'curacao', home: '厄瓜多尔', away: '库拉索', dateText: '6月21日 周日', kickoff: '08:00', group: 'E组', venue: 'Kansas City Stadium', endedAtSort: 202606211000, score: '0-0', resultMain: '厄瓜多尔胜', resultBackup: '', scoreMain: '2-0', scoreBackup: '3-0', totalPick: '2-3球', resultMainCorrect: false, resultBackupCorrect: false, scoreMainCorrect: false, scoreBackupCorrect: false },
  { id: 'germany-ivorycoast-review', matchId: 'germany-ivorycoast-20260620', homeTeam: 'germany', awayTeam: 'ivoryCoast', home: '德国', away: '科特迪瓦', dateText: '6月21日 周日', kickoff: '04:00', group: 'E组', venue: 'Toronto Stadium', endedAtSort: 202606210600, score: '2-1', resultMain: '德国胜', resultBackup: '', scoreMain: '2-1', scoreBackup: '2-0', totalPick: '2-3球', resultMainCorrect: true, resultBackupCorrect: false, scoreMainCorrect: true, scoreBackupCorrect: false },
  { id: 'netherlands-sweden-review', matchId: 'netherlands-sweden-20260620', homeTeam: 'netherlands', awayTeam: 'sweden', home: '荷兰', away: '瑞典', dateText: '6月21日 周日', kickoff: '01:00', group: 'F组', venue: 'Houston Stadium', endedAtSort: 202606210300, score: '5-1', resultMain: '荷兰胜', resultBackup: '平局', scoreMain: '2-1', scoreBackup: '1-1', totalPick: '2-3球', resultMainCorrect: true, resultBackupCorrect: false, scoreMainCorrect: false, scoreBackupCorrect: false },
  { id: 'turkey-paraguay-review', matchId: 'turkey-paraguay-20260619', homeTeam: 'turkey', awayTeam: 'paraguay', home: '土耳其', away: '巴拉圭', dateText: '6月20日 周六', kickoff: '11:00', group: 'D组', venue: 'San Francisco Bay Area Stadium', endedAtSort: 202606201300, score: '0-1', resultMain: '土耳其胜', resultBackup: '平局', scoreMain: '2-1', scoreBackup: '1-1', totalPick: '2-3球', resultMainCorrect: false, resultBackupCorrect: false, scoreMainCorrect: false, scoreBackupCorrect: false },
  { id: 'brazil-haiti-review', matchId: 'brazil-haiti-20260619', homeTeam: 'brazil', awayTeam: 'haiti', home: '巴西', away: '海地', dateText: '6月20日 周六', kickoff: '08:30', group: 'C组', venue: 'Philadelphia Stadium', endedAtSort: 202606201030, score: '3-0', resultMain: '巴西胜', resultBackup: '', scoreMain: '4-0', scoreBackup: '3-0', totalPick: '3-4球', resultMainCorrect: true, resultBackupCorrect: false, scoreMainCorrect: false, scoreBackupCorrect: true },
  { id: 'scotland-morocco-review', matchId: 'scotland-morocco-20260619', homeTeam: 'scotland', awayTeam: 'morocco', home: '苏格兰', away: '摩洛哥', dateText: '6月20日 周六', kickoff: '06:00', group: 'C组', venue: 'Boston Stadium', endedAtSort: 202606200800, score: '0-1', resultMain: '摩洛哥胜', resultBackup: '平局', scoreMain: '0-1', scoreBackup: '1-1', totalPick: '1-2球', resultMainCorrect: true, resultBackupCorrect: false, scoreMainCorrect: true, scoreBackupCorrect: false },
  { id: 'usa-australia-review', matchId: 'usa-australia-20260619', homeTeam: 'usa', awayTeam: 'australia', home: '美国', away: '澳大利亚', dateText: '6月20日 周六', kickoff: '03:00', group: 'D组', venue: 'Seattle Stadium', endedAtSort: 202606200500, score: '2-0', resultMain: '美国胜', resultBackup: '', scoreMain: '2-1', scoreBackup: '2-0', totalPick: '2-3球', resultMainCorrect: true, resultBackupCorrect: false, scoreMainCorrect: false, scoreBackupCorrect: true },
  { id: 'mexico-korea-review', matchId: 'mexico-korea-20260618', homeTeam: 'mexico', awayTeam: 'korea', home: '墨西哥', away: '韩国', dateText: '6月19日 周五', kickoff: '09:00', group: 'A组', venue: 'Estadio Guadalajara', endedAtSort: 202606191100, score: '1-0', resultMain: '墨西哥胜', resultBackup: '平局', scoreMain: '2-1', scoreBackup: '1-1', totalPick: '2-3球', resultMainCorrect: true, resultBackupCorrect: false, scoreMainCorrect: false, scoreBackupCorrect: false },
  { id: 'canada-qatar-review', matchId: 'canada-qatar-20260618', homeTeam: 'canada', awayTeam: 'qatar', home: '加拿大', away: '卡塔尔', dateText: '6月19日 周五', kickoff: '06:00', group: 'B组', venue: 'BC Place Vancouver', endedAtSort: 202606190800, score: '6-0', resultMain: '加拿大胜', resultBackup: '', scoreMain: '2-1', scoreBackup: '2-0', totalPick: '2-3球', resultMainCorrect: true, resultBackupCorrect: false, scoreMainCorrect: false, scoreBackupCorrect: false },
  { id: 'switzerland-bosnia-review', matchId: 'switzerland-bosnia-20260618', homeTeam: 'switzerland', awayTeam: 'bosnia', home: '瑞士', away: '波黑', dateText: '6月19日 周五', kickoff: '03:00', group: 'B组', venue: 'Los Angeles Stadium', endedAtSort: 202606190500, score: '4-1', resultMain: '瑞士胜', resultBackup: '', scoreMain: '1-0', scoreBackup: '2-0', totalPick: '1-2球', resultMainCorrect: true, resultBackupCorrect: false, scoreMainCorrect: false, scoreBackupCorrect: false },
  { id: 'czechia-southafrica-review', matchId: 'czechia-southafrica-20260618', homeTeam: 'czechia', awayTeam: 'southAfrica', home: '捷克', away: '南非', dateText: '6月19日 周五', kickoff: '00:00', group: 'A组', venue: 'Atlanta Stadium', endedAtSort: 202606190200, score: '1-1', resultMain: '捷克胜', resultBackup: '平局', scoreMain: '2-1', scoreBackup: '1-1', totalPick: '2-3球', resultMainCorrect: false, resultBackupCorrect: true, scoreMainCorrect: false, scoreBackupCorrect: true },
  { id: 'uzbekistan-colombia-review', matchId: 'uzbekistan-colombia-20260617', homeTeam: 'uzbekistan', awayTeam: 'colombia', home: '乌兹别克斯坦', away: '哥伦比亚', dateText: '6月18日 周四', kickoff: '10:00', group: 'K组', venue: 'Mexico City Stadium', endedAtSort: 202606181200, score: '1-3', resultMain: '哥伦比亚胜', resultBackup: '', scoreMain: '0-2', scoreBackup: '1-2', totalPick: '2-3球', resultMainCorrect: true, resultBackupCorrect: false, scoreMainCorrect: false, scoreBackupCorrect: false },
  { id: 'ghana-panama-review', matchId: 'ghana-panama-20260617', homeTeam: 'ghana', awayTeam: 'panama', home: '加纳', away: '巴拿马', dateText: '6月18日 周四', kickoff: '07:00', group: 'J组', venue: 'Miami Stadium', endedAtSort: 202606180900, score: '1-0', resultMain: '加纳胜', resultBackup: '平局', scoreMain: '2-1', scoreBackup: '1-1', totalPick: '2-3球', resultMainCorrect: true, resultBackupCorrect: false, scoreMainCorrect: false, scoreBackupCorrect: false },
  { id: 'england-croatia-review', matchId: 'england-croatia-20260617', homeTeam: 'england', awayTeam: 'croatia', home: '英格兰', away: '克罗地亚', dateText: '6月18日 周四', kickoff: '04:00', group: 'L组', venue: 'Dallas Stadium', endedAtSort: 202606180600, score: '4-2', resultMain: '英格兰胜', resultBackup: '平局', scoreMain: '2-1', scoreBackup: '1-1', totalPick: '2-3球', resultMainCorrect: true, resultBackupCorrect: false, scoreMainCorrect: false, scoreBackupCorrect: false },
  { id: 'portugal-congodr-review', matchId: 'portugal-congodr-20260617', homeTeam: 'portugal', awayTeam: 'congoDr', home: '葡萄牙', away: '刚果民主共和国', dateText: '6月18日 周四', kickoff: '01:00', group: 'K组', venue: 'Houston Stadium', endedAtSort: 202606180300, score: '1-1', resultMain: '葡萄牙胜', resultBackup: '', scoreMain: '3-1', scoreBackup: '2-0', totalPick: '3-4球', resultMainCorrect: false, resultBackupCorrect: false, scoreMainCorrect: false, scoreBackupCorrect: false },
  { id: 'austria-jordan-review', matchId: 'austria-jordan-20260616', homeTeam: 'austria', awayTeam: 'jordan', home: '奥地利', away: '约旦', dateText: '6月17日 周三', kickoff: '12:00', group: 'I组', venue: 'Seattle Stadium', endedAtSort: 202606171400, score: '3-1', resultMain: '奥地利胜', resultBackup: '', scoreMain: '3-1', scoreBackup: '2-0', totalPick: '3-4球', resultMainCorrect: true, resultBackupCorrect: false, scoreMainCorrect: true, scoreBackupCorrect: false },
  { id: 'argentina-algeria-review', matchId: 'argentina-algeria-20260616', homeTeam: 'argentina', awayTeam: 'algeria', home: '阿根廷', away: '阿尔及利亚', dateText: '6月17日 周三', kickoff: '09:00', group: 'I组', venue: 'San Francisco Bay Area Stadium', endedAtSort: 202606171100, score: '3-0', resultMain: '阿根廷胜', resultBackup: '', scoreMain: '2-0', scoreBackup: '2-1', totalPick: '2-3球', resultMainCorrect: true, resultBackupCorrect: false, scoreMainCorrect: false, scoreBackupCorrect: false },
  { id: 'iraq-norway-review', matchId: 'iraq-norway-20260616', homeTeam: 'iraq', awayTeam: 'norway', home: '伊拉克', away: '挪威', dateText: '6月17日 周三', kickoff: '06:00', group: 'J组', venue: 'Kansas City Stadium', endedAtSort: 202606170800, score: '1-4', resultMain: '挪威胜', resultBackup: '', scoreMain: '0-2', scoreBackup: '1-2', totalPick: '2-3球', resultMainCorrect: true, resultBackupCorrect: false, scoreMainCorrect: false, scoreBackupCorrect: false },
  { id: 'france-senegal-review', matchId: 'france-senegal-20260616', homeTeam: 'france', awayTeam: 'senegal', home: '法国', away: '塞内加尔', dateText: '6月17日 周三', kickoff: '03:00', group: 'J组', venue: 'New York New Jersey Stadium', endedAtSort: 202606170500, score: '3-1', resultMain: '法国胜', resultBackup: '', scoreMain: '2-0', scoreBackup: '2-1', totalPick: '2-3球', resultMainCorrect: true, resultBackupCorrect: false, scoreMainCorrect: false, scoreBackupCorrect: false },
  { id: 'iran-newzealand-review', matchId: 'iran-newzealand-20260615', homeTeam: 'iran', awayTeam: 'newZealand', home: '伊朗', away: '新西兰', dateText: '6月16日 周二', kickoff: '09:00', group: 'G组', venue: 'Los Angeles Stadium', endedAtSort: 202606161100, score: '2-2', resultMain: '伊朗胜', resultBackup: '', scoreMain: '1-0', scoreBackup: '2-0', totalPick: '1-2球', resultMainCorrect: false, resultBackupCorrect: false, scoreMainCorrect: false, scoreBackupCorrect: false },
  { id: 'saudi-uruguay-review', matchId: 'saudi-uruguay-20260615', homeTeam: 'saudi', awayTeam: 'uruguay', home: '沙特阿拉伯', away: '乌拉圭', dateText: '6月16日 周二', kickoff: '06:00', group: 'H组', venue: 'Miami Stadium', endedAtSort: 202606160800, score: '1-1', resultMain: '乌拉圭胜', resultBackup: '', scoreMain: '1-3', scoreBackup: '0-2', totalPick: '3-4球', resultMainCorrect: false, resultBackupCorrect: false, scoreMainCorrect: false, scoreBackupCorrect: false },
  { id: 'belgium-egypt-review', matchId: 'belgium-egypt-20260615', homeTeam: 'belgium', awayTeam: 'egypt', home: '比利时', away: '埃及', dateText: '6月16日 周二', kickoff: '03:00', group: 'G组', venue: 'Philadelphia Stadium', endedAtSort: 202606160500, score: '1-1', resultMain: '比利时胜', resultBackup: '', scoreMain: '2-1', scoreBackup: '2-0', totalPick: '2-3球', resultMainCorrect: false, resultBackupCorrect: false, scoreMainCorrect: false, scoreBackupCorrect: false },
  { id: 'spain-caboverde-review', matchId: 'spain-caboverde-20260615', homeTeam: 'spain', awayTeam: 'caboVerde', home: '西班牙', away: '佛得角', dateText: '6月16日 周二', kickoff: '00:00', group: 'H组', venue: 'Atlanta Stadium', endedAtSort: 202606160200, score: '0-0', resultMain: '西班牙胜', resultBackup: '', scoreMain: '2-0', scoreBackup: '3-0', totalPick: '2-3球', resultMainCorrect: false, resultBackupCorrect: false, scoreMainCorrect: false, scoreBackupCorrect: false },
  { id: 'sweden-tunisia-review', matchId: 'sweden-tunisia-20260614', homeTeam: 'sweden', awayTeam: 'tunisia', home: '瑞典', away: '突尼斯', dateText: '6月15日 周一', kickoff: '10:00', group: 'F组', venue: 'Estadio Monterrey', endedAtSort: 202606151200, score: '5-1', resultMain: '瑞典小胜', resultBackup: '', scoreMain: '1-0', scoreBackup: '1-1', totalPick: '1-2球', resultMainCorrect: true, resultBackupCorrect: false, scoreMainCorrect: false, scoreBackupCorrect: false },
  { id: 'ivorycoast-ecuador-review', matchId: 'ivorycoast-ecuador-20260614', homeTeam: 'ivoryCoast', awayTeam: 'ecuador', home: '科特迪瓦', away: '厄瓜多尔', dateText: '6月15日 周一', kickoff: '07:00', group: 'E组', venue: 'Philadelphia Stadium', endedAtSort: 202606150900, score: '1-0', resultMain: '平局', resultBackup: '科特迪瓦胜', scoreMain: '1-1', scoreBackup: '2-1', resultMainCorrect: false, resultBackupCorrect: true, scoreMainCorrect: false, scoreBackupCorrect: false },
  { id: 'netherlands-japan-review', matchId: 'netherlands-japan-20260614', homeTeam: 'netherlands', awayTeam: 'japan', home: '荷兰', away: '日本', dateText: '6月15日 周一', kickoff: '04:00', group: 'F组', venue: 'Dallas Stadium', endedAtSort: 202606150600, score: '2-2', resultMain: '荷兰胜', resultBackup: '', scoreMain: '2-1', scoreBackup: '1-1', resultMainCorrect: false, resultBackupCorrect: false, scoreMainCorrect: false, scoreBackupCorrect: false },
  { id: 'germany-curacao-review', matchId: 'germany-curacao-20260614', homeTeam: 'germany', awayTeam: 'curacao', home: '德国', away: '库拉索', dateText: '6月15日 周一', kickoff: '01:00', group: 'E组', venue: 'Houston Stadium', endedAtSort: 202606150300, score: '7-1', resultMain: '德国胜', resultBackup: '', scoreMain: '3-0', scoreBackup: '2-0', resultMainCorrect: true, resultBackupCorrect: false, scoreMainCorrect: false, scoreBackupCorrect: false },
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

function getScoreTotal(score) {
  const parts = String(score || '').split('-').map((item) => Number(item))
  if (parts.length !== 2 || parts.some(Number.isNaN)) return null
  return parts[0] + parts[1]
}

function parseTotalRange(totalText) {
  const text = String(totalText || '')
  const rangeMatch = text.match(/(\d+)\s*-\s*(\d+)/)
  if (rangeMatch) {
    return { min: Number(rangeMatch[1]), max: Number(rangeMatch[2]) }
  }
  const singleMatch = text.match(/(\d+)/)
  if (singleMatch) {
    const value = Number(singleMatch[1])
    return { min: value, max: value }
  }
  return null
}

function isTotalCorrect(score, totalText) {
  const actualTotal = getScoreTotal(score)
  const range = parseTotalRange(totalText)
  if (actualTotal === null || !range) return false
  return actualTotal >= range.min && actualTotal <= range.max
}

function inferTotalPickFromScores(scoreMain, scoreBackup) {
  const totals = [getScoreTotal(scoreMain), getScoreTotal(scoreBackup)].filter((value) => value !== null)
  if (!totals.length) return ''
  const min = Math.min.apply(Math, totals)
  const max = Math.max.apply(Math, totals)
  return min === max ? `${min}球` : `${min}-${max}球`
}

function formatPercentValue(value) {
  return Number.isInteger(value) ? `${value}%` : `${value.toFixed(1)}%`
}

function getShortResult(result, homeName, awayName) {
  const text = String(result || '')
  if (!text) return ''
  if (text.includes('平')) return '平'
  if (homeName && text.includes(homeName)) return '胜'
  if (awayName && text.includes(awayName)) return '负'
  if (text.includes('主胜')) return '胜'
  if (text.includes('客胜')) return '负'
  if (text.includes('胜')) return '胜'
  return text
}

function formatReviewResult(main, backup, homeName, awayName) {
  const mainText = getShortResult(main, homeName, awayName)
  const backupText = getShortResult(backup, homeName, awayName)
  return `${mainText}${backupText ? `（${backupText}）` : ''}`
}

function formatReviewScore(main, backup) {
  return `${main || ''}${backup ? `（${backup}）` : ''}`
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
  const sourceMatch = matches.find((match) => match.id === item.matchId)
  const totalPick = item.totalPick || (sourceMatch && sourceMatch.pick && sourceMatch.pick.total) || inferTotalPickFromScores(item.scoreMain, item.scoreBackup)
  const resultWeight = getPredictionWeight(item.resultMainCorrect, item.resultBackupCorrect)
  const scoreWeight = getPredictionWeight(item.scoreMainCorrect, item.scoreBackupCorrect)
  const totalCorrect = typeof item.totalCorrect === 'boolean' ? item.totalCorrect : isTotalCorrect(item.score, totalPick)
  const percentValue = resultWeight * 0.375 + scoreWeight * 0.375 + (totalCorrect ? 100 : 0) * 0.25
  return Object.assign({}, item, {
    totalPick,
    totalCorrect,
    resultMainShort: getShortResult(item.resultMain, item.home, item.away),
    resultBackupShort: getShortResult(item.resultBackup, item.home, item.away),
    resultDisplay: formatReviewResult(item.resultMain, item.resultBackup, item.home, item.away),
    scoreDisplay: formatReviewScore(item.scoreMain, item.scoreBackup),
    resultMainClass: item.resultMainCorrect ? 'review-ok' : 'review-bad',
    resultBackupClass: item.resultBackupCorrect ? 'review-ok' : 'review-bad',
    scoreMainClass: item.scoreMainCorrect ? 'review-ok' : 'review-bad',
    scoreBackupClass: item.scoreBackupCorrect ? 'review-ok' : 'review-bad',
    totalClass: totalCorrect ? 'review-ok' : 'review-bad',
    percentValue,
    percent: formatPercentValue(percentValue),
    percentLevel: getPercentLevel(percentValue),
    endedAtMs: sortKeyToLocalMs(item.endedAtSort)
  })
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

const upcomingMatches = matches
  .filter((match) => !match.isFinished)
  .slice()
  .sort((a, b) => a.sortTime - b.sortTime)
const recentFinishedHomeMatches = finishedMatches.filter((review) => {
  if (!review.retainOnHome || !review.endedAtMs) return false
  return Date.now() - review.endedAtMs <= 60 * 60 * 1000
}).slice(0, 10).map((review) => {
  const match = matches.find((item) => item.id === review.matchId) || makeHistoryFallback(review)
  return match && Object.assign({}, match, { matchStatus: 'finished', statusText: '完赛', liveScore: review.score, phaseText: '全场结束', finishDetectedAt: review.endedAtMs, review })
}).filter(Boolean)
const historyMatches = finishedMatches.map((review) => {
  const match = matches.find((item) => item.id === review.matchId) || makeHistoryFallback(review)
  return match && Object.assign({}, match, { review })
}).filter(Boolean).slice(0, 10)
const reviewSuccessValue = finishedMatches.length ? finishedMatches.reduce((sum, item) => {
  const value = item.percentValue !== undefined && item.percentValue !== null ? item.percentValue : parseFloat(item.percent)
  return sum + Number(value || 0)
}, 0) / finishedMatches.length : 0
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
