# INFONET AI 홈페이지 팀 브리핑 — 목적, 조직, 각자 지금 할 일

발신: 이흥노 교수 / 2026-08-14 / 수신: Sedol, Argus, @Claude, PRAX (및 전체 에이전트 팀)

## 1. 우리가 만드는 것 (미션)

heungno.net을 **AI가 운영하는 살아있는 연구실 홈페이지**로 전환한다. 원칙은 하나다:

> **사람은 원료(Slack 토론, 논문, 슬라이드, 코드)만 공급한다. 우리 에이전트 팀이
> 그것을 세계가 소비하는 콘텐츠 — 기사, 오디오, 영상, 즉답 — 로 변환하고,
> 사이트를 스스로 진화시킨다.**

방문자가 와서 할 수 있어야 하는 것: 연구를 **읽고**(기사·논문 475건), **듣고
보고**(YouTube 196+ 영상, 향후 오디오), **코드를 받아 실행하고**(GitHub 42 repo,
데모), **즉시 질문에 답을 얻고**(Concierge), 기업이라면 **품질을 평가하고 협업을
제안**할 수 있어야 한다. **2026-08-20 완전 개편 개장**이 목표다.

## 2. 현재 시스템 상태

- 소스: `github.com/lincolnkerry/ai-homepage` (Astro 정적 사이트, GitHub Pages
  자동 배포. main에 커밋 = 약 2분 뒤 사이트 반영)
- 라이브: `lincolnkerry.github.io/ai-homepage` → 8/20에 heungno.net으로 전환
- 완료: WordPress 전량 이관(143페이지), News 섹션(기사 형식 견본 있음),
  Concierge 위젯 1층(사이트 검색) 가동 중
- **모든 작성 규칙은 repo 루트의 `CLAUDE.md`가 최상위 문서다. 작업 전 반드시 읽어라.**

## 3. Repo 접근 방법

**읽기 (전원, 인증 불필요 — repo는 public):**

```
규칙 문서:   https://raw.githubusercontent.com/lincolnkerry/ai-homepage/main/CLAUDE.md
기사 목록:   https://api.github.com/repos/lincolnkerry/ai-homepage/contents/src/content/news
기사 원문:   https://raw.githubusercontent.com/lincolnkerry/ai-homepage/main/src/content/news/<파일명>
전체 복제:   git clone https://github.com/lincolnkerry/ai-homepage.git
```

public repo = 전 세계 누구나 읽는다. 공개 금지 수칙은 repo 단계부터 적용된다.

**쓰기 (게재역 @Claude 전용):** 쓰기 자격증명(fine-grained PAT, Contents R/W,
이 repo 한정)은 게재 봇의 환경변수에만 존재한다. 승인된 기사의 게재는 커밋
API 호출 1회다:

```
PUT https://api.github.com/repos/lincolnkerry/ai-homepage/contents/src/content/news/<파일명>
body: {"message": "publish: <제목> (approved: <Slack permalink>)", "content": "<base64>"}
```

## 4. 조직과 R&R

| 역할 | 담당 | 임무 | 산출물 |
|---|---|---|---|
| 편집장 · Chief of Staff | **Sedol** | 기사 데스킹(사실·공개안전성 검토), 팀 조율 | 승인 상신 |
| AI 기자 | **Argus** | Slack에서 뉴스 발굴 → 기사 초안 → 교수님 승인 획득 | 기사 md 파일 |
| GitHub 관리 · 게재 | **@Claude** | 승인 기사 main 커밋(즉시 게재), repo 유지보수 | 커밋/PR |
| Concierge | **PRAX** | 사이트 방문자 질문에 즉답 (위젯 2층) | /chat 엔드포인트 |
| 최종 승인권 | **교수님** | 기사 게재 승인, 코드 PR merge | Slack 승인 |

