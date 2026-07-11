# PROJECT PLAN
**FoodieGo – Online Food Ordering System**

**Version:** 1.0 | **Date:** July 7th, 2026

**Submitted by Team FoodieGo:**
- Cao Đình Bảo
- Võ Duy Hoàng
- Phạm Hải Thiên

**Approved by:**

Project Mentor: ______________________

---

**Project Plan Review Panel Representative:**

| Name | Signature | Date |
|------|-----------|------|
| | | |

---

**Capstone Project – Mentor:**

| Name | Signature | Date |
|------|-----------|------|
| | | |

---

## PROJECT INFORMATION

| Item | Information |
|------|-------------|
| Project Acronym | FoodieGo |
| Project Title | FoodieGo – Online Food Ordering System |
| Start Date | 07 July 2026 |
| End Date | 30 August 2026 |
| Lead Institution | International School, Duy Tan University |
| Project Mentor | __________________ |
| Scrum Master / Project Leader & contact details | Cao Đình Bảo, Email: caodinhbao@dtu.edu.vn |
| Partner Organization | Duy Tan University |
| Project Repository | GitHub – FoodieGo |

**Team Members:**

| Name | Student ID | Email | Role |
|------|------------|-------|------|
| Cao Đình Bảo | 29219051113 | caodinhbao@dtu.edu.vn | Scrum Master |
| Võ Duy Hoàng | 29219020704 | voduyhoan@dtu.edu.vn | Team Member |
| Phạm Hải Thiên | 29219020597 | phamhaisthien@dtu.edu.vn | Team Member |

---

## DOCUMENT NAME

| Item | Information |
|------|-------------|
| Document Title | Project Plan Document |
| Author(s) | Cao Đình Bảo |
| Role | Scrum Master |
| Date | July 7th, 2026 |
| File name | FoodieGo_ProjectPlan_ver1.0.docx |

---

## REVISION HISTORY

| Version | Date | Comments | Author |
|---------|------|----------|--------|
| 1.0 | July 7th, 2026 | Initial Release | Cao Đình Bảo |

---

## TABLE OF CONTENTS

1. Introduction
   - 1.1 Purpose
   - 1.2 Project Overview
   - 1.3 Project Deliverable
2. Team Organization
   - 2.1 Scrum Team Information
   - 2.2 Role and Responsibility
   - 2.3 Communication Methodology
   - 2.4 Communication and Report
3. Development Process
4. Schedule and Cost
   - 4.1 Detailed Schedule
   - 4.2 Cost
5. Project Risk
6. Deliverables

---

## LIST OF TABLES

- Table 1. Scrum Team Organization
- Table 2. Role and Responsibilities
- Table 3. Communication Methodology
- Table 4. Communication and Report
- Table 5. Detailed Schedule
- Table 6. Cost person/hours
- Table 7. Total Cost Estimate (1)
- Table 8. Cost Estimation Parameters
- Table 9. Total Working Hours
- Table 10. Labor Cost Distribution
- Table 11. Other Project Costs
- Table 12. Total Estimated Cost Of The Project
- Table 13. Rating for likelihood and seriousness for each risk
- Table 14. Project Risk
- Table 15. Deliverables

---

## 1. Introduction

### 1.1 Purpose
This document provides a summary of the project objectives, scope, and work assignments. It outlines key milestones, required resources, an overall schedule, and a budget plan. The Project Plan is developed based on the approved proposal of FoodieGo – Online Food Ordering System to ensure that the system is implemented on schedule, meets stakeholder requirements, and aligns with the planned deliverables.

### 1.2 Project Overview
FoodieGo is an online food ordering platform that enables customers to browse restaurants, place orders, track deliveries, and review restaurants. Restaurant owners can manage restaurants, menus, and orders. Administrators monitor users, restaurants, and system statistics. The project follows Agile Scrum methodology with Lean principles to reduce waste and shorten Lead Time.

### 1.3 Project Deliverable
The project will develop a web-based food ordering system designed for three types of users: customers, restaurant owners, and administrators. The system will support core functions such as user authentication, restaurant browsing, menu management, order placement, real-time delivery fee calculation (via FastAPI microservice), and order tracking. Quality assurance will be maintained through CI/CD pipelines (GitHub Actions), automated testing (Jest), and code quality analysis (SonarQube).

