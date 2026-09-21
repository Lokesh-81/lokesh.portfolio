export interface CertificationDomain {
  title: string
  description: string
}

export interface Certification {
  id: string
  title: string
  badgeTitle?: string
  subtitle?: string
  recipient?: string
  certifiedAs?: string
  issuer: string
  issuerLogo?: string
  seriesId?: string
  issueDate?: string
  expirationDate?: string
  expiryDate?: string
  credentialId?: string
  verificationUrl?: string
  credentialUrl?: string
  signatory?: {
    name: string
    title: string
  }
  status?: 'Active' | 'Renewed' | 'Lifetime' | string
  badgeImage?: string
  badgeUrl?: string
  featured?: boolean
  description?: string
  domains?: CertificationDomain[]
  technologies?: string[]
  examScope?: string[]
  skills?: string[]
  display_order?: number
  order?: number
  sortOrder?: number
}

export type BadgeCategory =
  | 'Machine Learning & AI'
  | 'Security'
  | 'Smart Analytics'
  | 'Infrastructure & Networking'
  | 'Serverless & Apps'
  | 'Kubernetes & DevOps'
  | 'Databases & Storage';

export interface SkillBadge {
  id: string;
  title: string;
  category?: BadgeCategory | string;
  level?: 'Introductory' | 'Intermediate' | 'Advanced' | string;
  issuer: string;
  issuedDate?: string;
  date?: string;
  description?: string;
  skills?: string[];
  url?: string;
  display_order?: number;
  order?: number;
  sortOrder?: number;
}

export const certifications: Certification[] = [
  {
    id: "gcp-pca",
    title: "Google Cloud Certified — Professional Cloud Architect",
    badgeTitle: "Professional Cloud Architect",
    subtitle: "Premier enterprise cloud solution design, resilient infrastructure, and security accreditation",
    recipient: "P. Lokesh",
    certifiedAs: "Poosala Lokesh",
    issuer: "Google Cloud",
    seriesId: "128554",
    issueDate: "Sep 17, 2026",
    expirationDate: "Sep 17, 2028",
    credentialId: "7cffa63ad06d4fda872934393093d928",
    verificationUrl: "https://www.credential.net/7cffa63ad06d4fda872934393093d928",
    signatory: {
      name: "Thomas Kurian",
      title: "CEO, Google Cloud"
    },
    status: "Active",
    badgeImage: "/professional-cloud-architect-certification.svg",
    featured: true,
    description:
      "Recognizes professional enterprise proficiency to design, develop, and manage robust, secure, highly available, and dynamic cloud solutions on Google Cloud Platform (GCP). Validates mastery in scalable compute, VPC topology, Kubernetes (GKE), IAM governance, data pipelines, and disaster recovery.",
    domains: [
      {
        title: "Designing & Planning Cloud Architecture",
        description:
          "Designing multi-region HA infrastructure, hybrid cloud connectivity, VPC subnet topologies, compute autoscaling, and storage tiering strategies."
      },
      {
        title: "Managing & Provisioning Infrastructure",
        description:
          "Automating infrastructure deployment with Terraform & Cloud Deployment Manager, managing GKE container clusters, and serverless Cloud Run workloads."
      },
      {
        title: "Designing for Security & Compliance",
        description:
          "Enforcing least privilege with Cloud IAM, VPC Service Controls, Customer-Managed Encryption Keys (CMEK), and Security Command Center audits."
      },
      {
        title: "Analyzing & Optimizing Processes",
        description:
          "SRE design principles, SLO/SLI monitoring, Cloud Operations (Stackdriver) telemetry, resilient automated failover, and cloud cost optimization."
      }
    ],
    technologies: [
      "Google Cloud Platform (GCP)",
      "Google Kubernetes Engine (GKE)",
      "Compute Engine & Cloud Run",
      "VPC & Cloud Interconnect",
      "Cloud IAM & KMS",
      "BigQuery & Cloud Storage",
      "Cloud Operations (Stackdriver)",
      "Terraform / Infrastructure as Code"
    ],
    examScope: [
      "Enterprise Multi-Tier Solution Architecture",
      "Scalable Microservices & Kubernetes Orchestration",
      "Zero Trust Security & Cloud Governance",
      "High Availability & RPO/RTO Disaster Recovery",
      "Cost Optimization & Architectural Review Frameworks"
    ]
  }
];

