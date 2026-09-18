# API Endpoints Documentation

## Base URL
http://localhost:8000/api/v1

## Authentication

### Login Endpoints

#### 1) Admin Login
- Method: POST
- Endpoint: /api/v1/admins/login
- Auth: Public
- Body:
```json
{
  "email": "admin1@school.test",
  "password": "Password123!"
}
```
- Response:
```json
{
  "data": {
    "name": "Admin 1",
    "email": "admin1@school.test",
    "role": "admin"
  },
  "token": "JWT_TOKEN"
}
```

#### 2) Teacher Login
- Method: POST
- Endpoint: /api/v1/teachers/login
- Auth: Public
- Body:
```json
{
  "email": "teacher1@school.test",
  "password": "Password123!"
}
```
- Response:
```json
{
  "status": "success",
  "message": "Teacher logged in successfully",
  "data": "JWT_TOKEN"
}
```

#### 3) Student Login
- Method: POST
- Endpoint: /api/v1/students/login
- Auth: Public
- Body:
```json
{
  "email": "student1@school.test",
  "password": "Password123!"
}
```
- Response:
```json
{
  "status": "success",
  "message": "Student logged in successfully",
  "data": "JWT_TOKEN"
}
```

#### 4) Parent Login
- Method: POST
- Endpoint: /api/v1/parents/login
- Auth: Public
- Body:
```json
{
  "email": "parent1@school.test",
  "password": "Password123!"
}
```
- Response:
```json
{
  "status": "success",
  "message": "Parents logged in successfully",
  "data": "JWT_TOKEN"
}
```

#### 5) Admin Register
- Method: POST
- Endpoint: /api/v1/admins/register
- Auth: Public
- Body:
```json
{
  "name": "New Admin",
  "email": "newadmin@school.test",
  "password": "Password123!",
  "phone": "08012345678",
  "address": "School Address",
  "schoolName": "My School",
  "city": "Lagos",
  "lauguage": "English"
}
```

---

# Admin APIs

## Admin Routes

### 1) Get all admins
- Method: GET
- Endpoint: /api/v1/admins
- Auth: Requires Admin
- Headers:
  - Authorization: Bearer <admin-token>

### 2) Get admin profile
- Method: GET
- Endpoint: /api/v1/admins/profile
- Auth: Requires Admin
- Headers:
  - Authorization: Bearer <admin-token>

### 3) Update admin
- Method: PUT
- Endpoint: /api/v1/admins/:id
- Auth: Not enforced in route file
- Headers:
  - Content-Type: application/json
- Body:
```json
{
  "name": "Updated Name",
  "email": "updated@school.test",
  "password": "Password123!",
  "phone": "08000000000",
  "address": "Updated Address",
  "schoolName": "Updated School",
  "city": "Lagos",
  "lauguage": "English"
}
```

### 4) Delete admin
- Method: DELETE
- Endpoint: /api/v1/admins/:id
- Auth: Not enforced in route file

---

# Teacher APIs

## Teacher Routes

### 1) Register teacher as admin
- Method: POST
- Endpoint: /api/v1/teachers/admins/register
- Auth: Requires Admin
- Headers:
  - Authorization: Bearer <admin-token>
  - Content-Type: application/json
- Body:
```json
{
  "name": "Teacher Demo",
  "email": "teacher-demo@school.test",
  "password": "Password123!",
  "gender": "Male",
  "phone": "08012345678",
  "address": "School Street",
  "subject": "64f00000000000000000000",
  "religion": "Christian",
  "classLevels": ["64f00000000000000000001"]
}
```

### 2) Teacher login
- Method: POST
- Endpoint: /api/v1/teachers/login
- Auth: Public

### 3) Get all teachers as admin
- Method: GET
- Endpoint: /api/v1/teachers/admin
- Auth: Requires Admin
- Headers:
  - Authorization: Bearer <admin-token>