---

## 2. Team Organization

### 2.1 Scrum Team Information

**Table 1. Scrum Team Organization**

| Full Name | Email | Position |
|-----------|-------|----------|
| __________________ | __________________ | Mentor |
| Cao Đình Bảo | caodinhbao@dtu.edu.vn | Scrum Master |
| Võ Duy Hoàng | voduyhoan@dtu.edu.vn | Team Member |
| Phạm Hải Thiên | phamhaithien@dtu.edu.vn | Team Member |

### 2.2 Role and Responsibility

**Table 2. Role and Responsibilities**

| Role | Responsibility | Name/Title |
|------|---------------|------------|
| Scrum Master | Organize Scrum events (Planning, Daily, Review, Retro). Ensure team compliance with Scrum. Remove impediments, support coordination. | Cao Đình Bảo |
| Secretary | Record meeting minutes. Archive documents (Proposal, Project Plan, Report). Track meeting schedules and deadlines. | Cao Đình Bảo |
| Reviewer | Participate in product evaluation in Sprint Review. Provide feedback from user perspective. Ensure features meet needs. | All Members |
| Developer | Design and program frontend interface. Build API and database (Backend). Integrate microservices. | All Members |
| Analyzer | Analyze user requirements. Identify use cases, user stories. Support Scrum Master in writing backlog. | All Members |
| Tester | Write Test Plan and Test Case. Test software (unit test, integration test). Record and report bugs. | All Members |
| Mentor | Project direction and monitoring. Provide professional advice. Support in solving technical difficulties. | Project Mentor |

### 2.3 Communication Methodology

**Table 3. Communication Methodology**

| Audience / Attendees | Topic / Deliverable | Frequency | Method |
|----------------------|---------------------|-----------|--------|
| Mentor and Team Member | Project Progress Review | Weekly | Meeting, Email, Zalo |
| Team Member | Project Progress Review and Daily Meeting | Daily | GitHub, Discord, Zalo, Google Meet |

### 2.4 Communication and Report

**Table 4. Communication and Report**

| Type of communication | Methods, tools | Frequency | Information | People |
|-----------------------|---------------|-----------|-------------|--------|
| Communication among in group (Scrum meeting) | Face to face or Discord | Every day | Informed about what was done in the last 24 hours, working on plans for today, the difficulties encountered and the solutions required. Just 10–15 minutes. | Project team |
| Sprint Planning Meeting | Meet face to face / Google Meet | Every 2 weeks | All members together to analyze the requirements, functions, working on the sprint going to do, planning and design for the sprint. | Project team |
| Retrospective Meeting | Meet face to face / Google Meet | Every 2 weeks | Complete documentation. For each stage, sharing materials, given the strengths and weaknesses for each member, period and the solution. | Project team and Mentor |
| Demo | Meeting online / Google Meet | Every Sprint | Demonstrate working software to mentor and stakeholders. Collect feedback. | Project team and Mentor |
| Task Tracking | GitHub Projects | Daily | A web-based task tracking system. To manage or divide tasks, report bugs/issues. | Project team |

---

## 3. Development Process

Scrum is an agile project management framework that helps teams structure and manage their work through a set of values, principles, and practices. FoodieGo applies Scrum combined with Lean principles to reduce waste and shorten Lead Time.

**Benefits of Scrum applied in FoodieGo:**

- **Adapts Quickly to Change:** Scrum allows the team to flexibly adjust plans and goals during short work cycles (Sprints). This helps the project easily react to changes without causing major disruptions.
- **Identifies Problems Early:** Daily Stand-ups and end-of-Sprint reviews provide opportunities for the team to detect and resolve problems early. This helps reduce bug-fixing costs and prevents delays.
- **Focuses on Value:** Scrum prioritizes developing the features with the highest value first. The team doesn't waste time on less important requirements, ensuring the final product delivers maximum benefits.
- **Better Aligns with Customer Needs:** With frequent Sprint Reviews, the team can receive direct feedback and ensure the product is always adjusted to meet user expectations.
- **Increases Work Productivity:** Scrum fosters a transparent and collaborative work environment. Team members know their tasks, share information continuously, and work more efficiently.
- **Predictable Scheduling:** Fixed-length Sprints maintain a stable work rhythm. Clients and stakeholders can easily predict progress and plan feature releases.

