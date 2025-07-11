const axios = require('axios');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const vision = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

/**
 * Vision API를 사용하여 프롬프트와 이미지를 전송하고 결과 텍스트를 반환합니다.
 */
module.exports = async function runVision(prompt, imageUrl) {
  // 이미지 다운로드 및 base64 인코딩
  const { data: buffer, headers } = await axios.get(imageUrl, { responseType: 'arraybuffer' });
  const mimeType = headers['content-type'] || 'image/jpeg';
  const b64 = Buffer.from(buffer).toString('base64');

  // Vision generateContent 호출
  const result = await vision.generateContent([
    { text: prompt },
    {
      inlineData: {
        mimeType,
        data: b64,
      },
    },
  ]);

  return result.response.text();
};
