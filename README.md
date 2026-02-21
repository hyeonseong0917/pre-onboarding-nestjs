# pre-onboarding-nestjs

NestJS 실무 전 학습용 Todo List REST API 프로젝트입니다.

---

## 📌 프로젝트 목표

- NestJS 기본 구조 이해 (Module, Controller, Service, DTO)
- REST API 설계 및 구현
- Git 브랜치 전략 및 PR 기반 협업 흐름 연습

---

## 🛠 기술 스택

| 분류 | 기술 |
|------|------|
| Framework | NestJS |
| Language | TypeScript |
| Database | In-Memory (추후 TypeORM + MySQL 예정) |
| Version Control | Git / GitHub |

---

## 📁 프로젝트 구조

```
src/
├── todos/
│   ├── todos.module.ts
│   ├── todos.controller.ts
│   ├── todos.service.ts
│   ├── dto/
│   │   ├── create-todo.dto.ts
│   │   └── update-todo.dto.ts
│   └── entities/
│       └── todo.entity.ts
├── app.module.ts
└── main.ts
```

---

## 📋 요구사항 명세

### Todo 데이터 구조

| 필드 | 타입 | 설명 |
|------|------|------|
| id | number | 고유 식별자 (자동 생성) |
| title | string | 할 일 제목 |
| description | string | 할 일 상세 내용 |
| isCompleted | boolean | 완료 여부 (기본값: false) |
| createdAt | Date | 생성 시간 |

---

### API 명세

#### ✅ Todo 생성
- **POST** `/todos`
- Request Body
```json
{
  "title": "NestJS 공부",
  "description": "Controller, Service 개념 학습"
}
```
- Response `201`
```json
{
  "id": 1,
  "title": "NestJS 공부",
  "description": "Controller, Service 개념 학습",
  "isCompleted": false,
  "createdAt": "2025-03-01T00:00:00.000Z"
}
```

---

#### ✅ Todo 전체 조회
- **GET** `/todos`
- Response `200`
```json
[
  {
    "id": 1,
    "title": "NestJS 공부",
    "description": "Controller, Service 개념 학습",
    "isCompleted": false,
    "createdAt": "2025-03-01T00:00:00.000Z"
  }
]
```

---

#### ✅ Todo 단건 조회
- **GET** `/todos/:id`
- Response `200`
```json
{
  "id": 1,
  "title": "NestJS 공부",
  "description": "Controller, Service 개념 학습",
  "isCompleted": false,
  "createdAt": "2025-03-01T00:00:00.000Z"
}
```
- 존재하지 않는 id 조회 시 `404 Not Found`

---

#### ✅ Todo 수정
- **PATCH** `/todos/:id`
- Request Body (수정할 필드만 포함)
```json
{
  "title": "NestJS 심화 공부",
  "isCompleted": true
}
```
- Response `200` (수정된 Todo 반환)
- 존재하지 않는 id 수정 시 `404 Not Found`

---

#### ✅ Todo 삭제
- **DELETE** `/todos/:id`
- Response `200`
```json
{
  "message": "삭제되었습니다."
}
```
- 존재하지 않는 id 삭제 시 `404 Not Found`

---

## 🌿 브랜치 전략

```
main
└── feature/todo-init        # 프로젝트 초기 세팅
└── feature/todo-create      # 생성 API
└── feature/todo-read        # 조회 API
└── feature/todo-update      # 수정 API
└── feature/todo-delete      # 삭제 API
```

각 기능 단위로 브랜치를 만들고 PR을 올려 main에 merge하는 방식으로 진행합니다.

---

## 🚀 실행 방법

```bash
# 패키지 설치
npm install

# 개발 서버 실행
npm run start:dev

# 서버 주소
http://localhost:3000
```