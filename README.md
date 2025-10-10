# NestJS CRUD 모듈 자동 생성기 (Enhanced v2.0)

NestJS 프로젝트를 위한 CRUD 모듈 자동 생성 도구입니다. Prisma 스키마를 기반으로 Controller, Service, Module, DTO, Model 파일들을 자동으로 생성합니다.

## 🚀 주요 기능 (v2.0)

### ✨ 자동화 기능 강화

- ✅ **자동 app.module.ts 업데이트** - 생성된 모듈을 자동으로 imports에 추가
- ✅ **Prettier 자동 포맷팅** - 생성된 코드를 자동으로 포맷팅
- ✅ **package.json 설정 지원** - 기본 경로 및 옵션을 설정 파일에서 관리
- ✅ **환경변수 지원** - `.env` 파일로 프로젝트별 기본값 설정
- ✅ **색상화된 CLI** - 가독성 높은 터미널 출력 🎨
- ✅ **도메인별 템플릿** - space, doda 등 여러 도메인 템플릿 지원

### 📁 Prisma 파일 지원 향상

- ✅ **모듈별 개별 Prisma 파일** - `prisma/[name].prisma` 및 `src/[name].prisma` 지원
- ✅ **확장된 재귀 검색** - `prisma` 및 `src` 폴더 내 모든 하위 폴더에서 `[name].prisma` 파일 자동 탐색
- ✅ **단일 통합 Prisma 파일** - `prisma/schema.prisma` 지원
- ✅ **자동 모델 매칭** - 모듈 이름과 일치하는 Prisma 모델 자동 탐색
- ✅ **성능 최적화** - node_modules, dist 등 불필요한 폴더 자동 제외

## 📦 설치 방법

### 로컬 개발 환경에서 설치

```bash
# 프로젝트 클론
git clone <repository-url>
cd schematic

# 의존성 설치
npm install

# 빌드
npm run build

# 글로벌 링크 (로컬에서 사용하기 위해)
npm link
```

### NPM 패키지로 설치 (퍼블리시 후)

```bash
npm install -g schematic
```

## ⚙️ 환경변수 설정 (선택사항)

각 프로젝트의 기본 동작을 커스터마이징하려면 **대상 NestJS 프로젝트**에 `.env` 파일을 생성하세요:

```bash
# 대상 프로젝트에서 실행
cd /path/to/your-nestjs-project

# .env 파일 생성
cat > .env << 'EOF'
SC_DEFAULT_DOMAIN=space
SC_DEFAULT_PATH=src/resources
SC_DEFAULT_PRISMA_PATH=prisma/schema.prisma
EOF
```

**설정 가능한 환경변수:**

- `SC_DEFAULT_DOMAIN` - 기본 도메인 템플릿 (기본값: space)
- `SC_DEFAULT_PATH` - 기본 생성 경로 (기본값: src/resources)
- `SC_DEFAULT_PRISMA_PATH` - 기본 Prisma 경로 (기본값: prisma/schema.prisma)
- `SC_EXCLUDED_DIRECTORIES` - 검색 제외 폴더
- `SC_SEARCH_DIRECTORIES` - Prisma 파일 검색 폴더

## 🚀 사용 방법

### 방법 1: CLI 명령어 (추천) ⭐

npm link 후 간편하게 사용:

```bash
# 기본 사용 (대화형 - 도메인 선택 프롬프트)
schematic User              # 또는 sc User
sc User                     # 짧은 명령어

# 도메인 지정 (프롬프트 스킵)
sc Product space            # space 도메인
sc Order doda               # doda 도메인

# 옵션과 함께 사용
sc Payment space --path=src/api
sc Invoice --prismaPath=prisma/invoice.prisma

# 도움말 확인
schematic --help
sc --help
```

### 방법 2: Schematics CLI

```bash
# 단일 명령으로 CRUD 모듈 생성
schematics .:crud-module --name=user

# 경로 지정
schematics .:crud-module --name=product --path=src/api

# Prisma 파일 지정
schematics .:crud-module --name=order --prismaPath=prisma/order.prisma

# 도메인 템플릿 지정
schematics .:crud-module --name=payment --domain=space
```

### CLI 특징

- ✅ **초간단 명령어**: `sc User space` 간단하게! 🚀
- ✅ **색상화된 출력**: 가독성 높은 컬러풀한 터미널 출력 🎨
- ✅ **프로젝트 검증**: NestJS 프로젝트인지 자동 확인
- ✅ **상세한 출력**: 생성된 파일 목록 표시
- ✅ **에러 처리**: 친절한 에러 메시지
- ✅ **자동화**: app.module 업데이트 + Prettier 포맷팅
- ✅ **두 가지 명령어**: `sc` (짧게) 또는 `schematic` (길게)
- ✅ **환경변수 지원**: 프로젝트별 기본값 설정 가능

## 🎭 도메인 템플릿 선택

이제 프로젝트에서 여러 도메인별로 다른 템플릿을 사용할 수 있습니다!

