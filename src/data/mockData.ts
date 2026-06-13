import type { Manuscript, Annotation } from '@/types';

const sampleContents: Record<string, string[]> = {
  ch1: [
    '暮色四合，远山如黛。江南的春雨总是这般缠绵，淅淅沥沥地落了三日未歇。青石板路上积起浅浅水洼，倒映着两侧白墙黛瓦的朦胧轮廓。沈砚之撑着一把油纸伞，独自走在这条熟悉的巷子里，鞋尖溅起细碎的水花。\n\n他刚从城外的栖霞寺回来，袖中藏着一封素笺，那是他的恩师、前朝大儒周怀远先生的绝笔。信上说，先生自知时日无多，有一部未竟的手稿托付于他，要他务必寻得一位有缘人传下去。至于这手稿藏在何处，信中却只字未提，只附了半首残诗："烟雨锁重楼，墨香绕指柔。"',
    '巷子尽头是一座久已荒废的老宅，门楣上斑驳的"沈府"二字依稀可辨。这里曾是江南最负盛名的藏书楼所在地，百年前一场大火之后，便只剩下这满目疮痍。沈砚之站在门前，看着那把生了锈的铜锁，忽然觉得那半首诗似乎在指引着什么。\n\n雨丝斜斜地打在他的脸上，冰凉入骨。他伸手抚过那两个字，指腹传来凹凸不平的触感。就在这时，身后传来一阵清脆的马蹄声，打破了巷子里的宁静。',
  ],
  ch2: [
    '沈砚之回头，只见一辆青布马车停在巷口，车帘掀开，露出一张清丽绝俗的面庞来。那女子约莫二十出头，一身素色襦裙，头上只简单挽了个双丫髻，插着一支白玉簪，衬得眉目如画，不染纤尘。\n\n"敢问公子，此处可是沈府？"她的声音如黄莺出谷，清润动听。沈砚之点头："正是。姑娘是？"女子微微一笑，从车中取出一个锦盒："奴家姓苏，名云舒，奉家师之命，来寻沈家后人。"',
    '苏云舒的师父是江湖上赫赫有名的"书隐"，据说此人学识渊博，却行踪不定，三十年前忽然销声匿迹，再无人见过。沈砚之心中一动，将她让进宅中。院子里的海棠开得正盛，落了一地花瓣，苏云舒踩着那些花瓣走过，裙摆翻飞，恍若画中人。\n\n"家师说，沈家藏书楼虽毁，但真正的宝物从未遗失。"苏云舒将锦盒打开，里面是一枚古朴的玉佩，"这枚同心佩，便是开启宝藏的钥匙。"',
  ],
  ch3: [
    '沈砚之接过玉佩，触手温润，上面刻着极为精细的云纹，中间有一个极小的篆字——"砚"。他心中一震，这不正是他名字里的字吗？\n\n"这......"他抬起头，看向苏云舒。后者点头道："家师与沈家颇有渊源，说若有朝一日沈氏后人得见此物，便知一切。"两人相视片刻，心中都升起一种奇异的感觉，仿佛冥冥之中，早有定数。\n\n当夜，雨停了，一轮明月挂在中天，清辉洒遍庭院。沈砚之带着苏云舒来到后院那口早已干涸的古井旁。',
    '"藏书楼失火之日，我祖父曾将一批重要的东西沉入井底。"沈砚之说着，从袖中取出火折子点亮，照向井中。井水早已干涸，井壁上长满了青苔，但借着月光，隐约可见井底似有一扇石门。苏云舒凑近一看，石门上赫然有一个与玉佩形状完全吻合的凹槽。',
  ],
  ch4: [
    '沈砚之将玉佩嵌入凹槽，只听"咔哒"一声，石门缓缓开启，露出一条向下延伸的石阶。两人举着火折子，小心翼翼地走了下去。\n\n石阶尽头是一间石室，四壁嵌着夜明珠，将室内照得亮如白昼。石室中央摆着一张紫檀木案，案上整齐地码放着数十卷古籍，旁边还有一只锦盒。沈砚之走上前，拿起最上面的一卷，扉页上写着"怀远遗稿"四字——正是周先生信中提到的那部手稿！',
    '他又打开旁边的锦盒，里面是一叠泛黄的信札和一枚印章。信札是沈氏先祖留下的，详细记载了藏书楼的秘密。原来当年沈家先祖为躲避战乱，将所有珍贵典籍都藏于此处，又在地面建了一座假的藏书楼掩人耳目。\n\n苏云舒拿起那枚印章，翻过来一看，底部刻着"墨香传家"四字，字体遒劲有力，古朴雅致。"这下，周先生的遗愿可以完成了。"沈砚之轻声道，眼中满是感慨。',
  ],
};

