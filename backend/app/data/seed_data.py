import json
from pathlib import Path
import random
import sys
from datetime import datetime

# Ensure project root is accessible
ROOT_DIR = Path(__file__).resolve().parent.parent.parent.parent
if str(ROOT_DIR) not in sys.path:
    sys.path.insert(0, str(ROOT_DIR))
BACKEND_DIR = Path(__file__).resolve().parent.parent.parent
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))
from sqlalchemy.orm import Session

from app.core.security import hash_password
from app.database import Base, SessionLocal, engine
from app.models.workforce import (
    AuditLog,
    AttritionPredictionRecord,
    Department,
    DigitalTwinScenario,
    Employee,
    EmployeeSkill,
    FutureSkillForecast,
    Project,
    ProjectRequirement,
    RetentionRecommendation,
    Skill,
    SuccessionPlan,
    User,
    WorkforceAlert,
)
from ml.predict_service import prediction_service


def seed_database() -> None:
    # Ensure all tables exist in SQLite/Postgres
    Base.metadata.create_all(bind=engine)
    db: Session = SessionLocal()

    try:
        if db.query(User).first() is not None:
            print("Database already contains data. Skipping re-seed.")
            return

        print("Seeding STRATA.AI Enterprise Workforce Database...")

        # 1. Seed Users for Role-Based Access Control
        users = [
            User(
                email="admin@enterprise.workforce",
                password_hash=hash_password("admin123"),
                first_name="System",
                last_name="Administrator",
                role="ADMIN",
                department="IT Operations",
            ),
            User(
                email="hr@enterprise.workforce",
                password_hash=hash_password("hr123"),
                first_name="Elena",
                last_name="Rostova",
                role="HR",
                department="People & Culture",
            ),
            User(
                email="manager@enterprise.workforce",
                password_hash=hash_password("manager123"),
                first_name="David",
                last_name="Chen",
                role="MANAGER",
                department="Engineering",
            ),
            User(
                email="leadership@enterprise.workforce",
                password_hash=hash_password("leader123"),
                first_name="Victoria",
                last_name="Sterling",
                role="LEADERSHIP",
                department="Executive Office",
            ),
            User(
                email="employee@enterprise.workforce",
                password_hash=hash_password("emp123"),
                first_name="Marcus",
                last_name="Vance",
                role="EMPLOYEE",
                department="Engineering",
            ),
        ]
        db.add_all(users)
        db.flush()

        # 2. Seed Departments
        dept_data = [
            {"name": "Engineering", "code": "ENG", "budget": 8500000.0, "head_count": 42},
            {"name": "People & Culture", "code": "HR", "budget": 1200000.0, "head_count": 8},
            {"name": "Sales & Revenue", "code": "SAL", "budget": 4500000.0, "head_count": 22},
            {"name": "Finance & Operations", "code": "FIN", "budget": 2100000.0, "head_count": 12},
            {"name": "Customer Support", "code": "SUP", "budget": 1800000.0, "head_count": 16},
        ]
        for d in dept_data:
            db.add(Department(**d))
        db.flush()

        # 3. Seed Skills Taxonomy
        skills_data = [
            # Technical & Web
            {"name": "Python", "category": "Programming Languages", "market_demand_weight": 1.2, "is_emerging": False},
            {"name": "TypeScript", "category": "Programming Languages", "market_demand_weight": 1.2, "is_emerging": False},
            {"name": "React", "category": "Frameworks & Web", "market_demand_weight": 1.1, "is_emerging": False},
            {"name": "FastAPI", "category": "Frameworks & Web", "market_demand_weight": 1.2, "is_emerging": False},
            {"name": "Node.js", "category": "Frameworks & Web", "market_demand_weight": 1.0, "is_emerging": False},
            {"name": "Go", "category": "Programming Languages", "market_demand_weight": 1.2, "is_emerging": True},
            # Cloud & DevOps
            {"name": "AWS", "category": "Cloud & Infrastructure", "market_demand_weight": 1.3, "is_emerging": False},
            {"name": "Azure", "category": "Cloud & Infrastructure", "market_demand_weight": 1.2, "is_emerging": False},
            {"name": "Docker", "category": "DevOps & SRE", "market_demand_weight": 1.1, "is_emerging": False},
            {"name": "Kubernetes", "category": "DevOps & SRE", "market_demand_weight": 1.4, "is_emerging": True},
            {"name": "Terraform", "category": "Cloud & Infrastructure", "market_demand_weight": 1.2, "is_emerging": False},
            {"name": "CI/CD", "category": "DevOps & SRE", "market_demand_weight": 1.1, "is_emerging": False},
            # Data & AI
            {"name": "Machine Learning", "category": "AI & Machine Learning", "market_demand_weight": 1.4, "is_emerging": False},
            {"name": "Generative AI", "category": "AI & Machine Learning", "market_demand_weight": 1.6, "is_emerging": True},
            {"name": "PyTorch", "category": "AI & Machine Learning", "market_demand_weight": 1.3, "is_emerging": False},
            {"name": "MLOps", "category": "AI & Machine Learning", "market_demand_weight": 1.5, "is_emerging": True},
            {"name": "PostgreSQL", "category": "Data & Databases", "market_demand_weight": 1.1, "is_emerging": False},
            {"name": "Snowflake", "category": "Data & Databases", "market_demand_weight": 1.3, "is_emerging": True},
            # Security
            {"name": "Cloud Security", "category": "Cybersecurity", "market_demand_weight": 1.4, "is_emerging": True},
            {"name": "Zero Trust Architecture", "category": "Cybersecurity", "market_demand_weight": 1.4, "is_emerging": True},
            # Leadership & Soft Skills
            {"name": "Executive Communication", "category": "Leadership & Strategy", "market_demand_weight": 1.2, "is_emerging": False},
            {"name": "Engineering Leadership", "category": "Leadership & Strategy", "market_demand_weight": 1.3, "is_emerging": False},
            {"name": "Agile / Scrum", "category": "Leadership & Strategy", "market_demand_weight": 1.0, "is_emerging": False},
        ]
        for s in skills_data:
            db.add(Skill(**s))
        db.flush()

        # 4. Generate 80 realistic employees across departments
        first_names = [
            "Marcus", "Elena", "Sophia", "David", "Aria", "James", "Liam", "Olivia",
            "Alexander", "Isabella", "Benjamin", "Mia", "Lucas", "Charlotte", "Henry", "Amelia",
            "Gabriel", "Harper", "Julian", "Evelyn", "Mateo", "Abigail", "Sebastian", "Emily",
            "Ethan", "Elizabeth", "Daniel", "Mila", "Matthew", "Ella", "Jackson", "Avery",
            "Samuel", "Sofia", "David", "Camila", "Joseph", "Aria", "Carter", "Scarlett",
            "Owen", "Victoria", "Wyatt", "Madison", "John", "Luna", "Jack", "Grace",
            "Luke", "Chloe", "Jayden", "Penelope", "Dylan", "Layla", "Grayson", "Riley",
            "Levi", "Zoey", "Isaac", "Nora", "Anthony", "Lily", "Leo", "Eleanor",
            "Joshua", "Hannah", "Christopher", "Lillian", "Andrew", "Addison", "Theodore", "Aubrey",
            "Caleb", "Ellie", "Ryan", "Stella", "Asher", "Natalie", "Nathan", "Zoe",
        ]
        last_names = [
            "Vance", "Rostova", "Patel", "Chen", "Kim", "O'Connor", "Dubois", "Nakamura",
            "Al-Mansoor", "Kowalski", "Santos", "Johansson", "Schmidt", "Rossi", "Torres", "Morales",
            "Larsson", "Bauer", "Fischer", "Meyer", "Moreau", "Fontaine", "Gomez", "Fernandez",
            "Silva", "Oliveira", "Costa", "Pereira", "Singh", "Sharma", "Verma", "Gupta",
            "Tanaka", "Yamamoto", "Watanabe", "Ito", "Park", "Choi", "Kang", "Yoon",
            "Zhao", "Wu", "Li", "Wang", "Zhang", "Liu", "Chen", "Yang",
            "Taylor", "Anderson", "Thomas", "Jackson", "White", "Harris", "Martin", "Thompson",
            "Garcia", "Martinez", "Robinson", "Clark", "Rodriguez", "Lewis", "Lee", "Walker",
            "Hall", "Allen", "Young", "Hernandez", "King", "Wright", "Lopez", "Hill",
            "Scott", "Green", "Adams", "Baker", "Gonzalez", "Nelson", "Carter", "Mitchell",
        ]

        roles_by_dept = {
            "Engineering": [
                ("Senior Cloud Platform Engineer", "Senior", 145000),
                ("Lead AI / ML Systems Engineer", "Lead", 168000),
                ("Senior Full-Stack Developer", "Senior", 138000),
                ("DevOps & SRE Specialist", "Mid", 115000),
                ("Software Engineer II", "Mid", 108000),
                ("Junior Software Engineer", "Junior", 82000),
                ("Principal Data Architect", "Director", 195000),
                ("Security & Compliance Engineer", "Senior", 142000),
            ],
            "People & Culture": [
                ("VP of People & Culture", "Director", 175000),
                ("Senior Technical Recruiter", "Senior", 105000),
                ("HR Business Partner", "Mid", 92000),
                ("People Operations Specialist", "Junior", 68000),
            ],
            "Sales & Revenue": [
                ("VP of Enterprise Sales", "Director", 185000),
                ("Senior Enterprise Account Executive", "Senior", 135000),
                ("Solutions Sales Engineer", "Senior", 130000),
                ("Account Executive II", "Mid", 95000),
                ("Sales Development Representative", "Junior", 62000),
            ],
            "Finance & Operations": [
                ("Head of Financial Planning", "Director", 170000),
                ("Senior Financial Analyst", "Senior", 118000),
                ("Operations Manager", "Mid", 98000),
                ("Staff Accountant", "Junior", 72000),
            ],
            "Customer Support": [
                ("Director of Customer Success", "Director", 155000),
                ("Senior Technical Account Manager", "Senior", 110000),
                ("Customer Support Lead", "Mid", 85000),
                ("Tier II Support Engineer", "Junior", 64000),
            ],
        }

        # Specific Signature Employee for Demo (EMP-104: Marcus Vance)
        # Perfectly exhibits the critical risk profile described in Master Prompt
        employees_to_create = []

        signature_emp = Employee(
            employee_number="EMP-104",
            first_name="Marcus",
            last_name="Vance",
            email="marcus.vance@enterprise.workforce",
            department="Engineering",
            role_title="Senior Cloud Platform Engineer",
            level="Senior",
            salary=128000.0,
            salary_growth_rate=1.8,
            compa_ratio=0.82,  # 18% underpaid vs role benchmark
            tenure_years=3.8,
            experience_years=8.5,
            age=34,
            hire_date="2021-03-15",
            performance_score=4.6,  # Stellar performer, but dissatisfied!
            satisfaction_score=31.0,  # Critical low
            engagement_score=36.0,  # Critical low
            monthly_hours=224,  # Overworked
            overtime_hours=38,
            project_count=4,
            promotions_count=0,
            years_since_last_promotion=3.8,  # Career stagnation
            manager_rating=2.8,  # Friction with manager
            manager_name="David Chen",
            attrition_risk=0.0,  # Will be calculated by ML below
            risk_tier="Critical",
            employment_status="Active",
        )
        employees_to_create.append(signature_emp)

        random.seed(42)
        depts = ["Engineering", "Sales & Revenue", "People & Culture", "Finance & Operations", "Customer Support"]
        dept_weights = [0.45, 0.25, 0.10, 0.10, 0.10]

        for i in range(1, 80):
            emp_num = f"EMP-{100 + i}"
            if emp_num == "EMP-104":
                continue

            fname = first_names[i % len(first_names)]
            lname = last_names[i % len(last_names)]
            dept = random.choices(depts, weights=dept_weights)[0]
            role_tuple = random.choice(roles_by_dept[dept])
            role_title, level, base_sal = role_tuple

            tenure = round(random.uniform(0.6, 9.0), 1)
            exp = round(tenure + random.uniform(1.0, 8.0), 1)
            age = int(24 + exp)

            # Make a realistic distribution: ~12% high/critical risk, ~25% medium, ~63% low
            risk_profile = random.random()
            if risk_profile < 0.12:
                # High/Critical risk employee
                sat = round(random.uniform(25, 48), 1)
                eng = round(random.uniform(30, 52), 1)
                hours = random.randint(195, 235)
                ot = random.randint(22, 45)
                compa = round(random.uniform(0.78, 0.88), 2)
                promo_years = round(random.uniform(2.5, min(tenure, 6.0)), 1)
                mgr_rate = round(random.uniform(2.0, 3.4), 1)
                growth = round(random.uniform(1.0, 2.5), 1)
            elif risk_profile < 0.35:
                # Medium risk employee
                sat = round(random.uniform(52, 68), 1)
                eng = round(random.uniform(55, 70), 1)
                hours = random.randint(170, 195)
                ot = random.randint(8, 20)
                compa = round(random.uniform(0.90, 0.98), 2)
                promo_years = round(random.uniform(1.5, 3.0), 1)
                mgr_rate = round(random.uniform(3.2, 4.0), 1)
                growth = round(random.uniform(3.0, 5.0), 1)
            else:
                # Healthy / Low risk employee
                sat = round(random.uniform(72, 95), 1)
                eng = round(random.uniform(75, 96), 1)
                hours = random.randint(155, 175)
                ot = random.randint(0, 10)
                compa = round(random.uniform(0.98, 1.22), 2)
                promo_years = round(random.uniform(0.5, 2.0), 1)
                mgr_rate = round(random.uniform(4.0, 4.9), 1)
                growth = round(random.uniform(4.5, 9.0), 1)

            sal = round(base_sal * compa, 2)
            perf = round(random.uniform(3.0, 4.8), 1)

            emp = Employee(
                employee_number=emp_num,
                first_name=fname,
                last_name=lname,
                email=f"{fname.lower()}.{lname.lower()}@enterprise.workforce",
                department=dept,
                role_title=role_title,
                level=level,
                salary=sal,
                salary_growth_rate=growth,
                compa_ratio=compa,
                tenure_years=tenure,
                experience_years=exp,
                age=age,
                hire_date=f"20{24 - int(tenure):02d}-0{random.randint(1,9)}-15",
                performance_score=perf,
                satisfaction_score=sat,
                engagement_score=eng,
                monthly_hours=hours,
                overtime_hours=ot,
                project_count=random.randint(1, 4),
                promotions_count=1 if tenure > 2.5 else 0,
                years_since_last_promotion=promo_years,
                manager_rating=mgr_rate,
                manager_name="David Chen" if dept == "Engineering" else "Elena Rostova",
                attrition_risk=0.0,
                risk_tier="Low",
                employment_status="Active",
            )
            employees_to_create.append(emp)

        db.add_all(employees_to_create)
        db.flush()

        # Run real ML model on all seeded employees to determine true risk & explanations!
        print("Running real ML model inference to calculate attrition risks for all employees...")
        skill_catalog = {s.name: s.category for s in db.query(Skill).all()}

        for emp in employees_to_create:
            emp_features = {
                "satisfaction_score": emp.satisfaction_score,
                "engagement_score": emp.engagement_score,
                "monthly_hours": emp.monthly_hours,
                "overtime_hours": emp.overtime_hours,
                "compa_ratio": emp.compa_ratio,
                "years_since_last_promotion": emp.years_since_last_promotion,
                "tenure_years": emp.tenure_years,
                "project_count": emp.project_count,
                "manager_rating": emp.manager_rating,
                "performance_score": emp.performance_score,
                "salary_growth_rate": emp.salary_growth_rate,
            }
            pred = prediction_service.predict(emp_features)
            emp.attrition_risk = pred["attrition_risk_score"]
            emp.risk_tier = pred["risk_tier"]

            # Store prediction record
            db.add(AttritionPredictionRecord(
                employee_id=emp.id,
                model_version=pred["model_version"],
                predicted_probability=pred["probability"],
                risk_tier=pred["risk_tier"],
                top_factors_json=json.dumps(pred["contributing_factors"]),
                shap_values_json=json.dumps(pred.get("contributing_factors", [])),
            ))

            # Store retention recommendations for high/critical risk employees
            if emp.attrition_risk >= 50.0:
                for rec in pred["recommended_interventions"]:
                    db.add(RetentionRecommendation(
                        employee_id=emp.id,
                        intervention_type=rec["type"],
                        title=f"{rec['type']} Retention Action",
                        description=rec["action"],
                        priority=rec["priority"],
                        status="Open",
                        estimated_risk_reduction=rec["projected_risk_reduction"],
                    ))

            # Assign 4 to 8 realistic skills per employee
            dept_skills = []
            if emp.department == "Engineering":
                dept_skills = ["Python", "FastAPI", "React", "TypeScript", "AWS", "Docker", "Kubernetes", "PostgreSQL", "Machine Learning", "Generative AI", "PyTorch", "MLOps", "Terraform", "Cloud Security", "CI/CD"]
            elif emp.department == "Sales & Revenue":
                dept_skills = ["Executive Communication", "Agile / Scrum", "Python", "Cloud Security", "AWS"]
            else:
                dept_skills = ["Executive Communication", "Engineering Leadership", "Agile / Scrum", "Python"]

            num_skills = random.randint(4, 7)
            chosen_skills = random.sample(dept_skills, min(num_skills, len(dept_skills)))
            for sk_name in chosen_skills:
                prof = random.choices([2, 3, 4, 5], weights=[0.2, 0.45, 0.25, 0.1])[0]
                db.add(EmployeeSkill(
                    employee_id=emp.id,
                    skill_name=sk_name,
                    category=skill_catalog.get(sk_name, "Technical"),
                    proficiency=prof,
                    confidence=0.92,
                    last_used="2026",
                ))

        db.flush()

        # 5. Seed Projects and Project Skill Requirements (to demonstrate Skill Gap Analysis)
        projects_data = [
            {
                "name": "Cloud Modernization & Multi-Region Migration",
                "code": "PRJ-CLOUD-2026",
                "department": "Engineering",
                "priority": "Critical",
                "status": "Active",
                "description": "Migrate core transactional architecture to highly-available AWS EKS multi-cluster setup.",
                "team_size_target": 8,
                "requirements": [
                    {"skill": "AWS", "min_prof": 4, "headcount": 5},
                    {"skill": "Kubernetes", "min_prof": 4, "headcount": 4},
                    {"skill": "Terraform", "min_prof": 3, "headcount": 3},
                    {"skill": "Cloud Security", "min_prof": 4, "headcount": 2},
                ],
            },
            {
                "name": "Autonomous AI & Generative Intelligence Engine",
                "code": "PRJ-AI-GEN-01",
                "department": "Engineering",
                "priority": "Critical",
                "status": "Active",
                "description": "Develop multi-agent RAG workflow with real-time vector retrieval and continuous MLOps.",
                "team_size_target": 6,
                "requirements": [
                    {"skill": "Generative AI", "min_prof": 4, "headcount": 4},
                    {"skill": "MLOps", "min_prof": 4, "headcount": 3},
                    {"skill": "Python", "min_prof": 4, "headcount": 5},
                    {"skill": "PyTorch", "min_prof": 3, "headcount": 3},
                ],
            },
            {
                "name": "Enterprise Zero-Trust Identity Overhaul",
                "code": "PRJ-SEC-ZT-04",
                "department": "Engineering",
                "priority": "High",
                "status": "Planning",
                "description": "Implement continuous biometric IAM and perimeterless micro-segmentation across corporate infra.",
                "team_size_target": 5,
                "requirements": [
                    {"skill": "Zero Trust Architecture", "min_prof": 4, "headcount": 3},
                    {"skill": "Cloud Security", "min_prof": 3, "headcount": 3},
                ],
            },
        ]

        for p_data in projects_data:
            reqs = p_data.pop("requirements")
            prj = Project(**p_data)
            db.add(prj)
            db.flush()
            for r in reqs:
                db.add(ProjectRequirement(
                    project_id=prj.id,
                    skill_name=r["skill"],
                    min_proficiency=r["min_prof"],
                    headcount_needed=r["headcount"],
                ))

        # 6. Seed Future Skill Forecasts (Module 7)
        future_forecasts = [
            FutureSkillForecast(
                skill_name="Generative AI & LLMOps",
                category="AI & Machine Learning",
                current_coverage=18.5,
                projected_demand_1yr=52.0,
                projected_demand_3yr=76.0,
                growth_rate=48.2,
                gap_tier="CRITICAL",
                strategic_rationale="Core product transformation towards autonomous agents and real-time semantic intelligence.",
            ),
            FutureSkillForecast(
                skill_name="Cloud Security Architecture",
                category="Cybersecurity",
                current_coverage=24.0,
                projected_demand_1yr=58.0,
                projected_demand_3yr=72.0,
                growth_rate=36.5,
                gap_tier="HIGH",
                strategic_rationale="Mandatory SOC2 Type II and FedRAMP compliance requirements for enterprise client expansion.",
            ),
            FutureSkillForecast(
                skill_name="MLOps & Model Governance",
                category="AI & Machine Learning",
                current_coverage=14.0,
                projected_demand_1yr=48.0,
                projected_demand_3yr=65.0,
                growth_rate=44.0,
                gap_tier="CRITICAL",
                strategic_rationale="Production deployment, automated model retraining, drift monitoring, and explainability auditing.",
            ),
            FutureSkillForecast(
                skill_name="Kubernetes Multi-Cluster",
                category="DevOps & SRE",
                current_coverage=21.0,
                projected_demand_1yr=50.0,
                projected_demand_3yr=62.0,
                growth_rate=29.0,
                gap_tier="HIGH",
                strategic_rationale="Global sovereign cloud hosting and zero-downtime distributed rolling updates.",
            ),
            FutureSkillForecast(
                skill_name="Zero Trust Architecture",
                category="Cybersecurity",
                current_coverage=16.0,
                projected_demand_1yr=44.0,
                projected_demand_3yr=58.0,
                growth_rate=31.5,
                gap_tier="HIGH",
                strategic_rationale="Enterprise cybersecurity mandate replacing traditional VPNs with cryptographically verified identity access.",
            ),
            FutureSkillForecast(
                skill_name="Snowflake & Lakehouse Engineering",
                category="Data & Databases",
                current_coverage=28.0,
                projected_demand_1yr=46.0,
                projected_demand_3yr=55.0,
                growth_rate=20.0,
                gap_tier="MEDIUM",
                strategic_rationale="Unified enterprise analytics, real-time customer data warehouse, and cross-department telemetry.",
            ),
        ]
        db.add_all(future_forecasts)

        # 7. Seed Succession Plans (Module 12)
        succession_data = [
            SuccessionPlan(
                role_title="Senior Cloud Platform Engineer",
                department="Engineering",
                current_holder_name="Marcus Vance",
                successor_name="Sophia Patel",
                successor_employee_id=3,
                readiness_tier="Ready 6-12M",
                readiness_score=82.0,
                missing_skills_json=json.dumps(["Advanced Kubernetes", "Terraform Cloud"]),
            ),
            SuccessionPlan(
                role_title="Lead AI / ML Systems Engineer",
                department="Engineering",
                current_holder_name="David Chen",
                successor_name="Aria Kim",
                successor_employee_id=5,
                readiness_tier="Ready Now",
                readiness_score=89.5,
                missing_skills_json=json.dumps(["Executive Communication"]),
            ),
            SuccessionPlan(
                role_title="VP of People & Culture",
                department="People & Culture",
                current_holder_name="Elena Rostova",
                successor_name="Liam Dubois",
                successor_employee_id=7,
                readiness_tier="Ready 1-2Y",
                readiness_score=68.0,
                missing_skills_json=json.dumps(["Strategic Workforce Planning", "Board Reporting"]),
            ),
        ]
        db.add_all(succession_data)

        # 8. Seed Workforce Alerts (Module 13)
        alerts_data = [
            WorkforceAlert(
                alert_type="ATTRITION_RISK",
                severity="CRITICAL",
                title="Critical Attrition Risk Detected: Marcus Vance (Senior Cloud Engineer)",
                description="Model detected 97.4% attrition probability driven by severe salary stagnation (+14%), overtime burnout (+9%), and 3.8 years without promotion. Immediate intervention recommended.",
                entity_id="EMP-104",
            ),
            WorkforceAlert(
                alert_type="SKILL_GAP",
                severity="HIGH",
                title="Severe Deficit in Generative AI & MLOps for Strategic Project",
                description="Project 'Autonomous AI Engine' requires 4 MLOps leads; current active workforce has only 2 qualified engineers available.",
                entity_id="PRJ-AI-GEN-01",
            ),
            WorkforceAlert(
                alert_type="SUCCESSION_GAP",
                severity="MEDIUM",
                title="Single Point of Failure: Cloud Infrastructure Lead",
                description="Incumbent at high flight risk. Designated successor (Sophia Patel) requires 6-12 months upskilling in distributed Kubernetes.",
                entity_id="EMP-104",
            ),
            WorkforceAlert(
                alert_type="WORKFORCE_CAPACITY",
                severity="HIGH",
                title="Engineering Overtime Volume Exceeds Sustainable Threshold",
                description="Engineering team average monthly overtime reached 28.4 hours, triggering elevated burnout indices across 14 team members.",
                entity_id="ENG",
            ),
        ]
        db.add_all(alerts_data)

        # 9. Seed Digital Twin Scenarios (Module 11 & 31)
        scenarios = [
            DigitalTwinScenario(
                name="Attrition Shock: Loss of 5 Senior Platform Engineers",
                scenario_type="ATTRITION_SHOCK",
                description="Simulates the immediate operational impact if 5 critical senior engineers depart concurrently.",
                parameters_json=json.dumps({"departing_count": 5, "departments": ["Engineering"], "roles": ["Senior Cloud Platform Engineer", "DevOps & SRE Specialist"]}),
                results_json=json.dumps({
                    "skill_coverage_drop": -14.2,
                    "delayed_projects": ["Cloud Modernization", "Autonomous AI Engine"],
                    "projected_replacement_cost": 235000,
                    "capacity_deficit_hours": 840,
                    "hiring_lead_time_weeks": 10,
                }),
            ),
            DigitalTwinScenario(
                name="Targeted Upskilling Wave: 30 Engineers Certified in AI & Cloud",
                scenario_type="UPSKILLING_WAVE",
                description="Simulates a 12-week internal upskilling program in Generative AI, MLOps, and Cloud Security.",
                parameters_json=json.dumps({"trainees_count": 30, "target_skills": ["Generative AI", "MLOps", "Cloud Security"], "duration_weeks": 12}),
                results_json=json.dumps({
                    "skill_coverage_lift": +22.8,
                    "external_hiring_avoidance": 12,
                    "estimated_cost_savings": 540000,
                    "internal_mobility_qualified": 18,
                    "readiness_index_gain": +19.4,
                }),
            ),
            DigitalTwinScenario(
                name="AI Transformation Demand Surge (+40% AI Skill Requirements)",
                scenario_type="TECH_SHIFT",
                description="Models workforce readiness under an aggressive acceleration of Generative AI adoption across all customer touchpoints.",
                parameters_json=json.dumps({"ai_demand_growth": 40.0, "time_horizon_months": 12}),
                results_json=json.dumps({
                    "net_skill_deficit": 16,
                    "internal_candidates_upgradable": 11,
                    "unavoidable_external_hires": 5,
                    "recommended_training_investment": 85000,
                }),
            ),
        ]
        db.add_all(scenarios)

        # 10. Audit Log Initial Entry
        db.add(AuditLog(
            user_email="system@strata.ai",
            action="SYSTEM_INITIALIZATION",
            resource_type="DATASET",
            resource_id="ALL",
            details_json=json.dumps({"status": "seeded_successfully", "employees_count": len(employees_to_create)}),
        ))

        db.commit()
        print(f"Successfully seeded {len(employees_to_create)} employees with complete ML predictions, skills, and scenarios!")

    except Exception as e:
        db.rollback()
        print(f"Error seeding database: {e}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed_database()
