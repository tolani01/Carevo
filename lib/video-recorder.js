const { chromium } = require('playwright');
const { saveVideo } = require('playwright-video');
const fs = require('fs');
const path = require('path');

async function recordAppDemo() {
  const browser = await chromium.launch({ 
    headless: false,
    args: ['--start-maximized']
  });
  
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 1,
    recordVideo: {
      dir: path.join(__dirname, 'video-recordings'),
      size: { width: 1920, height: 1080 }
    }
  });
  
  const page = await context.newPage();
  
  // Create video recordings directory
  const videoDir = path.join(__dirname, 'video-recordings');
  if (!fs.existsSync(videoDir)) {
    fs.mkdirSync(videoDir, { recursive: true });
  }

  const baseUrl = 'http://localhost:3000';
  
  try {
    console.log('🎬 Starting Carevo app demonstration recording...');
    
    // 1. Login Flow
    console.log('📱 Recording login flow...');
    await page.goto(`${baseUrl}/login`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000); // Pause for viewer to see
    
    // Fill phone number
    await page.fill('input[placeholder*="phone"], input[type="tel"]', '+1 (555) 123-4567');
    await page.waitForTimeout(1000);
    
    // Submit and go to OTP
    await page.click('button[type="submit"]');
    await page.waitForTimeout(2000);
    
    // Fill OTP
    await page.fill('input[placeholder*="code"], input[type="text"]', '000000');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(3000);

    // 2. Main Board Demo
    console.log('📋 Recording main board functionality...');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // Show task cards and interactions
    const taskCards = await page.locator('[data-testid="task-card"], .task-card, [role="button"]').first();
    if (await taskCards.count() > 0) {
      await taskCards.hover();
      await page.waitForTimeout(1000);
      await taskCards.click();
      await page.waitForTimeout(2000);
      await page.keyboard.press('Escape'); // Close drawer
      await page.waitForTimeout(1000);
    }
    
    // Show filters
    const filterButton = page.locator('button:has-text("Filter"), [data-testid="filter-button"]').first();
    if (await filterButton.count() > 0) {
      await filterButton.click();
      await page.waitForTimeout(1000);
      await filterButton.click(); // Close
      await page.waitForTimeout(500);
    }

    // 3. Command Palette Demo
    console.log('⌨️ Recording command palette...');
    await page.keyboard.press('Control+k');
    await page.waitForTimeout(2000);
    await page.keyboard.press('Escape');
    await page.waitForTimeout(1000);

    // 4. User Dropdown Demo
    console.log('👤 Recording user dropdown...');
    const userButton = page.locator('[aria-label*="User menu"], .user-dropdown, button:has-text("Dr. Sarah Smith")').first();
    if (await userButton.count() > 0) {
      await userButton.click();
      await page.waitForTimeout(2000);
      await page.keyboard.press('Escape');
      await page.waitForTimeout(1000);
    }

    // 5. Chat Interface Demo
    console.log('💬 Recording chat interface...');
    await page.goto(`${baseUrl}/chat`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // Type a message
    const messageInput = page.locator('textarea[placeholder*="message"], input[placeholder*="message"]').first();
    if (await messageInput.count() > 0) {
      await messageInput.fill('Hello team! @Dr. Smith can you review this patient case?');
      await page.waitForTimeout(2000);
      await messageInput.clear();
      await page.waitForTimeout(1000);
    }

    // 6. My Tasks Demo
    console.log('✅ Recording my tasks page...');
    await page.goto(`${baseUrl}/my`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // 7. Admin Panel Demo
    console.log('⚙️ Recording admin panel...');
    await page.goto(`${baseUrl}/admin`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // Switch tabs
    const locationsTab = page.locator('button:has-text("Locations")').first();
    if (await locationsTab.count() > 0) {
      await locationsTab.click();
      await page.waitForTimeout(2000);
    }
    
    const securityTab = page.locator('button:has-text("Security")').first();
    if (await securityTab.count() > 0) {
      await securityTab.click();
      await page.waitForTimeout(2000);
    }

    // 8. Profile Page Demo
    console.log('👤 Recording profile page...');
    await page.goto(`${baseUrl}/profile`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // 9. Mobile Responsive Demo
    console.log('📱 Recording mobile view...');
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(`${baseUrl}/board`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    await page.goto(`${baseUrl}/chat`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // 10. Logout Demo
    console.log('🚪 Recording logout flow...');
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto(`${baseUrl}/logout`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    console.log('✅ Recording completed successfully!');
    
    // Get video path
    const videoPath = await page.video().path();
    console.log(`📹 Video saved to: ${videoPath}`);
    
    return videoPath;

  } catch (error) {
    console.error('❌ Error during recording:', error);
  } finally {
    await browser.close();
  }
}

// Run the recording
recordAppDemo().then((videoPath) => {
  if (videoPath) {
    console.log(`🎉 Demo video created: ${videoPath}`);
    console.log('📝 You can now use this video for your marketing materials!');
  }
}).catch(console.error);