**Lean principles applied:**
- Reduce waiting time between tasks
- Reduce unnecessary rework through PR reviews and CI/CD
- Measure Lead Time from code commit to merge
- Continuous Improvement via Sprint Retrospective

**Quality is measured by:**
- Test Coverage ≥ 80% (Jest)
- CI Success Rate ≥ 90% (GitHub Actions)
- SonarQube Issues ≤ 10
- Lead Time (PR open → merge) ≤ 1 day

---

## 4. Schedule and Cost

### 4.1 Detailed Schedule

**Table 5. Detailed Schedule**

| No. | Task Name | Start | Finish | Effort (Hours) |
|-----|-----------|-------|--------|----------------|
| **1** | **Project Initiation** | **07/07** | **11/07** | **120** |
| 1.1 | Gathering Requirement | 07/07 | 08/07 | 40 |
| 1.1.1 | Get requirement from Mentor | 07/07 | 07/07 | 15 |
| 1.1.2 | Analyzing requirement | 08/07 | 08/07 | 25 |
| 1.2 | Create Proposal Document | 09/07 | 11/07 | 80 |
| 1.2.1 | Product Definition | 09/07 | 09/07 | 20 |
| 1.2.2 | Business Need | 09/07 | 10/07 | 20 |
| 1.2.3 | Proposed Solution | 10/07 | 11/07 | 25 |
| 1.2.4 | Master Plan | 11/07 | 11/07 | 15 |
| **2** | **Project Setup** | **12/07** | **16/07** | **120** |
| 2.1.1 | Project Kick-off Meeting | 12/07 | 12/07 | 10 |
| 2.1.2 | Team Meeting – Clarify Scope | 12/07 | 13/07 | 15 |
| 2.1.3 | Create User Stories | 13/07 | 14/07 | 30 |
| 2.1.4 | Create Product Backlog | 14/07 | 15/07 | 30 |
| 2.1.5 | Review Document | 15/07 | 16/07 | 20 |
| 2.1.6 | Create Project Plan | 16/07 | 16/07 | 15 |
| **3** | **Development** | **17/07** | **28/08** | **972** |
| **3.1** | **Sprint 1 (Auth + Users)** | **17/07** | **30/07** | **252** |
| 3.1.1 | Sprint Planning | 17/07 | 17/07 | 15 |
| 3.1.2 | Setup Infrastructure & DB | 18/07 | 20/07 | 54 |
| 3.1.3 | Authentication & JWT | 21/07 | 25/07 | 90 |
| 3.1.4 | Profile & Role Management | 26/07 | 29/07 | 72 |
| 3.1.5 | Sprint Release | 30/07 | 30/07 | 21 |
| **3.2** | **Sprint 2 (Restaurant + Menu)** | **31/07** | **13/08** | **252** |
| 3.2.1 | Sprint Planning | 31/07 | 31/07 | 15 |
| 3.2.2 | Restaurant Profile APIs | 01/08 | 05/08 | 72 |
| 3.2.3 | Menu Items CRUD | 06/08 | 10/08 | 90 |
| 3.2.4 | Database Unit Testing | 11/08 | 13/08 | 54 |
| 3.2.5 | Sprint Release | 13/08 | 13/08 | 21 |
| **3.3** | **Sprint 3 (Orders + Delivery)** | **14/08** | **23/08** | **252** |
| 3.3.1 | Sprint Planning | 14/08 | 14/08 | 15 |
| 3.3.2 | Order Creation & Status APIs | 15/08 | 18/08 | 90 |
| 3.3.3 | Delivery Service (FastAPI) | 19/08 | 21/08 | 90 |
| 3.3.4 | Integration Testing | 22/08 | 23/08 | 36 |
| 3.3.5 | Sprint Release | 23/08 | 23/08 | 21 |
| **3.4** | **Sprint 4 (Frontend + CI/CD + Docs)** | **24/08** | **28/08** | **216** |
| 3.4.1 | Sprint Planning | 24/08 | 24/08 | 15 |
| 3.4.2 | Web Interface Integration | 25/08 | 26/08 | 108 |
| 3.4.3 | Docker & CI/CD Pipeline | 27/08 | 27/08 | 54 |
| 3.4.4 | Final Release & Demo | 28/08 | 28/08 | 39 |
| **4** | **Close Project** | **29/08** | **30/08** | **36** |
| 4.1 | Final Release | 29/08 | 29/08 | 12 |
| 4.2 | Project Meeting | 29/08 | 30/08 | 12 |
| 4.3 | Final Submission | 30/08 | 30/08 | 12 |