### 기본 사용법

```bash
# 기본 사용 (space 도메인이 기본값)
sc User

# space 도메인 명시적 지정
sc User space

# doda 도메인 사용
sc User doda

# 향후 다른 도메인 템플릿도 추가 가능
```

### 도메인 템플릿 구조

```
src/crud/file/
├── space/              # Space 도메인 템플릿
│   ├── __name@dasherize__.module.ts.template
│   ├── __name@dasherize__.service.ts.template
│   └── ... (기타 템플릿 파일)
├── doda/               # Doda 도메인 템플릿
│   ├── __name@dasherize__.module.ts.template
│   ├── __name@dasherize__.service.ts.template
│   └── ... (기타 템플릿 파일)
└── custom/             # 커스텀 도메인 (필요시 추가)
```

### 새로운 도메인 템플릿 추가하기

1. `src/crud/file/` 아래에 새로운 도메인 폴더 생성 (예: `custom`)
2. 해당 폴더에 템플릿 파일들 복사 및 수정
3. CLI에서 `--domain=custom` 옵션으로 사용

```bash
# 예시: custom 도메인 템플릿 사용
sc Product custom
```

### 📁 Prisma 파일 자동 탐색 (확장된 재귀 검색)

이 도구는 **`prisma`와 `src` 폴더**와 모든 하위 폴더에서 모듈 이름과 일치하는 `.prisma` 파일을 자동으로 찾습니다!

#### 지원되는 Prisma 파일 구조:

```
prisma/
├── user.prisma                    ✅ sc User 실행 시 자동 탐지
├── product.prisma                 ✅ sc Product 실행 시 자동 탐지
├── schema.prisma                  ✅ 공통 스키마 (fallback)
├── domains/
│   ├── auth/
│   │   └── user.prisma            ✅ sc User 실행 시 자동 탐지
│   └── commerce/
│       └── order.prisma           ✅ sc Order 실행 시 자동 탐지
└── modules/
    └── payment/
        └── payment.prisma         ✅ sc Payment 실행 시 자동 탐지

src/
├── user/
│   └── user.prisma                ✅ sc User 실행 시 자동 탐지 (src에서도 찾음!)
└── resources/
    └── product/
        └── product.prisma         ✅ sc Product 실행 시 자동 탐지
```

**탐색 우선순위:**

1. `prisma/**/[name].prisma` (prisma 폴더 재귀 검색)
2. `src/**/[name].prisma` (src 폴더 재귀 검색)
3. `prisma/schema.prisma` (통합 스키마 파일)
4. `schema.prisma` (루트 스키마 파일)

**⚡ 성능 최적화:**

- `node_modules`, `dist`, `.git`, `build` 등 불필요한 폴더는 자동으로 제외됩니다

**예시: `prisma/User.prisma`**

```prisma
model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique /// 사용자 이메일
  name      String   /// 사용자 이름
  password  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  deletedAt DateTime?

  // 관계 필드는 자동으로 제외됩니다
  posts     Post[]
}
```

**주의사항:**

- `///` 주석은 필드 설명으로 파싱되어 DTO에 포함됩니다
- 배열 타입 (`Post[]`)과 관계 필드는 자동으로 제외됩니다
- 파일명은 모델명과 일치해야 합니다 (예: `User.prisma`)

## 📂 프로젝트 구조

```
schematic/
├── src/
│   ├── bin/
│   │   └── cli.ts                           # CLI 진입점
│   ├── crud/
│   │   ├── index.ts                          # 메인 스키마틱 로직
│   │   ├── schema.json                       # 스키마틱 옵션 정의
│   │   ├── schema.ts                         # 스키마 타입 정의
│   │   ├── file/                             # 템플릿 파일들
│   │   │   ├── __name@dasherize__.interface.ts.template
│   │   │   ├── __name@dasherize__.module.ts.template
│   │   │   ├── __name@dasherize__.service.ts.template
│   │   │   ├── controllers/
│   │   │   │   └── __name@dasherize__.controller.ts.template
│   │   │   ├── dto/
│   │   │   │   ├── request/
│   │   │   │   │   ├── __name@dasherize__-create.dto.ts.template
│   │   │   │   │   ├── __name@dasherize__-find.dto.ts.template
│   │   │   │   │   └── __name@dasherize__-update.dto.ts.template
│   │   │   │   └── response/
│   │   │   │       └── __name@dasherize__-find-response.dto.ts.template
│   │   │   └── models/
│   │   │       └── __name@dasherize__.model.ts.template
│   │   └── utils/                            # 유틸리티 함수들
│   │       ├── app-module-updater.ts         # app.module.ts 업데이트
│   │       ├── config-parser.ts              # package.json 설정 파싱
│   │       ├── prettier-formatter.ts         # Prettier 포맷팅
│   │       ├── prisma-file-finder.ts         # Prisma 파일 찾기
│   │       ├── prisma-model-parser.ts        # Prisma 모델 파싱
│   │       └── template-generator.ts         # 템플릿 생성
│   ├── collection.json                       # 스키마틱 컬렉션 정의
│   └── tsconfig.json
├── dist/                                      # 빌드 결과물
├── package.json
└── README.md
```