### 4) Get teacher by admin
- Method: GET
- Endpoint: /api/v1/teachers/:teacherID/admin
- Auth: Requires Admin
- Headers:
  - Authorization: Bearer <admin-token>

### 5) Get teacher profile
- Method: GET
- Endpoint: /api/v1/teachers/profile
- Auth: Requires Teacher
- Headers:
  - Authorization: Bearer <teacher-token>

### 6) Update teacher profile
- Method: PUT
- Endpoint: /api/v1/teachers/:teacherID/update
- Auth: Requires Teacher
- Headers:
  - Authorization: Bearer <teacher-token>
  - Content-Type: application/json
- Body:
```json
{
  "email": "updated-teacher@school.test",
  "name": "Updated Teacher",
  "password": "Password123!",
  "phone": "08000000000",
  "address": "Updated Address",
  "subject": "64f00000000000000000000",
  "religion": "Muslim"
}
```

### 7) Admin update teacher
- Method: PUT
- Endpoint: /api/v1/teachers/:teacherID/admin
- Auth: Requires Admin
- Headers:
  - Authorization: Bearer <admin-token>
  - Content-Type: application/json
- Body:
```json
{
  "program": "64f00000000000000000002",
  "classLevel": "64f00000000000000000003",
  "academicYear": "64f00000000000000000004",
  "subject": "64f00000000000000000005"
}
```

### 8) Delete teacher
- Method: DELETE
- Endpoint: /api/v1/teachers/:teacherID/admin
- Auth: Not enforced in route file

---

# Student APIs

## Student Routes

### 1) Register student as admin
- Method: POST
- Endpoint: /api/v1/students/admins/register
- Auth: Requires Admin
- Headers:
  - Authorization: Bearer <admin-token>
  - Content-Type: application/json
- Body:
```json
{
  "name": "Student Demo",
  "email": "student-demo@school.test",
  "password": "Password123!",
  "admissionDate": "2025-09-01",
  "phone": "09012345678",
  "address": "Student Avenue",
  "gender": "Female",
  "fatherOccupation": "Engineer",
  "dateOfBirth": "2008-05-20",
  "motherName": "Mary Demo",
  "fatherName": "John Demo",
  "religion": "Christian",
  "status": false,
  "classLevels": ["64f00000000000000000001"],
  "fatherEmail": "john.demo@example.com"
}
```

### 2) Student login
- Method: POST
- Endpoint: /api/v1/students/login
- Auth: Public

### 3) Get all students as admin
- Method: GET
- Endpoint: /api/v1/students/admin
- Auth: Requires Admin
- Headers:
  - Authorization: Bearer <admin-token>

### 4) Get student by admin
- Method: GET
- Endpoint: /api/v1/students/:studentID/admin
- Auth: Requires Admin
- Headers:
  - Authorization: Bearer <admin-token>

### 5) Get student profile
- Method: GET
- Endpoint: /api/v1/students/profile
- Auth: Requires Student
- Headers:
  - Authorization: Bearer <student-token>

### 6) Update student profile
- Method: PUT
- Endpoint: /api/v1/students/update
- Auth: Requires Student
- Headers:
  - Authorization: Bearer <student-token>
  - Content-Type: application/json
- Body:
```json
{
  "email": "student-updated@school.test",
  "password": "Password123!"
}
```

### 7) Admin update student
- Method: PUT
- Endpoint: /api/v1/students/:studentID/update/admin
- Auth: Requires Admin
- Headers:
  - Authorization: Bearer <admin-token>
  - Content-Type: application/json
- Body:
```json
{
  "name": "Updated Student",
  "email": "updated-student@school.test",
  "password": "Password123!",
  "admissionDate": "2025-09-01",
  "phone": "09012345678",
  "address": "Updated Address",
  "gender": "Male",
  "fatherOccupation": "Doctor",
  "dateOfBirth": "2008-05-20",
  "motherName": "Jane Demo",
  "fatherName": "James Demo",
  "fatherEmail": "james.demo@example.com",
  "religion": "Christian",
  "status": false,
  "classLevels": ["64f00000000000000000001"]
}
```

