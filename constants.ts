
import React from 'react';
import { AppState, DiagnosisQuestion, HollandTypeInfo, SrlChallengeInfo, TabId } from './types';
import * as Icons from './components/icons';

export const STORAGE_KEY = 'studyverse_app_state_v1';

export const initialAppState: AppState = {
    user: { nickname: '학생', aiCredits: 10 },
    diagnosis: { holland: null, srl: null },
    planner: {
        date: new Date().toISOString().split('T')[0],
        goal: '',
        todos: [],
        dday: '',
        rating: 0,
    },
    vision: null,
    roadmap: null,
    records: [],
    literacy: []
};

export const DIAGNOSIS_DATA: { holland: DiagnosisQuestion[], srl: DiagnosisQuestion[] } = {
    holland: [
      {id: "R1", domain: "HOLLAND", scale: "R", text: "새 기구나 도구를 받으면 직접 만져 보면서 어떻게 작동하는지 알아보고 싶다."},
      {id: "R2", domain: "HOLLAND", scale: "R", text: "고장이나 문제를 보면 손으로 고쳐보거나 해결 방법을 시도해보고 싶다."},
      {id: "R3", domain: "HOLLAND", scale: "R", text: "실습, 실험, 만들기 활동에서 준비부터 정리까지 참여하는 편이다."},
      {id: "I1", domain: "HOLLAND", scale: "I", text: "새로운 정보를 보면 왜 그런지 이유를 찾아보고 싶다."},
      {id: "I2", domain: "HOLLAND", scale: "I", text: "정답보다 과정과 원리를 이해하는 것이 더 중요하다."},
      {id: "I3", domain: "HOLLAND", scale: "I", text: "자료를 여러 개 찾아 비교한 뒤 내 결론을 내리는 편이다."},
      {id: "A1", domain: "HOLLAND", scale: "A", text: "과제에서 정해진 방식보다 나만의 방식으로 표현하고 싶다."},
      {id: "A2", domain: "HOLLAND", scale: "A", text: "음악, 영상, 그림 같은 작품을 보고 내 느낌을 표현해보고 싶다."},
      {id: "A3", domain: "HOLLAND", scale: "A", text: "일상에서 떠오른 아이디어를 기록하거나 만들어 본 적이 자주 있다."},
      {id: "S1", domain: "HOLLAND", scale: "S", text: "친구 고민을 들으면 구체적으로 도와주거나 함께 해결해주고 싶다."},
      {id: "S2", domain: "HOLLAND", scale: "S", text: "모둠 활동에서 분위기를 맞추거나 갈등을 조정하는 역할을 하는 편이다."},
      {id: "S3", domain: "HOLLAND", scale: "S", text: "누군가 도움이 필요해 보이면 먼저 다가가서 돕는 편이다."},
      {id: "E1", domain: "HOLLAND", scale: "E", text: "팀에서 목표와 역할을 정하고 진행을 이끄는 편이다."},
      {id: "E2", domain: "HOLLAND", scale: "E", text: "내 의견을 설득해서 실제로 실행에 옮긴 경험이 있다."},
      {id: "E3", domain: "HOLLAND", scale: "E", text: "도전 과제에서 성과를 내고 싶다는 마음이 에너지가 된다."},
      {id: "C1", domain: "HOLLAND", scale: "C", text: "시작 전에 체크리스트나 순서를 정하면 마음이 편하다."},
      {id: "C2", domain: "HOLLAND", scale: "C", text: "자료 정리나 숫자/표를 정확히 맞추는 일이 잘 맞는다."},
      {id: "C3", domain: "HOLLAND", scale: "C", text: "규칙이나 매뉴얼을 따르면 실수가 줄어든다고 느낀다."}
    ],
    srl: [
      {id: "TM1", domain: "SRL", scale: "TM", text: "과제가 여러 개면 먼저 필요한 시간을 대략 잡고 우선순위를 정한다."},
      {id: "TM2", domain: "SRL", scale: "TM", text: "마감이 긴 과제는 중간 마감(중간 목표)을 따로 잡는다."},
      {id: "TM3", domain: "SRL", scale: "TM", text: "계획이 어긋나면 실제 걸린 시간을 보고 다음 계획을 고친다."},
      {id: "TM4", domain: "SRL", scale: "TM", text: "공부할 때 시간을 확인하거나 타이머를 쓰는 편이다."},
      {id: "EN1", domain: "SRL", scale: "EN", text: "공부할 때 스마트폰, 알림, SNS 같은 방해를 줄이기 위해 조치를 한다."},
      {id: "EN2", domain: "SRL", scale: "EN", text: "집중 잘 되는 장소나 환경을 알고 상황에 맞게 고른다."},
      {id: "EN3", domain: "SRL", scale: "EN", text: "막히면 누구에게, 어떻게 도움을 요청할지 알고 실제로 한다."},
      {id: "EN4", domain: "SRL", scale: "EN", text: "참고서, 앱, 인강 등 학습 도구를 비교해서 내게 맞는 걸 고른다."},
      {id: "SE1", domain: "SRL", scale: "SE", text: "틀린 문제는 왜 틀렸는지 원인을 나눠서 생각한다."},
      {id: "SE2", domain: "SRL", scale: "SE", text: "공부한 내용을 다른 사람에게 설명할 수 있는지로 이해도를 점검한다."},
      {id: "SE3", domain: "SRL", scale: "SE", text: "과목에 따라 공부 방법을 바꾸는 편이다."},
      {id: "SE4", domain: "SRL", scale: "SE", text: "피드백을 들으면 내 판단과 비교해 무엇을 바꿀지 결정한다."}
    ]
};