---

### 4.2 Cost

This section presents the estimated cost required for the development of the FoodieGo project. The total cost includes labor costs (based on working hours of team members) and additional operational costs such as hosting and infrastructure.

#### 4.2.1 Cost per Person/Hour

The labor cost of the project is estimated based on the hourly rate of each team member. The proposed hourly rate is aligned with the typical internship salary in Vietnam, which ranges from 70,000 VND to 100,000 VND per hour. The Scrum Master is assigned a slightly higher hourly rate due to additional responsibilities such as project coordination, sprint planning, and team management, in addition to development tasks.

**Table 6. Cost person/hours**

| Full Name | Role | Salary Rate (USD/hour) |
|-----------|------|------------------------|
| Võ Duy Hoàng | Team Member | 3.50 |
| Phạm Hải Thiên | Team Member | 3.50 |
| Cao Đình Bảo | Scrum Master | 4.00 |

#### 4.2.2 Total Cost Estimate

The total project cost consists of two main components:
- Labor cost based on the working hours of team members
- Other operational costs required to support project development and deployment

**Table 7. Total Cost Estimate (1)**

| No. | Criteria | Price (USD) |
|-----|----------|-------------|
| 1 | Working hours | 3,792.00 |
| 2 | Other cost | 190.00 |
| **TOTAL ESTIMATED COST** | | **3,982.00** |

#### 4.2.3 Project Cost Parameters

The parameters used to estimate the total project cost are presented in Table 8.

**Table 8. Cost Estimation Parameters**

| Description | Amount | Unit |
|-------------|--------|------|
| Number of members | 3 | Person |
| Number of working hours per day | 6 | Hours |
| The average cost per hour per member | 3.67 | USD |
| The number of working days | 54 | Days |

#### 4.2.4 Total Working Hours

The total estimated working hours for the project are 1,248 hours, which are derived from the detailed activities defined in the Project Plan.

**Table 9. Total Working Hours**

| Phase | Working Hours |
|-------|---------------|
| Project Initiation | 120 hours |
| Project Setup | 120 hours |
| Sprint 1 (Auth + Users) | 252 hours |
| Sprint 2 (Restaurant + Menu) | 252 hours |
| Sprint 3 (Orders + Delivery) | 252 hours |
| Sprint 4 (Frontend + CI/CD + Docs) | 216 hours |
| Close Project | 36 hours |
| **TOTAL** | **1,248 hours** |

#### 4.2.5 Labor Cost Calculation

The labor cost is calculated based on the actual working hours of each team member multiplied by their hourly rate. Since all three members participate in the development process, the workload is distributed equally.

**Table 10. Labor Cost Distribution**

| Full Name | Role | Salary Rate (USD/hour) | Hours | Amount (USD) |
|-----------|------|------------------------|-------|--------------|
| Võ Duy Hoàng | Team Member | 3.50 | 416 | 1,456.00 |
| Phạm Hải Thiên | Team Member | 3.50 | 416 | 1,456.00 |
| Cao Đình Bảo | Scrum Master | 4.00 | 416 | 1,664.00 |
| **TOTAL** | | | **1,248** | **4,576.00** |

> Note: Estimated cost adjusted after accounting for shared workload distribution across phases.

#### 4.2.6 Other Costs

Besides labor costs, the project requires several supporting operational expenses, including infrastructure and miscellaneous costs.

**Table 11. Other Project Costs**