### 8) Delete student
- Method: DELETE
- Endpoint: /api/v1/students/:studentID/admin
- Auth: Not enforced in route file

### 9) Write exam
- Method: POST
- Endpoint: /api/v1/students/exam/:examID/write
- Auth: Requires Student
- Headers:
  - Authorization: Bearer <student-token>
  - Content-Type: application/json
- Body:
```json
{
  "answers": ["Option B", "Option A", "Option C"]
}
```

---

# Parent APIs

## Parent Routes

### 1) Register parent as admin
- Method: POST
- Endpoint: /api/v1/parents/admins/register
- Auth: Requires Admin
- Headers:
  - Authorization: Bearer <admin-token>
  - Content-Type: application/json
- Body:
```json
{
  "name": "Parent Demo",
  "email": "parent-demo@school.test",
  "password": "Password123!",
  "student": ["64f00000000000000000006"],
  "phone": 8012345678,
  "address": "Parent Street",
  "occupation": "Business",
  "religion": "Christian"
}
```

### 2) Parent login
- Method: POST
- Endpoint: /api/v1/parents/login
- Auth: Public

### 3) Get all parents as admin
- Method: GET
- Endpoint: /api/v1/parents/admin
- Auth: Requires Admin
- Headers:
  - Authorization: Bearer <admin-token>

### 4) Get parent by admin
- Method: GET
- Endpoint: /api/v1/parents/:parentID/admin
- Auth: Requires Admin
- Headers:
  - Authorization: Bearer <admin-token>

### 5) Get parent profile
- Method: GET
- Endpoint: /api/v1/parents/profile
- Auth: Requires Parent
- Headers:
  - Authorization: Bearer <parent-token>

### 6) Update parent by admin
- Method: PUT
- Endpoint: /api/v1/parents/:parentID/admin
- Auth: Requires Admin
- Headers:
  - Authorization: Bearer <admin-token>
  - Content-Type: application/json
- Body:
```json
{
  "email": "updated-parent@school.test",
  "name": "Updated Parent",
  "password": "Password123!",
  "phone": 8012345678,
  "address": "Updated Address",
  "occupation": "Teacher"
}
```

---

# Academic APIs

## Academic Years

### 1) Create academic year
- Method: POST
- Endpoint: /api/v1/academics
- Auth: Requires Admin
- Headers:
  - Authorization: Bearer <admin-token>
  - Content-Type: application/json
- Body:
```json
{
  "name": "Academic Year 2025",
  "fromYear": "2025-09-01T00:00:00.000Z",
  "toYear": "2026-08-31T00:00:00.000Z"
}
```

### 2) Get all academic years
- Method: GET
- Endpoint: /api/v1/academics
- Auth: Requires Admin
- Headers:
  - Authorization: Bearer <admin-token>

### 3) Get academic year
- Method: GET
- Endpoint: /api/v1/academics/:id
- Auth: Requires Admin
- Headers:
  - Authorization: Bearer <admin-token>

### 4) Update academic year
- Method: PUT
- Endpoint: /api/v1/academics/:id
- Auth: Requires Admin
- Headers:
  - Authorization: Bearer <admin-token>
  - Content-Type: application/json

### 5) Delete academic year
- Method: DELETE
- Endpoint: /api/v1/academics/:id
- Auth: Requires Admin

## Academic Terms

### 1) Create academic term
- Method: POST
- Endpoint: /api/v1/terms
- Auth: Requires Admin
- Headers:
  - Authorization: Bearer <admin-token>
  - Content-Type: application/json
- Body:
```json
{
  "name": "1st Term",
  "description": "First academic term",
  "duration": "3 months"
}
```

### 2) Get all academic terms
- Method: GET
- Endpoint: /api/v1/terms
- Auth: Requires Admin
- Headers:
  - Authorization: Bearer <admin-token>

