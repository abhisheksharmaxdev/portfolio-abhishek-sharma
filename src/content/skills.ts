import type { SkillGroup } from './types'

/** Skills as listed on the CV / LinkedIn (plus TypeScript, the main language of the MindEase repo). */
export const skillGroups: SkillGroup[] = [
  { name: 'Languages', icon: 'code', skills: ['Python', 'JavaScript', 'TypeScript', 'SQL'] },
  {
    name: 'Machine Learning & AI',
    icon: 'brain',
    skills: ['Scikit-learn', 'PyTorch', 'Machine Learning', 'Deep Learning', 'CNN', 'OpenAI API'],
  },
  {
    name: 'Data Science',
    icon: 'chart',
    skills: ['Pandas', 'NumPy', 'Data Cleaning', 'EDA', 'Feature Engineering', 'ETL Pipelines', 'Matplotlib', 'Seaborn'],
  },
  { name: 'Optimization', icon: 'target', skills: ['Linear Programming', 'PuLP'] },
  { name: 'Backend', icon: 'server', skills: ['FastAPI', 'Node.js', 'Express.js', 'REST APIs', 'JWT'] },
  { name: 'Frontend', icon: 'layout', skills: ['Angular', 'HTML5', 'CSS3'] },
  { name: 'Databases', icon: 'database', skills: ['MongoDB', 'SQL', 'NoSQL'] },
  { name: 'Tools & Deployment', icon: 'tool', skills: ['Git', 'GitHub', 'Joblib', 'Jupyter', 'Netlify', 'Render'] },
]

/**
 * Explicit skill → project links for skills that are concepts rather than
 * named stack items. Everything else is matched against each project's stack.
 */
export const skillProjectOverrides: Record<string, string[]> = {
  'Machine Learning': ['student-performance', 'cnn-image-classification'],
  'Deep Learning': ['cnn-image-classification'],
  CNN: ['cnn-image-classification'],
  'Data Cleaning': ['student-performance', 'etl-pipeline'],
  EDA: ['student-performance'],
  'Feature Engineering': ['student-performance'],
  'ETL Pipelines': ['etl-pipeline'],
  'REST APIs': ['mindease', 'student-performance'],
  MongoDB: ['mindease'],
  NoSQL: ['mindease'],
  JavaScript: ['mindease'],
  HTML5: ['mindease'],
  CSS3: ['mindease'],
  Git: ['mindease', 'student-performance', 'supply-chain', 'cnn-image-classification', 'etl-pipeline'],
  GitHub: ['mindease', 'student-performance', 'supply-chain', 'cnn-image-classification', 'etl-pipeline'],
}