export const HOLLAND_TYPE_DB: { [key: string]: HollandTypeInfo } = {
    "EC": { 
      name: "실행력 있는 기업형", 
      traits: ["실행", "추진", "결과", "성취"],
      strength: "목표를 빠르게 실행하고 결과를 내는 능력", 
      challenge: "장기적 계획이나 이론적 분석",
      careers: ["프로젝트매니저", "운영관리자", "프랜차이즈오너"], 
      actions: ["학교 행사 기획", "단기 목표 달성", "프로젝트 도구 사용"],
      tip: "목표를 작은 단위로 나누고, 성취감을 느끼며 학습하면 효과적입니다."
    },
    "RI": { 
      name: "실용적 탐구형", 
      traits: ["분석", "도구", "논리", "해결"],
      strength: "기술적 문제를 논리적으로 분석하고 해결하는 능력", 
      challenge: "협업 및 커뮤니케이션 능력",
      careers: ["데이터과학자", "시스템 엔지니어", "생명공학자"], 
      actions: ["실험 보고서 작성", "코딩 배우기", "기계 분해조립"],
      tip: "이론을 학습한 후, 반드시 실제 예제나 실험을 통해 원리를 체득하는 것이 중요합니다."
    },
    "DEFAULT": { 
      name: "융합형 인재", 
      traits: ["융합", "호기심", "잠재력", "적응"],
      strength: "다양한 분야에 호기심을 가지고 자신만의 길을 개척하는 잠재력", 
      challenge: "다양한 관심사를 하나로 모으는 것",
      careers: ["콘텐츠 기획자", "스타트업 창업가"], 
      actions: ["다양한 분야 독서", "직업인 인터뷰", "창의 프로젝트"],
      tip: "다양한 분야를 연결하며 자신만의 학습 지도를 그려나가는 것이 좋습니다."
    }
};

