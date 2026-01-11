# Task Management App - Complete Backend API Reference

**Version:** 1.0 | **Base URL:** `https://api.taskmanager.com/v1` | **Auth:** Bearer Token (JWT)

---

## 📋 Quick Reference Index

- [1. Authentication & Authorization (12 APIs)](#1-authentication--authorization)
- [2. User Management (13 APIs)](#2-user-management)
- [3. Department Management (9 APIs)](#3-department-management)
- [4. Project Management (15 APIs)](#4-project-management)
- [5. Task Management (18 APIs)](#5-task-management)
- [6. Bug Management (16 APIs)](#6-bug-management)
- [7. Attendance Management (12 APIs)](#7-attendance-management)
- [8. Leave Management (10 APIs)](#8-leave-management)
- [9. Time Tracking (8 APIs)](#9-time-tracking)
- [10. Timesheet Management (7 APIs)](#10-timesheet-management)
- [11. Dashboard & Analytics (10 APIs)](#11-dashboard--analytics)
- [12. Notifications (8 APIs)](#12-notifications)
- [13. Communication (12 APIs)](#13-communication)
- [14. Document Management (10 APIs)](#14-document-management)
- [15. Performance & Goals (12 APIs)](#15-performance--goals)
- [16. Training & Development (10 APIs)](#16-training--development)
- [17. Expense Management (9 APIs)](#17-expense-management)
- [18. Settings & Configuration (8 APIs)](#18-settings--configuration)
- [19. Reports (12 APIs)](#19-reports)
- [20. Miscellaneous (6 APIs)](#20-miscellaneous)

**Total APIs: 197**

---

## 1. Authentication & Authorization

### 1.1 User Registration
```
POST /auth/register
```
**Purpose:** Register new user account  
**Auth:** None  
**Body:** `{ first_name, last_name, email, password, password_confirmation, phone?, accept_terms }`  
**Response:** User object with email verification message  
**Why:** Onboard new users, collect essential info, trigger email verification

---

### 1.2 User Login
```
POST /auth/login
```
**Purpose:** Authenticate user and generate JWT token  
**Auth:** None  
**Body:** `{ email, password, remember_me? }`  
**Response:** `{ user, access_token, refresh_token, expires_in }`  
**Why:** Secure authentication, session management, return user context

---

### 1.3 Logout
```
POST /auth/logout
```
**Purpose:** Invalidate user session  
**Auth:** Required  
**Body:** `{ all_devices? }`  
**Response:** Success message  
**Why:** End sessions securely, blacklist tokens, logout from multiple devices

---

### 1.4 Refresh Token
```
POST /auth/refresh
```
**Purpose:** Renew access token  
**Auth:** Refresh Token  
**Body:** `{ refresh_token }`  
**Response:** New access token  
**Why:** Seamless token renewal without re-login

---

### 1.5 Forgot Password
```
POST /auth/forgot-password
```
**Purpose:** Send password reset email  
**Auth:** None  
**Body:** `{ email }`  
**Response:** Success message  
**Why:** Password recovery, generate reset token

---

### 1.6 Reset Password
```
POST /auth/reset-password
```
**Purpose:** Reset password with token  
**Auth:** None  
**Body:** `{ token, email, password, password_confirmation }`  
**Response:** Success message  
**Why:** Complete password reset, validate token

---

### 1.7 Change Password
```
PUT /auth/change-password
```
**Purpose:** Change password for logged-in user  
**Auth:** Required  
**Body:** `{ current_password, new_password, new_password_confirmation }`  
**Response:** Success message  
**Why:** Allow password updates, verify current password

---

### 1.8 Verify Email
```
GET /auth/verify-email/{token}
```
**Purpose:** Verify user email  
**Auth:** None  
**Params:** token (path)  
**Response:** Success message  
**Why:** Confirm email ownership, activate account

---

### 1.9 Resend Verification Email
```
POST /auth/resend-verification
```
**Purpose:** Resend email verification link  
**Auth:** Required  
**Response:** Success message  
**Why:** Handle missed verification emails

---

### 1.10 Enable 2FA
```
POST /auth/2fa/enable
```
**Purpose:** Enable two-factor authentication  
**Auth:** Required  
**Body:** `{ method: 'email'|'sms'|'authenticator' }`  
**Response:** QR code (if authenticator), backup codes  
**Why:** Enhanced security, support multiple 2FA methods

---

### 1.11 Verify 2FA Code
```
POST /auth/2fa/verify
```
**Purpose:** Verify 2FA code during login  
**Auth:** Temp Token  
**Body:** `{ code, temp_token }`  
**Response:** Access and refresh tokens  
**Why:** Complete 2FA flow, generate final tokens

---

### 1.12 Disable 2FA
```
POST /auth/2fa/disable
```
**Purpose:** Disable two-factor authentication  
**Auth:** Required  
**Body:** `{ password }`  
**Response:** Success message  
**Why:** Allow 2FA removal with password verification

---

## 2. User Management

### 2.1 Get Current User Profile
```
GET /users/me
```
**Purpose:** Get authenticated user's profile  
**Auth:** Required  
**Response:** Complete user object with preferences, department, manager  
**Why:** Display profile, populate forms, personalization

---

### 2.2 Update Current User Profile
```
PUT /users/me
```
**Purpose:** Update own profile  
**Auth:** Required  
**Body:** `{ first_name?, last_name?, phone?, date_of_birth?, gender?, address?, bio?, skills?, emergency_contact? }`  
**Response:** Updated user object  
**Why:** Allow users to maintain their information

---

### 2.3 Upload Profile Picture
```
POST /users/me/profile-picture
```
**Purpose:** Upload/update profile picture  
**Auth:** Required  
**Body:** `multipart/form-data: profile_picture (file, max 5MB, jpg/png)`  
**Response:** Profile picture URL  
**Why:** Personalize profiles, handle image uploads

---

### 2.4 Update User Preferences
```
PUT /users/me/preferences
```
**Purpose:** Update user preferences  
**Auth:** Required  
**Body:** `{ theme?, language?, timezone?, date_format?, notifications: { email, push, sms } }`  
**Response:** Updated preferences  
**Why:** Customize experience, manage notifications

---

### 2.5 Get All Users
```
GET /users
```
**Purpose:** List all users (Admin/Manager)  
**Auth:** Required (Admin, Manager)  
**Query:** `page, per_page, search, role, department_id, status, sort_by, sort_order`  
**Response:** Users array with pagination  
**Why:** User management, search, filtering

---

### 2.6 Get User by ID
```
GET /users/{user_id}
```
**Purpose:** Get user details  
**Auth:** Required  
**Response:** Complete user object with statistics  
**Why:** View profiles, display metrics

---

### 2.7 Create User
```
POST /users
```
**Purpose:** Create new user (Admin)  
**Auth:** Required (Admin)  
**Body:** `{ first_name, last_name, email, password?, role, department_id, reporting_manager_id?, designation, employee_id?, joining_date, send_welcome_email? }`  
**Response:** Created user with employee_id  
**Why:** Admin user creation, auto-generate IDs, send welcome emails

---

### 2.8 Update User
```
PUT /users/{user_id}
```
**Purpose:** Update user (Admin/Manager)  
**Auth:** Required (Admin, Manager)  
**Body:** `{ first_name?, last_name?, role?, department_id?, reporting_manager_id?, designation?, status? }`  
**Response:** Updated user  
**Why:** Manage users, change roles, update org structure

---

### 2.9 Delete User
```
DELETE /users/{user_id}
```
**Purpose:** Soft delete user (Admin)  
**Auth:** Required (Admin)  
**Body:** `{ transfer_tasks_to?, transfer_bugs_to?, reason? }`  
**Response:** Success with transfer counts  
**Why:** Remove users, transfer work, audit trail

---

### 2.10 Bulk Import Users
```
POST /users/bulk-import
```
**Purpose:** Import users from CSV/Excel  
**Auth:** Required (Admin)  
**Body:** `multipart/form-data: file (CSV/Excel), send_welcome_emails?`  
**Response:** Import summary with errors  
**Why:** Bulk onboarding, data migration

---

### 2.11 Export Users
```
GET /users/export
```
**Purpose:** Export users to CSV/Excel  
**Auth:** Required (Admin, Manager)  
**Query:** `format (csv|excel), department_id?, role?, status?, fields?`  
**Response:** File download  
**Why:** Reporting, backups, data portability

---

### 2.12 Reset User Password
```
POST /users/{user_id}/reset-password
```
**Purpose:** Admin reset user password  
**Auth:** Required (Admin)  
**Body:** `{ new_password?, send_email?, force_change_on_login? }`  
**Response:** Temp password if not emailed  
**Why:** Help users regain access, force password updates

---

### 2.13 Get User Statistics
```
GET /users/{user_id}/statistics
```
**Purpose:** Get user performance stats  
**Auth:** Required  
**Query:** `start_date?, end_date?`  
**Response:** Tasks, bugs, attendance, performance metrics  
**Why:** Performance tracking, dashboards

---

## 3. Department Management

### 3.1 Get All Departments
```
GET /departments
```
**Purpose:** List all departments  
**Auth:** Required  
**Query:** `page, per_page, search, parent_id, manager_id, status, sort_by`  
**Response:** Departments array with pagination  
**Why:** Org structure, dropdown lists, filtering

---

### 3.2 Get Department by ID
```
GET /departments/{department_id}
```
**Purpose:** Get department details  
**Auth:** Required  
**Response:** Complete department with employees, projects, statistics  
**Why:** Department dashboard, detailed view

---

### 3.3 Create Department
```
POST /departments
```
**Purpose:** Create new department (Admin)  
**Auth:** Required (Admin)  
**Body:** `{ name, code?, description?, parent_department_id?, manager_id?, budget?, location?, contact_email?, contact_phone?, working_hours? }`  
**Response:** Created department with auto-generated code  
**Why:** Org structure management, auto-generate codes

---

### 3.4 Update Department
```
PUT /departments/{department_id}
```
**Purpose:** Update department (Admin)  
**Auth:** Required (Admin)  
**Body:** `{ name?, description?, parent_department_id?, manager_id?, budget?, location?, working_hours?, status? }`  
**Response:** Updated department  
**Why:** Modify org structure, update settings

---

### 3.5 Delete Department
```
DELETE /departments/{department_id}
```
**Purpose:** Delete department (Admin)  
**Auth:** Required (Admin)  
**Body:** `{ transfer_employees_to?, transfer_projects_to?, reason? }`  
**Response:** Success with transfer counts  
**Why:** Restructure org, transfer resources

---

### 3.6 Get Department Employees
```
GET /departments/{department_id}/employees
```
**Purpose:** List department employees  
**Auth:** Required  
**Query:** `page, per_page, role, status, search`  
**Response:** Employees array with pagination  
**Why:** Team management, resource viewing

---

### 3.7 Get Department Projects
```
GET /departments/{department_id}/projects
```
**Purpose:** List department projects  
**Auth:** Required  
**Query:** `page, per_page, status, priority`  
**Response:** Projects array with pagination  
**Why:** Project portfolio view

---

### 3.8 Get Department Statistics
```
GET /departments/{department_id}/statistics
```
**Purpose:** Get department metrics  
**Auth:** Required (Manager, Admin)  
**Query:** `start_date?, end_date?, metrics?`  
**Response:** Employee, project, task, bug, attendance, budget metrics  
**Why:** Performance dashboards, KPI tracking

---

### 3.9 Get Department Hierarchy
```
GET /departments/hierarchy
```
**Purpose:** Get full department tree  
**Auth:** Required  
**Response:** Nested department structure  
**Why:** Org chart, hierarchy visualization

---

## 4. Project Management

### 4.1 Get All Projects
```
GET /projects
```
**Purpose:** List projects with filtering  
**Auth:** Required  
**Query:** `page, per_page, search, department_id, status, priority, team_lead_id, start_date_from, start_date_to, my_projects, completion_min, completion_max, sort_by`  
**Response:** Projects array with pagination and summary  
**Why:** Project list, portfolio view, filtering

---

### 4.2 Get Project by ID
```
GET /projects/{project_id}
```
**Purpose:** Get project details  
**Auth:** Required  
**Response:** Complete project with team, milestones, budget, tasks/bugs summary, documents  
**Why:** Project dashboard, detailed view

---

### 4.3 Create Project
```
POST /projects
```
**Purpose:** Create new project  
**Auth:** Required (Admin, Manager)  
**Body:** `{ name, code?, description?, department_id, client?, status?, priority?, visibility?, start_date, expected_end_date, team_lead_id, team_member_ids?, budget?, milestones?, tags?, custom_fields?, notify_team? }`  
**Response:** Created project with auto-generated code  
**Why:** Project initialization, team assignment

---

### 4.4 Update Project
```
PUT /projects/{project_id}
```
**Purpose:** Update project  
**Auth:** Required (Admin, Manager, Team Lead)  
**Body:** `{ name?, description?, client?, status?, priority?, visibility?, expected_end_date?, actual_end_date?, completion_percentage?, team_lead_id?, budget?, tags?, custom_fields? }`  
**Response:** Updated project  
**Why:** Track progress, modify details

---

### 4.5 Delete Project
```
DELETE /projects/{project_id}
```
**Purpose:** Delete project  
**Auth:** Required (Admin, Manager)  
**Body:** `{ archive_tasks?, archive_bugs?, delete_permanently?, reason? }`  
**Response:** Success with archived counts  
**Why:** Project closure, data archival

---

### 4.6 Add Team Member
```
POST /projects/{project_id}/team-members
```
**Purpose:** Add member to project  
**Auth:** Required (Admin, Manager, Team Lead)  
**Body:** `{ user_id, role_in_project?, allocation_percentage?, notify_user? }`  
**Response:** Added member details  
**Why:** Dynamic team building, resource allocation

---

### 4.7 Remove Team Member
```
DELETE /projects/{project_id}/team-members/{user_id}
```
**Purpose:** Remove member from project  
**Auth:** Required (Admin, Manager, Team Lead)  
**Body:** `{ reassign_tasks_to?, reassign_bugs_to?, notify_user? }`  
**Response:** Success with reassignment counts  
**Why:** Team changes, work reassignment

---

### 4.8 Update Team Member
```
PUT /projects/{project_id}/team-members/{user_id}
```
**Purpose:** Update member role/allocation  
**Auth:** Required (Admin, Manager, Team Lead)  
**Body:** `{ role_in_project?, allocation_percentage? }`  
**Response:** Updated member details  
**Why:** Adjust roles, manage capacity

---

### 4.9 Get Project Tasks
```
GET /projects/{project_id}/tasks
```
**Purpose:** List project tasks  
**Auth:** Required  
**Query:** `page, per_page, status, priority, assigned_to, overdue_only`  
**Response:** Tasks array with summary  
**Why:** Task management, filtering

---

### 4.10 Get Project Bugs
```
GET /projects/{project_id}/bugs
```
**Purpose:** List project bugs  
**Auth:** Required  
**Query:** `page, per_page, status, severity, assigned_to`  
**Response:** Bugs array with summary  
**Why:** Bug tracking, filtering

---

### 4.11 Create Milestone
```
POST /projects/{project_id}/milestones
```
**Purpose:** Add project milestone  
**Auth:** Required (Admin, Manager, Team Lead)  
**Body:** `{ name, description?, due_date }`  
**Response:** Created milestone  
**Why:** Track project phases

---

### 4.12 Update Milestone
```
PUT /projects/{project_id}/milestones/{milestone_id}
```
**Purpose:** Update milestone  
**Auth:** Required (Admin, Manager, Team Lead)  
**Body:** `{ name?, description?, due_date?, status?, completion_percentage? }`  
**Response:** Updated milestone  
**Why:** Milestone management

---

### 4.13 Delete Milestone
```
DELETE /projects/{project_id}/milestones/{milestone_id}
```
**Purpose:** Delete milestone  
**Auth:** Required (Admin, Manager, Team Lead)  
**Response:** Success message  
**Why:** Remove obsolete milestones

---

### 4.14 Get Project Timeline
```
GET /projects/{project_id}/timeline
```
**Purpose:** Get project Gantt data  
**Auth:** Required  
**Response:** Timeline data for visualization  
**Why:** Gantt charts, timeline view

---

### 4.15 Clone Project
```
POST /projects/{project_id}/clone
```
**Purpose:** Clone existing project  
**Auth:** Required (Admin, Manager)  
**Body:** `{ name, code?, include_tasks?, include_team?, start_date }`  
**Response:** Cloned project  
**Why:** Reuse project structure

---

## 5. Task Management

### 5.1 Get All Tasks
```
GET /tasks
```
**Purpose:** List tasks with filtering  
**Auth:** Required  
**Query:** `page, per_page, search, project_id, status, priority, assigned_to, created_by, due_date_from, due_date_to, my_tasks, overdue_only, sort_by`  
**Response:** Tasks array with pagination  
**Why:** Task list, my tasks view, filtering

---

### 5.2 Get Task by ID
```
GET /tasks/{task_id}
```
**Purpose:** Get task details  
**Auth:** Required  
**Response:** Complete task with time logs, comments, attachments, history  
**Why:** Task detail view, tracking

---

### 5.3 Create Task
```
POST /tasks
```
**Purpose:** Create new task  
**Auth:** Required (Team Lead, Manager, Admin)  
**Body:** `{ title, description?, project_id, type?, priority?, status?, assigned_to?, due_date?, estimated_hours?, start_date?, tags?, dependencies?, parent_task_id?, custom_fields? }`  
**Response:** Created task  
**Why:** Task creation, assignment

---

### 5.4 Update Task
```
PUT /tasks/{task_id}
```
**Purpose:** Update task  
**Auth:** Required  
**Body:** `{ title?, description?, status?, priority?, assigned_to?, due_date?, estimated_hours?, tags?, completion_percentage? }`  
**Response:** Updated task  
**Why:** Track progress, modify details

---

### 5.5 Delete Task
```
DELETE /tasks/{task_id}
```
**Purpose:** Delete task  
**Auth:** Required (Team Lead, Manager, Admin)  
**Body:** `{ reason? }`  
**Response:** Success message  
**Why:** Remove obsolete tasks

---

### 5.6 Assign Task
```
POST /tasks/{task_id}/assign
```
**Purpose:** Assign/reassign task  
**Auth:** Required (Team Lead, Manager, Admin)  
**Body:** `{ assigned_to, notify_user? }`  
**Response:** Success with assignee details  
**Why:** Task assignment, notifications

---

### 5.7 Start Task
```
POST /tasks/{task_id}/start
```
**Purpose:** Start working on task  
**Auth:** Required  
**Response:** Task with updated status, time session started  
**Why:** Time tracking, status update

---

### 5.8 Pause Task
```
POST /tasks/{task_id}/pause
```
**Purpose:** Pause task work  
**Auth:** Required  
**Body:** `{ reason? }`  
**Response:** Task with paused time session  
**Why:** Break tracking, interruptions

---

### 5.9 Resume Task
```
POST /tasks/{task_id}/resume
```
**Purpose:** Resume task work  
**Auth:** Required  
**Response:** Task with resumed time session  
**Why:** Continue tracking after pause

---

### 5.10 Complete Task
```
POST /tasks/{task_id}/complete
```
**Purpose:** Mark task as completed  
**Auth:** Required  
**Body:** `{ completion_notes? }`  
**Response:** Completed task with metrics  
**Why:** Task completion, time calculation

---

### 5.11 Reopen Task
```
POST /tasks/{task_id}/reopen
```
**Purpose:** Reopen completed task  
**Auth:** Required  
**Body:** `{ reason }`  
**Response:** Reopened task  
**Why:** Handle rework, issues found

---

### 5.12 Add Comment
```
POST /tasks/{task_id}/comments
```
**Purpose:** Add comment to task  
**Auth:** Required  
**Body:** `{ content, mentions? }`  
**Response:** Created comment  
**Why:** Discussion, collaboration

---

### 5.13 Update Comment
```
PUT /tasks/{task_id}/comments/{comment_id}
```
**Purpose:** Edit comment  
**Auth:** Required (comment owner)  
**Body:** `{ content }`  
**Response:** Updated comment  
**Why:** Fix typos, update info

---

### 5.14 Delete Comment
```
DELETE /tasks/{task_id}/comments/{comment_id}
```
**Purpose:** Delete comment  
**Auth:** Required (comment owner, Admin)  
**Response:** Success message  
**Why:** Remove inappropriate content

---

### 5.15 Add Attachment
```
POST /tasks/{task_id}/attachments
```
**Purpose:** Upload attachment  
**Auth:** Required  
**Body:** `multipart/form-data: file (max 20MB)`  
**Response:** Attachment details with URL  
**Why:** Share files, documentation

---

### 5.16 Delete Attachment
```
DELETE /tasks/{task_id}/attachments/{attachment_id}
```
**Purpose:** Remove attachment  
**Auth:** Required (uploader, Admin)  
**Response:** Success message  
**Why:** Cleanup, remove outdated files

---

### 5.17 Get Task History
```
GET /tasks/{task_id}/history
```
**Purpose:** Get task activity log  
**Auth:** Required  
**Query:** `page, per_page`  
**Response:** Activity history with timestamps  
**Why:** Audit trail, change tracking

---

### 5.18 Bulk Update Tasks
```
PUT /tasks/bulk-update
```
**Purpose:** Update multiple tasks  
**Auth:** Required (Team Lead, Manager, Admin)  
**Body:** `{ task_ids[], updates: { status?, priority?, assigned_to? } }`  
**Response:** Success with updated count  
**Why:** Batch operations, efficiency

---

## 6. Bug Management

### 6.1 Get All Bugs
```
GET /bugs
```
**Purpose:** List bugs with filtering  
**Auth:** Required  
**Query:** `page, per_page, search, project_id, status, severity, priority, type, assigned_to, created_by, my_bugs, sort_by`  
**Response:** Bugs array with pagination  
**Why:** Bug tracking, filtering

---

### 6.2 Get Bug by ID
```
GET /bugs/{bug_id}
```
**Purpose:** Get bug details  
**Auth:** Required  
**Response:** Complete bug with reproduction steps, time logs, comments, attachments  
**Why:** Bug detail view, investigation

---

### 6.3 Create Bug
```
POST /bugs
```
**Purpose:** Report new bug  
**Auth:** Required  
**Body:** `{ title, description, project_id, type, severity, priority?, status?, assigned_to?, steps_to_reproduce, expected_behavior, actual_behavior, environment, screenshots?, error_logs? }`  
**Response:** Created bug  
**Why:** Bug reporting, assignment

---

### 6.4 Update Bug
```
PUT /bugs/{bug_id}
```
**Purpose:** Update bug  
**Auth:** Required  
**Body:** `{ title?, description?, status?, severity?, priority?, type?, assigned_to?, steps_to_reproduce?, expected_behavior?, actual_behavior? }`  
**Response:** Updated bug  
**Why:** Track fixes, update details

---

### 6.5 Delete Bug
```
DELETE /bugs/{bug_id}
```
**Purpose:** Delete bug  
**Auth:** Required (Team Lead, Manager, Admin)  
**Body:** `{ reason? }`  
**Response:** Success message  
**Why:** Remove duplicates, invalid bugs

---

### 6.6 Assign Bug
```
POST /bugs/{bug_id}/assign
```
**Purpose:** Assign/reassign bug  
**Auth:** Required (Team Lead, Manager, Admin)  
**Body:** `{ assigned_to, notify_user? }`  
**Response:** Success with assignee details  
**Why:** Bug assignment, developer routing

---

### 6.7 Start Bug Fix
```
POST /bugs/{bug_id}/start
```
**Purpose:** Start working on bug  
**Auth:** Required  
**Response:** Bug with updated status, time session started  
**Why:** Time tracking, status update

---

### 6.8 Pause Bug Fix
```
POST /bugs/{bug_id}/pause
```
**Purpose:** Pause bug work  
**Auth:** Required  
**Body:** `{ reason? }`  
**Response:** Bug with paused time session  
**Why:** Break tracking, blockers

---

### 6.9 Resume Bug Fix
```
POST /bugs/{bug_id}/resume
```
**Purpose:** Resume bug work  
**Auth:** Required  
**Response:** Bug with resumed time session  
**Why:** Continue after pause

---

### 6.10 Resolve Bug
```
POST /bugs/{bug_id}/resolve
```
**Purpose:** Mark bug as resolved  
**Auth:** Required  
**Body:** `{ resolution_notes, root_cause?, fix_version? }`  
**Response:** Resolved bug  
**Why:** Fix completion, testing queue

---

### 6.11 Verify Bug Fix
```
POST /bugs/{bug_id}/verify
```
**Purpose:** Verify bug resolution  
**Auth:** Required (Tester, Team Lead)  
**Body:** `{ verified: boolean, verification_notes }`  
**Response:** Verified/reopened bug  
**Why:** QA process, quality control

---

### 6.12 Close Bug
```
POST /bugs/{bug_id}/close
```
**Purpose:** Close verified bug  
**Auth:** Required  
**Response:** Closed bug  
**Why:** Final closure after verification

---

### 6.13 Reopen Bug
```
POST /bugs/{bug_id}/reopen
```
**Purpose:** Reopen closed bug  
**Auth:** Required  
**Body:** `{ reason }`  
**Response:** Reopened bug  
**Why:** Fix failed, regression

---

### 6.14 Add Bug Comment
```
POST /bugs/{bug_id}/comments
```
**Purpose:** Comment on bug  
**Auth:** Required  
**Body:** `{ content, mentions? }`  
**Response:** Created comment  
**Why:** Discussion, investigation notes

---

### 6.15 Add Bug Attachment
```
POST /bugs/{bug_id}/attachments
```
**Purpose:** Upload attachment  
**Auth:** Required  
**Body:** `multipart/form-data: file`  
**Response:** Attachment details  
**Why:** Screenshots, logs, reproduction files

---

### 6.16 Get Bug History
```
GET /bugs/{bug_id}/history
```
**Purpose:** Get bug activity log  
**Auth:** Required  
**Query:** `page, per_page`  
**Response:** Activity history  
**Why:** Track changes, audit trail

---

## 7. Attendance Management

### 7.1 Clock In
```
POST /attendance/clock-in
```
**Purpose:** Mark attendance (clock in)  
**Auth:** Required  
**Body:** `{ location?, ip_address?, photo?, device_info? }`  
**Response:** Attendance record with clock-in time  
**Why:** Track arrival, location capture

---

### 7.2 Clock Out
```
POST /attendance/clock-out
```
**Purpose:** Mark clock out  
**Auth:** Required  
**Body:** `{ location?, ip_address? }`  
**Response:** Attendance record with total hours  
**Why:** Track departure, calculate hours

---

### 7.3 Get Today's Attendance
```
GET /attendance/today
```
**Purpose:** Get current day attendance  
**Auth:** Required  
**Response:** Today's attendance with clock-in/out, breaks, hours  
**Why:** Display status, current session

---

### 7.4 Get Attendance History
```
GET /attendance/history
```
**Purpose:** Get attendance records  
**Auth:** Required  
**Query:** `start_date, end_date, user_id?, department_id?, status?`  
**Response:** Attendance records with pagination  
**Why:** View history, reporting

---

### 7.5 Mark Break Start
```
POST /attendance/break-start
```
**Purpose:** Start break  
**Auth:** Required  
**Body:** `{ break_type: 'lunch'|'tea'|'other' }`  
**Response:** Break session started  
**Why:** Track breaks separately

---

### 7.6 Mark Break End
```
POST /attendance/break-end
```
**Purpose:** End break  
**Auth:** Required  
**Response:** Break session with duration  
**Why:** Calculate net working hours

---

### 7.7 Request Attendance Regularization
```
POST /attendance/regularization
```
**Purpose:** Request to fix missed punch  
**Auth:** Required  
**Body:** `{ date, type: 'clock_in'|'clock_out', time, reason, proof_document? }`  
**Response:** Regularization request  
**Why:** Fix missed attendance, approval workflow

---

### 7.8 Approve/Reject Regularization
```
PUT /attendance/regularization/{request_id}
```
**Purpose:** Approve or reject request  
**Auth:** Required (Manager, Admin)  
**Body:** `{ status: 'approved'|'rejected', comments? }`  
**Response:** Updated regularization request  
**Why:** Manager approval, attendance correction

---

### 7.9 Get Attendance Summary
```
GET /attendance/summary
```
**Purpose:** Get attendance summary  
**Auth:** Required  
**Query:** `user_id?, month, year`  
**Response:** Monthly summary with total days, present, absent, leaves, working hours  
**Why:** Monthly reports, statistics

---

### 7.10 Manual Attendance Entry
```
POST /attendance/manual-entry
```
**Purpose:** Manually mark attendance (Manager/Admin)  
**Auth:** Required (Manager, Admin)  
**Body:** `{ user_id, date, clock_in_time, clock_out_time, status, reason }`  
**Response:** Created attendance record  
**Why:** Retroactive entries, corrections

---

### 7.11 Get Team Attendance
```
GET /attendance/team
```
**Purpose:** Get team attendance for today  
**Auth:** Required (Manager, Team Lead)  
**Query:** `department_id?, date?`  
**Response:** Team members with attendance status  
**Why:** Monitor team presence, daily overview

---

### 7.12 Export Attendance Report
```
GET /attendance/export
```
**Purpose:** Export attendance to CSV/Excel  
**Auth:** Required (Manager, Admin)  
**Query:** `format, start_date, end_date, user_id?, department_id?`  
**Response:** File download  
**Why:** Reports, payroll processing

---

## 8. Leave Management

### 8.1 Apply for Leave
```
POST /leaves/apply
```
**Purpose:** Submit leave application  
**Auth:** Required  
**Body:** `{ leave_type, start_date, end_date, is_half_day?, half_day_period?, reason, attachment? }`  
**Response:** Leave application with status 'pending'  
**Why:** Leave requests, approval workflow

---

### 8.2 Get My Leaves
```
GET /leaves/my-leaves
```
**Purpose:** Get user's leave history  
**Auth:** Required  
**Query:** `page, per_page, status?, start_date?, end_date?, leave_type?`  
**Response:** Leave applications with pagination  
**Why:** View leave history, status tracking

---

### 8.3 Get Leave by ID
```
GET /leaves/{leave_id}
```
**Purpose:** Get leave details  
**Auth:** Required  
**Response:** Complete leave application with approval chain  
**Why:** View details, track approvals

---

### 8.4 Cancel Leave
```
POST /leaves/{leave_id}/cancel
```
**Purpose:** Cancel pending/approved leave  
**Auth:** Required  
**Body:** `{ reason }`  
**Response:** Cancelled leave  
**Why:** Handle plan changes

---

### 8.5 Get Leave Balance
```
GET /leaves/balance
```
**Purpose:** Get leave balance  
**Auth:** Required  
**Query:** `user_id?`  
**Response:** Balance by leave type, accrued, used, available  
**Why:** Check eligibility, plan leaves

---

### 8.6 Get Pending Approvals
```
GET /leaves/pending-approvals
```
**Purpose:** Get leaves awaiting approval  
**Auth:** Required (Manager, Team Lead)  
**Query:** `page, per_page, department_id?`  
**Response:** Pending leave applications  
**Why:** Manager approval queue

---

### 8.7 Approve/Reject Leave
```
PUT /leaves/{leave_id}/review
```
**Purpose:** Approve or reject leave  
**Auth:** Required (Manager, Team Lead)  
**Body:** `{ status: 'approved'|'rejected', comments? }`  
**Response:** Updated leave application  
**Why:** Approval workflow, notifications

---

### 8.8 Get Leave Calendar
```
GET /leaves/calendar
```
**Purpose:** Get team leave calendar  
**Auth:** Required  
**Query:** `month, year, department_id?, team_id?`  
**Response:** Calendar with leave dates, conflicts  
**Why:** Team planning, resource management

---

### 8.9 Get Leave Statistics
```
GET /leaves/statistics
```
**Purpose:** Get leave statistics  
**Auth:** Required (Manager, Admin)  
**Query:** `user_id?, department_id?, start_date?, end_date?`  
**Response:** Leave utilization, patterns, trends  
**Why:** Analytics, reporting

---

### 8.10 Configure Leave Policy
```
PUT /leaves/policy
```
**Purpose:** Update leave policy (Admin)  
**Auth:** Required (Admin)  
**Body:** `{ leave_type, annual_quota, accrual_frequency, carryforward_limit, encashment_allowed }`  
**Response:** Updated policy  
**Why:** Configure leave rules

---

## 9. Time Tracking

### 9.1 Start Time Session
```
POST /time-tracking/start
```
**Purpose:** Start time tracking session  
**Auth:** Required  
**Body:** `{ task_id?, bug_id?, description? }`  
**Response:** Active time session  
**Why:** Track work hours on tasks/bugs

---

### 9.2 Pause Time Session
```
POST /time-tracking/{session_id}/pause
```
**Purpose:** Pause active session  
**Auth:** Required  
**Body:** `{ reason? }`  
**Response:** Paused session with duration  
**Why:** Break tracking, interruptions

---

### 9.3 Resume Time Session
```
POST /time-tracking/{session_id}/resume
```
**Purpose:** Resume paused session  
**Auth:** Required  
**Response:** Resumed session  
**Why:** Continue tracking

---

### 9.4 End Time Session
```
POST /time-tracking/{session_id}/end
```
**Purpose:** End time session  
**Auth:** Required  
**Body:** `{ work_notes? }`  
**Response:** Completed session with total time  
**Why:** Complete tracking, log hours

---

### 9.5 Get Active Session
```
GET /time-tracking/active
```
**Purpose:** Get current active session  
**Auth:** Required  
**Response:** Active session or null  
**Why:** Display current timer, session info

---

### 9.6 Get Time Logs
```
GET /time-tracking/logs
```
**Purpose:** Get time log history  
**Auth:** Required  
**Query:** `page, per_page, user_id?, task_id?, bug_id?, start_date?, end_date?`  
**Response:** Time logs with pagination  
**Why:** View history, reporting

---

### 9.7 Add Manual Time Entry
```
POST /time-tracking/manual-entry
```
**Purpose:** Add time manually  
**Auth:** Required  
**Body:** `{ task_id?, bug_id?, date, hours, minutes, description, billable? }`  
**Response:** Created time entry  
**Why:** Log past work, corrections

---

### 9.8 Update Time Entry
```
PUT /time-tracking/{entry_id}
```
**Purpose:** Edit time entry  
**Auth:** Required (entry owner, Admin)  
**Body:** `{ hours?, minutes?, description?, billable? }`  
**Response:** Updated time entry  
**Why:** Corrections, updates

---

## 10. Timesheet Management

### 10.1 Get My Timesheet
```
GET /timesheets/my-timesheet
```
**Purpose:** Get user's timesheet  
**Auth:** Required  
**Query:** `start_date, end_date`  
**Response:** Timesheet with daily entries, total hours  
**Why:** View/submit timesheet

---

### 10.2 Submit Timesheet
```
POST /timesheets/submit
```
**Purpose:** Submit timesheet for approval  
**Auth:** Required  
**Body:** `{ week_start_date, week_end_date, entries[], comments? }`  
**Response:** Submitted timesheet  
**Why:** Weekly submission, approval workflow

---

### 10.3 Get Pending Timesheets
```
GET /timesheets/pending-approvals
```
**Purpose:** Get timesheets awaiting approval  
**Auth:** Required (Manager, Team Lead)  
**Query:** `page, per_page, department_id?`  
**Response:** Pending timesheets  
**Why:** Manager approval queue

---

### 10.4 Approve/Reject Timesheet
```
PUT /timesheets/{timesheet_id}/review
```
**Purpose:** Approve or reject timesheet  
**Auth:** Required (Manager, Team Lead)  
**Body:** `{ status: 'approved'|'rejected', comments? }`  
**Response:** Updated timesheet  
**Why:** Approval workflow, payroll

---

### 10.5 Get Timesheet by ID
```
GET /timesheets/{timesheet_id}
```
**Purpose:** Get timesheet details  
**Auth:** Required  
**Response:** Complete timesheet with entries breakdown  
**Why:** View details, verification

---

### 10.6 Resubmit Timesheet
```
POST /timesheets/{timesheet_id}/resubmit
```
**Purpose:** Resubmit rejected timesheet  
**Auth:** Required  
**Body:** `{ updated_entries[], comments? }`  
**Response:** Resubmitted timesheet  
**Why:** Fix and resubmit after rejection

---

### 10.7 Export Timesheet Report
```
GET /timesheets/export
```
**Purpose:** Export timesheets  
**Auth:** Required (Manager, Admin)  
**Query:** `format, start_date, end_date, user_id?, department_id?, status?`  
**Response:** File download  
**Why:** Reports, billing, payroll

---

## 11. Dashboard & Analytics

### 11.1 Get Admin Dashboard
```
GET /dashboard/admin
```
**Purpose:** Get admin overview  
**Auth:** Required (Admin)  
**Response:** System-wide metrics, users, projects, tasks, bugs, attendance  
**Why:** Executive dashboard, system health

---

### 11.2 Get Manager Dashboard
```
GET /dashboard/manager
```
**Purpose:** Get manager dashboard  
**Auth:** Required (Manager)  
**Query:** `department_id?`  
**Response:** Department metrics, team performance, pending approvals  
**Why:** Department oversight, management

---

### 11.3 Get Team Lead Dashboard
```
GET /dashboard/team-lead
```
**Purpose:** Get team lead dashboard  
**Auth:** Required (Team Lead)  
**Response:** Project metrics, team tasks, bugs, timeline adherence  
**Why:** Project tracking, team management

---

### 11.4 Get Employee Dashboard
```
GET /dashboard/employee
```
**Purpose:** Get employee dashboard  
**Auth:** Required  
**Response:** My tasks, bugs, time tracking, attendance, notifications  
**Why:** Personal work overview

---

### 11.5 Get Project Analytics
```
GET /analytics/projects
```
**Purpose:** Project performance analytics  
**Auth:** Required (Manager, Admin)  
**Query:** `project_id?, department_id?, start_date?, end_date?`  
**Response:** Completion rates, timeline adherence, budget utilization, velocity  
**Why:** Project insights, reporting

---

### 11.6 Get Task Analytics
```
GET /analytics/tasks
```
**Purpose:** Task performance metrics  
**Auth:** Required (Manager, Admin)  
**Query:** `project_id?, user_id?, start_date?, end_date?`  
**Response:** Completion rates, cycle time, overdue trends, distribution  
**Why:** Productivity tracking

---

### 11.7 Get Bug Analytics
```
GET /analytics/bugs
```
**Purpose:** Bug tracking metrics  
**Auth:** Required (Manager, Admin)  
**Query:** `project_id?, start_date?, end_date?`  
**Response:** Bug density, resolution time, reopen rate, severity distribution  
**Why:** Quality metrics, trends

---

### 11.8 Get Employee Performance
```
GET /analytics/employee-performance
```
**Purpose:** Employee performance metrics  
**Auth:** Required (Manager, Admin)  
**Query:** `user_id, start_date?, end_date?`  
**Response:** Tasks completed, hours logged, attendance, quality metrics  
**Why:** Performance reviews, feedback

---

### 11.9 Get Resource Utilization
```
GET /analytics/resource-utilization
```
**Purpose:** Resource allocation analytics  
**Auth:** Required (Manager, Admin)  
**Query:** `department_id?, start_date?, end_date?`  
**Response:** Allocation percentages, capacity vs demand, overallocation  
**Why:** Resource planning, optimization

---

### 11.10 Get Custom Report
```
POST /analytics/custom-report
```
**Purpose:** Generate custom analytics report  
**Auth:** Required (Manager, Admin)  
**Body:** `{ report_type, metrics[], dimensions[], filters, start_date, end_date, format? }`  
**Response:** Custom report data or file  
**Why:** Flexible reporting, custom metrics

---

## 12. Notifications

### 12.1 Get All Notifications
```
GET /notifications
```
**Purpose:** Get user notifications  
**Auth:** Required  
**Query:** `page, per_page, read?, type?`  
**Response:** Notifications array with pagination  
**Why:** Notification center, inbox

---

### 12.2 Get Unread Count
```
GET /notifications/unread-count
```
**Purpose:** Get unread notification count  
**Auth:** Required  
**Response:** `{ count: number }`  
**Why:** Badge count, UI indicators

---

### 12.3 Mark as Read
```
PUT /notifications/{notification_id}/read
```
**Purpose:** Mark notification as read  
**Auth:** Required  
**Response:** Updated notification  
**Why:** Track read status

---

### 12.4 Mark All as Read
```
POST /notifications/mark-all-read
```
**Purpose:** Mark all notifications as read  
**Auth:** Required  
**Response:** Success with count  
**Why:** Clear all notifications

---

### 12.5 Delete Notification
```
DELETE /notifications/{notification_id}
```
**Purpose:** Delete notification  
**Auth:** Required  
**Response:** Success message  
**Why:** Clear individual notifications

---

### 12.6 Get Notification Settings
```
GET /notifications/settings
```
**Purpose:** Get notification preferences  
**Auth:** Required  
**Response:** Email, push, SMS preferences by notification type  
**Why:** View settings

---

### 12.7 Update Notification Settings
```
PUT /notifications/settings
```
**Purpose:** Update notification preferences  
**Auth:** Required  
**Body:** `{ email: {}, push: {}, sms: {} }`  
**Response:** Updated settings  
**Why:** Customize notifications

---

### 12.8 Test Notification
```
POST /notifications/test
```
**Purpose:** Send test notification (Admin)  
**Auth:** Required (Admin)  
**Body:** `{ type: 'email'|'push'|'sms', recipient_id }`  
**Response:** Success message  
**Why:** Test notification system

---

## 13. Communication

### 13.1 Send Message
```
POST /messages
```
**Purpose:** Send direct message  
**Auth:** Required  
**Body:** `{ recipient_id, content, attachments? }`  
**Response:** Created message  
**Why:** Internal messaging

---

### 13.2 Get Conversations
```
GET /messages/conversations
```
**Purpose:** Get conversation list  
**Auth:** Required  
**Query:** `page, per_page`  
**Response:** Conversations with last message, unread count  
**Why:** Chat inbox

---

### 13.3 Get Conversation Messages
```
GET /messages/conversations/{user_id}
```
**Purpose:** Get messages with specific user  
**Auth:** Required  
**Query:** `page, per_page`  
**Response:** Messages array  
**Why:** Chat history

---

### 13.4 Create Announcement
```
POST /announcements
```
**Purpose:** Create announcement (Admin/Manager)  
**Auth:** Required (Admin, Manager)  
**Body:** `{ title, content, priority, target_audience: 'all'|'department'|'project', target_id?, expires_at? }`  
**Response:** Created announcement  
**Why:** Company/department announcements

---

### 13.5 Get Announcements
```
GET /announcements
```
**Purpose:** Get announcements  
**Auth:** Required  
**Query:** `page, per_page, active_only?`  
**Response:** Announcements array  
**Why:** View company news

---

### 13.6 Acknowledge Announcement
```
POST /announcements/{announcement_id}/acknowledge
```
**Purpose:** Mark announcement as read  
**Auth:** Required  
**Response:** Success message  
**Why:** Track acknowledgment

---

### 13.7 Create Meeting
```
POST /meetings
```
**Purpose:** Schedule meeting  
**Auth:** Required  
**Body:** `{ title, description?, date, start_time, end_time, attendees[], location?, meeting_link?, agenda? }`  
**Response:** Created meeting  
**Why:** Meeting scheduling

---

### 13.8 Update Meeting
```
PUT /meetings/{meeting_id}
```
**Purpose:** Update meeting details  
**Auth:** Required (organizer)  
**Body:** `{ title?, description?, date?, start_time?, end_time?, attendees?, location?, meeting_link?, agenda? }`  
**Response:** Updated meeting  
**Why:** Reschedule, update details

---

### 13.9 Cancel Meeting
```
DELETE /meetings/{meeting_id}
```
**Purpose:** Cancel meeting  
**Auth:** Required (organizer)  
**Body:** `{ reason }`  
**Response:** Success message  
**Why:** Cancel meetings

---

### 13.10 Get My Meetings
```
GET /meetings/my-meetings
```
**Purpose:** Get user's meetings  
**Auth:** Required  
**Query:** `start_date?, end_date?, status?`  
**Response:** Meetings array  
**Why:** Calendar view

---

### 13.11 Add Meeting Minutes
```
POST /meetings/{meeting_id}/minutes
```
**Purpose:** Add meeting notes  
**Auth:** Required  
**Body:** `{ attendees_present[], notes, action_items[], decisions[], attachments? }`  
**Response:** Created minutes  
**Why:** Document meetings

---

### 13.12 Get Meeting Minutes
```
GET /meetings/{meeting_id}/minutes
```
**Purpose:** Get meeting notes  
**Auth:** Required  
**Response:** Meeting minutes  
**Why:** Review notes, action items

---

## 14. Document Management

### 14.1 Upload Document
```
POST /documents
```
**Purpose:** Upload document  
**Auth:** Required  
**Body:** `multipart/form-data: file, category, title?, description?, tags?, access_level: 'public'|'private'|'department'`  
**Response:** Uploaded document details  
**Why:** Document storage, organization

---

### 14.2 Get All Documents
```
GET /documents
```
**Purpose:** List documents  
**Auth:** Required  
**Query:** `page, per_page, category?, search?, tags?, uploaded_by?`  
**Response:** Documents array with pagination  
**Why:** Browse documents

---

### 14.3 Get Document by ID
```
GET /documents/{document_id}
```
**Purpose:** Get document details  
**Auth:** Required  
**Response:** Document metadata and download URL  
**Why:** View/download documents

---

### 14.4 Update Document
```
PUT /documents/{document_id}
```
**Purpose:** Update document metadata  
**Auth:** Required (uploader, Admin)  
**Body:** `{ title?, description?, category?, tags?, access_level? }`  
**Response:** Updated document  
**Why:** Update information

---

### 14.5 Delete Document
```
DELETE /documents/{document_id}
```
**Purpose:** Delete document  
**Auth:** Required (uploader, Admin)  
**Response:** Success message  
**Why:** Remove documents

---

### 14.6 Upload New Version
```
POST /documents/{document_id}/versions
```
**Purpose:** Upload new document version  
**Auth:** Required (uploader, Admin)  
**Body:** `multipart/form-data: file, version_notes?`  
**Response:** New version details  
**Why:** Version control

---

### 14.7 Get Document Versions
```
GET /documents/{document_id}/versions
```
**Purpose:** Get version history  
**Auth:** Required  
**Response:** Versions array  
**Why:** Track changes, rollback

---

### 14.8 Create Folder
```
POST /documents/folders
```
**Purpose:** Create document folder  
**Auth:** Required  
**Body:** `{ name, parent_folder_id?, description? }`  
**Response:** Created folder  
**Why:** Organize documents

---

### 14.9 Share Document
```
POST /documents/{document_id}/share
```
**Purpose:** Share document with users  
**Auth:** Required  
**Body:** `{ user_ids[], permission: 'view'|'edit', message? }`  
**Response:** Success with shared users  
**Why:** Collaboration, access control

---

### 14.10 Search Documents
```
GET /documents/search
```
**Purpose:** Full-text document search  
**Auth:** Required  
**Query:** `query, page, per_page, filters?`  
**Response:** Search results with highlights  
**Why:** Find documents quickly

---

## 15. Performance & Goals

### 15.1 Create Goal
```
POST /goals
```
**Purpose:** Create OKR/goal  
**Auth:** Required (Manager, Admin, for self)  
**Body:** `{ title, description, type: 'individual'|'team'|'department'|'company', owner_id, period_start, period_end, key_results[], parent_goal_id? }`  
**Response:** Created goal  
**Why:** Goal setting, OKR tracking

---

### 15.2 Get Goals
```
GET /goals
```
**Purpose:** Get goals list  
**Auth:** Required  
**Query:** `page, per_page, type?, owner_id?, status?, period?`  
**Response:** Goals array  
**Why:** View goals, tracking

---

### 15.3 Get Goal by ID
```
GET /goals/{goal_id}
```
**Purpose:** Get goal details  
**Auth:** Required  
**Response:** Complete goal with key results, progress, check-ins  
**Why:** Goal details, progress tracking

---

### 15.4 Update Goal
```
PUT /goals/{goal_id}
```
**Purpose:** Update goal  
**Auth:** Required (owner, manager)  
**Body:** `{ title?, description?, key_results?, status? }`  
**Response:** Updated goal  
**Why:** Modify goals, update progress

---

### 15.5 Update Goal Progress
```
POST /goals/{goal_id}/progress
```
**Purpose:** Update goal progress  
**Auth:** Required (owner)  
**Body:** `{ progress_percentage, notes?, key_results_update[] }`  
**Response:** Updated goal with progress  
**Why:** Track progress, check-ins

---

### 15.6 Close Goal
```
POST /goals/{goal_id}/close
```
**Purpose:** Close/complete goal  
**Auth:** Required (owner, manager)  
**Body:** `{ final_notes, achievement_percentage }`  
**Response:** Closed goal  
**Why:** Goal completion

---

### 15.7 Create Performance Review
```
POST /performance-reviews
```
**Purpose:** Initiate performance review  
**Auth:** Required (Manager, Admin)  
**Body:** `{ employee_id, review_period_start, review_period_end, review_type: 'quarterly'|'annual'|'probation', template_id? }`  
**Response:** Created review  
**Why:** Performance evaluation

---

### 15.8 Submit Self-Assessment
```
POST /performance-reviews/{review_id}/self-assessment
```
**Purpose:** Submit self-assessment  
**Auth:** Required (reviewee)  
**Body:** `{ responses: {question_id: answer}, comments }`  
**Response:** Submitted assessment  
**Why:** Self-evaluation

---

### 15.9 Submit Manager Review
```
POST /performance-reviews/{review_id}/manager-review
```
**Purpose:** Submit manager evaluation  
**Auth:** Required (manager)  
**Body:** `{ ratings: {criteria: rating}, strengths[], areas_for_improvement[], overall_rating, comments }`  
**Response:** Submitted review  
**Why:** Manager evaluation

---

### 15.10 Request Peer Feedback
```
POST /performance-reviews/{review_id}/peer-feedback
```
**Purpose:** Request peer reviews  
**Auth:** Required (manager, reviewee)  
**Body:** `{ peer_ids[], questions[] }`  
**Response:** Peer feedback requests  
**Why:** 360-degree feedback

---

### 15.11 Submit Peer Feedback
```
POST /performance-reviews/{review_id}/peer-feedback/{request_id}
```
**Purpose:** Submit peer feedback  
**Auth:** Required (peer)  
**Body:** `{ responses: {question_id: answer}, anonymous? }`  
**Response:** Submitted feedback  
**Why:** Peer evaluation

---

### 15.12 Finalize Review
```
POST /performance-reviews/{review_id}/finalize
```
**Purpose:** Finalize and publish review  
**Auth:** Required (manager)  
**Body:** `{ final_rating, final_comments, development_plan?, promotion_recommendation? }`  
**Response:** Finalized review  
**Why:** Complete review cycle

---

## 16. Training & Development

### 16.1 Get Training Catalog
```
GET /training/courses
```
**Purpose:** List available courses  
**Auth:** Required  
**Query:** `page, per_page, category?, search?`  
**Response:** Courses array  
**Why:** Browse training

---

### 16.2 Get Course Details
```
GET /training/courses/{course_id}
```
**Purpose:** Get course information  
**Auth:** Required  
**Response:** Course with syllabus, duration, prerequisites, materials  
**Why:** Course details

---

### 16.3 Enroll in Course
```
POST /training/courses/{course_id}/enroll
```
**Purpose:** Enroll in training  
**Auth:** Required  
**Response:** Enrollment confirmation  
**Why:** Course registration

---

### 16.4 Get My Enrollments
```
GET /training/my-enrollments
```
**Purpose:** Get enrolled courses  
**Auth:** Required  
**Query:** `status?: 'enrolled'|'in_progress'|'completed'`  
**Response:** Enrollments array  
**Why:** Track learning

---

### 16.5 Mark Training Complete
```
POST /training/enrollments/{enrollment_id}/complete
```
**Purpose:** Complete training  
**Auth:** Required  
**Body:** `{ completion_certificate?, feedback?, rating? }`  
**Response:** Completed enrollment  
**Why:** Track completion

---

### 16.6 Get Skills Matrix
```
GET /training/skills-matrix
```
**Purpose:** Get skills inventory  
**Auth:** Required  
**Query:** `user_id?, department_id?`  
**Response:** Skills with proficiency levels  
**Why:** Skill gap analysis

---

### 16.7 Update Skills
```
PUT /training/my-skills
```
**Purpose:** Update user skills  
**Auth:** Required  
**Body:** `{ skills: [{skill_id, proficiency_level}] }`  
**Response:** Updated skills  
**Why:** Maintain skill profile

---

### 16.8 Request Training
```
POST /training/requests
```
**Purpose:** Request training course  
**Auth:** Required  
**Body:** `{ course_name, justification, estimated_cost?, preferred_dates? }`  
**Response:** Training request  
**Why:** Training needs

---

### 16.9 Approve Training Request
```
PUT /training/requests/{request_id}/review
```
**Purpose:** Approve/reject training  
**Auth:** Required (Manager)  
**Body:** `{ status: 'approved'|'rejected', comments? }`  
**Response:** Updated request  
**Why:** Approval workflow

---

### 16.10 Get Training Statistics
```
GET /training/statistics
```
**Purpose:** Get training metrics  
**Auth:** Required (Manager, Admin)  
**Query:** `user_id?, department_id?, start_date?, end_date?`  
**Response:** Completion rates, hours, certifications  
**Why:** L&D reporting

---

## 17. Expense Management

### 17.1 Submit Expense
```
POST /expenses
```
**Purpose:** Submit expense claim  
**Auth:** Required  
**Body:** `{ title, amount, currency, category, date, project_id?, description, receipt, billable? }`  
**Response:** Created expense  
**Why:** Expense claims, reimbursement

---

### 17.2 Get My Expenses
```
GET /expenses/my-expenses
```
**Purpose:** Get user's expenses  
**Auth:** Required  
**Query:** `page, per_page, status?, start_date?, end_date?`  
**Response:** Expenses array  
**Why:** Track claims

---

### 17.3 Get Expense by ID
```
GET /expenses/{expense_id}
```
**Purpose:** Get expense details  
**Auth:** Required  
**Response:** Complete expense with receipt, approvals  
**Why:** View details

---

### 17.4 Update Expense
```
PUT /expenses/{expense_id}
```
**Purpose:** Update expense (if not submitted)  
**Auth:** Required  
**Body:** `{ title?, amount?, category?, description?, receipt? }`  
**Response:** Updated expense  
**Why:** Corrections before submission

---

### 17.5 Delete Expense
```
DELETE /expenses/{expense_id}
```
**Purpose:** Delete expense  
**Auth:** Required  
**Response:** Success message  
**Why:** Remove drafts

---

### 17.6 Get Pending Expense Approvals
```
GET /expenses/pending-approvals
```
**Purpose:** Get expenses awaiting approval  
**Auth:** Required (Manager)  
**Query:** `page, per_page, department_id?`  
**Response:** Pending expenses  
**Why:** Manager approval queue

---

### 17.7 Approve/Reject Expense
```
PUT /expenses/{expense_id}/review
```
**Purpose:** Approve or reject expense  
**Auth:** Required (Manager)  
**Body:** `{ status: 'approved'|'rejected', comments? }`  
**Response:** Updated expense  
**Why:** Approval workflow

---

### 17.8 Mark as Reimbursed
```
POST /expenses/{expense_id}/reimburse
```
**Purpose:** Mark expense as paid  
**Auth:** Required (Finance, Admin)  
**Body:** `{ payment_method, transaction_id?, payment_date }`  
**Response:** Reimbursed expense  
**Why:** Track payments

---

### 17.9 Get Expense Report
```
GET /expenses/report
```
**Purpose:** Get expense analytics  
**Auth:** Required (Manager, Admin)  
**Query:** `start_date, end_date, user_id?, department_id?, project_id?, category?`  
**Response:** Expense breakdown, totals, trends  
**Why:** Financial reporting

---

## 18. Settings & Configuration

### 18.1 Get System Settings
```
GET /settings
```
**Purpose:** Get system configuration  
**Auth:** Required (Admin)  
**Response:** All system settings  
**Why:** View configuration

---

### 18.2 Update System Settings
```
PUT /settings
```
**Purpose:** Update system settings  
**Auth:** Required (Admin)  
**Body:** `{ company_name?, timezone?, working_hours?, leave_policies?, email_settings?, security_settings? }`  
**Response:** Updated settings  
**Why:** Configure system

---

### 18.3 Get Roles & Permissions
```
GET /settings/roles
```
**Purpose:** Get role configurations  
**Auth:** Required (Admin)  
**Response:** Roles with permissions  
**Why:** View access control

---

### 18.4 Update Role Permissions
```
PUT /settings/roles/{role_id}
```
**Purpose:** Update role permissions  
**Auth:** Required (Admin)  
**Body:** `{ permissions: {module: [actions]} }`  
**Response:** Updated role  
**Why:** Configure access control

---

### 18.5 Get Audit Logs
```
GET /settings/audit-logs
```
**Purpose:** Get system activity logs  
**Auth:** Required (Admin)  
**Query:** `page, per_page, user_id?, action?, module?, start_date?, end_date?`  
**Response:** Audit logs  
**Why:** Security, compliance

---

### 18.6 Backup Data
```
POST /settings/backup
```
**Purpose:** Trigger system backup  
**Auth:** Required (Admin)  
**Response:** Backup job ID  
**Why:** Data protection

---

### 18.7 Get Integration Settings
```
GET /settings/integrations
```
**Purpose:** Get third-party integrations  
**Auth:** Required (Admin)  
**Response:** Configured integrations  
**Why:** Manage integrations

---

### 18.8 Configure Integration
```
PUT /settings/integrations/{integration_type}
```
**Purpose:** Configure integration (Slack, Email, etc.)  
**Auth:** Required (Admin)  
**Body:** `{ enabled, api_key?, webhook_url?, settings: {} }`  
**Response:** Updated integration config  
**Why:** Setup third-party integrations

---

## 19. Reports

### 19.1 Generate Project Report
```
POST /reports/project
```
**Purpose:** Generate project report  
**Auth:** Required (Manager, Admin)  
**Body:** `{ project_id, report_type: 'summary'|'detailed'|'timeline', format: 'pdf'|'excel', include_sections[] }`  
**Response:** Report file or job ID  
**Why:** Project documentation

---

### 19.2 Generate Attendance Report
```
POST /reports/attendance
```
**Purpose:** Generate attendance report  
**Auth:** Required (Manager, Admin)  
**Body:** `{ start_date, end_date, user_ids[]?, department_id?, format }`  
**Response:** Report file  
**Why:** Attendance tracking, payroll

---

### 19.3 Generate Performance Report
```
POST /reports/performance
```
**Purpose:** Generate performance report  
**Auth:** Required (Manager, Admin)  
**Body:** `{ user_id?, department_id?, period, metrics[], format }`  
**Response:** Report file  
**Why:** Performance reviews

---

### 19.4 Generate Time Utilization Report
```
POST /reports/time-utilization
```
**Purpose:** Generate time tracking report  
**Auth:** Required (Manager, Admin)  
**Body:** `{ start_date, end_date, user_ids[]?, project_id?, billable_only?, format }`  
**Response:** Report file  
**Why:** Billing, productivity analysis

---

### 19.5 Generate Budget Report
```
POST /reports/budget
```
**Purpose:** Generate budget utilization report  
**Auth:** Required (Manager, Admin)  
**Body:** `{ department_id?, project_id?, fiscal_year, format }`  
**Response:** Report file  
**Why:** Financial reporting

---

### 19.6 Generate Leave Report
```
POST /reports/leave
```
**Purpose:** Generate leave utilization report  
**Auth:** Required (Manager, Admin)  
**Body:** `{ start_date, end_date, department_id?, leave_type?, format }`  
**Response:** Report file  
**Why:** HR reporting

---

### 19.7 Generate Task Completion Report
```
POST /reports/task-completion
```
**Purpose:** Generate task analytics report  
**Auth:** Required (Manager, Admin)  
**Body:** `{ start_date, end_date, project_id?, user_id?, format }`  
**Response:** Report file  
**Why:** Productivity tracking

---

### 19.8 Generate Bug Report
```
POST /reports/bug-analysis
```
**Purpose:** Generate bug metrics report  
**Auth:** Required (Manager, Admin)  
**Body:** `{ start_date, end_date, project_id?, severity?, format }`  
**Response:** Report file  
**Why:** Quality analysis

---

### 19.9 Generate Employee Report
```
POST /reports/employee
```
**Purpose:** Generate employee summary report  
**Auth:** Required (Manager, Admin)  
**Body:** `{ user_id, start_date, end_date, include_sections[], format }`  
**Response:** Report file  
**Why:** Individual performance, reviews

---

### 19.10 Schedule Recurring Report
```
POST /reports/schedule
```
**Purpose:** Schedule automatic report  
**Auth:** Required (Admin)  
**Body:** `{ report_type, frequency: 'daily'|'weekly'|'monthly', recipients[], parameters, format }`  
**Response:** Scheduled report config  
**Why:** Automated reporting

---

### 19.11 Get Report History
```
GET /reports/history
```
**Purpose:** Get generated reports list  
**Auth:** Required  
**Query:** `page, per_page, report_type?, generated_by?`  
**Response:** Reports array with download links  
**Why:** Access past reports

---

### 19.12 Download Report
```
GET /reports/{report_id}/download
```
**Purpose:** Download generated report  
**Auth:** Required  
**Response:** Report file  
**Why:** Retrieve reports

---

## 20. Miscellaneous

### 20.1 Global Search
```
GET /search
```
**Purpose:** Search across all entities  
**Auth:** Required  
**Query:** `query, page, per_page, filters: {entities[], date_range?}`  
**Response:** Search results grouped by entity type  
**Why:** Universal search

---

### 20.2 Get Activity Feed
```
GET /activity-feed
```
**Purpose:** Get recent activity  
**Auth:** Required  
**Query:** `page, per_page, entity_type?, entity_id?`  
**Response:** Activity stream  
**Why:** Recent updates, news feed

---

### 20.3 Upload File
```
POST /files/upload
```
**Purpose:** Generic file upload  
**Auth:** Required  
**Body:** `multipart/form-data: file, purpose: 'attachment'|'document'|'profile'`  
**Response:** File URL and metadata  
**Why:** File handling

---

### 20.4 Get File
```
GET /files/{file_id}
```
**Purpose:** Get/download file  
**Auth:** Required  
**Response:** File download or URL  
**Why:** File retrieval

---

### 20.5 Health Check
```
GET /health
```
**Purpose:** API health status  
**Auth:** None  
**Response:** `{ status: 'ok', version, uptime, database_status }`  
**Why:** Monitoring, uptime checks

---

### 20.6 Get API Version
```
GET /version
```
**Purpose:** Get API version info  
**Auth:** None  
**Response:** `{ version, build, release_date, changelog_url }`  
**Why:** Version tracking

---

## Appendix

### A. Common Query Parameters

| Parameter | Type | Description | Default |
|-----------|------|-------------|---------|
| page | integer | Page number (1-indexed) | 1 |
| per_page | integer | Items per page (max: 100) | 20 |
| search | string | Search query | - |
| sort_by | string | Field to sort by | created_at |
| sort_order | string | asc or desc | desc |
| start_date | date | Start date filter (YYYY-MM-DD) | - |
| end_date | date | End date filter (YYYY-MM-DD) | - |
| status | string | Filter by status | - |
| priority | string | Filter by priority | - |

---

### B. Common Response Fields

| Field | Type | Description |
|-------|------|-------------|
| id | uuid | Unique identifier |
| created_at | datetime | Creation timestamp (ISO 8601) |
| updated_at | datetime | Last update timestamp (ISO 8601) |
| created_by | object | User who created |
| updated_by | object | User who last updated |

---

### C. Enum Values Reference

**User Roles:**
- admin
- manager
- team_lead
- employee

**Project Status:**
- not_started
- in_progress
- on_hold
- completed
- cancelled
- archived

**Task Status:**
- to_do
- in_progress
- in_review
- testing
- completed
- blocked
- cancelled

**Bug Status:**
- new
- open
- in_progress
- testing
- resolved
- closed
- reopened
- deferred
- cannot_reproduce

**Priority Levels:**
- low
- medium
- high
- critical

**Bug Severity:**
- low
- medium
- high
- critical
- blocker

**Leave Types:**
- sick_leave
- casual_leave
- earned_leave
- unpaid_leave
- maternity_leave
- paternity_leave
- bereavement_leave
- compensatory_off
- work_from_home

**Approval Status:**
- pending
- approved
- rejected

---

### D. Error Codes

| Code | Description |
|------|-------------|
| AUTH_001 | Invalid credentials |
| AUTH_002 | Token expired |
| AUTH_003 | Invalid token |
| AUTH_004 | Insufficient permissions |
| VAL_001 | Validation error |
| VAL_002 | Required field missing |
| VAL_003 | Invalid format |
| BUS_001 | Business logic error |
| BUS_002 | Resource not found |
| BUS_003 | Duplicate entry |
| BUS_004 | Operation not allowed |
| SYS_001 | Internal server error |
| SYS_002 | Database error |
| SYS_003 | External service error |

---

### E. Rate Limiting

- **Default:** 1000 requests per hour per user
- **Headers:**
  - `X-RateLimit-Limit`: Request limit
  - `X-RateLimit-Remaining`: Remaining requests
  - `X-RateLimit-Reset`: Reset timestamp
- **Response on Limit:** 429 Too Many Requests

---

### F. Webhooks (Optional)

Available webhook events:
- `user.created`, `user.updated`, `user.deleted`
- `project.created`, `project.updated`, `project.status_changed`
- `task.created`, `task.assigned`, `task.status_changed`, `task.completed`
- `bug.created`, `bug.assigned`, `bug.status_changed`, `bug.resolved`
- `leave.applied`, `leave.approved`, `leave.rejected`
- `timesheet.submitted`, `timesheet.approved`

Configure webhooks via: `PUT /settings/webhooks`

---

### G. Best Practices

1. **Authentication:** Always include Bearer token in Authorization header
2. **Error Handling:** Check `success` field, handle errors gracefully
3. **Pagination:** Always use pagination for list endpoints
4. **Filtering:** Use query parameters for efficient filtering
5. **Caching:** Implement caching for frequently accessed data
6. **Rate Limits:** Respect rate limits, implement exponential backoff
7. **Versioning:** Include API version in base URL
8. **HTTPS:** Always use HTTPS in production
9. **Validation:** Validate data on client before submission
10. **Idempotency:** Use idempotency keys for critical operations

---

## Summary

**Total API Endpoints: 197**

- Authentication & Authorization: 12
- User Management: 13
- Department Management: 9
- Project Management: 15
- Task Management: 18
- Bug Management: 16
- Attendance Management: 12
- Leave Management: 10
- Time Tracking: 8
- Timesheet Management: 7
- Dashboard & Analytics: 10
- Notifications: 8
- Communication: 12
- Document Management: 10
- Performance & Goals: 12
- Training & Development: 10
- Expense Management: 9
- Settings & Configuration: 8
- Reports: 12
- Miscellaneous: 6

---

**End of API Documentation**
```
PUT