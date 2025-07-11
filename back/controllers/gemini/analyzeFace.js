// controllers/faceController.js
require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const runVision = require('./runVision');                 // Google Cloud Vision util
const parseFaceAnalysis = require('../../utils/parseFaceAnalysis');

/*────────────────────────────────────────────────────────
 1) 모델 선택: gemini‑1.5‑flash (멀티모달, 저비용)
   · Pro 대비 10배 저렴, Latency ↓
   · Vision API로 1차 특징 추출 후 “점수화 + 요약” 용도로 충분
────────────────────────────────────────────────────────*/
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const textModel = genAI.getGenerativeModel({
  model: 'gemini-1.5-flash',
  generationConfig: { responseMimeType: 'text/plain' },
});

/*────────────────────────────────────────────────────────
 2) 얼굴 분석 컨트롤러
────────────────────────────────────────────────────────*/
/**
 * POST  /gemini/analyzeface
 * body  { imageResponse<string>, sex<'남'|'여'> }
 */
exports.analyzeFace = async (req, res) => {
  try {
    const { imageResponse, sex , lang} = req.body; // Cloudinary URL & 성별
    // ko en ja zh vi

    /*───────────────────────────────────────────────
      2‑1. 분석 프롬프트
        · Vision 특징 + 이미지 + 성별(남/여) 모두 고려
        · 5항목 점수 + total (6필드) JSON ONLY
    ───────────────────────────────────────────────*/
    const facePrompt = `
# ROLE
You are an expert "Face Analysis AI" that converts raw face features into 5 scores (0‑100) and a rich summary (total). You MUST output **exactly six JSON fields** described below.
또한 0-100 수치는 일의 자리까지 디테일하게 부탁할게

# INPUT
# INPUT
- Language: ${lang}  // ko=Korean, en=English, ja=Japanese, zh=Chinese, vi=Vietnamese
- Gender: ${sex}    // 남=male, 여=female
- vision_json: <Google Vision API landmarks, faceDetection, safeSearch, dominantColors etc. will be appended below>

# EVALUATION POLICY  (How to score 0‑100)
1. **face_shape**
   • Angular jawline & sharp eyes ⇒ score ↑ toward 테토 (90‑100)
   • Rounded chin & soft eyes ⇒ score ↓ toward 에겐 (0‑10)
2. **expression** (facial expression)
   • Neutral/angry/strong ⇒ 테토 ↑
   • Smiling/soft ⇒ 에겐 ↑
3. **physiognomy** (overall vibe vs. celebrities)
   • Powerful / charismatic celebrity vibe ⇒ 테토 ↑
   • Friendly / cute vibe ⇒ 에겐 ↑
4. **style** (hair ◇ clothes) — *Use **gender** to interpret correctly*
   • IF close‑up portrait:
       – Male: short hair exposing forehead & brows ⇒ 테토 ↑
       – Male: long fringe covering face ⇒ 에겐 ↑
       – Female: slick ponytail / bob exposing facial line ⇒ 테토 ↑
       – Female: full bangs / big waves covering cheeks ⇒ 에겐 ↑
   • IF upper‑body/full‑body:
       – Loud, colorful, ornate outfit ⇒ 에겐 ↑
       – Simple, modern, tailored outfit ⇒ 테토 ↑
   • Muscular / athletic body (any gender) ⇒ 테토 ↑
5. **atmosphere** (combined style + expression)
   • Strong / chic / intense ⇒ 테토 ↑
   • Gentle / warm / soft ⇒ 에겐 ↑

*Score 50 means neutral. Use Vision landmarks (mouth curve, eye openness, color tone) + gender rules above.*

# OUTPUT FORMAT  🔴 JSON ONLY, EXACTLY 6 FIELDS  🔴
{
  "expression":   { "score": <int0‑100>, "desc": "<≤15자>" },
  "face_shape":   { "score": <int>,       "desc": "<≤15자>" },
  "atmosphere":  { "score": <int>,       "desc": "<≤15자>" },
  "style":        { "score": <int>,       "desc": "<≤15자>" },
  "physiognomy":  { "score": <int>,       "desc": "<≤15자>" },
  "total":        { "desc" : "<Summary in ${lang}, 2-3 sentences, 60 chars max, mention tendency and key evidence>"}
}

⚠️ Rules:
- NO extra keys / text. 6 fields only.
- If any field is missing, response is INVALID.
    `.trim();

    // 2‑2. Vision API + Gemini 호출
    const visionRaw = await runVision(facePrompt, imageResponse);

    // 2‑3. JSON 파싱 & 검증
    const scores = parseFaceAnalysis(visionRaw);

    return res.status(200).json(scores);
  } catch (err) {
    console.error('[analyzeFace] Error →', err);
    return res.status(500).json({ message: '페이스 분석 실패' });
  }
};