export const skillBadges: SkillBadge[] = [
  // 1. Machine Learning & AI
  {
    id: "badge-sentiment-nlp",
    title: "Analyze Sentiment with Natural Language API",
    category: "Machine Learning & AI",
    level: "Introductory",
    issuer: "Google Cloud",
    issuedDate: "Dec 23, 2025",
    description: "Inspect text for emotion, extract entities, evaluate syntax, and classify content using Google Cloud Natural Language API.",
    skills: ["Cloud Natural Language API", "Sentiment Analysis", "Entity Extraction", "Content Classification"]
  },
  {
    id: "badge-doc-ai",
    title: "Automate Data Capture at Scale with Document AI",
    category: "Machine Learning & AI",
    level: "Introductory",
    issuer: "Google Cloud",
    issuedDate: "Dec 17, 2025",
    description: "Extract structured data from unstructured documents, automate form and invoice parsing with Google Cloud Document AI processors.",
    skills: ["Document AI", "Form Parser", "OCR Processing", "Document Workflows"]
  },
  {
    id: "badge-bqml-models",
    title: "Create ML Models with BigQuery ML",
    category: "Machine Learning & AI",
    level: "Intermediate",
    issuer: "Google Cloud",
    issuedDate: "Dec 25, 2025",
    description: "Train, evaluate, and operationalize machine learning models (linear regression, logistic regression, k-means) directly using SQL in BigQuery.",
    skills: ["BigQuery ML", "SQL Modeling", "Model Evaluation", "Hyperparameter Tuning"]
  },
  {
    id: "badge-agent-dev-kit",
    title: "Engineer AI Agents with Agent Development Kit (ADK)",
    category: "Machine Learning & AI",
    level: "Advanced",
    issuer: "Google Cloud",
    issuedDate: "Jul 28, 2026",
    description: "Architect and engineer autonomous AI agent systems, function calling, memory persistence, and orchestration with Agent Development Kit.",
    skills: ["Agent Development Kit (ADK)", "Autonomous Agents", "Tool Calling", "Gemini Orchestration"]
  },
  {
    id: "badge-bqml-feature-eng",
    title: "Engineer Data for Predictive Modeling with BigQuery ML",
    category: "Machine Learning & AI",
    level: "Intermediate",
    issuer: "Google Cloud",
    issuedDate: "Dec 25, 2025",
    description: "Feature engineering, data preprocessing, categorical encoding, and feature transformation pipelines for high-accuracy predictive ML models.",
    skills: ["Feature Engineering", "Data Transformation", "Predictive Modeling", "BigQuery ML"]
  },
  {
    id: "badge-gemini-multimodal-rag",
    title: "Inspect Rich Documents with Gemini Multimodality and Multimodal RAG",
    category: "Machine Learning & AI",
    level: "Intermediate",
    issuer: "Google Cloud",
    issuedDate: "Dec 23, 2025",
    description: "Leverage Gemini multimodal capabilities across text, audio, and visual documents, implementing Retrieval-Augmented Generation (RAG).",
    skills: ["Gemini 1.5/2.0", "Multimodal RAG", "Vector Search", "Document Intelligence"]
  },
  {
    id: "badge-prep-data-ml-apis",
    title: "Prepare Data for ML APIs on Google Cloud",
    category: "Machine Learning & AI",
    level: "Intermediate",
    issuer: "Google Cloud",
    issuedDate: "Dec 14, 2025",
    description: "Prepare, validate, and structure multimodal datasets to train and tune Google Cloud Machine Learning APIs and Vertex AI services.",
    skills: ["Dataset Preparation", "Data Validation", "Vertex AI", "Data Pipelines"]
  },
  {
    id: "badge-use-ml-apis",
    title: "Use Machine Learning APIs on Google Cloud",
    category: "Machine Learning & AI",
    level: "Introductory",
    issuer: "Google Cloud",
    issuedDate: "Dec 25, 2025",
    description: "Integrate pre-trained Google Cloud Vision API, Speech-to-Text, Translation API, and Text-to-Speech into production web applications.",
    skills: ["Cloud Vision API", "Speech-to-Text", "Translation API", "Text-to-Speech"]
  },

  // 2. Security
  {
    id: "badge-secure-cloud-network",
    title: "Build a Secure Google Cloud Network",
    category: "Security",
    level: "Intermediate",
    issuer: "Google Cloud",
    issuedDate: "Dec 19, 2025",
    description: "Configure multi-tier VPC networks, firewall rules, Cloud NAT, private Google access, Cloud Armor DDoS mitigation, and secure bastions.",
    skills: ["VPC Security", "Cloud Armor", "Firewall Rules", "Private Google Access"]
  },
  {
    id: "badge-secure-data-lake",
    title: "Create a Secure Data Lake on Cloud Storage",
    category: "Security",
    level: "Intermediate",
    issuer: "Google Cloud",
    issuedDate: "Dec 15, 2025",
    description: "Implement secure object storage architecture with uniform bucket-level access, CMEK encryption keys, and lifecycle audit policies.",
    skills: ["Cloud Storage", "CMEK Encryption", "Bucket Policies", "Data Governance"]
  },
  {
    id: "badge-security-fundamentals",
    title: "Implement Cloud Security Fundamentals on Google Cloud",
    category: "Security",
    level: "Introductory",
    issuer: "Google Cloud",
    issuedDate: "Dec 25, 2025",
    description: "Deploy Cloud IAM least privilege policies, custom roles, service accounts, Cloud Audit Logs, and Identity-Aware Proxy (IAP).",
    skills: ["Cloud IAM", "Service Accounts", "Audit Logging", "Identity-Aware Proxy"]
  },
  {
    id: "badge-security-command-center",
    title: "Mitigate Threats and Vulnerabilities with Security Command Center",
    category: "Security",
    level: "Intermediate",
    issuer: "Google Cloud",
    issuedDate: "Dec 25, 2025",
    description: "Continuous vulnerability assessment, posture management, threat detection, and compliance auditing with Security Command Center (SCC).",
    skills: ["Security Command Center", "Threat Mitigation", "Compliance Auditing", "Vulnerability Scanning"]
  },
  {
    id: "badge-data-loss-prevention",
    title: "Protect Sensitive Data with Data Loss Prevention",
    category: "Security",
    level: "Intermediate",
    issuer: "Google Cloud",
    issuedDate: "Dec 15, 2025",
    description: "Inspect, classify, mask, and redact personally identifiable information (PII) and sensitive data across Cloud Storage and BigQuery using Cloud DLP.",
    skills: ["Cloud DLP", "PII Redaction", "Data Masking", "Sensitive Data Discovery"]
  },
  {
    id: "badge-secure-software-delivery",
    title: "Secure Software Delivery",
    category: "Security",
    level: "Intermediate",
    issuer: "Google Cloud",
    issuedDate: "Dec 23, 2025",
    description: "Enforce software supply chain security with Binary Authorization, container image signing, vulnerability scans, and SLSA compliance in Cloud Build.",
    skills: ["Binary Authorization", "Container Scanning", "SLSA Framework", "Artifact Registry"]
  },

  // 3. Smart Analytics
  {
    id: "badge-data-warehouse-bigquery",
    title: "Build a Data Warehouse with BigQuery",
    category: "Smart Analytics",
    level: "Intermediate",
    issuer: "Google Cloud",
    issuedDate: "Dec 25, 2025",
    description: "Ingest datasets, partition and cluster tables, optimize analytical SQL queries, manage access control, and build high-performance data warehouses.",
    skills: ["BigQuery", "Data Warehousing", "Partitioning & Clustering", "SQL Optimization"]
  },
  {
    id: "badge-lookml-objects",
    title: "Build LookML Objects in Looker",
    category: "Smart Analytics",
    level: "Intermediate",
    issuer: "Google Cloud",
    issuedDate: "Dec 25, 2025",
    description: "Model dimensions, measures, explores, derived tables, and relationship joins using LookML to power self-service business intelligence.",
    skills: ["Looker", "LookML", "Data Modeling", "Explores & Dashboards"]
  },
  {
    id: "badge-bigquery-apps-script",
    title: "Integrate BigQuery Data and Google Workspace using Apps Script",
    category: "Smart Analytics",
    level: "Intermediate",
    issuer: "Google Cloud",
    issuedDate: "Dec 23, 2025",
    description: "Automate executive reporting pipelines by querying BigQuery and dynamically generating Google Sheets charts, Docs, and Gmail alerts.",
    skills: ["BigQuery", "Apps Script", "Workspace Integration", "Automated Reporting"]
  },
  {
    id: "badge-share-data-cloud",
    title: "Share Data Using Google Data Cloud",
    category: "Smart Analytics",
    level: "Intermediate",
    issuer: "Google Cloud",
    issuedDate: "Dec 16, 2025",
    description: "Publish, share, and govern analytical datasets across organizations with BigQuery Analytics Hub and private exchanges.",
    skills: ["Analytics Hub", "Data Sharing", "Data Governance", "BigQuery"]
  },
  {
    id: "badge-streaming-analytics-bigquery",
    title: "Streaming Analytics into BigQuery",
    category: "Smart Analytics",
    level: "Intermediate",
    issuer: "Google Cloud",
    issuedDate: "Dec 16, 2025",
    description: "Architect streaming ingestion pipelines using Cloud Pub/Sub, Dataflow with Apache Beam, and BigQuery streaming inserts.",
    skills: ["Cloud Pub/Sub", "Cloud Dataflow", "Streaming Ingestion", "Real-Time Analytics"]
  },

  // 4. Infrastructure & Networking
  {
    id: "badge-aws-to-gcp",
    title: "Build Google Cloud Infrastructure for AWS Professionals",
    category: "Infrastructure & Networking",
    level: "Intermediate",
    issuer: "Google Cloud",
    issuedDate: "Jul 22, 2026",
    description: "Bridge AWS cloud concepts to GCP architecture, managing cross-cloud networking, IAM mappings, compute parity, and storage migration.",
    skills: ["GCP vs AWS Architecture", "Compute Engine", "VPC Peering", "Multi-Cloud Strategy"]
  },
  {
    id: "badge-develop-network",
    title: "Develop Your Google Cloud Network",
    category: "Infrastructure & Networking",
    level: "Intermediate",
    issuer: "Google Cloud",
    issuedDate: "Dec 25, 2025",
    description: "Deploy custom VPC networks, multi-region subnets, Cloud Router, Cloud DNS, internal and external load balancers.",
    skills: ["VPC Subnetting", "Cloud Router", "Cloud DNS", "Network Routing"]
  },
  {
    id: "badge-load-balancing",
    title: "Implement Load Balancing on Compute Engine",
    category: "Infrastructure & Networking",
    level: "Intermediate",
    issuer: "Google Cloud",
    issuedDate: "Dec 25, 2025",
    description: "Configure global HTTP(S) load balancers, managed instance groups, autoscaling policies, SSL certificates, and health checks.",
    skills: ["HTTP(S) Load Balancing", "Managed Instance Groups", "Autoscaling", "Cloud CDN"]
  },

  // 5. Serverless & Apps
  {
    id: "badge-build-website-gcp",
    title: "Build a Website on Google Cloud",
    category: "Serverless & Apps",
    level: "Introductory",
    issuer: "Google Cloud",
    issuedDate: "Dec 25, 2025",
    description: "Deploy scalable modern websites on Compute Engine, Cloud Storage, and serverless Cloud Run with load balancing.",
    skills: ["Cloud Run", "Compute Engine", "Static Site Hosting", "Load Balancing"]
  },
  {
    id: "badge-eventarc-apps",
    title: "Build Event-Driven Applications with Eventarc",
    category: "Serverless & Apps",
    level: "Intermediate",
    issuer: "Google Cloud",
    issuedDate: "Dec 23, 2025",
    description: "Build decoupled event-driven microservices responding to Cloud Storage, Audit Logs, and Pub/Sub events using Eventarc and Cloud Run.",
    skills: ["Eventarc", "Event-Driven Architecture", "Cloud Run", "Pub/Sub Triggers"]
  },
  {
    id: "badge-cloud-run-functions",
    title: "Build Serverless Applications with Cloud Run Functions",
    category: "Serverless & Apps",
    level: "Intermediate",
    issuer: "Google Cloud",
    issuedDate: "Dec 19, 2025",
    description: "Develop asynchronous serverless microservices and webhooks using Cloud Run functions with event bindings.",
    skills: ["Cloud Run Functions", "Microservices", "Webhook Handlers", "Event Bindings"]
  },
  {
    id: "badge-serverless-cloud-run",
    title: "Develop Serverless Applications on Cloud Run",
    category: "Serverless & Apps",
    level: "Intermediate",
    issuer: "Google Cloud",
    issuedDate: "Dec 19, 2025",
    description: "Containerize web apps and APIs, configure continuous deployment, concurrency, custom domains, and traffic splitting on Cloud Run.",
    skills: ["Cloud Run Containers", "Traffic Splitting", "Concurrency Tuning", "Serverless Architecture"]
  },
  {
    id: "badge-serverless-firebase",
    title: "Develop Serverless Apps with Firebase",
    category: "Serverless & Apps",
    level: "Intermediate",
    issuer: "Google Cloud",
    issuedDate: "Dec 19, 2025",
    description: "Build reactive full-stack web applications with Firestore, Firebase Auth, Cloud Functions, and Firebase Hosting.",
    skills: ["Firebase", "Firestore", "Firebase Auth", "Serverless Web Apps"]
  },
  {
    id: "badge-cloud-collab-workflows",
    title: "Implement Cloud Collaboration and Productivity Workflows",
    category: "Serverless & Apps",
    level: "Introductory",
    issuer: "Google Cloud",
    issuedDate: "Dec 24, 2025",
    description: "Automate organizational workflows connecting Google Workspace tools and Google Cloud services with script hooks.",
    skills: ["Google Workspace APIs", "Workflow Automation", "Apps Script", "Cloud Integration"]
  },
  {
    id: "badge-setup-app-dev-env",
    title: "Set Up an App Dev Environment on Google Cloud",
    category: "Serverless & Apps",
    level: "Introductory",
    issuer: "Google Cloud",
    issuedDate: "Dec 25, 2025",
    description: "Configure Google Cloud Workstations, Cloud Shell environments, gcloud CLI profiles, and developer IAM permissions.",
    skills: ["Cloud Workstations", "Cloud Shell", "gcloud CLI", "Developer Tooling"]
  },

  // 6. Kubernetes & DevOps
  {
    id: "badge-deploy-k8s-gcp",
    title: "Deploy Kubernetes Applications on Google Cloud",
    category: "Kubernetes & DevOps",
    level: "Intermediate",
    issuer: "Google Cloud",
    issuedDate: "Dec 25, 2025",
    description: "Deploy, manage, and scale containerized applications on Google Kubernetes Engine (GKE) with Pods, Deployments, and Services.",
    skills: ["Google Kubernetes Engine", "Pods & Services", "Rolling Updates", "GKE Deployments"]
  },
  {
    id: "badge-manage-k8s-gcp",
    title: "Manage Kubernetes in Google Cloud",
    category: "Kubernetes & DevOps",
    level: "Intermediate",
    issuer: "Google Cloud",
    issuedDate: "Dec 14, 2025",
    description: "Administer GKE clusters, multi-zonal node pools, RBAC permissions, horizontal pod autoscalers (HPA), and ingress controllers.",
    skills: ["GKE Cluster Administration", "RBAC", "Node Pool Management", "Horizontal Pod Autoscaler"]
  },
  {
    id: "badge-cicd-pipelines",
    title: "Implement CI/CD Pipelines on Google Cloud",
    category: "Kubernetes & DevOps",
    level: "Intermediate",
    issuer: "Google Cloud",
    issuedDate: "Dec 14, 2025",
    description: "Automate continuous integration and continuous deployment pipelines using Cloud Build, Artifact Registry, and Cloud Deploy.",
    skills: ["Cloud Build", "Cloud Deploy", "Artifact Registry", "CI/CD Automation"]
  },
  {
    id: "badge-prometheus-monitoring",
    title: "Monitor Environments with Google Cloud Managed Service for Prometheus",
    category: "Kubernetes & DevOps",
    level: "Intermediate",
    issuer: "Google Cloud",
    issuedDate: "Dec 25, 2025",
    description: "Collect, query, and visualize metrics at scale across GKE clusters with Managed Service for Prometheus and Cloud Monitoring.",
    skills: ["Managed Prometheus", "PromQL", "Cloud Monitoring", "Kubernetes Telemetry"]
  },
  {
    id: "badge-optimize-gke-costs",
    title: "Optimize Costs for Google Kubernetes Engine",
    category: "Kubernetes & DevOps",
    level: "Advanced",
    issuer: "Google Cloud",
    issuedDate: "Aug 24, 2026",
    description: "Analyze and implement cluster cost reduction strategies: GKE Autopilot, Spot instances, workload rightsizing, and cost allocation telemetry.",
    skills: ["GKE Autopilot", "Spot VMs", "Workload Rightsizing", "FinOps & Cost Optimization"]
  },

  // 7. Databases & Storage
  {
    id: "badge-cloud-spanner",
    title: "Create and Manage Cloud Spanner Instances",
    category: "Databases & Storage",
    level: "Intermediate",
    issuer: "Google Cloud",
    issuedDate: "Dec 23, 2025",
    description: "Provision globally distributed, strongly consistent relational databases with Cloud Spanner, multi-region replication, and query tuning.",
    skills: ["Cloud Spanner", "Distributed SQL", "Global Replication", "Database Tuning"]
  },
  {
    id: "badge-migrate-mysql-cloudsql",
    title: "Migrate MySQL data to Cloud SQL using Database Migration Service",
    category: "Databases & Storage",
    level: "Intermediate",
    issuer: "Google Cloud",
    issuedDate: "Dec 25, 2025",
    description: "Plan and execute minimal-downtime database migrations from MySQL to Cloud SQL using Google Cloud Database Migration Service (DMS).",
    skills: ["Database Migration Service", "Cloud SQL MySQL", "Continuous Migration", "Connection Profiles"]
  },
  {
    id: "badge-cli-storage-data",
    title: "Store, Process, and Manage Data on Google Cloud - Command Line",
    category: "Databases & Storage",
    level: "Introductory",
    issuer: "Google Cloud",
    issuedDate: "Dec 17, 2025",
    description: "Manage Cloud Storage buckets, Cloud SQL databases, and BigQuery datasets using gcloud, gsutil, and bq command-line interfaces.",
    skills: ["gcloud CLI", "gsutil", "bq CLI", "Data Management"]
  }
];