function makeChapters(manuscriptId: string) {
  const chapterTitles = ['第一章 烟雨江南', '第二章 故人来访', '第三章 古井探秘', '第四章 墨香传世'];
  return chapterTitles.map((title, idx) => {
    const key = `ch${idx + 1}`;
    const pages = sampleContents[key];
    const chapterId = `${manuscriptId}-ch${idx + 1}`;
    return {
      id: chapterId,
      manuscriptId,
      title,
      order: idx + 1,
      pages: pages.map((content, pIdx) => ({
        id: `${chapterId}-p${pIdx + 1}`,
        chapterId,
        pageNumber: pIdx + 1,
        content,
      })),
    };
  });
}

export const mockManuscripts: Manuscript[] = [
  (() => {
    const id = 'ms-001';
    const chapters = makeChapters(id);
    const totalPages = chapters.reduce((sum, c) => sum + c.pages.length, 0);
    return {
      id,
      title: '墨香传',
      author: '周怀远',
      status: 'in_progress',
      totalPages,
      reviewedPages: 3,
      chapters,
      createdAt: '2026-05-20T10:30:00Z',
      updatedAt: '2026-06-10T15:42:00Z',
    };
  })(),
  (() => {
    const id = 'ms-002';
    const chapters = makeChapters(id);
    const totalPages = chapters.reduce((sum, c) => sum + c.pages.length, 0);
    return {
      id,
      title: '山水志',
      author: '林清源',
      status: 'pending',
      totalPages,
      reviewedPages: 0,
      chapters,
      createdAt: '2026-06-01T09:15:00Z',
      updatedAt: '2026-06-01T09:15:00Z',
    };
  })(),
  (() => {
    const id = 'ms-003';
    const chapters = makeChapters(id);
    const totalPages = chapters.reduce((sum, c) => sum + c.pages.length, 0);
    return {
      id,
      title: '星辰录',
      author: '慕容紫英',
      status: 'completed',
      totalPages,
      reviewedPages: totalPages,
      chapters,
      createdAt: '2026-04-15T14:00:00Z',
      updatedAt: '2026-05-28T11:20:00Z',
    };
  })(),
  (() => {
    const id = 'ms-004';
    const chapters = makeChapters(id);
    const totalPages = chapters.reduce((sum, c) => sum + c.pages.length, 0);
    return {
      id,
      title: '沧海遗珠',
      author: '谢灵韵',
      status: 'in_progress',
      totalPages,
      reviewedPages: 4,
      chapters,
      createdAt: '2026-05-28T16:45:00Z',
      updatedAt: '2026-06-12T08:30:00Z',
    };
  })(),
];

const ms001ch1p1 = 'ms-001-ch1-p1';
const ms001ch1p2 = 'ms-001-ch1-p2';
const ms001ch2p1 = 'ms-001-ch2-p1';