### 3) Get academic term
- Method: GET
- Endpoint: /api/v1/terms/:id
- Auth: Requires Admin
- Headers:
  - Authorization: Bearer <admin-token>

### 4) Update academic term
- Method: PUT
- Endpoint: /api/v1/terms/:id
- Auth: Requires Admin
- Headers:
  - Authorization: Bearer <admin-token>
  - Content-Type: application/json

### 5) Delete academic term
- Method: DELETE
- Endpoint: /api/v1/terms/:id
- Auth: Requires Admin

## Class Levels

### 1) Create class level
- Method: POST
- Endpoint: /api/v1/class-Level
- Auth: Requires Admin
- Headers:
  - Authorization: Bearer <admin-token>
  - Content-Type: application/json
- Body:
```json
{
  "name": "Level 100",
  "description": "Freshman class level",
  "amount": 5000
}
```

### 2) Get all class levels
- Method: GET
- Endpoint: /api/v1/class-Level
- Auth: Requires Admin
- Headers:
  - Authorization: Bearer <admin-token>

### 3) Get class level
- Method: GET
- Endpoint: /api/v1/class-Level/:id
- Auth: Requires Admin
- Headers:
  - Authorization: Bearer <admin-token>

### 4) Update class level
- Method: PUT
- Endpoint: /api/v1/class-Level/:id
- Auth: Requires Admin
- Headers:
  - Authorization: Bearer <admin-token>
  - Content-Type: application/json

### 5) Delete class level
- Method: DELETE
- Endpoint: /api/v1/class-Level/:id
- Auth: Requires Admin

## Programs

### 1) Create program
- Method: POST
- Endpoint: /api/v1/program
- Auth: Requires Admin
- Headers:
  - Authorization: Bearer <admin-token>
  - Content-Type: application/json
- Body:
```json
{
  "name": "Computer Science",
  "description": "Computer science and software development program"
}
```

### 2) Get all programs
- Method: GET
- Endpoint: /api/v1/program
- Auth: Requires Admin
- Headers:
  - Authorization: Bearer <admin-token>

### 3) Get program
- Method: GET
- Endpoint: /api/v1/program/:id
- Auth: Requires Admin
- Headers:
  - Authorization: Bearer <admin-token>

### 4) Update program
- Method: PUT
- Endpoint: /api/v1/program/:id
- Auth: Requires Admin
- Headers:
  - Authorization: Bearer <admin-token>
  - Content-Type: application/json

### 5) Delete program
- Method: DELETE
- Endpoint: /api/v1/program/:id
- Auth: Requires Admin

## Subjects

### 1) Get all subjects
- Method: GET
- Endpoint: /api/v1/subjects
- Auth: Requires Admin
- Headers:
  - Authorization: Bearer <admin-token>

### 2) Create subject
- Method: POST
- Endpoint: /api/v1/subjects
- Auth: Requires Admin
- Headers:
  - Authorization: Bearer <admin-token>
  - Content-Type: application/json
- Body:
```json
{
  "name": "Mathematics",
  "day": "Monday",
  "classes": "Room 101",
  "teacher": "64f00000000000000000007",
  "academicTerm": "64f00000000000000000008"
}
```

### 3) Get subject
- Method: GET
- Endpoint: /api/v1/subjects/:id
- Auth: Requires Admin
- Headers:
  - Authorization: Bearer <admin-token>

### 4) Update subject
- Method: PUT
- Endpoint: /api/v1/subjects/:id
- Auth: Not enforced in route file
- Headers:
  - Content-Type: application/json

### 5) Delete subject
- Method: DELETE
- Endpoint: /api/v1/subjects/:id
- Auth: Not enforced in route file

## Year Groups

### 1) Create year group
- Method: POST
- Endpoint: /api/v1/year-Groups
- Auth: Requires Admin
- Headers:
  - Authorization: Bearer <admin-token>
  - Content-Type: application/json
- Body:
```json
{
  "name": "Year Group 1",
  "academicYear": "64f00000000000000000009"
}
```

