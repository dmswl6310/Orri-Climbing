# 🧗‍♂️ ORURI (Next.js 14 Refactoring)

**기존 Page Router 기반의 클라이밍 서비스를 <br>Next.js 14 App Router로 재구축해 성능과 유지보수성을 높이는 프로젝트**
<br><br>


## 🔗 Live Demo
[**🚀 오르리 보러가기**](https://orri-climbing.vercel.app)
<br><br>


## 🎯 Refactoring Focus
### ⚡ 성능 최적화 (Performance)
- Lighthouse 전 항목 90점 이상 달성 및 유지
- 초기 렌더링 속도 개선을 통한 사용자 이탈 방지

### 🛠 기술 스택 현대화 (Modernization)
- **Next.js 14 (App Router)**: 서버 컴포넌트 기반 번들 크기 최소화
- **Tailwind CSS v4**: 기존 Styled-components 대비 런타임 오버헤드 제거
- **TypeScript**: 엄격한 타입 정의로 코드 안정성 확보

### 💾 데이터 아키텍처 (Data Architecture)
- **Supabase**: 기존 EC2 기반 환경에서 서버리스 DB로 마이그레이션
- **단계적 전환**: JSON Mock 데이터에서 실시간 DB 연동까지 순차 적용
<br>

## 🛠 Tech Stack

| 분류 | 기술 스택 |
| :--- | :--- |
| **Framework** | **Next.js 14 (App Router)** |
| **Styling** | **Tailwind CSS v4** |
| **Language** | **TypeScript** |
| **Database** | **Supabase** (In-progress) |
| **Deployment** | **Vercel** |

<br>

## 📅 리팩토링 히스토리 (Milestones)

- [x] **Week 1**: 프로젝트 초기 환경 세팅 및 Vercel 자동 배포 연동
- [x] **Week 1**: Tailwind CSS v4 테마 및 글로벌 스타일 시스템 구축
- [ ] **Week 2**: 핵심 공통 UI(Navbar, Footer) 및 레이아웃 리팩토링
- [ ] **Week 3**: 메인 및 검색 페이지 서버 컴포넌트 구현 (Mock Data)
- [ ] **Week 4**: Supabase DB 연동 및 실제 데이터 API 마이그레이션
