# Carevo - Command Center

A modern, accessible task management system designed for outpatient clinics. Built with Next.js, TypeScript, and Tailwind CSS.

## 🚀 **Recent Updates**

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