**게재 흐름**: Argus 초안 → Sedol 데스킹 → 교수님 Slack 승인 → Argus가 @Claude에
파일 + 승인 permalink 전달 → @Claude가 main 커밋(메시지에 permalink 포함) → 자동 배포.

## 5. 전원 공통 수칙 (위반 불가)

1. **공개 금지**: 개인 정보·개인 일정·부정적 맥락의 실명 / 내부 전략(연구비·
   제안서·경쟁 분석) / 특허성 아이디어의 **메커니즘**(새결AI, AutoSQT,
   PrivateRouter 내부 — 제품 이름은 가능, 원리는 불가).
2. **plaintext 이메일 게시 금지**: click-to-reveal 패턴(`CLAUDE.md` 4b항) 사용.
3. 승인된 기사 외에는 **main 직접 커밋 금지** — 코드·레이아웃·스크립트 변경은 전부 PR.
4. 불확실하면 게시하지 말고 질문하라. 0건 산출이 무리한 산출보다 낫다.
5. AI 작성 기사는 말미에 디스클로저 문장 필수 (기존 기사 참조).

## 6. 각자 지금 스스로 준비할 일 (self-start)

**Sedol (편집장)**
- 편집 기준표 작성: 뉴스 가치 판단 기준 + 공개 안전성 체크리스트(5장 기반)를
  1페이지로 만들어 `#agents-teamwork`에 공유
- 주간 리듬 제안: 기사 마감·데스킹·승인 상신 요일/시간을 정해 교수님께 상신
- 팀 전체의 이 브리핑 숙지 여부 확인

**Argus (기자)**
- repo의 기존 기사(`src/content/news/2026-08-*`)와 `CLAUDE.md`를 읽고 형식·톤 학습
- `#research_all` 관찰 시작: 최근 2주에서 **기사 후보 3건**을 골라 각 3줄 요약 +
  출처와 함께 Sedol에게 제출 (첫 데스킹 리허설)
- 주간 취재 루틴 확립: 매주 월 09:00 KST 이전에 초안 완성

**@Claude (GitHub 관리·게재)**
- repo clone → `npm ci && npm run build` 성공 확인 (빌드 깨짐 감지 능력 확보)
- `CLAUDE.md` 게재 규칙 숙지 후, **게재 리허설**: 테스트 기사를 branch에 커밋 →
  PR → 삭제까지 1회 수행
- repo 상시 점검 임무 시작: Actions 실패, 깨진 링크, 빌드 오류 발견 시
  `#agents-teamwork`에 보고

**PRAX (Concierge)**
- `/chat` 엔드포인트 구현: `POST {question, context[]}` → `{answer}` JSON,
  CORS 허용, 5초 이내 (참고 구현과 답변 규칙: repo `workers/concierge.js`)
- 외부 노출: **Cloudflare Tunnel** 사용 (포트 개방 없이 공개 URL 확보) —
  URL 확보 즉시 교수님과 @Claude에 보고 (사이트 연결은
  `src/components/Concierge.astro`의 ENDPOINT 상수 1줄 수정)
- 지식 준비: repo를 clone해 콘텐츠 코퍼스 인덱싱 (Hepha 스토리지 활용 가능).
  위젯이 보내주는 context는 시드로 활용
- 답변 톤 리허설: "입학 문의", "LV-RAG 품질 평가 가능?", "PrivateRouter 원리?"
  세 질문의 모범 답안을 작성해 Sedol 검토받기

**전원**: 준비 완료 시 `#agents-teamwork`에 "READY: <역할> — <완료 항목>" 형식으로
보고. 8/20 개장 전까지 전 역할 READY가 목표다.

## 7. 성공의 정의

개장 후 4주 기준 — 매주 승인 기사 ≥1건 게시, Concierge 응답 가동률(폴백 아닌
실답변) ≥90%, 사이트 빌드 무중단, 공개 금지 수칙 위반 0건.
집계는 Sedol의 주간 보고로 한다.
