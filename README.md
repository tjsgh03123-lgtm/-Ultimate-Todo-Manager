# Ultimate Todo Manager

Daily / Weekly / Monthly / Custom 할 일을 한 화면에서 관리하는 iOS 스타일의 심플하고 아름다운 Todo 앱입니다.
React 18 + TypeScript + Vite + TailwindCSS + Framer Motion 으로 제작되었으며, PWA로 설치하여
오프라인에서도 사용할 수 있습니다.

## ✨ 주요 기능

- **상단 탭 (MAIN / DAILY / WEEKLY / MONTHLY / Custom...)**
  - 탭 클릭 또는 좌우 스와이프로 이동, iOS 느낌의 부드러운 전환 애니메이션
  - 탭 드래그로 순서 변경
- **MAIN 대시보드**
  - 전체 완료 개수 / 전체 개수 / 달성률(%) 자동 계산 및 카운트업 애니메이션
  - 페이지별 카드(이름, N/N, 퍼센트, 애니메이션 프로그레스 바)
- **Todo 페이지**
  - 무제한 추가 / 삭제 / 체크(취소선) / 체크 해제
  - Enter 키로 빠르게 추가, 텍스트 탭하여 바로 수정
  - 드래그 앤 드롭으로 순서 변경
  - 현재 페이지 내 실시간 검색
- **커스텀 페이지**
  - `+` 버튼 → 모달에서 이름 / 초기화 방식(Daily·Weekly·Monthly·없음) / 색상 지정 후 생성
  - 무제한 생성, 이름 변경, 색상 변경, 삭제(기본 페이지는 삭제 불가) 가능
- **자동 초기화**
  - 앱 실행 시(그리고 포그라운드로 돌아올 때) 자동 검사
  - Daily → 매일 / Weekly → 매주 월요일 / Monthly → 매월 1일 기준으로 **체크 상태만** 초기화
  - Todo 항목 자체는 절대 삭제되지 않음
- **LocalStorage 영속성**: 모든 변경 사항이 즉시 저장되어 새로고침·앱 종료 후에도 유지
- **다크 모드**: 시스템 설정을 최초 기본값으로 사용하며, 선택 값은 자동 저장
- **JSON 백업 / 복원**: 설정 화면에서 전체 데이터를 JSON 파일로 내보내거나 불러오기
- **PWA**: manifest + service worker 제공, 홈 화면에 설치 가능, 오프라인 지원
- **반응형 / 모바일 최적화**: 아이폰 여백/라운드 카드/그림자 기반의 Material-급 디자인

## 🛠 기술 스택

| 영역 | 사용 기술 |
| --- | --- |
| 프레임워크 | React 18, TypeScript |
| 빌드 도구 | Vite |
| 스타일 | TailwindCSS |
| 애니메이션 | Framer Motion |
| 스와이프 제스처 | react-swipeable |
| 드래그 앤 드롭 | react-beautiful-dnd |
| 아이콘 | Heroicons |
| 저장소 | Browser LocalStorage |
| 오프라인 지원 | Service Worker (직접 구현) |

## 🚀 시작하기

```bash
# 의존성 설치
npm install

# 개발 서버 실행 (http://localhost:5173)
npm run dev

# 프로덕션 빌드
npm run build

# 빌드 결과 미리보기
npm run preview
```

## 📁 프로젝트 구조

```
ultimate-todo-manager/
├── public/
│   ├── manifest.json        # PWA 매니페스트
│   ├── sw.js                 # Service Worker (오프라인 캐싱)
│   ├── favicon.svg
│   └── icons/
│       ├── icon-192.svg
│       └── icon-512.svg
├── src/
│   ├── components/
│   │   ├── Navbar.tsx         # 상단 탭 바 (이동 + 드래그 재정렬)
│   │   ├── Dashboard.tsx      # MAIN 페이지 (통계/카드)
│   │   ├── TodoList.tsx       # 개별 페이지의 Todo 리스트
│   │   ├── TodoItem.tsx       # Todo 한 줄
│   │   ├── ProgressBar.tsx    # 애니메이션 진행률 바
│   │   ├── AddPageModal.tsx   # 페이지 생성/수정/삭제 모달
│   │   ├── SettingsModal.tsx  # 다크모드 + 백업/복원 모달
│   │   ├── SearchBar.tsx      # 검색 입력
│   │   ├── ThemeToggle.tsx    # 다크모드 스위치
│   │   └── Toast.tsx          # 알림 토스트
│   ├── hooks/
│   │   ├── useAppData.ts      # 전역 상태 + LocalStorage 동기화 + CRUD
│   │   ├── useTheme.ts        # 다크모드 <html class> 동기화
│   │   └── useCountUp.ts      # 숫자 카운트업 애니메이션
│   ├── utils/
│   │   ├── storage.ts         # LocalStorage 저장/로드 + JSON 백업/복원
│   │   ├── dateUtils.ts       # 날짜 포맷/월요일 계산 등
│   │   ├── defaultData.ts     # 최초 실행 시 기본 데이터
│   │   ├── resetLogic.ts      # Daily/Weekly/Monthly 자동 초기화 로직
│   │   └── id.ts              # 고유 ID 생성
│   ├── types/
│   │   └── index.ts           # 공용 타입 정의
│   ├── App.tsx
│   ├── main.tsx
│   ├── index.css
│   └── vite-env.d.ts
├── index.html
├── tailwind.config.js
├── postcss.config.js
├── vite.config.ts
├── tsconfig.json
├── tsconfig.node.json
└── package.json
```

## 📲 PWA 설치

1. `npm run build && npm run preview` (또는 배포된 HTTPS 주소)로 접속합니다.
2. iOS Safari: 공유 버튼 → "홈 화면에 추가"
   Android Chrome: 메뉴 → "앱 설치" / 홈 화면에 추가 배너
3. 설치 후에는 오프라인 상태에서도 마지막으로 캐싱된 화면과 데이터로 앱이 실행됩니다.

## 💾 데이터 백업 / 복원

우측 상단 톱니바퀴 아이콘 → 설정에서:

- **JSON으로 백업하기**: 현재 모든 페이지/Todo/설정을 `todo-backup-YYYYMMDD-HHmm.json` 파일로 다운로드
- **JSON 파일에서 복원하기**: 이전에 백업한 JSON 파일을 선택하면 현재 데이터를 완전히 대체

## 🔁 자동 초기화 규칙

| 페이지 유형 | 초기화 시점 | 초기화 대상 |
| --- | --- | --- |
| Daily | 마지막 접속일과 오늘 날짜가 다를 때 | 오늘 하루가 지나면 체크만 해제 |
| Weekly | 마지막 접속 주(월요일 기준)와 이번 주가 다를 때 | 월요일 기준 체크만 해제 |
| Monthly | 마지막 접속 월과 이번 달이 다를 때 | 매월 1일 기준 체크만 해제 |
| Custom(없음) | 초기화하지 않음 | - |

> Todo 항목(텍스트)은 어떤 경우에도 자동으로 삭제되지 않으며, `completed` 값만 초기화됩니다.

## 📝 라이선스

이 프로젝트는 자유롭게 사용, 수정, 배포할 수 있습니다.
