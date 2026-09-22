import type { Project } from './types'

// Listed in display order. Each metric keeps a `source` so the number can be traced back
// to the CV, LinkedIn or the project repo. New visuals are registered in ProjectVisual.tsx.

const GH = 'https://github.com/abhisheksharmaxdev'

export const projects: Project[] = [
  {
    slug: 'mindease',
    title: 'MindEase — AI-Powered Mental Wellness Platform',
    shortTitle: 'MindEase',
    tagline: 'A full-stack mental wellness platform for students, with an AI support chatbot, therapist booking and anonymous reporting.',
    period: 'Feb 2026 – Apr 2026',
    categories: ['Full-Stack'],
    featured: true,
    problem:
      'Students often find it hard to ask for emotional support. MindEase makes it easier to get help, with a private chat companion, anonymous concern reporting and a straightforward way to book time with a therapist.',
    approach: [
      'Angular frontend with separate dashboards for Users, Therapists and Admins',
      'Node.js + Express REST API backed by MongoDB Atlas',
      'MindMate chatbot built on the OpenAI API, with context-aware English/Hinglish replies and safe fallback handling',
      'Real-time dashboard updates using polling',
    ],
    contribution: [
      'Designed and built the full application myself, from the Angular UI and Express API to the database schema and deployment',
      'Implemented JWT authentication with role-based access control (Admin, Therapist, User)',
      'Built therapist booking (accept/reject flow), anonymous concern reporting with admin assignment, and transaction/activity tracking',
      'Deployed the frontend on Netlify and the backend on Render, keeping API keys and secrets in environment variables so they never reach the frontend',
    ],
    results: [
      'Live, multi-user deployment: stateless JWT sessions let many users stay signed in at the same time across all three roles',
      'MongoDB Atlas provides a managed database layer that can scale with usage without changing application code',
      'Increased user engagement by 30%, based on a student feedback survey comparing MindEase with the university’s mental-health awareness event',
    ],
    metrics: [
      {
        value: '+30%',
        label: 'user engagement',
        source: 'Student feedback survey comparing MindEase with the university’s mental-health awareness event (CV)',
      },
      { value: '3', label: 'user roles with dedicated dashboards', source: 'GitHub README — Admin, Therapist, User' },
      { value: 'Live', label: 'Netlify + Render', source: 'mindease-as.netlify.app' },
    ],
    stack: ['Angular', 'TypeScript', 'Node.js', 'Express.js', 'MongoDB Atlas', 'OpenAI API', 'JWT', 'REST APIs', 'Netlify', 'Render'],
    links: { github: `${GH}/MindEase`, live: 'https://mindease-as.netlify.app/' },
    visual: 'mindease',
    accent: '#a78bfa',
  },
  {
    slug: 'student-performance',
    title: 'End-to-End Student Performance Prediction System',
    shortTitle: 'Student Performance Prediction',
    tagline: 'A regression pipeline that predicts exam scores from academic and lifestyle factors, served through a FastAPI REST API.',
    period: 'May 2026 – Jun 2026',
    categories: ['Machine Learning'],
    featured: true,
    context: 'Codtech IT Solutions — Data Science Internship',
    problem:
      'Estimate a student’s final exam score from features like study hours, attendance, previous score, sleep, tutoring, parental education, internet access and extracurricular activities, then make the model usable by other applications through an API.',
    approach: [
      'Data cleaning: duplicate removal, missing-value imputation, type validation and outlier clipping',
      'Exploratory data analysis: score distribution, correlation matrix, null-value and study-hours-vs-score plots',
      'Preprocessing with a ColumnTransformer (StandardScaler for numeric features, One-Hot Encoding for categorical ones)',
      'Trained and compared Linear Regression and Random Forest Regressor on MAE, RMSE and R²',
    ],
    contribution: [
      'Built the full pipeline, from raw CSV to a saved model',
      'Automated best-model selection and saved the model and preprocessing with Joblib so predictions stay consistent',
      'Built a FastAPI service with a /predict endpoint returning JSON predictions, plus interactive Swagger docs',
    ],
    results: [
      'Linear Regression was the best model: R² = 0.795, MAE = 3.73, RMSE = 4.80',
      'Cleaned the dataset from 308 to 304 rows (4 duplicates removed) and filled all missing values',
      'Real-time predictions available through the REST API',
    ],
    metrics: [
      { value: '0.795', label: 'R² (best model)', source: 'outputs/metrics.json in internship-task-3' },
      { value: '3.73', label: 'MAE (exam-score points)', source: 'outputs/metrics.json in internship-task-3' },
      { value: '2', label: 'models compared', source: 'outputs/metrics.json in internship-task-3' },
    ],
    stack: ['Python', 'Pandas', 'NumPy', 'Scikit-learn', 'Matplotlib', 'Joblib', 'FastAPI', 'Uvicorn'],
    links: { github: `${GH}/internship-task-3` },
    visual: 'student-performance',
    accent: '#22d3ee',
  },
  {
    slug: 'supply-chain',
    title: 'End-to-End Supply Chain Transportation Cost Optimization',
    shortTitle: 'Supply Chain Cost Optimization',
    tagline: 'A linear programming model that finds the lowest-cost shipment plan from 3 warehouses to 4 retail stores.',
    period: 'Jun 2026 – Jul 2026',
    categories: ['Optimization'],
    featured: true,
    context: 'Codtech IT Solutions — Data Science Internship',
    problem:
      'Decide how many units to ship on each warehouse-to-store route (Mumbai, Delhi and Ahmedabad to Jaipur, Surat, Pune and Indore) so every store’s demand is met, no warehouse exceeds its supply, and total transportation cost is as low as possible.',
    approach: [
      'Formulated a balanced transportation problem: minimize Σ (cost per unit × shipment quantity)',
      'Added supply, demand and non-negativity constraints',
      'Solved the model with PuLP after loading and validating the supply, demand and cost datasets with Pandas',
      'Visualized the results with Matplotlib, Seaborn and NetworkX (supply/demand charts, shipment heatmap, route network)',
    ],
    contribution: [
      'Wrote the mathematical formulation and implemented it in PuLP',
      'Analyzed supply, demand and transportation cost data before optimizing',
      'Generated optimal shipment plans and cost summaries (CSV) to support decisions',
    ],
    results: [
      'Reduced transportation cost by 45.4% compared to a baseline sequential shipment allocation strategy',
      'Optimal plan meets all store demand at a minimum total transportation cost of 1,950',
      'Found Ahmedabad → Surat to be the cheapest route; Mumbai mainly serves Pune, and Delhi supplies Jaipur and Indore',
    ],
    metrics: [
      {
        value: '45.4%',
        label: 'lower cost vs. baseline sequential allocation',
        source: 'LinkedIn project description / CV',
      },
      { value: '1,950', label: 'minimum total transportation cost', source: 'README results in internship-task-4' },
      { value: '3 → 4', label: 'warehouses → stores', source: 'README dataset section in internship-task-4' },
    ],
    stack: ['Python', 'PuLP', 'Linear Programming', 'Pandas', 'NumPy', 'Matplotlib', 'Seaborn', 'NetworkX', 'Jupyter'],
    links: { github: `${GH}/internship-task-4` },
    visual: 'supply-chain',
    accent: '#34d399',
  },
  {
    slug: 'cnn-image-classification',
    title: 'Deep Learning Image Classification with PyTorch',
    shortTitle: 'CNN Image Classification',
    tagline: 'A convolutional neural network that classifies handwritten digits (MNIST), with training, evaluation and visualization.',
    period: '2026',
    categories: ['Deep Learning'],
    featured: false,
    context: 'Codtech IT Solutions — Data Science Internship',
    problem:
      'Learn the full deep learning workflow by training a CNN to recognize handwritten digits 0–9 from 28×28 grayscale images.',
    approach: [
      'Two convolution + max-pooling blocks (32 and 64 filters), a 128-unit fully connected layer with dropout, and a 10-class output layer',
      'Trained with the Adam optimizer on a train/validation split, monitoring validation performance',
      'Evaluated with a classification report, confusion matrix and sample predictions',
    ],
    contribution: [
      'Structured the code into modules: data loader, model, training, evaluation and visualization',
      'Saved the best and final model checkpoints plus the training history',
      'Generated accuracy/loss curves, a confusion-matrix heatmap and prediction samples',
    ],
    results: ['Reached 99.17% validation accuracy after 5 epochs'],
    metrics: [
      { value: '99.17%', label: 'validation accuracy (epoch 5)', source: 'outputs/training_history.json in internship-task-2' },
      { value: '60k', label: 'training images (MNIST)', source: 'README in internship-task-2' },
    ],
    stack: ['Python', 'PyTorch', 'TorchVision', 'NumPy', 'Matplotlib', 'Seaborn', 'Scikit-learn'],
    links: { github: `${GH}/internship-task-2` },
    visual: 'cnn',
    accent: '#f472b6',
  },
  {
    slug: 'etl-pipeline',
    title: 'ETL Pipeline with Pandas & Scikit-learn',
    shortTitle: 'ETL Pipeline',
    tagline: 'An automated extract-transform-load pipeline that turns a raw customer CSV into model-ready train/test datasets.',
    period: '2026',
    categories: ['Data Engineering'],
    featured: false,
    context: 'Codtech IT Solutions — Data Science Internship',
    problem:
      'Raw data is rarely ready for machine learning. The goal was one reusable script that cleans, transforms and splits a dataset the same way every time.',
    approach: [
      'Extract: load the raw customer dataset with Pandas and profile its types and missing values',
      'Transform: impute missing values, encode categorical variables and scale numeric features using a Scikit-learn pipeline',
      'Load: export the cleaned data and train/test splits, and save the fitted preprocessor with Joblib',
    ],
    contribution: [
      'Automated the whole workflow in a single Python script',
      'Made preprocessing reusable by saving the fitted transformer and dataset metadata',
    ],
    results: ['Produces 7 output files: cleaned data, transformed train/test features, labels, metadata.json and preprocessor.joblib'],
    metrics: [{ value: '7', label: 'generated output files', source: 'README in internship-task-1' }],
    stack: ['Python', 'Pandas', 'NumPy', 'Scikit-learn', 'Joblib'],
    links: { github: `${GH}/internship-task-1` },
    visual: 'etl',
    accent: '#fbbf24',
  },
]

export const projectCategories = ['All', ...Array.from(new Set(projects.flatMap((p) => p.categories)))] as const