export const SRL_CHALLENGE_DB: { [key: string]: SrlChallengeInfo } = {
    "TM": {
      name: "시간 관리",
      problem: "할 일은 많은데 우선순위를 정하기 어렵거나 마감을 미루는 경향이 있습니다.",
      goal: "현실적인 시간 계획을 수립하고 실천합니다.",
      challenges: [
        { day: 1, title: "할 일 우선순위", mission: "내일 할 일 적고 별표 3개 선택", why: "중요한 일 집중", status: "미완료" },
        { day: 2, title: "집중 시간", mission: "포모도로 기법 4회", why: "집중력 유지", status: "미완료" },
        { day: 3, title: "자투리 시간", mission: "10분 활용해 단어 암기", why: "시간 효율", status: "미완료" }
      ]
    },
    "EN": {
      name: "환경 관리",
      problem: "주변 환경에 쉽게 영향받아 집중이 흐트러뜹니다.",
      goal: "최적화된 학습 환경을 만듭니다.",
      challenges: [
        { day: 1, title: "공간 진단", mission: "방해 요소 5가지 찾기", why: "환경이 집중력 결정", status: "미완료" },
        { day: 2, title: "책상 정리", mission: "필수품 3개만 남기기", why: "시각 혼란 제거", status: "미완료" },
        { day: 3, title: "디지털 격리", mission: "스마트폰 멀리 두기", why: "디지털 디톡스", status: "미완료" }
      ]
    },
    "SE": {
      name: "자기 평가",
      problem: "공부량에 비해 성적이 오르지 않습니다.",
      goal: "메타인지 능력을 강화합니다.",
      challenges: [
        { day: 1, title: "백지 복습", mission: "기억나는 내용 적기", why: "이해도 확인", status: "미완료" },
        { day: 2, title: "선생님 놀이", mission: "개념 설명하기", why: "지식 구조화", status: "미완료" },
        { day: 3, title: "오답 분석", mission: "실수 패턴 찾기", why: "반복 방지", status: "미완료" }
      ]
    }
};

export const navItems: { id: TabId; icon: React.ElementType; label: string }[] = [
    { id: 'home', icon: Icons.Home, label: '홈' },
    { id: 'diagnosis', icon: Icons.Brain, label: '진단' },
    { id: 'planner', icon: Icons.CalendarCheck, label: '플래너' },
    { id: 'roadmap', icon: Icons.Map, label: '로드맵' },
    { id: 'records', icon: Icons.FolderOpen, label: '기록' },
    { id: 'literacy', icon: Icons.BookOpen, label: '문해력' },
];

