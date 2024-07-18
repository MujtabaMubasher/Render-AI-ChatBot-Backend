import Configuration from 'openai';

function configureOpenAI() {
  try {
        const openAiConfig = new Configuration({
        apiKey: process.env.OPEN_AI_SECRET,
        organization: process.env.OPEN_AI_ORGANIZATION_ID,
        });
        return openAiConfig;
  } 
  catch (error) 
  {
        console.log("Enable to configure Open AI", error.message);
  }
}

export {configureOpenAI}