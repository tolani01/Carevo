# Carevo - Command Center

A modern, accessible task management system designed for outpatient clinics. Built with Next.js, TypeScript, and Tailwind CSS.

## 🚀 **Recent Updates**

### **Latest Session Enhancements** ✅ (December 23, 2024)
- **Dynamic KPI System**: Real-time calculations with smart color coding and detailed drill-downs
- **Enhanced Calendar**: Fully functional with task statistics, date filtering, and clickable tasks
- **Search System Improvements**: Removed restrictions, added clear buttons, fixed 7-day task display
- **Task Actions**: Complete functionality for all buttons with proper modals and design consistency
- **Global Header Cleanup**: Removed New Task and Filters buttons across all pages
- **Profile Page Fixes**: Resolved TypeScript errors and component issues
- **Next.js Build Issues**: Resolved port conflicts and corrupted .next directory

### **Sprint 2: Search & KPIs** ✅ (Weeks 3-4)
- **Semantic Search**: AI-powered natural language search with intelligent suggestions
  - Natural language query processing (intent, entities, time ranges)
  - AI understanding with query analysis cards
  - Multi-entity search (tasks, messages, users)
  - Relevance scoring and result ranking
  - Intelligent search suggestions based on query content

- **KPI Dashboard**: Interactive metrics dashboard for clinic oversight
  - Real-time metrics display (completed, overdue, due today, etc.)
  - Interactive KPI tiles with trend indicators
  - Detailed metric modals with data breakdowns
  - Performance insights and trend analysis
  - Status-based color coding (good/warning/danger)

- **Filter System Integration**: Complete filter system with URL persistence
  - URL-based filter state persistence
  - Filter chips for active filter display
  - Advanced filter combinations
  - Clear individual or all filters functionality
  - Performance monitoring and optimization

- **Performance Monitoring**: Real-time performance tracking
  - Search performance tracking with query analysis
  - Task action performance monitoring
  - Filter operation performance tracking
  - Threshold-based performance warnings
  - In-memory metrics storage and analysis

### **Week 1: Task Card Enhancements** ✅
- **DueDatePicker Component**: New modal component for setting task due dates
  - Quick selection options (Today, Tomorrow, Next Week)
  - Custom date and time selection
  - Date validation (prevents past dates)
  - Full keyboard navigation and screen reader support
  - Accessible dialog with proper ARIA labels

- **Design Tokens System**: Comprehensive design system implementation
  - Color palette (primary, semantic, neutral scales)
  - Spacing scale (xs to 5xl)
  - Typography scale with line heights
  - Border radius, shadows, z-index scales
  - CSS variables for non-TypeScript consumers

- **Storybook Integration**: Component documentation and testing
  - A11y addon for accessibility testing
  - Interactive component stories
  - Design token integration

- **Testing Suite**: Comprehensive testing implementation
  - Unit tests with Jest and Testing Library
  - Integration tests with Playwright
  - Accessibility testing
  - Cross-browser compatibility

### **Next Week (Week 2)**: FilterDrawer, KPI Bar, Semantic Search UI
- FilterDrawer component for advanced filtering
- KPI dashboard bar for clinic metrics
- Semantic search interface improvements
- Enhanced mobile experience

## 🏗️ **Tech Stack**

- **Frontend**: Next.js 14+ (App Router), TypeScript, Tailwind CSS
- **UI Components**: shadcn/ui (Radix UI primitives)
- **State Management**: React Context + Custom Hooks
- **Authentication**: Mock OTP system (test code: `000000`)
- **Styling**: Custom glassmorphism theme with design tokens
- **Testing**: Jest, Testing Library, Playwright
- **Documentation**: Storybook

## 🚀 **Getting Started**

### **Prerequisites**
- Node.js 18+ 
- npm or yarn

### **Installation**
```bash
# Clone the repository
git clone <repository-url>
cd carevo

# Install dependencies
npm install

# Start development server
npm run dev
```

### **Available Scripts**
```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server

# Testing
npm test             # Run unit tests
npm run test:e2e     # Run integration tests
npm run storybook    # Start Storybook

# Code Quality
npm run lint         # Run ESLint
npm run typecheck    # Run TypeScript checks
```

## 📱 **Features**

### **Task Management**
- Kanban board with drag-and-drop
- Task assignment and reassignment
- Due date management with DueDatePicker
- Status tracking (ToDo, InProgress, Waiting, Done)
- Priority levels and labels
- Patient reference system (HIPAA-compliant)

### **User Interface**
- Modern glassmorphism design
- Responsive mobile-first layout
- Dark mode support (coming soon)
- Accessibility (WCAG 2.2 AA compliant)
- Keyboard navigation
- Screen reader support

### **Communication**
- Team chat with channels
- File sharing capabilities
- Task creation from messages
- Real-time updates (coming soon)

### **Admin Panel**
- User management
- Role-based access control
- System settings
- Audit logs

## 🎨 **Design System**

### **Design Tokens**
The application uses a comprehensive design token system:

```typescript
// TypeScript consumers
import { designTokens } from '@/lib/design-tokens'

// Available tokens
designTokens.colors.primary[500]    // #3b82f6
designTokens.spacing.md             // 1rem
designTokens.typography.fontSize.lg // 1.125rem
```

```css
/* CSS consumers */
:root {
  --color-primary-500: #3b82f6;
  --spacing-md: 1rem;
  --font-size-lg: 1.125rem;
}
```

### **Component Library**
- Built with shadcn/ui and Radix UI
- Custom components for task management
- Accessible by default
- TypeScript support

## 🧪 **Testing**

### **Unit Tests**
```bash
npm test
```
- Jest and Testing Library
- Component behavior testing
- Accessibility testing
- User interaction testing

### **Integration Tests**
```bash
npm run test:e2e
```
- Playwright end-to-end tests
- Cross-browser compatibility
- Mobile testing
- User workflow testing

### **Visual Testing**
```bash
npm run storybook
```
- Component stories
- Accessibility testing
- Design token showcase
- Interactive examples

## 📚 **Documentation**

- **Component Docs**: `docs/components/`
- **Implementation Logs**: `docs/Week1_Implementation.md`
- **API Documentation**: Generated from TypeScript
- **Storybook**: Interactive component documentation

## 🔒 **Security & Privacy**

- **HIPAA Compliance**: PHI-lite design with de-identification
- **Access Control**: Role-based permissions
- **Data Protection**: Encrypted data storage
- **Audit Trails**: Complete activity logging

## 🚀 **Deployment**

### **Production Build**
```bash
npm run build
npm run start
```

### **Environment Variables**
```bash
# .env.local
NEXT_PUBLIC_APP_URL=http://localhost:3000
# Add other environment variables as needed
```

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

### **Code Standards**
- TypeScript strict mode
- ESLint configuration
- Prettier formatting
- Conventional commits
- Accessibility first

## 📄 **License**

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 **Acknowledgments**

- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide React](https://lucide.dev/)
- Testing with [Playwright](https://playwright.dev/)

---

**Carevo** - Where Healthcare Meets Efficiency 🏥✨
