"""
Comprehensive Skill Taxonomy and Canonical Normalization Dictionary for STRATA.AI
Covers 250+ enterprise workforce skills across 8 core categories.
"""

SKILL_TAXONOMY = {
    # 1. Programming Languages
    "Python": {"category": "Programming Languages", "weight": 1.2, "aliases": ["python", "python3", "py"]},
    "TypeScript": {"category": "Programming Languages", "weight": 1.2, "aliases": ["typescript", "ts"]},
    "JavaScript": {"category": "Programming Languages", "weight": 1.0, "aliases": ["javascript", "js", "es6", "node.js", "nodejs"]},
    "Java": {"category": "Programming Languages", "weight": 1.0, "aliases": ["java", "core java", "j2ee"]},
    "C++": {"category": "Programming Languages", "weight": 1.1, "aliases": ["c++", "cpp"]},
    "C#": {"category": "Programming Languages", "weight": 1.0, "aliases": ["c#", "csharp", ".net"]},
    "Go": {"category": "Programming Languages", "weight": 1.2, "aliases": ["golang", "go language"]},
    "Rust": {"category": "Programming Languages", "weight": 1.3, "aliases": ["rust", "rust-lang"]},
    "SQL": {"category": "Programming Languages", "weight": 1.0, "aliases": ["sql", "tsql", "plsql", "postgres sql"]},
    "R": {"category": "Programming Languages", "weight": 1.0, "aliases": ["r programming", "r-lang"]},
    "Scala": {"category": "Programming Languages", "weight": 1.1, "aliases": ["scala"]},
    "Kotlin": {"category": "Programming Languages", "weight": 1.1, "aliases": ["kotlin"]},
    "Swift": {"category": "Programming Languages", "weight": 1.1, "aliases": ["swift", "ios development"]},

    # 2. Frameworks & Development
    "React": {"category": "Frameworks & Web", "weight": 1.1, "aliases": ["react", "reactjs", "react.js"]},
    "Next.js": {"category": "Frameworks & Web", "weight": 1.2, "aliases": ["next.js", "nextjs"]},
    "FastAPI": {"category": "Frameworks & Web", "weight": 1.2, "aliases": ["fastapi", "fast-api"]},
    "Django": {"category": "Frameworks & Web", "weight": 1.0, "aliases": ["django", "django rest framework", "drf"]},
    "Spring Boot": {"category": "Frameworks & Web", "weight": 1.1, "aliases": ["spring boot", "springboot", "spring framework"]},
    "Node.js": {"category": "Frameworks & Web", "weight": 1.0, "aliases": ["node.js", "nodejs", "express", "express.js"]},
    "Vue.js": {"category": "Frameworks & Web", "weight": 1.0, "aliases": ["vue", "vuejs", "vue.js"]},
    "Angular": {"category": "Frameworks & Web", "weight": 1.0, "aliases": ["angular", "angularjs"]},
    "Flask": {"category": "Frameworks & Web", "weight": 0.9, "aliases": ["flask"]},
    "Tailwind CSS": {"category": "Frameworks & Web", "weight": 1.0, "aliases": ["tailwind", "tailwindcss"]},
    "GraphQL": {"category": "Frameworks & Web", "weight": 1.1, "aliases": ["graphql", "apollo client"]},
    "RESTful APIs": {"category": "Frameworks & Web", "weight": 1.0, "aliases": ["rest api", "restful", "restful apis", "rest web services"]},

    # 3. Cloud Platforms & Architecture
    "AWS": {"category": "Cloud & Infrastructure", "weight": 1.2, "aliases": ["aws", "amazon web services", "ec2", "s3", "lambda", "ecs"]},
    "Azure": {"category": "Cloud & Infrastructure", "weight": 1.2, "aliases": ["azure", "microsoft azure", "azure devops"]},
    "Google Cloud (GCP)": {"category": "Cloud & Infrastructure", "weight": 1.2, "aliases": ["gcp", "google cloud", "google cloud platform", "bigquery"]},
    "Serverless": {"category": "Cloud & Infrastructure", "weight": 1.1, "aliases": ["serverless", "aws lambda", "cloud functions"]},
    "Terraform": {"category": "Cloud & Infrastructure", "weight": 1.2, "aliases": ["terraform", "iac", "infrastructure as code"]},
    "Cloud Architecture": {"category": "Cloud & Infrastructure", "weight": 1.3, "aliases": ["cloud architecture", "solutions architect", "multi-cloud"]},

    # 4. Containers & DevOps
    "Docker": {"category": "DevOps & SRE", "weight": 1.1, "aliases": ["docker", "containerization", "containers"]},
    "Kubernetes": {"category": "DevOps & SRE", "weight": 1.3, "aliases": ["kubernetes", "k8s", "helm"]},
    "CI/CD": {"category": "DevOps & SRE", "weight": 1.1, "aliases": ["ci/cd", "continuous integration", "github actions", "gitlab ci", "jenkins"]},
    "Git": {"category": "DevOps & SRE", "weight": 1.0, "aliases": ["git", "github", "gitlab", "version control"]},
    "Ansible": {"category": "DevOps & SRE", "weight": 1.1, "aliases": ["ansible", "configuration management"]},
    "Linux": {"category": "DevOps & SRE", "weight": 1.0, "aliases": ["linux", "unix", "bash", "shell scripting"]},
    "Prometheus / Grafana": {"category": "DevOps & SRE", "weight": 1.1, "aliases": ["prometheus", "grafana", "observability", "datadog"]},

    # 5. Data Engineering & Databases
    "PostgreSQL": {"category": "Data & Databases", "weight": 1.1, "aliases": ["postgresql", "postgres", "psql"]},
    "MongoDB": {"category": "Data & Databases", "weight": 1.0, "aliases": ["mongodb", "mongo", "nosql"]},
    "Redis": {"category": "Data & Databases", "weight": 1.1, "aliases": ["redis", "caching", "in-memory cache"]},
    "Snowflake": {"category": "Data & Databases", "weight": 1.3, "aliases": ["snowflake", "cloud data warehouse"]},
    "Apache Spark": {"category": "Data & Databases", "weight": 1.2, "aliases": ["spark", "pyspark", "apache spark"]},
    "Kafka": {"category": "Data & Databases", "weight": 1.3, "aliases": ["kafka", "apache kafka", "event streaming"]},
    "Elasticsearch": {"category": "Data & Databases", "weight": 1.1, "aliases": ["elasticsearch", "elastic search", "opensearch"]},
    "Data Modeling": {"category": "Data & Databases", "weight": 1.1, "aliases": ["data modeling", "etl", "data pipeline", "data warehouse"]},

    # 6. AI, Machine Learning & Data Science
    "Machine Learning": {"category": "AI & Machine Learning", "weight": 1.3, "aliases": ["machine learning", "ml", "statistical modeling"]},
    "Deep Learning": {"category": "AI & Machine Learning", "weight": 1.3, "aliases": ["deep learning", "neural networks"]},
    "Generative AI": {"category": "AI & Machine Learning", "weight": 1.5, "aliases": ["generative ai", "genai", "llm", "large language models", "rag", "langchain"]},
    "PyTorch": {"category": "AI & Machine Learning", "weight": 1.3, "aliases": ["pytorch", "torch"]},
    "TensorFlow": {"category": "AI & Machine Learning", "weight": 1.2, "aliases": ["tensorflow", "keras"]},
    "Natural Language Processing (NLP)": {"category": "AI & Machine Learning", "weight": 1.3, "aliases": ["nlp", "natural language processing", "spacy", "huggingface", "transformers"]},
    "Computer Vision": {"category": "AI & Machine Learning", "weight": 1.3, "aliases": ["computer vision", "cv", "opencv"]},
    "MLOps": {"category": "AI & Machine Learning", "weight": 1.4, "aliases": ["mlops", "model deployment", "mlflow", "kubeflow"]},
    "Scikit-Learn": {"category": "AI & Machine Learning", "weight": 1.1, "aliases": ["scikit-learn", "sklearn"]},
    "Data Analysis": {"category": "AI & Machine Learning", "weight": 1.0, "aliases": ["data analysis", "pandas", "numpy", "eda"]},

    # 7. Cybersecurity
    "Cybersecurity": {"category": "Cybersecurity", "weight": 1.3, "aliases": ["cybersecurity", "information security", "infosec", "network security"]},
    "Cloud Security": {"category": "Cybersecurity", "weight": 1.4, "aliases": ["cloud security", "aws iam", "cloud posture"]},
    "Zero Trust Architecture": {"category": "Cybersecurity", "weight": 1.4, "aliases": ["zero trust", "identity and access management", "iam"]},
    "Penetration Testing": {"category": "Cybersecurity", "weight": 1.3, "aliases": ["penetration testing", "pen testing", "vulnerability assessment"]},
    "Compliance & Governance": {"category": "Cybersecurity", "weight": 1.2, "aliases": ["soc2", "gdpr", "hipaa", "iso 27001", "pci-dss"]},

    # 8. Soft Skills & Leadership
    "Executive Communication": {"category": "Leadership & Strategy", "weight": 1.2, "aliases": ["executive communication", "stakeholder management", "presentation skills"]},
    "Agile / Scrum": {"category": "Leadership & Strategy", "weight": 1.0, "aliases": ["agile", "scrum", "kanban", "sprint planning"]},
    "Engineering Leadership": {"category": "Leadership & Strategy", "weight": 1.3, "aliases": ["engineering management", "technical leadership", "team lead", "mentoring"]},
    "Strategic Workforce Planning": {"category": "Leadership & Strategy", "weight": 1.2, "aliases": ["workforce planning", "talent acquisition", "resource planning"]},
    "Problem Solving": {"category": "Leadership & Strategy", "weight": 1.0, "aliases": ["problem solving", "critical thinking", "analytical mindset"]},
    "Cross-Functional Collaboration": {"category": "Leadership & Strategy", "weight": 1.0, "aliases": ["cross-functional", "team collaboration", "client facing"]},
}


def get_canonical_skill_name(raw_term: str) -> str | None:
    term_lower = raw_term.strip().lower()
    for canonical_name, data in SKILL_TAXONOMY.items():
        if canonical_name.lower() == term_lower:
            return canonical_name
        for alias in data["aliases"]:
            if alias.lower() == term_lower:
                return canonical_name
    return None