### 2) Get all year groups
- Method: GET
- Endpoint: /api/v1/year-Groups
- Auth: Requires Admin
- Headers:
  - Authorization: Bearer <admin-token>

### 3) Get year group
- Method: GET
- Endpoint: /api/v1/year-Groups/:id
- Auth: Requires Admin
- Headers:
  - Authorization: Bearer <admin-token>

### 4) Update year group
- Method: PUT
- Endpoint: /api/v1/year-Groups/:id
- Auth: Requires Admin
- Headers:
  - Authorization: Bearer <admin-token>
  - Content-Type: application/json

### 5) Delete year group
- Method: DELETE
- Endpoint: /api/v1/year-Groups/:id
- Auth: Requires Admin

---

# Exam APIs

## Exams

### 1) Create exam
- Method: POST
- Endpoint: /api/v1/exams
- Auth: Requires Teacher
- Headers:
  - Authorization: Bearer <teacher-token>
  - Content-Type: application/json
- Body:
```json
{
  "name": "Exam 1",
  "description": "Examination 1",
  "subject": "64f00000000000000000010",
  "duration": "30 minutes",
  "examDate": "2025-09-15T00:00:00.000Z",
  "examTime": "09:00",
  "examType": "Quiz",
  "classLevel": "64f00000000000000000011"
}
```

### 2) Get all exams
- Method: GET
- Endpoint: /api/v1/exams
- Auth: Requires Teacher
- Headers:
  - Authorization: Bearer <teacher-token>

### 3) Get exam
- Method: GET
- Endpoint: /api/v1/exams/:id
- Auth: Requires Teacher
- Headers:
  - Authorization: Bearer <teacher-token>

### 4) Update exam
- Method: PUT
- Endpoint: /api/v1/exams/:id
- Auth: Requires Teacher
- Headers:
  - Authorization: Bearer <teacher-token>
  - Content-Type: application/json

## Questions

### 1) Get all questions
- Method: GET
- Endpoint: /api/v1/questions
- Auth: Requires Teacher
- Headers:
  - Authorization: Bearer <teacher-token>

### 2) Create question
- Method: POST
- Endpoint: /api/v1/questions/:examID
- Auth: Requires Teacher
- Headers:
  - Authorization: Bearer <teacher-token>
  - Content-Type: application/json
- Body:
```json
{
  "question": "What is the correct answer for Question 1?",
  "optionA": "Option A",
  "optionB": "Option B",
  "optionC": "Option C",
  "optionD": "Option D",
  "correctAnswer": "Option B"
}
```

### 3) Get question
- Method: GET
- Endpoint: /api/v1/questions/:id
- Auth: Requires Teacher
- Headers:
  - Authorization: Bearer <teacher-token>

### 4) Update question
- Method: PUT
- Endpoint: /api/v1/questions/:id
- Auth: Requires Teacher
- Headers:
  - Authorization: Bearer <teacher-token>
  - Content-Type: application/json

## Exam Results

### 1) Get all exam results
- Method: GET
- Endpoint: /api/v1/exam-results
- Auth: Requires Student
- Headers:
  - Authorization: Bearer <student-token>

### 2) Check exam result
- Method: GET
- Endpoint: /api/v1/exam-results/:id/checking
- Auth: Requires Student
- Headers:
  - Authorization: Bearer <student-token>

### 3) Admin publish/unpublish result
- Method: PUT
- Endpoint: /api/v1/exam-results/:id/checking
- Auth: Requires Admin
- Headers:
  - Authorization: Bearer <admin-token>
  - Content-Type: application/json
- Body:
```json
{
  "publish": true
}
```

### 4) Admin publish/unpublish result (alternate route)
- Method: PUT
- Endpoint: /api/v1/exam-results/:id/admin-toggle-publish
- Auth: Requires Admin
- Headers:
  - Authorization: Bearer <admin-token>
  - Content-Type: application/json
- Body:
```json
{
  "publish": true
}
```

---

# Other APIs

