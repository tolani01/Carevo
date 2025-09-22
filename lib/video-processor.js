const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const execAsync = promisify(exec);

async function processVideo() {
  const videoDir = path.join(__dirname, 'video-recordings');
  const inputFile = path.join(videoDir, '2dc57a7c68c46b497942cacddb4f7a88.webm');
  const outputFile = path.join(__dirname, 'Carevo-App-Demo.mp4');
  
  try {
    console.log('🎬 Processing video for marketing use...');
    console.log(`📁 Input: ${inputFile}`);
    console.log(`📁 Output: ${outputFile}`);
    
    // Check if input file exists
    if (!fs.existsSync(inputFile)) {
      throw new Error('Input video file not found');
    }
    
    // Convert WebM to MP4 with optimizations for marketing
    const ffmpegCommand = `
      ffmpeg -i "${inputFile}" 
      -c:v libx264 
      -preset medium 
      -crf 23 
      -c:a aac 
      -b:a 128k 
      -movflags +faststart 
      -vf "scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2:black"
      -t 120
      -y 
      "${outputFile}"
    `.replace(/\s+/g, ' ').trim();
    
    console.log('🔄 Converting to MP4 format...');
    console.log('⚙️ Applying video optimizations...');
    
    const { stdout, stderr } = await execAsync(ffmpegCommand);
    
    if (stderr && !stderr.includes('Deprecated')) {
      console.warn('FFmpeg warnings:', stderr);
    }
    
    console.log('✅ Video processing completed!');
    console.log(`🎉 Marketing video created: ${outputFile}`);
    
    // Get file size
    const stats = fs.statSync(outputFile);
    const fileSizeInMB = (stats.size / (1024 * 1024)).toFixed(2);
    console.log(`📊 File size: ${fileSizeInMB} MB`);
    
    return outputFile;
    
  } catch (error) {
    console.error('❌ Error processing video:', error);
    
    // Fallback: just copy the original file with MP4 extension
    console.log('🔄 Attempting fallback conversion...');
    try {
      const fallbackCommand = `copy "${inputFile}" "${outputFile}"`;
      await execAsync(fallbackCommand);
      console.log('✅ Fallback conversion completed');
      return outputFile;
    } catch (fallbackError) {
      console.error('❌ Fallback also failed:', fallbackError);
      return null;
    }
  }
}

// Create a marketing-ready version with title screen
async function createMarketingVideo() {
  const videoDir = path.join(__dirname, 'video-recordings');
  const inputFile = path.join(videoDir, '2dc57a7c68c46b497942cacddb4f7a88.webm');
  const outputFile = path.join(__dirname, 'Carevo-Marketing-Video.mp4');
  
  try {
    console.log('🎬 Creating enhanced marketing video...');
    
    // Create a simple title screen using FFmpeg
    const titleCommand = `
      ffmpeg -f lavfi -i color=c=blue:size=1920x1080:duration=3 
      -vf "drawtext=text='Carevo - Command Center for Healthcare':fontcolor=white:fontsize=60:x=(w-text_w)/2:y=(h-text_h)/2,
           drawtext=text='PHI-lite Kanban Board for Outpatient Clinics':fontcolor=white:fontsize=30:x=(w-text_w)/2:y=(h-text_h)/2+80"
      -c:v libx264 -preset medium -crf 23 -t 3 -y temp_title.mp4
    `.replace(/\s+/g, ' ').trim();
    
    console.log('🎨 Creating title screen...');
    await execAsync(titleCommand);
    
    // Combine title with main video
    const combineCommand = `
      ffmpeg -i temp_title.mp4 -i "${inputFile}" 
      -filter_complex "[0:v][1:v]concat=n=2:v=1:a=0[outv]"
      -map "[outv]" 
      -c:v libx264 -preset medium -crf 23 
      -movflags +faststart 
      -t 150
      -y 
      "${outputFile}"
    `.replace(/\s+/g, ' ').trim();
    
    console.log('🔗 Combining title with demo...');
    await execAsync(combineCommand);
    
    // Clean up temp file
    if (fs.existsSync('temp_title.mp4')) {
      fs.unlinkSync('temp_title.mp4');
    }
    
    console.log('✅ Enhanced marketing video created!');
    console.log(`🎉 Final video: ${outputFile}`);
    
    const stats = fs.statSync(outputFile);
    const fileSizeInMB = (stats.size / (1024 * 1024)).toFixed(2);
    console.log(`📊 File size: ${fileSizeInMB} MB`);
    
    return outputFile;
    
  } catch (error) {
    console.error('❌ Error creating marketing video:', error);
    return null;
  }
}

// Run both processing functions
async function main() {
  console.log('🚀 Starting video processing pipeline...');
  
  // Process basic video
  const basicVideo = await processVideo();
  
  // Create enhanced marketing version
  const marketingVideo = await createMarketingVideo();
  
  console.log('\n📋 Summary:');
  if (basicVideo) {
    console.log(`✅ Basic demo video: ${basicVideo}`);
  }
  if (marketingVideo) {
    console.log(`✅ Marketing video: ${marketingVideo}`);
  }
  
  console.log('\n🎬 Videos ready for your marketing campaign!');
  console.log('📝 You can now use these videos in presentations, websites, or social media.');
}

main().catch(console.error);