export const LITERACY_TEST_DATA = {
  passages: [
    {
      id: 'p1',
      title: '갯벌의 생태적 가치',
      content: `갯벌은 강물이 운반한 미세한 흙과 모래가 파도가 잔잔한 해안에 오랫동안 쌓여 만들어진 평평한 지형이다. 이곳은 육상 생태계와 해양 생태계를 연결하는 독특한 '전이 지대'로, 다양한 생물에게 서식지를 제공하는 생태계의 보고이다. 갯벌에 사는 수많은 미생물은 유기물을 분해하여 물을 정화하는 자연의 콩팥 역할을 한다. 예를 들어, 10㎢의 갯벌은 10만 명이 사는 도시의 하수처리장 하나와 맞먹는 정화 능력을 지닌다. 또한 갯벌은 태풍이나 해일이 발생했을 때 파도의 힘을 약화시켜 해안 지역의 피해를 줄여주는 자연 방파제 역할도 수행한다. 최근에는 환경오염과 무분별한 개발로 인해 갯벌의 면적이 점차 줄어들고 있어, 그 보존의 중요성이 더욱 강조되고 있다.`,
      questions: [
        { id: 'p1q1', type: '사실력', text: '이 글에서 설명하는 갯벌의 역할이 아닌 것은 무엇인가?', options: ['수질 정화', '생물 서식지 제공', '자연재해 피해 감소', '관광 자원 개발'], answer: 3 },
        { id: 'p1q2', type: '사실력', text: '10㎢의 갯벌이 정화할 수 있는 능력은 어느 정도 규모의 도시와 비슷한가?', options: ['1만 명 규모의 도시', '5만 명 규모의 도시', '10만 명 규모의 도시', '20만 명 규모의 도시'], answer: 2 },
        { id: 'p1q3', type: '사실력', text: '갯벌이 형성되는 주된 요인은 무엇인가?', options: ['강한 파도와 바람', '강물의 퇴적 작용과 잔잔한 파도', '화산 활동과 지각 변동', '인공적인 매립 공사'], answer: 1 },
        { id: 'p1q4', type: '추론력', text: '글쓴이가 이 글을 쓴 주된 목적으로 가장 적절한 것은?', options: ['갯벌의 아름다운 경관을 소개하기 위해', '갯벌 개발 사업의 필요성을 주장하기 위해', '갯벌의 생태적 가치와 보존의 중요성을 알리기 위해', '갯벌 생물의 종류와 특징을 설명하기 위해'], answer: 2 },
        { id: 'p1q5', type: '추론력', text: '이 글의 내용으로 미루어 볼 때, 갯벌이 사라지면 어떤 문제가 발생할 가능성이 가장 높은가?', options: ['해안 지역의 어업 생산량이 증가할 것이다.', '해양 생태계의 종 다양성이 증가할 것이다.', '태풍 발생 시 해안가의 피해가 더 커질 수 있다.', '도시의 하수 처리 비용이 감소할 것이다.'], answer: 2 },
        { id: 'p1q6', type: '응용력', text: '갯벌 보존을 위한 캠페인 문구를 만든다고 할 때, 이 글의 내용을 가장 잘 반영한 것은?', options: ['"갯벌에서 즐기는 신나는 여름 휴가!"', '"개발만이 살 길, 갯벌을 황금의 땅으로!"', '"생명의 숨, 자연의 콩팥, 갯벌을 지켜주세요!"', '"갯벌 체험, 우리 아이 창의력 쑥쑥!"'], answer: 2 },
        { id: 'p1q7', type: '응용력', text: '학교 신문에 갯벌에 대한 기사를 쓴다고 할 때, 이 글에서 인용하기에 가장 적절한 표현은?', options: ['"독특한 전이 지대"', '"생태계의 보고"', '"자연의 콩팥"', '위의 모든 표현'], answer: 3 },
        { id: 'p1q8', type: '사실력', text: '갯벌의 면적이 줄어드는 원인으로 언급된 것은 무엇인가?', options: ['지구 온난화와 해수면 상승', '어족 자원의 고갈', '환경오염과 무분별한 개발', '해양 스포츠의 인기 증가'], answer: 2 },
      ]
    },
    {
      id: 'p2',
      title: '심리학의 방어기제',
      content: `방어기제는 심리학자 프로이트가 제시한 개념으로, 자아가 위협받는 상황에서 무의식적으로 자신을 속이거나 상황을 다르게 해석하여 심리적 상처로부터 자신을 보호하려는 심리 기술이다. 가장 흔한 방어기제 중 하나는 '합리화'이다. 이는 받아들이기 힘든 현실에 대해 그럴듯한 이유를 붙여 자신의 행동을 정당화하는 것이다. 예를 들어, 갖고 싶던 물건을 사지 못했을 때 "어차피 별로 필요 없었어"라고 생각하는 것이 이에 해당한다. 또 다른 방어기제인 '투사'는 자신이 받아들이기 힘든 생각이나 욕구를 다른 사람의 것으로 여기는 것이다. 자신이 누군가를 미워하면서, 오히려 상대방이 자신을 미워한다고 느끼는 경우가 대표적이다. 이러한 방어기제는 일시적으로 심리적 안정감을 줄 수 있지만, 과도하게 사용하면 현실을 왜곡하고 문제 해결을 회피하게 만들어 장기적으로는 정신 건강에 해로울 수 있다.`,
      questions: [
        { id: 'p2q1', type: '사실력', text: "이 글에서 설명하는 '방어기제'의 주된 기능은 무엇인가?", options: ['타인의 행동을 예측하는 것', '심리적 상처로부터 자신을 보호하는 것', '논리적 사고 능력을 향상시키는 것', '사회적 성공을 돕는 것'], answer: 1 },
        { id: 'p2q2', type: '사실력', text: "이 글에서 '합리화'의 예시로 든 상황은 무엇인가?", options: ['자신이 화난 것을 남의 탓으로 돌리는 것', '갖고 싶던 물건을 사지 못하고 필요 없었다고 생각하는 것', '힘든 일을 잊기 위해 다른 일에 몰두하는 것', '존경하는 사람의 행동을 따라 하는 것'], answer: 1 },
        { id: 'p2q3', type: '추론력', text: '이 글의 관점에서 볼 때, 방어기제에 대한 설명으로 가장 적절한 것은?', options: ['의식적이고 계획적으로 사용하는 심리 전략이다.', '항상 긍정적인 결과만을 가져오는 유용한 도구이다.', '현실을 객관적으로 인식하는 데 도움을 준다.', '단기적인 안정감을 주지만 남용하면 문제가 될 수 있다.'], answer: 3 },
        { id: 'p2q4', type: '추론력', text: '방어기제를 과도하게 사용하는 사람에게 나타날 수 있는 문제점은 무엇인가?', options: ['지나치게 솔직해져 대인관계에 어려움을 겪는다.', '문제의 근본적인 원인을 해결하지 못하고 회피하게 된다.', '자신감이 과도하게 높아져 무모한 도전을 하게 된다.', '타인의 감정을 지나치게 잘 공감하게 된다.'], answer: 1 },
        { id: 'p2q5', type: '응용력', text: '시험을 망친 학생이 "이번 시험은 문제가 너무 어려워서 다들 못 봤을 거야"라고 말하는 것은 어떤 방어기제에 해당하는가?', options: ['합리화', '투사', '부인', '억압'], answer: 0 },
        { id: 'p2q6', type: '응용력', text: '자신이 친구를 질투하면서 "친구가 나를 질투하는 것 같아 기분 나빠"라고 생각하는 것은 어떤 방어기제인가?', options: ['합리화', '투사', '전치', '승화'], answer: 1 },
        { id: 'p2q7', type: '응용력', text: '다음 중 방어기제를 건강하게 사용하고 있다고 볼 수 있는 사례는?', options: ['모든 실수를 남의 탓으로 돌리며 자신은 잘못이 없다고 믿는다.', '불안감을 느낄 때마다 게임에만 몰두하며 현실을 잊으려 한다.', '힘든 감정을 느낄 때, 일시적으로 그럴 수 있다고 받아들이고 친구와 대화로 푼다.', '자신의 단점을 인정하지 않기 위해 항상 완벽한 모습만 보이려 애쓴다.'], answer: 2 },
        { id: 'p2q8', type: '추론력', text: "이 글을 바탕으로 '투사'라는 방어기제의 핵심 원리를 한 문장으로 요약한다면?", options: ['자신의 감정을 반대로 표현하는 것', '용납할 수 없는 자신의 감정을 남의 것으로 돌리는 것', '고통스러운 기억을 의식에서 지워버리는 것', '사회적으로 용납되는 방식으로 욕구를 표출하는 것'], answer: 1 },
      ]
    }
  ]
};

export const QUOTES = [
    "성공의 비결은 시작하는 것이다.",
    "성공은 끝이 아니고, 실패는 치명적이지 않다. 중요한 것은 계속 나아가는 용기다.",
    "오늘의 나는 어제의 내가 만든 결과다.",
    "위대한 일은 작은 일들이 모여 이루어진다.",
    "완벽을 추구하기보다 과정을 즐겨라."
];

export const REC_TEMPLATES = {
    basic: {
        labels: ['오늘의 한 줄', '가장 큰 성과', '배운 점']
    },
    emotion: {
        labels: ['오늘의 감정 요약', '가장 기뻤던 순간', '나를 위로하는 말']
    },
    study: {
        labels: ['오늘 학습 한 줄 요약', '가장 잘 이해된 개념', '가장 어려웠던 개념']
    }
};
