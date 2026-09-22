// Personal details used across the site. The phone number is deliberately left out.
export const profile = {
  name: 'Abhishek Sharma',
  initials: 'AS',
  headline: 'Computer Science (Big Data Analytics) Student · Building with AI/ML, Data & Software',
  headlineParts: {
    role: 'Computer Science (Big Data Analytics) Student',
    focus: ['AI/ML', 'Data', 'Software'],
  },
  location: 'Mehsana, Gujarat, India',
  email: 'abhisheksharmaxdev@gmail.com',
  availability: 'Open to internships & entry-level roles',
  seeking: ['Data Science', 'AI/ML', 'Python Development', 'Software Engineering'],

  /** Short intro used in the hero. */
  intro:
    'I build practical applications that combine data analysis, machine learning and full-stack development — from preprocessing pipelines and trained models to APIs and deployed web apps.',

  /** About section — adapted from LinkedIn "About" and CV summary. */
  about: [
    'I am a B.Tech Computer Science student at Ganpat University (ICT), specializing in Big Data Analytics, with a strong interest in Data Science, Machine Learning and Software Development. I enjoy building practical applications that solve real-world problems and expanding my technical skills through hands-on projects.',
    'Recently I completed a 6-week Data Science internship at Codtech IT Solutions, where I worked on end-to-end projects involving ETL pipelines, machine learning, deep learning fundamentals, FastAPI and linear programming — including student performance prediction, image classification and supply chain transportation cost optimization.',
    'Before that, I built and deployed MindEase, a full-stack mental wellness platform for students with an AI chatbot, role-based dashboards and therapist booking. I care about writing clean, maintainable code and building solutions that bring data analysis and software development together.',
  ],

  strengths: ['Problem-Solving', 'Analytical Thinking', 'Team Collaboration', 'Communication'],

  resume: {
    url: 'https://drive.google.com/file/d/1-X18zDaxA9PAv1Mv-U9y1fdWL0yFmlcc/view?usp=drive_link',
  },

  socials: {
    github: { label: 'GitHub', handle: 'abhisheksharmaxdev', href: 'https://github.com/abhisheksharmaxdev' },
    linkedin: {
      label: 'LinkedIn',
      handle: 'abhishek-sharma-xdev',
      href: 'https://www.linkedin.com/in/abhishek-sharma-xdev',
    },
  },
} as const