## 📝 생성되는 파일

`schematic User` 명령어 실행 시 다음 파일들이 `src/resources/user/` 디렉토리에 생성됩니다:

```
src/resources/user/
├── controllers/
│   └── user.controller.ts          # REST API 엔드포인트
├── dto/
│   ├── request/
│   │   ├── user-create.dto.ts      # 생성 요청 DTO
│   │   ├── user-find.dto.ts        # 조회 요청 DTO
│   │   └── user-update.dto.ts      # 수정 요청 DTO
│   └── response/
│       └── user-find-response.dto.ts # 조회 응답 DTO
├── models/
│   └── user.model.ts                # 모델 정의
├── user.interface.ts                # 인터페이스 정의
├── user.module.ts                   # NestJS 모듈
└── user.service.ts                  # 비즈니스 로직
```

### 생성되는 CRUD 기능

각 모듈은 다음 기능을 포함합니다:

- **Create**: 새 리소스 생성
- **FindUnique**: ID로 단일 리소스 조회
- **FindMany**: 페이지네이션을 포함한 다중 리소스 조회
- **Update**: 리소스 수정
- **SoftDelete**: 소프트 삭제 (deletedAt 필드 업데이트)

## 🛠 개발 가이드

### 스크립트 명령어

```bash
# TypeScript 빌드
npm run build

# 감시 모드로 빌드 (개발 시 유용)
npm run build:watch

# 빌드 결과물 삭제
npm run clean

# 빌드 및 로컬 링크 (개발 테스트용)
npm run link
```

### 템플릿 수정하기

템플릿 파일은 `src/crud/file/` 디렉토리에 있습니다. 다음 변수들을 사용할 수 있습니다:

- `<%= name %>`: 원본 이름
- `<%= classify(name) %>`: PascalCase (예: User)
- `<%= dasherize(name) %>`: kebab-case (예: user)
- `<%= camelize(name) %>`: camelCase (예: user)
- `<%= prismaModel %>`: 파싱된 Prisma 모델 객체

템플릿 수정 후에는 반드시 빌드해야 합니다:

```bash
npm run build
```

### 유틸리티 함수 설명

1. **app-module-updater.ts**: `app.module.ts`에 새 모듈을 자동으로 import 및 등록
2. **config-parser.ts**: `package.json`에서 사용자 정의 설정 파싱
3. **prettier-formatter.ts**: 생성된 파일을 Prettier로 포맷팅
4. **prisma-file-finder.ts**: Prisma 스키마 파일 자동 탐색
5. **prisma-model-parser.ts**: Prisma 모델 정의를 TypeScript 객체로 파싱
6. **template-generator.ts**: 템플릿 파일들을 실제 코드로 변환

## 📋 요구사항

### NestJS 프로젝트 요구사항

이 도구를 사용하려면 대상 프로젝트에 다음이 필요합니다:

```json
{
  "dependencies": {
    "@nestjs/core": "^10.0.0",
    "@prisma/client": "^5.0.0"
  }
}
```

### 추천 프로젝트 구조

```
your-nestjs-project/
├── src/
│   ├── app.module.ts
│   ├── core/
│   │   └── prisma/
│   │       └── prisma.service.ts
│   ├── common/
│   │   ├── utils/
│   │   │   └── common.service.ts
│   │   └── helpers/
│   │       └── pagination.helper.ts
│   └── resources/                    # 생성된 모듈들이 여기에 위치
│       ├── user/
│       ├── product/
│       └── ...
└── prisma/
    ├── schema.prisma
    ├── User.prisma                    # 개별 모델 스키마 (선택사항)
    └── Product.prisma
```

### 필수 서비스 및 헬퍼

생성된 코드가 제대로 작동하려면 다음 파일들이 필요합니다:

1. **PrismaService** (`src/core/prisma/prisma.service.ts`)
2. **CommonService** (`src/common/utils/common.service.ts`)
3. **pagination.helper** (`src/common/helpers/pagination.helper.ts`)

## 🔧 설정 커스터마이징

`package.json`에 다음 설정을 추가하여 기본 경로를 변경할 수 있습니다:

```json
{
  "schematic": {
    "path": "src/modules"
  }
}
```

기본값은 `src/resources`입니다.

## ⚙️ 기술 스택

- **@angular-devkit/schematics**: 코드 생성 프레임워크
- **TypeScript**: 타입 안전한 개발
- **Prettier**: 코드 포맷팅
- **Prisma**: 데이터베이스 ORM 및 스키마 파싱

## 📄 라이선스

ISC

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 문의

프로젝트 관련 문의사항이 있으시면 이슈를 등록해주세요.

---

**Happy Coding! 🚀**