| Item | Cost (USD) | Note |
|------|------------|------|
| Electricity and internet | 70 | Team working environment during the project |
| Server / hosting rental | 100 | Deployment and testing environment |
| Domain (optional) | 20 | FoodieGo domain registration |
| **TOTAL** | **190** | |

#### 4.2.7 Total Project Cost

The total estimated cost of the project is calculated as follows:

**Table 12. Total Estimated Cost Of The Project**

| Item | Amount (USD) |
|------|--------------|
| Labor cost | 4,576.00 |
| Other costs | 190.00 |
| **TOTAL ESTIMATED COST** | **4,766.00** |

Therefore, the total estimated budget required to complete the FoodieGo project is **4,766.00 USD** (In words: Four thousand seven hundred sixty-six US dollars).

---

## 5. Project Risk

**Table 13. Rating for likelihood and seriousness for each risk**

| Rating | Meaning |
|--------|---------|
| L | Rated as Low |
| E | Rated as Extreme (Used for Seriousness only) |
| M | Rated as Medium |
| NA | Not Assessed |
| H | Rated as High |

**Table 14. Project Risk**

| Risk | Definition | Level | Likelihood | Mitigation Strategy |
|------|------------|-------|------------|---------------------|
| Requirements Definition | The team does not have a clear agreement on functional requirements, leading to scope misalignment. | H | M | Conduct requirement clarification meetings; document and confirm requirements officially before each Sprint. |
| Schedule Estimation | Planning and execution time are not accurately estimated, leading to delays. | M | M | Create a detailed plan with effort estimates, update the schedule regularly via GitHub Projects. |
| Programming Experience | Team members are not familiar with technologies such as Node.js, FastAPI, or MySQL. | M | M | Organize internal training sessions; pair less experienced members with experienced ones; study documentation early. |
| Database Management | Errors in MySQL design could lead to data loss or low performance. | H | M | Design a clear database schema, perform regular backups, and test thoroughly via Docker. |
| Testing and Quality Assurance | Lack of sufficient testing could cause bugs in the production environment. | H | M | Write Jest unit/integration tests with coverage ≥ 80%; integrate SonarQube for code quality checks. |
| Network / Hosting Infrastructure | Unstable hosting or limited bandwidth could slow down or interrupt the system. | M | L | Choose a reliable hosting service; use Docker for consistent deployment environments. |
| Security | Vulnerabilities such as SQL Injection or weak JWT handling due to insecure coding. | H | M | Follow secure coding standards; validate all inputs; use HTTPS; enforce JWT expiration policies. |
| Team Communication | Lack of clear communication leads to misunderstandings or duplicated tasks. | M | L | Hold daily stand-ups on Discord; use GitHub Projects for task tracking. |
| CI/CD Failure | GitHub Actions pipeline failures block deployment and slow down development. | M | M | Maintain clean CI configuration; fix lint and test errors immediately; test Docker deployment each Sprint. |
| Scope Creep | New requirements are frequently added during development, affecting progress. | H | M | Define a clear scope at the start and apply a change approval process for additional requests. |

---

## 6. Deliverables

**Table 15. Deliverables**

| No. | Document | Deadline | File Name |
|-----|----------|----------|-----------|
| 1 | Project Proposal | July 10th, 2026 | FoodieGo_ProjectProposal_ver1.0.docx |
| 2 | Product Backlog | July 15th, 2026 | FoodieGo_Backlog.md |
| 3 | Project Plan Document | July 20th, 2026 | FoodieGo_ProjectPlan_ver1.0.docx |
| 4 | Sprint 1 Release | July 30th, 2026 | GitHub Release – Sprint 1 |
| 5 | Sprint 2 Release | August 13th, 2026 | GitHub Release – Sprint 2 |
| 6 | Sprint 3 Release | August 23rd, 2026 | GitHub Release – Sprint 3 |
| 7 | Testing & Metrics Report | August 28th, 2026 | FoodieGo_Metrics_Report.md |
| 8 | Source Code (Final) | August 30th, 2026 | GitHub Repository – FoodieGo |
| 9 | Presentation Slides | August 30th, 2026 | FoodieGo_FinalPresentation.pptx |
| 10 | Final Demonstration | August 30th, 2026 | Live Demo – Capstone Day |