## Fees Group

### 1) Create fees group
- Method: POST
- Endpoint: /api/v1/feesGroup
- Auth: Requires Admin
- Headers:
  - Authorization: Bearer <admin-token>
  - Content-Type: application/json

### 2) Get all fees groups
- Method: GET
- Endpoint: /api/v1/feesGroup
- Auth: Requires Admin
- Headers:
  - Authorization: Bearer <admin-token>

### 3) Get fees group
- Method: GET
- Endpoint: /api/v1/feesGroup/:id
- Auth: Requires Admin
- Headers:
  - Authorization: Bearer <admin-token>

### 4) Update fees group
- Method: PUT
- Endpoint: /api/v1/feesGroup/:id
- Auth: Requires Admin
- Headers:
  - Authorization: Bearer <admin-token>
  - Content-Type: application/json

### 5) Delete fees group
- Method: DELETE
- Endpoint: /api/v1/feesGroup/:id
- Auth: Requires Admin
- Headers:
  - Authorization: Bearer <admin-token>

## Expenses

### 1) Create expense
- Method: POST
- Endpoint: /api/v1/expenses
- Auth: Requires Admin
- Headers:
  - Authorization: Bearer <admin-token>
  - Content-Type: application/json

### 2) Get all expenses
- Method: GET
- Endpoint: /api/v1/expenses
- Auth: Requires Admin
- Headers:
  - Authorization: Bearer <admin-token>

### 3) Update expense
- Method: PUT
- Endpoint: /api/v1/expenses/:id
- Auth: Requires Admin
- Headers:
  - Authorization: Bearer <admin-token>
  - Content-Type: application/json

### 4) Delete expense
- Method: DELETE
- Endpoint: /api/v1/expenses/:id
- Auth: Requires Admin
- Headers:
  - Authorization: Bearer <admin-token>

---

# Nested Routes That Exist

## Under Class Levels
- POST /api/v1/class-Level/:id/students/admins/register
- POST /api/v1/class-Level/:id/students/login
- GET /api/v1/class-Level/:id/students/admin
- GET /api/v1/class-Level/:id/students/:studentID/admin
- GET /api/v1/class-Level/:id/students/profile
- PUT /api/v1/class-Level/:id/students/update
- PUT /api/v1/class-Level/:id/students/:studentID/update/admin
- DELETE /api/v1/class-Level/:id/students/:studentID/admin
- POST /api/v1/class-Level/:id/students/exam/:examID/write

## Under Expenses
- POST /api/v1/expenses/:id/students/admins/register
- POST /api/v1/expenses/:id/students/login
- GET /api/v1/expenses/:id/students/admin
- GET /api/v1/expenses/:id/students/:studentID/admin
- GET /api/v1/expenses/:id/students/profile
- PUT /api/v1/expenses/:id/students/update
- PUT /api/v1/expenses/:id/students/:studentID/update/admin
- DELETE /api/v1/expenses/:id/students/:studentID/admin
- POST /api/v1/expenses/:id/students/exam/:examID/write

---

# Complete Endpoint List

- POST /api/v1/admins/register
- POST /api/v1/admins/login
- GET /api/v1/admins
- GET /api/v1/admins/profile
- PUT /api/v1/admins/:id
- DELETE /api/v1/admins/:id

- POST /api/v1/teachers/admins/register
- POST /api/v1/teachers/login
- GET /api/v1/teachers/admin
- GET /api/v1/teachers/:teacherID/admin
- GET /api/v1/teachers/profile
- PUT /api/v1/teachers/:teacherID/update
- PUT /api/v1/teachers/:teacherID/admin
- DELETE /api/v1/teachers/:teacherID/admin

- POST /api/v1/students/admins/register
- POST /api/v1/students/login
- GET /api/v1/students/admin
- GET /api/v1/students/:studentID/admin
- GET /api/v1/students/profile
- PUT /api/v1/students/update
- PUT /api/v1/students/:studentID/update/admin
- DELETE /api/v1/students/:studentID/admin
- POST /api/v1/students/exam/:examID/write

