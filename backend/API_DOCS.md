# HaruFit Backend API 명세서

이 문서는 HaruFit 백엔드 API의 사용법을 설명합니다.

**기본 URL:** `http://localhost:5000/api` (개발 환경)

---

## 1. 사용자 관리 API (`/api/users`)

### 1.1. 사용자 생성 (회원가입/닉네임 설정)

* **URL:** `/api/users`
* **메서드:** `POST`
* **설명:** 새로운 사용자를 생성합니다. (닉네임과 PIN은 필수)
* **요청 (Request Body - JSON):**
    ```json
    {
        "nickname": "String", // 필수: 사용자의 고유 닉네임 (최소 2자, 최대 20자)
        "pin": "String",      // 선택: 4-6자리 숫자 문자열 (PoC용 보안)
        "mode": "String"      // 선택: 'easy', 'normal', 'hard' 중 하나 (기본값: 'easy')
    }
    ```
* **응답 (Response - JSON):**
    * **성공 (201 Created):**
        ```json
        {
            "message": "사용자가 성공적으로 생성되었습니다.",
            "user": {
                "id": "String (MongoDB ObjectId)",
                "nickname": "String",
                "mode": "String",
                "createdAt": "Date"
            }
        }
        ```
    * **실패 (400 Bad Request):** (예: 닉네임 누락, PIN 형식 오류)
        ```json
        {
            "message": "닉네임은 필수 입력 항목입니다."
        }
        ```
    * **실패 (409 Conflict):** (예: 이미 존재하는 닉네임)
        ```json
        {
            "message": "이미 존재하는 닉네임입니다. 다른 닉네임을 선택해주세요."
        }
        ```

### 1.2. 사용자 정보 조회

* **URL:** `/api/users/:nickname` (경로 파라미터로 닉네임 전달)
* **메서드:** `GET`
* **설명:** 닉네임과 PIN을 통해 특정 사용자 정보를 조회합니다.
* **요청 (Request Query - URL 파라미터):**
    * `nickname`: `String` (필수: URL 경로에 포함. 예: `/api/users/testuser_with_pin`)
    * `pin`: `String` (필수: URL 쿼리 파라미터. 예: `?pin=1234`)
* **응답 (Response - JSON):**
    * **성공 (200 OK):**
        ```json
        {
            "message": "사용자 정보를 성공적으로 가져왔습니다.",
            "user": {
                "_id": "String (MongoDB ObjectId)",
                "nickname": "String",
                "mode": "String",
                "pin": "String", // PoC 단계에서는 포함될 수 있음
                "targetWeight": "Number",
                "targetCalories": "Number",
                "createdAt": "Date",
                "updatedAt": "Date"
            }
        }
        ```
    * **실패 (404 Not Found):** (예: 사용자를 찾을 수 없거나 PIN 불일치)
        ```json
        {
            "message": "사용자를 찾을 수 없거나 PIN이 일치하지 않습니다."
        }
        ```

---

## 2. AI 코치 대화 API (`/api/ai`)

### 2.1. AI 응답 생성 및 대화 기록 저장

* **URL:** `/api/ai/chat`
* **메서드:** `POST`
* **설명:** 사용자 메시지에 대한 AI 코치의 응답을 생성하고, 해당 대화를 대화 기록(ChatHistory)에 저장합니다.
* **요청 (Request Body - JSON):**
    ```json
    {
        "nickname": "String", // 필수: 대화하는 사용자의 닉네임
        "pin": "String",      // 필수: 사용자의 PIN
        "message": "String"   // 필수: 사용자 메시지
    }
    ```
* **응답 (Response - JSON):**
    * **성공 (200 OK):**
        ```json
        {
            "message": "AI 응답을 성공적으로 받았습니다.",
            "aiResponse": "String", // AI 코치의 답변 메시지
            "extractedData": {      // AI가 메시지에서 추출한 식단/운동 정보 (없으면 null)
                "type": "String (diet|workout)",
                "food_name": "String",
                "quantity": "String",
                "exercise_name": "String",
                "duration_minutes": "Number",
                "calories_burned": "Number"
            }
        }
        ```
    * **실패 (400 Bad Request):** (예: 메시지, 닉네임, PIN 누락)
        ```json
        {
            "message": "메시지를 입력해주세요."
        }
        ```
    * **실패 (404 Not Found):** (예: 사용자를 찾을 수 없거나 PIN 불일치)
        ```json
        {
            "message": "존재하지 않는 사용자이거나 PIN이 일치하지 않습니다."
        }
        ```