export const mockAnnotations: Annotation[] = [
  {
    id: 'ann-001',
    pageId: ms001ch1p1,
    chapterId: 'ms-001-ch1',
    manuscriptId: 'ms-001',
    type: 'text_error',
    content: '\"了三日未歇\"搭配稍显生硬，建议改为\"淅淅沥沥落了三日方歇\"或\"连绵三日未歇\"。',
    highlightedText: '淅淅沥沥地落了三日未歇',
    startOffset: 18,
    endOffset: 30,
    createdAt: '2026-06-05T09:12:00Z',
    updatedAt: '2026-06-05T09:12:00Z',
  },
  {
    id: 'ann-002',
    pageId: ms001ch1p1,
    chapterId: 'ms-001-ch1',
    manuscriptId: 'ms-001',
    type: 'content_question',
    content: '栖霞寺与后文藏书楼有何关联？此处伏笔是否过于隐晦？建议在后续章节有所呼应。',
    highlightedText: '他刚从城外的栖霞寺回来',
    startOffset: 96,
    endOffset: 110,
    createdAt: '2026-06-05T09:30:00Z',
    updatedAt: '2026-06-05T09:30:00Z',
  },
  {
    id: 'ann-003',
    pageId: ms001ch1p2,
    chapterId: 'ms-001-ch1',
    manuscriptId: 'ms-001',
    type: 'format_issue',
    content: '段落过渡过于突兀，建议在两段之间加入简短的环境描写或人物动作过渡，使叙事节奏更自然。',
    highlightedText: '雨丝斜斜地打在他的脸上',
    startOffset: 0,
    endOffset: 12,
    createdAt: '2026-06-06T10:05:00Z',
    updatedAt: '2026-06-06T10:05:00Z',
  },
  {
    id: 'ann-004',
    pageId: ms001ch2p1,
    chapterId: 'ms-001-ch2',
    manuscriptId: 'ms-001',
    type: 'text_error',
    content: '\"清丽绝俗\"后\"的面庞来\"显得冗余，建议删去\"来\"字，或改为\"一张清丽绝俗的面庞\"。',
    highlightedText: '露出一张清丽绝俗的面庞来',
    startOffset: 42,
    endOffset: 57,
    createdAt: '2026-06-08T14:22:00Z',
    updatedAt: '2026-06-08T14:22:00Z',
  },
  {
    id: 'ann-005',
    pageId: ms001ch2p1,
    chapterId: 'ms-001-ch2',
    manuscriptId: 'ms-001',
    type: 'format_issue',
    content: '人物外貌描写与动作描写之间缺少自然过渡，建议在\"插着一支白玉簪\"后增加人物神态描写。',
    highlightedText: '插着一支白玉簪，衬得眉目如画，不染纤尘',
    startOffset: 95,
    endOffset: 117,
    createdAt: '2026-06-08T14:45:00Z',
    updatedAt: '2026-06-08T14:45:00Z',
  },
  {
    id: 'ann-006',
    pageId: ms001ch1p1,
    chapterId: 'ms-001-ch1',
    manuscriptId: 'ms-001',
    type: 'content_question',
    content: '周怀远先生的身份背景在开篇便提及为"前朝大儒"，但后文是否需要补充其与主角的师承渊源？否则"绝笔托付"这一情节的情感分量稍显不足。',
    highlightedText: '那是他的恩师、前朝大儒周怀远先生的绝笔',
    startOffset: 130,
    endOffset: 154,
    createdAt: '2026-06-09T11:00:00Z',
    updatedAt: '2026-06-09T11:00:00Z',
  },
];

export function loadInitialData(): { manuscripts: Manuscript[]; annotations: Annotation[] } {
  try {
    const storedM = localStorage.getItem('manuscripts');
    const storedA = localStorage.getItem('annotations');
    return {
      manuscripts: storedM ? JSON.parse(storedM) : mockManuscripts,
      annotations: storedA ? JSON.parse(storedA) : mockAnnotations,
    };
  } catch {
    return { manuscripts: mockManuscripts, annotations: mockAnnotations };
  }
}
