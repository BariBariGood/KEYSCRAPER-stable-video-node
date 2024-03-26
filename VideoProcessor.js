const ffmpeg = require("ffmpeg");
const path = require("path");
const fs = require("fs");
const sanitize = require("sanitize-filename");
const axios = require("axios");

class VideoProcessor {
  static NUM_FRAMES = 20
  static SIZE = 512 // Must be divisible by 8!
  
  constructor(videoName) {
    videoName = sanitize(videoName);
    
    console.log(`[+] ${videoName}: Creating VideoProcessor`);
    
    this.videoName = videoName;
    this.videoPath = path.join(__dirname, "videos", videoName);
    this.framesPath = path.join(__dirname, "frames", path.parse(videoName).name);
  }

  async split() {
    const {videoName, videoPath, framesPath} = this;

    if (!fs.existsSync(videoPath)) {
      throw new Error(`[-] ${videoName}: Video at path "${videoPath}" does not exist`);
    }
    if (!fs.existsSync(framesPath)) {
      console.log(`[+] ${videoName}: Creating directory for frames at "${framesPath}"`);
      fs.mkdirSync(framesPath, {recursive: true});
    }
    
    this.video = await new ffmpeg(videoPath)
      .then(async video => {
        const size = VideoProcessor.SIZE + "x" + VideoProcessor.SIZE;

        // The number of frames isn't exact... this is because of how the
        // `node-ffmpeg` library handles `every_n_percentage`, see line
        // 809 of:
        // https://github.com/damianociarla/node-ffmpeg/blob/master/lib/video.js
        const every_n_percentage = 100 / VideoProcessor.NUM_FRAMES;
        
        console.log(`[+] ${videoName}: Extracting frames from video to "${framesPath}"`);
        await video.fnExtractFrameToJPG(framesPath, {every_n_percentage, size})
          .then(() => {
            console.log(`[+] ${videoName}: Extracted frames from video to "${framesPath}"`);
          })
          .catch(console.error);

        return video;
      })
      .catch(console.error);
  }

  async convert() {
    const {framesPath, width, height} = this;

    const frames = fs.readdirSync(framesPath);
    await Promise.all(frames.map(filename => {
      return new Promise(async (resolve, reject) => {
        const staticPath = path.join(__dirname, "frames");
        const framePath = path.join(framesPath, filename);
        const publicPath = path.join("frames", path.relative(staticPath, framePath));
        
        const prompt = "a cat sitting on a bench";
        
        const body = {
          key: process.env.STABLE_DIFFUSION_KEY,
          prompt,
          init_image: "https://stable-video-node.ivandel6.repl.co/" + publicPath, // TODO: Test ./ instead of URL
          width: VideoProcessor.SIZE, 
          height: VideoProcessor.SIZE,
          samples: 1,
          num_inference_steps: 30,
          safety_checker: "no",
          enhance_prompt: "yes",
          guidance_scale: 7.5,
          strength: 0.7
        };
    
        const headers = {
          "Content-Type": "application/json"
        };
    
        await axios.post("https://stablediffusionapi.com/api/v3/img2img", body, {headers})
          .then(console.log)
          .catch(console.error);
        
        resolve();
      });
    }));
  }

  async join() {
    
  }

  async process() {
    await this.split();
    await this.convert();
    await this.join();
  }
}

module.exports = {VideoProcessor};