---

## 3. 식단 기록 API (`/api/diet`)

### 3.1. 식단 기록 추가

* **URL:** `/api/diet`
* **메서드:** `POST`
* **설명:** 사용자의 식단 기록을 추가합니다. `foodItems`에 `name`만 있어도 AI를 통해 영양 정보가 자동 추정됩니다.
* **요청 (Request Body - JSON):**
    ```json
    {
        "nickname": "String", // 필수: 사용자의 닉네임
        "pin": "String",      // 필수: 사용자의 PIN
        "date": "Date String",// 선택: 기록 날짜 (ISO 8601 형식), 기본값: 현재 시간
        "mealType": "String", // 선택: 'breakfast', 'lunch', 'dinner', 'snack', 'other' (기본값: 'other')
        "foodItems": [        // 필수: 섭취한 음식 목록
            {
                "name": "String",   // 필수: 음식명
                "calories": "Number", // 선택: 수동 입력 시 (미입력 시 AI 추정)
                "protein": "Number",  // 선택: 수동 입력 시 (미입력 시 AI 추정)
                "carbs": "Number",    // 선택: 수동 입력 시 (미입력 시 AI 추정)
                "fat": "Number",      // 선택: 수동 입력 시 (미입력 시 AI 추정)
                "quantity": "String"  // 선택: 섭취량 (예: "100g", "1개")
            }
        ],
        "waterIntakeMl": "Number", // 선택: 물 섭취량 (ml)
        "notes": "String"          // 선택: 기타 메모
    }
    ```
* **응답 (Response - JSON):**
    * **성공 (201 Created):**
        ```json
        {
            "message": "식단이 성공적으로 기록되었습니다.",
            "entry": {
                // DietEntry 스키마에 따라 기록된 식단 정보
            }
        }
        ```

### 3.2. 식단 기록 조회

* **URL:** `/api/diet`
* **메서드:** `GET`
* **설명:** 특정 사용자의 모든 식단 기록을 최신순으로 조회합니다.
* **요청 (Request Query - URL 파라미터):**
    * `nickname`: `String` (필수)
    * `pin`: `String` (필수)
* **응답 (Response - JSON):**
    * **성공 (200 OK):**
        ```json
        {
            "message": "식단 기록을 성공적으로 가져왔습니다.",
            "entries": [
                // DietEntry 배열
            ]
        }
        ```

### 3.3. 식단 기록 업데이트

* **URL:** `/api/diet/:nickname/:pin/:entryId`
* **메서드:** `PUT`
* **설명:** 특정 식단 기록을 업데이트합니다.
* **요청 (Request Body - JSON):** (업데이트할 필드만 포함)
    ```json
    {
        "mealType": "dinner",
        "foodItems": [
            {"name": "새로운 음식", "calories": 500}
        ],
        "notes": "수정된 메모"
    }
    ```
* **응답 (Response - JSON):**
    * **성공 (200 OK):**
        ```json
        {
            "message": "식단 기록이 성공적으로 업데이트되었습니다.",
            "entry": { /* 업데이트된 DietEntry 객체 */ }
        }
        ```

### 3.4. 식단 기록 삭제

* **URL:** `/api/diet/:nickname/:pin/:entryId`
* **메서드:** `DELETE`
* **설명:** 특정 식단 기록을 삭제합니다.
* **응답 (Response - JSON):**
    * **성공 (200 OK):**
        ```json
        {
            "message": "식단 기록이 성공적으로 삭제되었습니다.",
            "entry": { /* 삭제된 DietEntry 객체 */ }
        }
        ```

---

## 4. 운동 기록 API (`/api/workout`)

### 4.1. 운동 기록 추가