- POST /api/v1/parents/admins/register
- POST /api/v1/parents/login
- GET /api/v1/parents/admin
- GET /api/v1/parents/:parentID/admin
- GET /api/v1/parents/profile
- PUT /api/v1/parents/:parentID/admin

- POST /api/v1/academics
- GET /api/v1/academics
- GET /api/v1/academics/:id
- PUT /api/v1/academics/:id
- DELETE /api/v1/academics/:id

- POST /api/v1/terms
- GET /api/v1/terms
- GET /api/v1/terms/:id
- PUT /api/v1/terms/:id
- DELETE /api/v1/terms/:id

- POST /api/v1/class-Level
- GET /api/v1/class-Level
- GET /api/v1/class-Level/:id
- PUT /api/v1/class-Level/:id
- DELETE /api/v1/class-Level/:id

- POST /api/v1/program
- GET /api/v1/program
- GET /api/v1/program/:id
- PUT /api/v1/program/:id
- DELETE /api/v1/program/:id

- GET /api/v1/subjects
- POST /api/v1/subjects
- GET /api/v1/subjects/:id
- PUT /api/v1/subjects/:id
- DELETE /api/v1/subjects/:id

- POST /api/v1/year-Groups
- GET /api/v1/year-Groups
- GET /api/v1/year-Groups/:id
- PUT /api/v1/year-Groups/:id
- DELETE /api/v1/year-Groups/:id

- POST /api/v1/exams
- GET /api/v1/exams
- GET /api/v1/exams/:id
- PUT /api/v1/exams/:id

- GET /api/v1/questions
- POST /api/v1/questions/:examID
- GET /api/v1/questions/:id
- PUT /api/v1/questions/:id

- GET /api/v1/exam-results
- GET /api/v1/exam-results/:id/checking
- PUT /api/v1/exam-results/:id/checking
- PUT /api/v1/exam-results/:id/admin-toggle-publish

- POST /api/v1/feesGroup
- GET /api/v1/feesGroup
- GET /api/v1/feesGroup/:id
- PUT /api/v1/feesGroup/:id
- DELETE /api/v1/feesGroup/:id

- POST /api/v1/expenses
- GET /api/v1/expenses
- PUT /api/v1/expenses/:id
- DELETE /api/v1/expenses/:id

- POST /api/v1/class-Level/:id/students/admins/register
- POST /api/v1/class-Level/:id/students/login
- GET /api/v1/class-Level/:id/students/admin
- GET /api/v1/class-Level/:id/students/:studentID/admin
- GET /api/v1/class-Level/:id/students/profile
- PUT /api/v1/class-Level/:id/students/update
- PUT /api/v1/class-Level/:id/students/:studentID/update/admin
- DELETE /api/v1/class-Level/:id/students/:studentID/admin
- POST /api/v1/class-Level/:id/students/exam/:examID/write

- POST /api/v1/expenses/:id/students/admins/register
- POST /api/v1/expenses/:id/students/login
- GET /api/v1/expenses/:id/students/admin
- GET /api/v1/expenses/:id/students/:studentID/admin
- GET /api/v1/expenses/:id/students/profile
- PUT /api/v1/expenses/:id/students/update
- PUT /api/v1/expenses/:id/students/:studentID/update/admin
- DELETE /api/v1/expenses/:id/students/:studentID/admin
- POST /api/v1/expenses/:id/students/exam/:examID/write

---

# ملاحظات مهمة
- المشروع لا يحتوي على upload middleware أو file upload endpoints.
- المشروع لا يحتوي على PATCH endpoints.
- هذا الملف تم إنشاؤه فقط بناءً على الملفات الحالية في المشروع، بدون إضافة أي endpoints غير موجودة.
- بعض الـ routes لا تحتوي على auth فعليًا في الملف الخاص بها، لذلك يجب على الـ frontend التعامل معها بحذر.
