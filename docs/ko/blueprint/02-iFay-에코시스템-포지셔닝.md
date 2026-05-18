## 2. iFay 에코시스템 포지셔닝

ICP는 iFay 에코시스템에서 탄생했지만, 그 가치는 iFay에 국한되지 않습니다. 본 장에서는 iFay 에코시스템 내 ICP의 아키텍처 위치와 독립적인 프로토콜 표준으로서의 범용적 가치를 설명합니다.

### iFay의 계층 아키텍처와 ICP의 위치

iFay Framework는 5계층 아키텍처를 채택합니다:

- **Context 계층** (최상위): 모듈식 멀티모달 메시지(Modular Multimodal Messages) 조립, Prompt 번역, 로컬 디바이스 API, 데이터 전송 API, 원격 API 연결 담당
- **Protocol 계층**: iFay와 외부 세계의 상호작용을 위한 프로토콜 집합 정의
- **iFay 코어 계층**: 크레덴셜(Credentials), 감지(Sense), 행동(Action), 사고(Thought) 4대 능력 모듈 포함, 기반은 에고 모델(Ego Model)로 구동
- **Virtual Runtime Environment 계층**: iFay의 실행 환경, 컴퓨터, 구현 로봇, 컨테이너, 터미널 디바이스, 서버/클라우드, 앱 내장 등 다양한 캐리어 지원, FayGer 런타임으로 관리
- **Global Merit Chain** (종단 계층): 전체를 관통하는 신뢰와 가치 시스템

ICP(Interactive Conversation Protocol)는 Protocol 계층에 위치하며, iFay 프로토콜 스위트의 일원으로 다른 5개 프로토콜과 병렬합니다:

| 프로토콜 | 책임 |
|---------|------|
| Faying Protocol | iFay 간 소셜 및 아이덴티티 프로토콜 |
| **Interactive Conversation Protocol (ICP)** | **인간-기계 인터랙티브 대화의 시맨틱 기술 프로토콜** |
| Telepathy Protocol | 의도와 정신 상태 전달 프로토콜 |
| Control Authority Protocol | 권한 제어 및 인가 프로토콜 |
| Data Tunnel Protocol | 데이터 채널 및 전송 프로토콜 |
| Skill Sharing Protocol | 스킬 공유 및 호출 프로토콜 |

ICP는 "인터랙티브 대화"라는 인간-기계 상호작용 시나리오에 특화되어 있습니다. iFay가 사용자와 구조화된 대화 상호작용을 수행해야 할 때, ICP는 현재 터미널의 객관적 컨텍스트에 기반하여 시맨틱 콘텐츠를 사용자 친화적인 인터랙티브 인터페이스로 동적으로 조립하는 책임을 담당합니다.

### iFay의 정의

iFay는 자연인에 귀속되는 개인 AI 에이전트(Personal AI Agent)입니다. 각 iFay는 한 자연인과 일대일로 바인딩되어, 해당 사용자의 선호, 습관, 사회적 관계, 생활 컨텍스트를 깊이 이해합니다.

### coFay의 정의

coFay는 사회적 공공 기능을 담당하는 AI 에이전트(Public Role AI Agent)입니다. iFay의 개인적 속성과 달리, coFay는 경찰, 의사, 교사, 공무원, 고객 서비스 담당자 등 정의된 공공 역할을 수행합니다.

### ICP의 독립적 가치

ICP는 iFay 에코시스템에서 탄생했지만, iFay에 의존하지 않고 사용할 수 있는 독립적인 시맨틱 기술 프로토콜로 설계되었습니다.

인간-기계 상호작용 시맨틱스를 구조적으로 기술해야 하는 모든 시스템이 ICP를 채택할 수 있습니다: 채팅 애플리케이션, 음성 어시스턴트, AR/VR 플랫폼, 기업 협업 도구, IoT 디바이스 제어 패널 등.

ICP는 따라서 이중 정체성을 가집니다:

- iFay 에코시스템 내에서는 Protocol 계층의 인터랙티브 대화 시맨틱 기술 프로토콜
- iFay 에코시스템 외에서는 모든 인간-기계 상호작용 시나리오에 적용 가능한 범용 시맨틱 기술 프로토콜
