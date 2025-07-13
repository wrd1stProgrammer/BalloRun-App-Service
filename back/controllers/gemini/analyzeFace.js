require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const runVisionWithModel = require('./runVision');                 // Google Cloud Vision util
const parseFaceAnalysis = require('../../utils/parseFaceAnalysis');

/*────────────────────────────────────────────────────────
 1) 모델 선택: gemini‑1.5‑flash (멀티모달, 저비용)
   · Pro 대비 10배 저렴, Latency ↓
   · Vision API로 1차 특징 추출 후 “점수화 + 요약” 용도로 충분
────────────────────────────────────────────────────────*/
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const primaryVision = genAI.getGenerativeModel({
  model: 'gemini-1.5-flash',
  generationConfig: { responseMimeType: 'text/plain' },
});
const fallbackVision = genAI.getGenerativeModel({
  model: 'gemini-2.0-flash-lite',
  generationConfig: { responseMimeType: 'text/plain' },
});

/*────────────────────────────────────────────────────────
 2) 얼굴 분석 컨트롤러
────────────────────────────────────────────────────────*/
/**
 * POST  /gemini/analyzeface
 * body  { imageResponse<string>, sex<'남'|'여'>, lang<'ko'|'en'|'ja'|'zh'|'vi'> }
 */
exports.analyzeFace = async (req, res) => {
  try {
    const { imageResponse, sex, lang } = req.body;

    /*───────────────────────────────────────────────
      2‑1. 분석 프롬프트
        · Vision 특징 + 이미지 + 성별 + 언어 모두 고려
        · 5항목 점수 + total (6필드) JSON ONLY
        · desc 필드는 최소 15자 이상, 유머러스한 톤으로 작성
        · 1) 만약 특정 수치가 N퍼센트라면,
            그 수치가 나온 이유를 '테토' 또는 '에겐' 성향과 연관 지어 설명하고,
            유머를 섞어도 OK
    ───────────────────────────────────────────────*/
    const facePrompt = `
# ROLE
You are an expert "Face Analysis AI" that converts raw face features into 5 scores (0-100) and a rich summary (total). You MUST output exactly six JSON fields described below.
Make each "desc" at least 15 characters long and write them in a humorous tone. If a score is N percent, explain why that N% came out by relating it to Teto or Egen tendencies, and feel free to mix in humor.
또한 0-100 수치는 일의 자리까지 디테일하게 부탁할게# INPUT
- Language: ${lang}  // ko=Korean, en=English, ja=Japanese, zh=Chinese, vi=Vietnamese
- Gender: ${sex}    // 남=male, 여=female
- vision_json: <Google Vision API landmarks, faceDetection, safeSearch, dominantColors etc. will be appended below>

# EVALUATION POLICY  (How to score 0-100)
1. **face_shape**
   • Angular jawline & sharp eyes ⇒ score ↑ toward 테토 (90-100)
   • Rounded chin & soft eyes ⇒ score ↓ toward 에겐 (0-10)
2. **expression** (facial expression)
   • Neutral/angry/strong ⇒ 테토 ↑
   • Smiling/soft ⇒ 에겐 ↑
3. **physiognomy** (overall vibe vs. celebrities)
   • Powerful/charismatic vibe ⇒ 테토 ↑
   • Friendly/cute vibe ⇒ 에겐 ↑
4. **style**
   • Use **gender** to interpret hair/clothes
   • Close-up portrait rules & full-body rules as before
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
# The 6 outputs must be translated according to ${lang}
{
  "expression":   { "score": <int0-100>, "desc": "<min 15 chars>" },
  "face_shape":  { "score": <int>,      "desc": "<min 15 chars>" },
  "atmosphere":  { "score": <int>,      "desc": "<min 15 chars>" },
  "style":       { "score": <int>,      "desc": "<min 15 chars>" },
  "physiognomy": { "score": <int>,      "desc": "<min 15 chars>" },
  "total":       { "desc": "<Summary in ${lang},2-3 sentences, 60 chars max, mention tendency and key evidence>" }
}

⚠️ Rules:
- NO extra keys/text. 6 fields only.
- If any field is missing or desc < 15 chars, response is INVALID.
    `.trim();

    // 2‑2. Vision API + Gemini 호출
    let visionRaw;
    try {
      visionRaw = await runVisionWithModel(primaryVision, facePrompt, imageResponse);
    } catch (err) {
      if (err.status === 503) {
        console.warn('[analyzeFace] primary model overloaded, retrying with fallback');
        visionRaw = await runVisionWithModel(fallbackVision, facePrompt, imageResponse);
      } else {
        throw err;
      }
    }

    // 2‑3. JSON 파싱 & 검증
    const scores = parseFaceAnalysis(visionRaw);

    return res.status(200).json(scores);
  } catch (err) {
    console.error('[analyzeFace] Error →', err);
    return res.status(500).json({ message: '페이스 분석 실패' });
  }
};
