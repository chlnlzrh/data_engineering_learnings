# Data Engineering Learning Platform

A comprehensive Next.js 15 application built for data engineering education, featuring a structured learning path, project portfolio, community features, and resource library.

## Features

- 🚀 **Interactive Dashboard** - Personalized learning progress and next steps
- 🗺️ **Structured Learning Path** - 8 modules from foundations to advanced topics
- 🛠️ **Project Portfolio** - Capstone and mini-projects with real-world scenarios
- 💬 **Community Hub** - Forums, office hours, and peer collaboration
- 📚 **Resource Library** - Guides, cheat sheets, and curated reading materials
- 🌙 **Dark Mode** - Full light/dark theme support with system preference detection
- 📱 **Mobile Responsive** - Optimized for all device sizes with mobile-first design
- ♿ **Accessibility** - WCAG compliant with keyboard navigation and screen reader support

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with design tokens
- **UI Components**: Shadcn/ui components
- **Icons**: Lucide React
- **Theme**: next-themes for dark mode
- **Performance**: Turbopack for fast development

## Architecture

The application follows Claude.md guidelines with:

- **Component-based architecture** with reusable UI components
- **Mobile-first responsive design** with breakpoint-specific layouts
- **Semantic HTML** and ARIA attributes for accessibility
- **Performance optimization** with proper code splitting and lazy loading
- **Type safety** with strict TypeScript configuration

## Menu Structure

Based on the Website Menu.md specification:

### Primary Navigation
- **My Dashboard** - Personalized homepage with progress tracking
- **Learning Path** - 8 modules with interactive progress indicators
- **Projects** - Portfolio showcase and project management
- **Help & Community** - Forums, support, and collaboration tools
- **Resource Library** - Categorized learning materials and guides

### Navigation Features
- **Desktop**: Collapsed sidebar that expands on hover
- **Mobile**: Full-screen hamburger menu with smooth animations
- **Auto-collapse** behavior with 300ms spring transitions
- **Active states** and visual feedback
- **Keyboard navigation** support

## Module Structure

### Module 0: Orientation & Setup
- Program overview and expectations
- Environment setup (Git, Python, Docker, IDE)
- Modern data stack introduction

### Module 1: Data Engineering Foundations
- Role definition and core concepts
- Data lifecycle and formats
- Essential toolkit (Linux, Git, version control)

### Module 2: SQL & Data Modeling
- SQL fundamentals to advanced concepts
- OLTP vs OLAP systems
- Dimensional modeling and star schemas

### Module 3: Python for Data Engineering
- Python essentials and data structures
- Pandas for data manipulation
- API integration and pipeline building

### Module 4: Modern Warehouse & Transformation
- Cloud warehouses (BigQuery, Snowflake, Redshift)
- ELT paradigm and dbt fundamentals
- Data transformation patterns

### Module 5: Batch Processing & Cloud Platforms
- Cloud platform fundamentals
- Distributed computing with Spark
- Data lakes and lakehouse architecture

### Module 6: Orchestration & DataOps
- Workflow orchestration (Airflow, Dagster)
- Data quality and testing strategies
- CI/CD for data pipelines

### Module 7: Real-Time Data & Streaming
- Batch vs streaming concepts
- Kafka and message queues
- Stream processing patterns

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd data-engineering-platform
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript compiler check

## Development Guidelines

### Code Style
- Follow the established component patterns
- Use TypeScript strictly with proper typing
- Implement responsive design mobile-first
- Maintain accessibility standards (WCAG AA)
- Follow the Claude.md architecture principles

### Component Structure
```
src/
├── app/                 # Next.js App Router pages
├── components/          # React components
│   ├── ui/             # Base UI components (Shadcn)
│   └── ...             # Feature components
└── lib/                # Utilities and helpers
```

### Design System
- **Typography**: Inter font, text-xs base size
- **Spacing**: Tailwind spacing tokens (4px/8px grid)
- **Colors**: Semantic color tokens with dark mode support
- **Motion**: 300ms spring animations with reduced motion support

## Deployment

The application is configured for Vercel deployment:

1. Connect your GitHub repository to Vercel
2. Configure environment variables if needed
3. Deploy with automatic builds on commits

## Contributing

1. Follow the established code patterns and architecture
2. Ensure all components are accessible and responsive
3. Test across different devices and screen sizes
4. Run linting and type checking before commits
5. Follow the commit message conventions

## License

This project is for educational purposes as part of the data engineering learning curriculum.