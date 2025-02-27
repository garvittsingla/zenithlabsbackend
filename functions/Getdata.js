const {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
  } = require("@google/generative-ai");
  

const getKeywords = async(prompt,tags) => {
    let Ask_ai_input = "give me a instagram post about some stampede"
let tags_array = ["elon musk", "bitcoin", "mercedes", "lewis hamilton", "15 billion", "apple", "prayagraj stampede"]


  const apiKey = "AIzaSyAKZu103BnT-tNKvnVT6bGpBA-1INoFdAk";
  const genAI = new GoogleGenerativeAI(apiKey);
  
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
  });
  
  const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
  };
  
  async function run() {
    const chatSession = model.startChat({
      generationConfig,
      history: [
        {
          role: "user",
          parts: [
            {text: "give me only similar words (not even a single text more than the similar words) that coincide with the meaning of this given string - \" give me the post from instagram about F1 Racing\" from a bucket of these words = [ \"elon musk\", \"cyber Truck\", \"15 billion\", \"SemiConductor\", \"Apple\", \"Lewis Hamilton\", \"Mercedes\"], do strict checkes on the tag, none of the tag should be extra or non relavant to prompt, but if you dont find anything related to the bocket of words provided then return null"},
          ],
        },
        {
          role: "model",
          parts: [
            {text: "[\"Lewis Hamilton\", \"Mercedes\", \"instagram\"]\n"},
          ],
        },
      ],
    });
    
    const user_input = `give me only similar words (not even a single text more than the similar words) that coincide with the meaning of this given string - ${prompt} from a bucket of these words = ${tags} do strict checkes on the tag, none of the tag should be extra or non relavant to prompt,give the things only in prompt dont add something else ,give the things only in prmpt dont add something else but if you dont find anything related to the bucket of words provided then return null`
    const result = await chatSession.sendMessage(user_input);
    // console.log(result.response.text())
    return result.response.text();
  }

  try {
    const result = await run();
    return result;
  } catch (error) {
    console.error('Error in getKeywords:', error);
    return null;
  }
}

module.exports = getKeywords