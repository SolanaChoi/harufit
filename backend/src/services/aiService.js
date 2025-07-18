// backend/src/services/aiService.js
const OpenAI = require('openai');
const dotenv = require('dotenv');
dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// ✅ AI의 호칭 관련 지침을 시스템 프롬프트에 추가
const systemPrompt = `당신은 사용자의 건강을 책임지는 AI 코치입니다. 스스로를 '하루핏 매니저'라고 칭하세요. 단, AI 기술, 데이터 분석 등 기술적인 측면을 강조해야 할 때는 '하루핏 AI 매니저'라고 칭할 수 있습니다. 항상 친절하고 동기를 부여하는 말투로 대화하세요.
사용자의 메시지에서 식단이나 운동 기록을 발견하면, 자연스러운 대화 응답을 먼저 하세요.
그 다음, **줄을 바꾸고 반드시 \`[DATA_START]\`와 \`[DATA_END]\` 사이에** 추출한 정보를 JSON 형식으로 추가하세요.
JSON 데이터가 없다면 \`[DATA_START]\` 블록을 포함하지 마세요.

- 식단 JSON: {"type": "diet", "food": "음식 이름", "calories": 숫자}
- 운동 JSON: {"type": "workout", "exercise": "운동 이름", "duration": 숫자(분), "calories_burned": 숫자}

예시 1:
사용자: 오늘 닭가슴살 샐러드 먹고 스쿼트 30분 했어.
당신: 닭가슴살 샐러드와 스쿼트, 정말 건강한 하루를 보내셨네요! 꾸준함이 중요해요.
[DATA_START]
{"type": "diet", "food": "닭가슴살 샐러드", "calories": 350}
[DATA_END]
[DATA_START]
{"type": "workout", "exercise": "스쿼트", "duration": 30}
[DATA_END]

예시 2:
사용자: 너무 피곤해요 ㅠㅠ
당신: 많이 피곤하시군요. 그럴 땐 무리하지 않고 충분히 휴식을 취하는 것도 중요해요. 내일 더 힘내면 되죠!
`;

exports.getAiChatResponse = async (userMessage, history, userContext) => {
    try {
        const messages = [
            { role: "system", content: systemPrompt },
            ...history, // 이전 대화 기록 (프론트엔드에서 전달)
            { role: "user", content: `(참고: 내 닉네임은 ${userContext.nickname}이고, 목표 체중은 ${userContext.targetWeight || '미설정'}kg이야) ${userMessage}` }
        ];

        const chatCompletion = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: messages,
        });

        const fullResponse = chatCompletion.choices[0].message.content;

        // AI 응답에서 대화와 데이터를 분리하는 로직
        const conversationalReply = fullResponse.split('[DATA_START]')[0].trim();
        const extractedData = [];
        
        const dataRegex = /\[DATA_START\]([\s\S]*?)\[DATA_END\]/g;
        let match;
        while ((match = dataRegex.exec(fullResponse)) !== null) {
            try {
                extractedData.push(JSON.parse(match[1].trim()));
            } catch (e) {
                console.error("JSON 파싱 오류:", e);
            }
        }

        return {
            conversationalReply, // 사용자에게 보여줄 순수 대화
            extractedData: extractedData.length > 0 ? extractedData : null, // 서버에서 처리할 데이터
        };

    } catch (error) {
        console.error('AI 응답 생성 중 오류 발생:', error);
        throw new Error('하루핏 AI 매니저의  응답 생성에 실패했습니다.');
    }
};


// getNutritionEstimate 함수는 그대로 유지됩니다.
exports.getNutritionEstimate = async (foodName) => {
    try {
        const prompt = `${foodName}의 일반적인 1회 제공량(또는 100g 기준)에 대한 칼로리(kcal), 단백질(g), 탄수화물(g), 지방(g)을 JSON 형식으로 알려줘. 정확한 숫자만 포함하고, 불필요한 설명은 제외해줘.
    예시: {"calories": 150, "protein": 10, "carbs": 20, "fat": 5}`;

        const chatCompletion = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                { role: "user", content: prompt }
            ],
            response_format: { type: "json_object" },
        });

        const text = chatCompletion.choices[0].message.content;
        const parsed = JSON.parse(text);

        return {
            calories: parseFloat(parsed.calories) || 0,
            protein: parseFloat(parsed.protein) || 0,
            carbs: parseFloat(parsed.carbs) || 0,
            fat: parseFloat(parsed.fat) || 0,
        };

    } catch (error) {
        console.error('OpenAI를 통한 영양 정보 추정 중 오류 발생:', error);
        throw new Error("식품 영양성분 정보를 가져오는 데 실패했습니다.");
    }
};