import type { ExperienceItem } from './types'

export const experience: ExperienceItem[] = [
  {
    role: 'Data Science Intern',
    organization: 'Codtech IT Solutions Pvt. Ltd.',
    type: 'Internship',
    period: 'May 2026 – Jul 2026',
    duration: '6-week internship',
    location: 'Remote · Hyderabad, Telangana, India',
    summary:
      'Worked on end-to-end Data Science and Machine Learning projects in Python, covering ETL, deep learning, model deployment and optimization.',
    highlights: [
      'Built automated ETL pipelines for data preprocessing using Pandas and Scikit-learn',
      'Trained and improved a CNN-based image classification model using PyTorch',
      'Built and deployed a Student Performance Prediction API using FastAPI',
      'Developed a Supply Chain Transportation Cost Optimization model using Linear Programming (PuLP)',
      'Handled data cleaning, feature engineering, EDA, model evaluation, visualization and API development',
      'Used Git and GitHub for version control and project documentation',
    ],
    stack: ['Python', 'Pandas', 'Scikit-learn', 'PyTorch', 'FastAPI', 'PuLP', 'Matplotlib', 'Git'],
    relatedProjects: ['etl-pipeline', 'cnn-image-classification', 'student-performance', 'supply-chain'],
    // Paste the certificate URL here to show a "View certificate" button.
    credential: { label: 'Internship certificate', href: '' },
  },
  {
    role: 'Teaching Volunteer (Computer Basics)',
    organization: 'Jeevan Prabhat — Arya Samaj',
    type: 'Volunteering · Education',
    period: 'Jul 2025',
    duration: '1 month',
    location: 'India',
    summary:
      'Taught basic computer skills and fundamental technology concepts to students as part of a volunteer program at Arya Samaj.',
    highlights: [
      'Improved the digital literacy of 40 students by teaching basic computer skills',
      'Simplified technical concepts into beginner-friendly lessons and guided students in using computers and basic digital tools',
      'Encouraged problem-solving and curiosity through interactive sessions, and mentored students to build confidence with technology',
      'Developed communication, leadership and teaching skills while explaining technical concepts to diverse learners',
    ],
  },
]
