const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require("@google/generative-ai");
const { GoogleAIFileManager } = require("@google/generative-ai/server");

const apiKey = "AIzaSyAKZu103BnT-tNKvnVT6bGpBA-1INoFdAk";
const genAI = new GoogleGenerativeAI(apiKey);
const fileManager = new GoogleAIFileManager(apiKey);

const getMetadata = async (imagePath) => {
  try {
    return new Promise(async (resolve, reject) => {
      try {
        // Upload file to Gemini
        const uploadToGemini = async (path, mimeType) => {
          const uploadResult = await fileManager.uploadFile(path, {
            mimeType,
            displayName: path,
          });
          const file = uploadResult.file;
          console.log(`Uploaded file ${file.displayName} as: ${file.name}`);
          return file;
        };

        const model = genAI.getGenerativeModel({
          model: "gemini-2.0-flash-exp",
        });

        const generationConfig = {
          temperature: 1,
          topP: 0.95,
          topK: 40,
          maxOutputTokens: 8192,
          responseMimeType: "text/plain",
        };

        const files = [
          await uploadToGemini(`${imagePath}`, "image/png"),
        ];

        const chatSession = model.startChat({
          generationConfig,
          history: [
            {
              role: "user",
              parts: [
                {
                  fileData: {
                    mimeType: files[0].mimeType,
                    fileUri: files[0].uri,
                  },
                },
                {
                  text: "this image is the screen shot of a post made on a social web platform , your job is to return me a object having key value pairs , the object should include keys like - title, description, keywords, platform . Value for title key should be string , obtain the value from this post, Value for description key should also be a string with words limit under 30 get the value for description from the provided image, the value for platform key is a string which should mention in one word the name of the social platform, the Keyword key has an array value which stores top 5-10 most important Keywords found in the post , which implies in best way whats the post is about , get the value from keyword key also from the image provided, also add the title and description string values in keywords"
                },
              ],
            },
          ],
        });

        const user_prompt = "this image is the screen shot of a post made on a social web platform , your job is to return me a object having key value pairs , the object should include keys like - title, description, keywords, platform . Value for title key should be string , obtain the value from this post, Value for description key should also be a string with words limit under 30 get the value for description from the provided image, the value for platform key is a string which should mention in one word the name of the social platform, the Keyword key has an array value which stores top 5-10 most important Keywords found in the post , which implies in best way whats the post is about , get the value from keyword key also from the image provided, also add the title and description string values in keywords";
        
        const result = await chatSession.sendMessage(user_prompt);
        let aianswer = result.response.text();
        let cleanJsonData = JSON.parse(aianswer.substring(8, aianswer.length - 4));
        
        resolve([true, cleanJsonData]);
      } catch (error) {
        console.error('Error in getMetadata:', error);
        reject([false, error]);
      }
    });
  } catch (err) {
    console.error('Outer error in getMetadata:', err);
    return [false, err];
  }
};

module.exports = getMetadata;