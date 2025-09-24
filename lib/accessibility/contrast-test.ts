/**
 * AA-Accessible Dark Mode Contrast Testing Utility
 * Tests contrast ratios for WCAG 2.1 AA compliance
 */

interface ContrastTest {
  element: string;
  background: string;
  foreground: string;
  contrastRatio: number;
  aaStatus: 'PASS' | 'FAIL';
  aaaStatus: 'PASS' | 'FAIL';
}

/**
 * Calculate contrast ratio between two colors
 */
function getContrastRatio(color1: string, color2: string): number {
  // Simplified contrast calculation for demo
  // In production, use a proper color contrast library
  const getLuminance = (color: string): number => {
    // Convert hex to RGB and calculate relative luminance
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16) / 255;
    const g = parseInt(hex.substr(2, 2), 16) / 255;
    const b = parseInt(hex.substr(4, 2), 16) / 255;
    
    const [rs, gs, bs] = [r, g, b].map(c => 
      c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
    );
    
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  };
  
  const l1 = getLuminance(color1);
  const l2 = getLuminance(color2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Test all contrast combinations for AA compliance
 */
export function testContrastCompliance(): ContrastTest[] {
  const tests: ContrastTest[] = [
    // Body text tests
    {
      element: 'Body text on card',
      background: '#1a1f2e', // surface-2
      foreground: '#f1f5f9', // text-1
      contrastRatio: 0,
      aaStatus: 'FAIL',
      aaaStatus: 'FAIL'
    },
    {
      element: 'Large heading on card',
      background: '#1a1f2e', // surface-2
      foreground: '#f1f5f9', // text-1
      contrastRatio: 0,
      aaStatus: 'FAIL',
      aaaStatus: 'FAIL'
    },
    {
      element: 'Button label on primary',
      background: '#3b82f6', // accent
      foreground: '#0f1419', // surface-1
      contrastRatio: 0,
      aaStatus: 'FAIL',
      aaaStatus: 'FAIL'
    },
    {
      element: 'Input placeholder',
      background: '#1a1f2e', // surface-2
      foreground: '#94a3b8', // text-muted
      contrastRatio: 0,
      aaStatus: 'FAIL',
      aaaStatus: 'FAIL'
    },
    {
      element: 'Link on card',
      background: '#1a1f2e', // surface-2
      foreground: '#3b82f6', // accent
      contrastRatio: 0,
      aaStatus: 'FAIL',
      aaaStatus: 'FAIL'
    },
    {
      element: 'Focus ring',
      background: '#1a1f2e', // surface-2
      foreground: '#3b82f6', // accent
      contrastRatio: 0,
      aaStatus: 'FAIL',
      aaaStatus: 'FAIL'
    },
    {
      element: 'Success message',
      background: '#1f2937', // success-bg
      foreground: '#16a34a', // success
      contrastRatio: 0,
      aaStatus: 'FAIL',
      aaaStatus: 'FAIL'
    },
    {
      element: 'Warning message',
      background: '#1f2937', // warning-bg
      foreground: '#f59e0b', // warning
      contrastRatio: 0,
      aaStatus: 'FAIL',
      aaaStatus: 'FAIL'
    },
    {
      element: 'Danger message',
      background: '#1f2937', // danger-bg
      foreground: '#ef4444', // danger
      contrastRatio: 0,
      aaStatus: 'FAIL',
      aaaStatus: 'FAIL'
    }
  ];
  
  // Calculate actual contrast ratios
  tests.forEach(test => {
    test.contrastRatio = getContrastRatio(test.background, test.foreground);
    test.aaStatus = test.contrastRatio >= 4.5 ? 'PASS' : 'FAIL';
    test.aaaStatus = test.contrastRatio >= 7.0 ? 'PASS' : 'FAIL';
  });
  
  return tests;
}

/**
 * Generate contrast report
 */
export function generateContrastReport(): string {
  const tests = testContrastCompliance();
  const passedAA = tests.filter(t => t.aaStatus === 'PASS').length;
  const passedAAA = tests.filter(t => t.aaaStatus === 'PASS').length;
  
  let report = `# Carevo Dark Mode Contrast Report\n\n`;
  report += `## Summary\n`;
  report += `- AA Compliance: ${passedAA}/${tests.length} (${Math.round(passedAA/tests.length*100)}%)\n`;
  report += `- AAA Compliance: ${passedAAA}/${tests.length} (${Math.round(passedAAA/tests.length*100)}%)\n\n`;
  
  report += `## Detailed Results\n\n`;
  report += `| Element | Background | Foreground | Contrast | AA | AAA |\n`;
  report += `|---------|------------|------------|----------|----|----|\n`;
  
  tests.forEach(test => {
    report += `| ${test.element} | ${test.background} | ${test.foreground} | ${test.contrastRatio.toFixed(2)}:1 | ${test.aaStatus} | ${test.aaaStatus} |\n`;
  });
  
  report += `\n## Recommendations\n\n`;
  
  const failedTests = tests.filter(t => t.aaStatus === 'FAIL');
  if (failedTests.length > 0) {
    report += `### Failed Tests:\n`;
    failedTests.forEach(test => {
      report += `- **${test.element}**: ${test.contrastRatio.toFixed(2)}:1 (needs 4.5:1 for AA)\n`;
    });
  } else {
    report += `✅ All tests pass AA compliance!\n`;
  }
  
  return report;
}

/**
 * Test accent hue adaptation
 */
export function testAccentHueAdaptation(): string {
  const hues = [
    { name: 'Blue (Current)', hue: 240 },
    { name: 'Green (Medical)', hue: 160 },
    { name: 'Red (Alert)', hue: 0 },
    { name: 'Purple (Secondary)', hue: 280 }
  ];
  
  let report = `# Accent Hue Adaptation Test\n\n`;
  report += `## Test Results\n\n`;
  
  hues.forEach(({ name, hue }) => {
    const accent = `hsl(${hue}, 89%, 65%)`;
    const surface = '#0f1419';
    const contrast = getContrastRatio(accent, surface);
    
    report += `### ${name}\n`;
    report += `- Accent: ${accent}\n`;
    report += `- Contrast with surface: ${contrast.toFixed(2)}:1\n`;
    report += `- AA Status: ${contrast >= 4.5 ? '✅ PASS' : '❌ FAIL'}\n\n`;
  });
  
  return report;
}
