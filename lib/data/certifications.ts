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
  },
  {
    id: "google-student-ambassador-2026",
    title: "Google Student Ambassador Program 2026 — Semester 1",
    badgeTitle: "Certificate of Recognition",
    subtitle: "Semester 1 · Outstanding performance and contribution",
    recipient: "P. Lokesh",
    certifiedAs: "P. Lokesh",
    issuer: "Google Student Ambassador Program",
    issueDate: "Nov 04, 2026",
    credentialUrl: "/certificates/GSA_Semester1_Certificate_P.Lokesh.pdf",
    badgeImage: "/certificates/download.png",
    status: "Issued",
    featured: true,
    description: "Certificate of Recognition for successfully completing Semester 1 and for outstanding performance and exceptional contribution as a Google Student Ambassador. Issued to P. Lokesh of Wesley Degree College on November 04, 2026.",
    technologies: ["Gemini", "Student Community", "Technology Outreach", "Community Leadership"]
  }
];

export const skillBadges: SkillBadge[] = [
  {
    id: "gcloud-analyze-and-reason-on-multimodal-data-with-gemini",
    title: "Analyze and Reason on Multimodal Data with Gemini",
    issuer: "Google Cloud"
  },
  {
    id: "gcloud-analyze-images-with-the-cloud-vision-api-skill-badge",
    title: "Analyze Images with the Cloud Vision API Skill Badge",
    issuer: "Google Cloud"
  },
  {
  id: "badge-sentiment-nlp",
      title: "Analyze Sentiment with Natural Language API Skill Badge",
      category: "Machine Learning & AI",
      level: "Introductory",
      issuer: "Google Cloud",
      issuedDate: "Dec 23, 2025",
      description: "Inspect text for emotion, extract entities, evaluate syntax, and classify content using Google Cloud Natural Language API.",
      skills: ["Cloud Natural Language API", "Sentiment Analysis", "Entity Extraction", "Content Classification"]
  },
  {
    id: "gcloud-analyze-speech-and-language-with-google-apis-skill-badge",
    title: "Analyze Speech and Language with Google APIs Skill Badge",
    issuer: "Google Cloud"
  },
  {
    id: "gcloud-app-building-with-appsheet-skill-badge",
    title: "App Building with AppSheet Skill Badge",
    issuer: "Google Cloud"
  },
  {
  id: "badge-data-warehouse-bigquery",
      title: "Build a Data Warehouse with BigQuery Skill Badge",
      category: "Smart Analytics",
      level: "Intermediate",
      issuer: "Google Cloud",
      issuedDate: "Dec 25, 2025",
      description: "Ingest datasets, partition and cluster tables, optimize analytical SQL queries, manage access control, and build high-performance data warehouses.",
      skills: ["BigQuery", "Data Warehousing", "Partitioning & Clustering", "SQL Optimization"]
  },
  {
  id: "badge-secure-cloud-network",
      title: "Build a Secure Google Cloud Network Skill Badge",
      category: "Security",
      level: "Intermediate",
      issuer: "Google Cloud",
      issuedDate: "Dec 19, 2025",
      description: "Configure multi-tier VPC networks, firewall rules, Cloud NAT, private Google access, Cloud Armor DDoS mitigation, and secure bastions.",
      skills: ["VPC Security", "Cloud Armor", "Firewall Rules", "Private Google Access"]
  },
  {
    id: "gcloud-build-a-smart-cloud-application-with-vibe-coding-and-mcp",
    title: "Build a Smart Cloud Application with Vibe Coding and MCP",
    issuer: "Google Cloud"
  },
  {
  id: "badge-build-website-gcp",
      title: "Build a Website on Google Cloud Skill Badge",
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
    id: "gcloud-build-global-and-regional-load-balancing-solutions",
    title: "Build Global and Regional Load Balancing Solutions",
    issuer: "Google Cloud"
  },
  {
  id: "badge-aws-to-gcp",
      title: "Build Google Cloud Infrastructure for AWS Professionals Skill Badge",
      category: "Infrastructure & Networking",
      level: "Intermediate",
      issuer: "Google Cloud",
      issuedDate: "Jul 22, 2026",
      description: "Bridge AWS cloud concepts to GCP architecture, managing cross-cloud networking, IAM mappings, compute parity, and storage migration.",
      skills: ["GCP vs AWS Architecture", "Compute Engine", "VPC Peering", "Multi-Cloud Strategy"]
  },
  {
    id: "gcloud-build-infrastructure-with-terraform-on-google-cloud-skil",
    title: "Build Infrastructure with Terraform on Google Cloud Skill Badge",
    issuer: "Google Cloud"
  },
  {
  id: "badge-lookml-objects",
      title: "Build LookML Objects in Looker Skill Badge",
      category: "Smart Analytics",
      level: "Intermediate",
      issuer: "Google Cloud",
      issuedDate: "Dec 25, 2025",
      description: "Model dimensions, measures, explores, derived tables, and relationship joins using LookML to power self-service business intelligence.",
      skills: ["Looker", "LookML", "Data Modeling", "Explores & Dashboards"]
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
    id: "gcloud-configure-service-accounts-and-iam-roles-for-google-clou",
    title: "Configure Service Accounts and IAM Roles for Google Cloud Skill Badge",
    issuer: "Google Cloud"
  },
  {
    id: "gcloud-connecting-cloud-networks-with-ncc",
    title: "Connecting Cloud Networks with NCC",
    issuer: "Google Cloud"
  },
  {
    id: "gcloud-create-and-manage-alloydb-instances-skill-badge",
    title: "Create and Manage AlloyDB Instances Skill Badge",
    issuer: "Google Cloud"
  },
  {
    id: "gcloud-create-and-manage-bigtable-instances-skill-badge",
    title: "Create and Manage Bigtable Instances Skill Badge",
    issuer: "Google Cloud"
  },
  {
  id: "badge-cloud-spanner",
      title: "Create and Manage Cloud Spanner Instances Skill Badge",
      category: "Databases & Storage",
      level: "Intermediate",
      issuer: "Google Cloud",
      issuedDate: "Dec 23, 2025",
      description: "Provision globally distributed, strongly consistent relational databases with Cloud Spanner, multi-region replication, and query tuning.",
      skills: ["Cloud Spanner", "Distributed SQL", "Global Replication", "Database Tuning"]
  },
  {
  id: "badge-secure-data-lake",
      title: "Create a Secure Data Lake on Cloud Storage Skill Badge",
      category: "Security",
      level: "Intermediate",
      issuer: "Google Cloud",
      issuedDate: "Dec 15, 2025",
      description: "Implement secure object storage architecture with uniform bucket-level access, CMEK encryption keys, and lifecycle audit policies.",
      skills: ["Cloud Storage", "CMEK Encryption", "Bucket Policies", "Data Governance"]
  },
  {
  id: "badge-bqml-models",
      title: "Create ML Models with BigQuery ML Skill Badge",
      category: "Machine Learning & AI",
      level: "Intermediate",
      issuer: "Google Cloud",
      issuedDate: "Dec 25, 2025",
      description: "Train, evaluate, and operationalize machine learning models (linear regression, logistic regression, k-means) directly using SQL in BigQuery.",
      skills: ["BigQuery ML", "SQL Modeling", "Model Evaluation", "Hyperparameter Tuning"]
  },
  {
    id: "gcloud-create-your-first-gemini-enterprise-application",
    title: "Create Your First Gemini Enterprise Application",
    issuer: "Google Cloud"
  },
  {
    id: "gcloud-deploy-and-manage-applications-on-google-app-engine",
    title: "Deploy and Manage Applications on Google App Engine",
    issuer: "Google Cloud"
  },
  {
    id: "gcloud-deploy-and-secure-serverless-apis-with-api-gateway",
    title: "Deploy and Secure Serverless APIs with API Gateway",
    issuer: "Google Cloud"
  },
  {
  id: "badge-deploy-k8s-gcp",
      title: "Deploy Kubernetes Applications on Google Cloud Skill Badge",
      category: "Kubernetes & DevOps",
      level: "Intermediate",
      issuer: "Google Cloud",
      issuedDate: "Dec 25, 2025",
      description: "Deploy, manage, and scale containerized applications on Google Kubernetes Engine (GKE) with Pods, Deployments, and Services.",
      skills: ["Google Kubernetes Engine", "Pods & Services", "Rolling Updates", "GKE Deployments"]
  },
  {
    id: "gcloud-deploy-multi-agent-architectures",
    title: "Deploy Multi-Agent Architectures",
    issuer: "Google Cloud"
  },
  {
    id: "gcloud-derive-insights-from-bigquery-data-skill-badge",
    title: "Derive Insights from BigQuery Data Skill Badge",
    issuer: "Google Cloud"
  },
  {
    id: "gcloud-develop-ai-powered-prototypes-in-google-ai-studio",
    title: "Develop AI-Powered Prototypes in Google AI Studio",
    issuer: "Google Cloud"
  },
  {
    id: "gcloud-develop-and-secure-apis-with-apigee-x-skill-badge",
    title: "Develop and Secure APIs with Apigee X Skill Badge",
    issuer: "Google Cloud"
  },
  {
    id: "gcloud-develop-genai-apps-with-gemini-and-streamlit-skill-badge",
    title: "Develop GenAI Apps with Gemini and Streamlit Skill Badge",
    issuer: "Google Cloud"
  },
  {
  id: "badge-serverless-cloud-run",
      title: "Develop Serverless Applications on Cloud Run Skill Badge",
      category: "Serverless & Apps",
      level: "Intermediate",
      issuer: "Google Cloud",
      issuedDate: "Dec 19, 2025",
      description: "Containerize web apps and APIs, configure continuous deployment, concurrency, custom domains, and traffic splitting on Cloud Run.",
      skills: ["Cloud Run Containers", "Traffic Splitting", "Concurrency Tuning", "Serverless Architecture"]
  },
  {
    id: "gcloud-develop-with-apps-script-and-appsheet-skill-badge",
    title: "Develop with Apps Script and AppSheet Skill Badge",
    issuer: "Google Cloud"
  },
  {
  id: "badge-develop-network",
      title: "Develop Your Google Cloud Network Skill Badge",
      category: "Infrastructure & Networking",
      level: "Intermediate",
      issuer: "Google Cloud",
      issuedDate: "Dec 25, 2025",
      description: "Deploy custom VPC networks, multi-region subnets, Cloud Router, Cloud DNS, internal and external load balancers.",
      skills: ["VPC Subnetting", "Cloud Router", "Cloud DNS", "Network Routing"]
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
      title: "Engineer Data for Predictive Modeling with BigQuery ML Skill Badge",
      category: "Machine Learning & AI",
      level: "Intermediate",
      issuer: "Google Cloud",
      issuedDate: "Dec 25, 2025",
      description: "Feature engineering, data preprocessing, categorical encoding, and feature transformation pipelines for high-accuracy predictive ML models.",
      skills: ["Feature Engineering", "Data Transformation", "Predictive Modeling", "BigQuery ML"]
  },
  {
    id: "gcloud-enhance-gemini-model-capabilities",
    title: "Enhance Gemini Model Capabilities",
    issuer: "Google Cloud"
  },
  {
    id: "gcloud-enrich-metadata-and-discovery-of-lakehouse-data",
    title: "Enrich Metadata and Discovery of Lakehouse Data",
    issuer: "Google Cloud"
  },
  {
    id: "gcloud-explore-generative-ai-with-the-vertex-ai-gemini-api-skil",
    title: "Explore Generative AI with the Vertex AI Gemini API Skill Badge",
    issuer: "Google Cloud"
  },
  {
    id: "gcloud-get-started-with-dataplex-skill-badge",
    title: "Get Started with Dataplex Skill Badge",
    issuer: "Google Cloud"
  },
  {
  id: "badge-cicd-pipelines",
      title: "Implement CI/CD Pipelines on Google Cloud Skill Badge",
      category: "Kubernetes & DevOps",
      level: "Intermediate",
      issuer: "Google Cloud",
      issuedDate: "Dec 14, 2025",
      description: "Automate continuous integration and continuous deployment pipelines using Cloud Build, Artifact Registry, and Cloud Deploy.",
      skills: ["Cloud Build", "Cloud Deploy", "Artifact Registry", "CI/CD Automation"]
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
  id: "badge-security-fundamentals",
      title: "Implement Cloud Security Fundamentals on Google Cloud Skill Badge",
      category: "Security",
      level: "Introductory",
      issuer: "Google Cloud",
      issuedDate: "Dec 25, 2025",
      description: "Deploy Cloud IAM least privilege policies, custom roles, service accounts, Cloud Audit Logs, and Identity-Aware Proxy (IAP).",
      skills: ["Cloud IAM", "Service Accounts", "Audit Logging", "Identity-Aware Proxy"]
  },
  {
    id: "gcloud-implement-cloud-storage-and-data-protection-solutions",
    title: "Implement Cloud Storage and Data Protection Solutions",
    issuer: "Google Cloud"
  },
  {
    id: "gcloud-implement-devops-workflows-in-google-cloud-skill-badge",
    title: "Implement DevOps Workflows in Google Cloud Skill Badge",
    issuer: "Google Cloud"
  },
  {
    id: "gcloud-implement-event-driven-messaging-and-automation-workflow",
    title: "Implement Event-Driven Messaging and Automation Workflows",
    issuer: "Google Cloud"
  },
  {
  id: "badge-load-balancing",
      title: "Implement Load Balancing on Compute Engine Skill Badge",
      category: "Infrastructure & Networking",
      level: "Intermediate",
      issuer: "Google Cloud",
      issuedDate: "Dec 25, 2025",
      description: "Configure global HTTP(S) load balancers, managed instance groups, autoscaling policies, SSL certificates, and health checks.",
      skills: ["HTTP(S) Load Balancing", "Managed Instance Groups", "Autoscaling", "Cloud CDN"]
  },
  {
    id: "gcloud-implement-multimodal-vector-search-with-bigquery",
    title: "Implement Multimodal Vector Search with BigQuery",
    issuer: "Google Cloud"
  },
  {
    id: "gcloud-implement-speech-and-language-solutions-with-pre-trained",
    title: "Implement Speech and Language Solutions with Pre-trained APIs",
    issuer: "Google Cloud"
  },
  {
  id: "badge-bigquery-apps-script",
      title: "Integrate BigQuery Data and Google Workspace using Apps Script Skill Badge",
      category: "Smart Analytics",
      level: "Intermediate",
      issuer: "Google Cloud",
      issuedDate: "Dec 23, 2025",
      description: "Automate executive reporting pipelines by querying BigQuery and dynamically generating Google Sheets charts, Docs, and Gmail alerts.",
      skills: ["BigQuery", "Apps Script", "Workspace Integration", "Automated Reporting"]
  },
  {
  id: "badge-manage-k8s-gcp",
      title: "Manage Kubernetes in Google Cloud Skill Badge",
      category: "Kubernetes & DevOps",
      level: "Intermediate",
      issuer: "Google Cloud",
      issuedDate: "Dec 14, 2025",
      description: "Administer GKE clusters, multi-zonal node pools, RBAC permissions, horizontal pod autoscalers (HPA), and ingress controllers.",
      skills: ["GKE Cluster Administration", "RBAC", "Node Pool Management", "Horizontal Pod Autoscaler"]
  },
  {
  id: "badge-migrate-mysql-cloudsql",
      title: "Migrate MySQL data to Cloud SQL using Database Migration Service Skill Badge",
      category: "Databases & Storage",
      level: "Intermediate",
      issuer: "Google Cloud",
      issuedDate: "Dec 25, 2025",
      description: "Plan and execute minimal-downtime database migrations from MySQL to Cloud SQL using Google Cloud Database Migration Service (DMS).",
      skills: ["Database Migration Service", "Cloud SQL MySQL", "Continuous Migration", "Connection Profiles"]
  },
  {
  id: "badge-security-command-center",
      title: "Mitigate Threats and Vulnerabilities with Security Command Center Skill Badge",
      category: "Security",
      level: "Intermediate",
      issuer: "Google Cloud",
      issuedDate: "Dec 25, 2025",
      description: "Continuous vulnerability assessment, posture management, threat detection, and compliance auditing with Security Command Center (SCC).",
      skills: ["Security Command Center", "Threat Mitigation", "Compliance Auditing", "Vulnerability Scanning"]
  },
  {
    id: "gcloud-monitor-and-log-with-google-cloud-operations-suite-skill",
    title: "Monitor and Log with Google Cloud Operations Suite Skill Badge",
    issuer: "Google Cloud"
  },
  {
    id: "gcloud-monitor-and-manage-google-cloud-resources-skill-badge",
    title: "Monitor and Manage Google Cloud Resources Skill Badge",
    issuer: "Google Cloud"
  },
  {
  id: "badge-prometheus-monitoring",
      title: "Monitor Environments with Google Cloud Managed Service for Prometheus Skill Badge",
      category: "Kubernetes & DevOps",
      level: "Intermediate",
      issuer: "Google Cloud",
      issuedDate: "Dec 25, 2025",
      description: "Collect, query, and visualize metrics at scale across GKE clusters with Managed Service for Prometheus and Cloud Monitoring.",
      skills: ["Managed Prometheus", "PromQL", "Cloud Monitoring", "Kubernetes Telemetry"]
  },
  {
    id: "gcloud-monitoring-in-google-cloud-skill-badge",
    title: "Monitoring in Google Cloud Skill Badge",
    issuer: "Google Cloud"
  },
  {
    id: "gcloud-orchestrate-multi-agent-workflows-with-gemini-enterprise",
    title: "Orchestrate Multi-agent Workflows with Gemini Enterprise",
    issuer: "Google Cloud"
  },
  {
    id: "gcloud-perform-predictive-data-analysis-in-bigquery-skill-badge",
    title: "Perform Predictive Data Analysis in BigQuery Skill Badge",
    issuer: "Google Cloud"
  },
  {
  id: "badge-prep-data-ml-apis",
      title: "Prepare Data for ML APIs on Google Cloud Skill Badge",
      category: "Machine Learning & AI",
      level: "Intermediate",
      issuer: "Google Cloud",
      issuedDate: "Dec 14, 2025",
      description: "Prepare, validate, and structure multimodal datasets to train and tune Google Cloud Machine Learning APIs and Vertex AI services.",
      skills: ["Dataset Preparation", "Data Validation", "Vertex AI", "Data Pipelines"]
  },
  {
    id: "gcloud-privileged-access-with-iam",
    title: "Privileged Access with IAM",
    issuer: "Google Cloud"
  },
  {
    id: "gcloud-prompt-design-in-vertex-ai-skill-badge",
    title: "Prompt Design in Vertex AI Skill Badge",
    issuer: "Google Cloud"
  },
  {
    id: "gcloud-protect-cloud-traffic-with-beyondcorp-enterprise-bce-sec",
    title: "Protect Cloud Traffic with BeyondCorp Enterprise (BCE) Security Skill Badge",
    issuer: "Google Cloud"
  },
  {
  id: "badge-data-loss-prevention",
      title: "Protect Sensitive Data with Data Loss Prevention Skill Badge",
      category: "Security",
      level: "Intermediate",
      issuer: "Google Cloud",
      issuedDate: "Dec 15, 2025",
      description: "Inspect, classify, mask, and redact personally identifiable information (PII) and sensitive data across Cloud Storage and BigQuery using Cloud DLP.",
      skills: ["Cloud DLP", "PII Redaction", "Data Masking", "Sensitive Data Discovery"]
  },
  {
    id: "gcloud-secure-biglake-data-skill-badge",
    title: "Secure BigLake Data Skill Badge",
    issuer: "Google Cloud"
  },
  {
  id: "badge-secure-software-delivery",
      title: "Secure Software Delivery Skill Badge",
      category: "Security",
      level: "Intermediate",
      issuer: "Google Cloud",
      issuedDate: "Dec 23, 2025",
      description: "Enforce software supply chain security with Binary Authorization, container image signing, vulnerability scans, and SLSA compliance in Cloud Build.",
      skills: ["Binary Authorization", "Container Scanning", "SLSA Framework", "Artifact Registry"]
  },
  {
    id: "gcloud-set-up-a-google-cloud-network-skill-badge",
    title: "Set Up a Google Cloud Network Skill Badge",
    issuer: "Google Cloud"
  },
  {
  id: "badge-setup-app-dev-env",
      title: "Set Up an App Dev Environment on Google Cloud Skill Badge",
      category: "Serverless & Apps",
      level: "Introductory",
      issuer: "Google Cloud",
      issuedDate: "Dec 25, 2025",
      description: "Configure Google Cloud Workstations, Cloud Shell environments, gcloud CLI profiles, and developer IAM permissions.",
      skills: ["Cloud Workstations", "Cloud Shell", "gcloud CLI", "Developer Tooling"]
  },
  {
  id: "badge-share-data-cloud",
      title: "Share Data Using Google Data Cloud Skill Badge",
      category: "Smart Analytics",
      level: "Intermediate",
      issuer: "Google Cloud",
      issuedDate: "Dec 16, 2025",
      description: "Publish, share, and govern analytical datasets across organizations with BigQuery Analytics Hub and private exchanges.",
      skills: ["Analytics Hub", "Data Sharing", "Data Governance", "BigQuery"]
  },
  {
  id: "badge-cli-storage-data",
      title: "Store, Process, and Manage Data on Google Cloud - Command Line Skill Badge",
      category: "Databases & Storage",
      level: "Introductory",
      issuer: "Google Cloud",
      issuedDate: "Dec 17, 2025",
      description: "Manage Cloud Storage buckets, Cloud SQL databases, and BigQuery datasets using gcloud, gsutil, and bq command-line interfaces.",
      skills: ["gcloud CLI", "gsutil", "bq CLI", "Data Management"]
  },
  {
    id: "gcloud-store-process-and-manage-data-on-google-cloud-console-sk",
    title: "Store, Process, and Manage Data on Google Cloud - Console Skill Badge",
    issuer: "Google Cloud"
  },
  {
  id: "badge-streaming-analytics-bigquery",
      title: "Streaming Analytics into BigQuery Skill Badge",
      category: "Smart Analytics",
      level: "Intermediate",
      issuer: "Google Cloud",
      issuedDate: "Dec 16, 2025",
      description: "Architect streaming ingestion pipelines using Cloud Pub/Sub, Dataflow with Apache Beam, and BigQuery streaming inserts.",
      skills: ["Cloud Pub/Sub", "Cloud Dataflow", "Streaming Ingestion", "Real-Time Analytics"]
  },
  {
    id: "gcloud-the-basics-of-google-cloud-compute-skill-badge",
    title: "The Basics of Google Cloud Compute Skill Badge",
    issuer: "Google Cloud"
  },
  {
    id: "gcloud-use-apis-to-work-with-cloud-storage-skill-badge",
    title: "Use APIs to Work with Cloud Storage Skill Badge",
    issuer: "Google Cloud"
  },
  {
  id: "badge-use-ml-apis",
      title: "Use Machine Learning APIs on Google Cloud Skill Badge",
      category: "Machine Learning & AI",
      level: "Introductory",
      issuer: "Google Cloud",
      issuedDate: "Dec 25, 2025",
      description: "Integrate pre-trained Google Cloud Vision API, Speech-to-Text, Translation API, and Text-to-Speech into production web applications.",
      skills: ["Cloud Vision API", "Speech-to-Text", "Translation API", "Text-to-Speech"]
  },
  {
    id: "gcloud-using-the-google-cloud-speech-api",
    title: "Using the Google Cloud Speech API",
    issuer: "Google Cloud"
  }
];
