const axios = require('axios');

/**
 * Vision 모델 인스턴스 + 프롬프트 + 이미지 URL을 받아서
 * Gemini generateContent 결과 텍스트를 반환합니다.
 *
 * @param visionModel  GoogleGenerativeAI.getGenerativeModel() 반환값
 * @param prompt       분석용 텍스트 프롬프트
 * @param imageUrl     분석할 이미지 URL
 * @returns {Promise<string>}
 */
module.exports = async function runVisionWithModel(visionModel, prompt, imageUrl) {
  // 1) 이미지 다운로드 & Base64 인코딩
  const { data: buffer, headers } = await axios.get(imageUrl, { responseType: 'arraybuffer' });
  const mimeType = headers['content-type'] || 'image/jpeg';
  const b64 = Buffer.from(buffer).toString('base64');

  // 2) Gemini Vision generateContent 호출
  const result = await visionModel.generateContent([
    { text: prompt },
    {
      inlineData: {
        mimeType,
        data: b64,
      },
    },
  ]);

  // 3) 결과 텍스트 반환
  return result.response.text();
};
