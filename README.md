# NestJS Todo List API 프로젝트

NestJS + TypeORM + MySQL을 사용한 Todo List REST API 프로젝트입니다.  
입사 전 NestJS 학습 및 Git PR 흐름 연습을 목적으로 진행했습니다.

---

## 목차

1. [기술 스택](#기술-스택)
2. [프로젝트 구조](#프로젝트-구조)
3. [시작하기](#시작하기)
4. [환경 변수 설정](#환경-변수-설정)
5. [API 명세](#api-명세)
6. [구현 기능 상세 설명](#구현-기능-상세-설명)
7. [Git PR 흐름](#git-pr-흐름)

---

## 기술 스택

| 분류 | 기술 |
|------|------|
| 백엔드 프레임워크 | NestJS |
| 언어 | TypeScript |
| 데이터베이스 | MySQL 8.0 (Docker) |
| ORM | TypeORM |
| 인증 | JWT (JSON Web Token) |
| 유효성 검사 | class-validator, class-transformer |
| 환경 변수 | @nestjs/config |

---

## 프로젝트 구조

```
src/
├── app.module.ts              # 앱 루트 모듈 (TypeORM, ConfigModule 설정)
├── main.ts                    # 앱 진입점 (전역 파이프, 필터, 인터셉터 등록)
├── common/
│   ├── filters/
│   │   └── http-exception.filter.ts   # 커스텀 에러 응답 필터
│   └── interceptors/
│       └── transform.interceptor.ts   # 성공 응답 형식 통일 인터셉터
├── auth/
│   ├── dto/
│   │   ├── login.dto.ts       # 로그인 요청 DTO
│   │   └── signup.dto.ts      # 회원가입 요청 DTO
│   ├── guards/
│   │   └── jwt-auth.guard.ts  # JWT 인증 가드
│   ├── auth.controller.ts     # 인증 컨트롤러 (회원가입, 로그인)
│   ├── auth.module.ts         # 인증 모듈
│   └── auth.service.ts        # 인증 서비스 (JWT 발급, 비밀번호 검증)
├── users/
│   ├── entities/
│   │   └── user.entity.ts     # User 엔티티
│   ├── users.module.ts        # 유저 모듈
│   └── users.service.ts       # 유저 서비스 (회원가입, 이메일 조회)
└── todos/
    ├── dto/
    │   ├── create-todo.dto.ts      # Todo 생성 요청 DTO
    │   ├── update-todo.dto.ts      # Todo 수정 요청 DTO
    │   └── pagination-query.dto.ts # 페이지네이션 쿼리 DTO
    ├── entities/
    │   └── todo.entity.ts     # Todo 엔티티
    ├── todos.controller.ts    # Todo 컨트롤러
    ├── todos.module.ts        # Todo 모듈
    └── todos.service.ts       # Todo 서비스
```

---

## 시작하기

### 사전 준비

- Node.js 설치
- Docker 설치

### 1. 레포지토리 클론

```bash
git clone https://github.com/hyeonseong0917/pre-onboarding-nestjs.git
cd pre-onboarding-nestjs
```

### 2. 패키지 설치

```bash
npm install
```

### 3. MySQL 컨테이너 실행

```bash
docker run --name mysql-todo \
  -e MYSQL_ROOT_PASSWORD=1234 \
  -e MYSQL_DATABASE=todos \
  -p 3306:3306 \
  -d mysql:8.0
```

### 4. 환경 변수 파일 생성

`.env.example`을 참고해서 `.env.development` 파일을 만들어요.

```bash
cp .env.example .env.development
```

`.env.development` 내용 작성:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=1234
DB_DATABASE=todos
NODE_ENV=development
JWT_SECRET=mysecretkey123
```

### 5. 서버 실행

```bash
npm run start:dev
```

서버가 `http://localhost:3000` 에서 실행돼요.

---

## 환경 변수 설정

| 변수명 | 설명 | 예시 |
|--------|------|------|
| DB_HOST | 데이터베이스 호스트 | localhost |
| DB_PORT | 데이터베이스 포트 | 3306 |
| DB_USERNAME | 데이터베이스 유저명 | root |
| DB_PASSWORD | 데이터베이스 비밀번호 | 1234 |
| DB_DATABASE | 데이터베이스 이름 | todos |
| NODE_ENV | 실행 환경 | development / production |
| JWT_SECRET | JWT 서명 비밀 키 | mysecretkey123 |

> ⚠️ `.env.development`, `.env.production` 파일은 보안상 Git에 올리지 않아요.  
> `.env.example`을 참고해서 직접 만들어야 해요.

---

## API 명세

### 인증 API

#### 회원가입
```
POST /auth/signup
```

요청 Body:
```json
{
  "email": "test@test.com",
  "password": "123456"
}
```

응답:
```json
{
  "success": true,
  "data": {
    "message": "회원가입 성공",
    "userId": 1
  }
}
```

---

#### 로그인
```
POST /auth/login
```

요청 Body:
```json
{
  "email": "test@test.com",
  "password": "123456"
}
```

응답:
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGci..."
  }
}
```

---

### Todo API

> ⚠️ 모든 Todo API는 로그인 후 발급받은 JWT 토큰이 필요해요.  
> 요청 Header에 아래와 같이 토큰을 포함해야 해요.
> ```
> Authorization: Bearer {accessToken}
> ```

---

#### Todo 목록 조회 (페이지네이션)
```
GET /todos?page=1&limit=10
```

| 쿼리 파라미터 | 타입 | 기본값 | 설명 |
|--------------|------|--------|------|
| page | number | 1 | 페이지 번호 (1 이상) |
| limit | number | 10 | 페이지당 항목 수 (1 이상) |

응답:
```json
{
  "success": true,
  "data": {
    "todos": [
      {
        "id": 1,
        "title": "공부하기",
        "description": "NestJS 공부",
        "isCompleted": false,
        "createdAt": "2026-02-26T00:00:00.000Z"
      }
    ],
    "meta": {
      "total": 25,
      "page": 1,
      "limit": 10,
      "totalPages": 3
    }
  }
}
```

---

#### Todo 단건 조회
```
GET /todos/:id
```

응답:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "공부하기",
    "description": "NestJS 공부",
    "isCompleted": false,
    "createdAt": "2026-02-26T00:00:00.000Z"
  }
}
```

---

#### Todo 생성
```
POST /todos
```

요청 Body:
```json
{
  "title": "공부하기",
  "description": "NestJS 공부"
}
```

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| title | string | ✅ | 할 일 제목 |
| description | string | ❌ | 할 일 설명 |

응답:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "공부하기",
    "description": "NestJS 공부",
    "isCompleted": false,
    "createdAt": "2026-02-26T00:00:00.000Z"
  }
}
```

---

#### Todo 수정
```
PATCH /todos/:id
```

요청 Body (수정할 필드만 보내면 돼요):
```json
{
  "title": "수정된 제목",
  "isCompleted": true
}
```

응답:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "수정된 제목",
    "description": "NestJS 공부",
    "isCompleted": true,
    "createdAt": "2026-02-26T00:00:00.000Z"
  }
}
```

---

#### Todo 삭제
```
DELETE /todos/:id
```

응답:
```json
{
  "success": true,
  "data": null
}
```

---

### 에러 응답 형식

모든 에러는 아래 형식으로 응답해요:

```json
{
  "success": false,
  "statusCode": 404,
  "message": "에러 메시지",
  "timestamp": "2026-02-26T00:00:00.000Z",
  "path": "/todos/9999"
}
```

| 상태코드 | 설명 |
|---------|------|
| 400 | 잘못된 요청 (유효성 검사 실패) |
| 401 | 인증 실패 (토큰 없음 또는 유효하지 않은 토큰) |
| 404 | 리소스를 찾을 수 없음 |
| 409 | 중복된 데이터 (이미 사용 중인 이메일) |

---

## 구현 기능 상세 설명

### 1. ValidationPipe (유효성 검사)

`main.ts`에 전역으로 등록된 `ValidationPipe`가 요청 Body의 유효성을 자동으로 검사해요.

```typescript
app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true,           // DTO에 없는 필드는 자동으로 제거
    forbidNonWhitelisted: true, // DTO에 없는 필드가 오면 400 에러
    transform: true,           // 타입 자동 변환 (string → number 등)
  }),
);
```

---

### 2. 커스텀 예외 필터

NestJS 기본 에러 응답 형식 대신 커스텀 형식으로 통일해줘요.  
`@Catch(HttpException)` 데코레이터로 모든 HTTP 예외를 잡아서 처리해요.

```
NotFoundException (404), BadRequestException (400),
UnauthorizedException (401), ConflictException (409) 등 모두 처리
```

---

### 3. 응답 인터셉터

모든 성공 응답을 `{ success: true, data: ... }` 형식으로 통일해줘요.  
RxJS의 `map` 연산자를 사용해서 컨트롤러의 반환값을 가공해요.

---

### 4. 페이지네이션

`GET /todos?page=1&limit=10` 형식으로 요청하면 데이터를 나눠서 받을 수 있어요.  
TypeORM의 `findAndCount`를 사용해서 데이터와 전체 개수를 한 번에 가져와요.

```
skip = (page - 1) * limit  →  건너뛸 데이터 수
take = limit                →  가져올 데이터 수
```

---

### 5. JWT 인증/인가

**회원가입**: 비밀번호를 `bcrypt`로 암호화해서 DB에 저장해요.  
**로그인**: 이메일/비밀번호 검증 후 JWT 토큰을 발급해요.  
**가드**: `JwtAuthGuard`가 모든 Todo API 요청에서 토큰을 검증해요.

```
토큰 없이 요청 → 401 에러
유효하지 않은 토큰 → 401 에러
유효한 토큰 → 요청 통과
```

---

## Git PR 흐름

이 프로젝트는 기능 단위로 브랜치를 나눠서 PR을 올리는 방식으로 진행했어요.

| 브랜치 | 작업 내용 |
|--------|----------|
| `docs/readme` | README.md 작성 |
| `feature/todos` | Todo CRUD API 구현 (메모리 배열 기반) |
| `feature/validation` | ValidationPipe 전역 등록, DTO 유효성 검사 |
| `feature/error-handling` | NotFoundException 적용, 버그 수정 |
| `feature/typeorm-mysql` | TypeORM + MySQL 연동, Repository 패턴 적용 |
| `feature/env-config` | 환경별 설정 분리 (.env.development / .env.production) |
| `feature/exception-filter` | 커스텀 HTTP 예외 필터 추가 |
| `feature/response-interceptor` | 응답 형식 통일 인터셉터 추가 |
| `feature/pagination` | 페이지네이션 추가 |
| `feature/auth` | JWT 인증/인가 (회원가입, 로그인, 가드) |

### PR 흐름 예시

```
1. main 브랜치에서 feature 브랜치 생성
   git checkout -b feature/새기능

2. 기능 구현 후 커밋
   git add .
   git commit -m "feat: 새 기능 추가"

3. 원격 저장소에 push
   git push origin feature/새기능

4. GitHub에서 PR 생성 → main으로 merge

5. 로컬 main 브랜치 최신화
   git checkout main
   git pull origin main
```