* **URL:** `/api/workout`
* **메서드:** `POST`
* **설명:** 사용자의 운동 기록을 추가합니다.
* **요청 (Request Body - JSON):**
    ```json
    {
        "nickname": "String", // 필수
        "pin": "String",      // 필수
        "date": "Date String",// 선택: 기본값 현재 시간
        "workoutType": "String", // 선택: 'cardio', 'strength', 'yoga', 'stretching', 'other'
        "exercises": [        // 필수: 운동 세부 목록
            {
                "name": "String",          // 필수: 운동명
                "durationMinutes": "Number",// 선택: 시간(분)
                "sets": "Number",          // 선택: 세트 수
                "reps": "Number",          // 선택: 반복 횟수
                "weightKg": "Number",      // 선택: 무게(kg)
                "caloriesBurned": "Number",// 선택: 예상 칼로리 소모량
                "notes": "String"          // 선택: 운동별 메모
            }
        ],
        "totalDurationMinutes": "Number", // 선택: 총 운동 시간 (자동 계산 또는 수동 입력)
        "totalCaloriesBurned": "Number",  // 선택: 총 소모 칼로리 (자동 계산 또는 수동 입력)
        "notes": "String"                 // 선택: 전체 운동 메모
    }
    ```
* **응답 (Response - JSON):**
    * **성공 (201 Created):**
        ```json
        {
            "message": "운동 기록이 성공적으로 추가되었습니다.",
            "entry": { /* WorkoutEntry 객체 */ }
        }
        ```

### 4.2. 운동 기록 조회

* **URL:** `/api/workout`
* **메서드:** `GET`
* **설명:** 특정 사용자의 모든 운동 기록을 최신순으로 조회합니다.
* **요청 (Request Query - URL 파라미터):**
    * `nickname`: `String` (필수)
    * `pin`: `String` (필수)
* **응답 (Response - JSON):**
    * **성공 (200 OK):**
        ```json
        {
            "message": "운동 기록을 성공적으로 가져왔습니다.",
            "entries": [
                // WorkoutEntry 배열
            ]
        }
        ```

### 4.3. 운동 기록 업데이트

* **URL:** `/api/workout/:nickname/:pin/:entryId`
* **메서드:** `PUT`
* **설명:** 특정 운동 기록을 업데이트합니다.
* **요청 (Request Body - JSON):** (업데이트할 필드만 포함)
    ```json
    {
        "workoutType": "cardio",
        "exercises": [
            {"name": "러닝", "durationMinutes": 30}
        ]
    }
    ```
* **응답 (Response - JSON):**
    * **성공 (200 OK):**
        ```json
        {
            "message": "운동 기록이 성공적으로 업데이트되었습니다.",
            "entry": { /* 업데이트된 WorkoutEntry 객체 */ }
        }
        ```

### 4.4. 운동 기록 삭제

* **URL:** `/api/workout/:nickname/:pin/:entryId`
* **메서드:** `DELETE`
* **설명:** 특정 운동 기록을 삭제합니다.
* **응답 (Response - JSON):**
    * **성공 (200 OK):**
        ```json
        {
            "message": "운동 기록이 성공적으로 삭제되었습니다.",
            "entry": { /* 삭제된 WorkoutEntry 객체 */ }
        }
        ```

---

## 5. 대화 기록 API (`/api/chatHistory`)

### 5.1. 사용자 대화 기록 조회

* **URL:** `/api/chatHistory/:nickname/:pin`
* **메서드:** `GET`
* **설명:** 특정 사용자와 AI 코치 간의 전체 대화 기록을 조회합니다.
* **요청 (Request Path - URL 파라미터):**
    * `nickname`: `String` (필수: URL 경로에 포함)
    * `pin`: `String` (필수: URL 경로에 포함)
* **응답 (Response - JSON):**
    * **성공 (200 OK):**
        ```json
        {
            "message": "대화 기록을 성공적으로 가져왔습니다.",
            "history": {
                "_id": "String (ObjectId)",
                "user": "String (User ObjectId)",
                "messages": [ // 대화 메시지 배열
                    {
                        "role": "String (user|assistant)",
                        "content": "String (메시지 내용)",
                        "timestamp": "Date",
                        "extractedData": { /* 추출된 데이터 (있으면) */ }
                    }
                ],
                "createdAt": "Date",
                "updatedAt": "Date"
            }
        }
        ```
    * **성공 (200 OK, 기록 없음):** (대화 기록이 아직 없는 경우)
        ```json
        {
            "message": "아직 대화 기록이 없습니다.",
            "history": { "messages": [] }
        }
        ```

### 5.2. 대화 기록 삭제 (전체)

* **URL:** `/api/chatHistory/:nickname/:pin`
* **메서드:** `DELETE`
* **설명:** 특정 사용자의 전체 대화 기록을 삭제합니다.
* **응답 (Response - JSON):**
    * **성공 (200 OK):**
        ```json
        {
            "message": "대화 기록이 성공적으로 삭제되었습니다."
        }
        ```

---

## 6. 캘린더 및 목표 설정 API (`/api/calendarGoal`)

### 6.1. 일일 요약 조회

* **URL:** `/api/calendarGoal/:nickname/:pin/daily-summary`
* **메서드:** `GET`
* **설명:** 특정 사용자의 특정 날짜 식단 및 운동 기록 요약을 조회합니다.
* **요청 (Request Path & Query - URL 파라미터):**
    * `nickname`: `String` (필수: URL 경로)
    * `pin`: `String` (필수: URL 경로)
    * `date`: `String` (필수: URL 쿼리 파라미터, `YYYY-MM-DD` 형식. 예: `?date=2025-07-15`)
* **응답 (Response - JSON):**
    * **성공 (200 OK):**
        ```json
        {
            "message": "일일 요약 데이터를 성공적으로 가져왔습니다.",
            "summary": {
                "date": "Date String",
                "totalCaloriesIntake": "Number (총 섭취 칼로리)",
                "totalCaloriesBurned": "Number (총 소모 칼로리)",
                "totalWaterIntakeMl": "Number (총 물 섭취량)",
                "dietEntriesCount": "Number (식단 기록 개수)",
                "workoutEntriesCount": "Number (운동 기록 개수)",
                "dailyNutritionGoals": { /* 해당 날짜의 목표치 */ },
                "progress": { /* 목표 대비 진행 상황 */ }
            }
        }
        ```

### 6.2. 목표 설정

* **URL:** `/api/calendarGoal/:nickname/:pin/goals`
* **메서드:** `POST`
* **설명:** 사용자의 목표(예: 목표 체중, 목표 칼로리)를 설정합니다.
* **요청 (Request Body - JSON):**
    ```json
    {
        "targetWeight": "Number",  // 선택: 목표 체중 (kg)
        "targetCalories": "Number" // 선택: 목표 칼로리 (kcal)
    }
    ```
* **응답 (Response - JSON):**
    * **성공 (200 OK):**
        ```json
        {
            "message": "목표가 성공적으로 설정되었습니다.",
            "user": { /* 업데이트된 User 객체 (목표 필드 포함) */ }
        }
        ```

### 6.3. 목표 조회

* **URL:** `/api/calendarGoal/:nickname/:pin/goals`
* **메서드:** `GET`
* **설명:** 사용자의 현재 설정된 목표를 조회합니다.
* **응답 (Response - JSON):**
    * **성공 (200 OK):**
        ```json
        {
            "message": "목표를 성공적으로 가져왔습니다.",
            "goals": {
                "targetWeight": "Number",
                "targetCalories": "Number"
            }
        }
        ```

### 6.4. 목표 업데이트

* **URL:** `/api/calendarGoal/:nickname/:pin/goals`
* **메서드:** `PUT`
* **설명:** 사용자의 목표를 업데이트합니다. (업데이트할 필드만 포함)
* **요청 (Request Body - JSON):**
    ```json
    {
        "targetWeight": "Number" // 업데이트할 목표 체중
        // "targetCalories": "Number" // 업데이트할 목표 칼로리
    }
    ```
* **응답 (Response - JSON):**
    * **성공 (200 OK):**
        ```json
        {
            "message": "목표가 성공적으로 업데이트되었습니다.",
            "user": { /* 업데이트된 User 객체 */ }
        }
        ```

### 6.5. 목표 삭제

* **URL:** `/api/calendarGoal/:nickname/:pin/goals`
* **메서드:** `DELETE`
* **설명:** 사용자의 목표를 삭제합니다. (실제로는 `targetWeight`, `targetCalories` 필드를 `null`로 설정)
* **응답 (Response - JSON):**
    * **성공 (200 OK):**
        ```json
        {
            "message": "목표가 성공적으로 삭제되었습니다.",
            "user": { /* 업데이트된 User 객체 (목표 필드 null) */ }
        }
        ```

