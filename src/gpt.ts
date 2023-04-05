import * as dotenv from 'dotenv'
dotenv.config();
import { Configuration, CreateChatCompletionRequest, OpenAIApi } from "openai";

class Chat {
    private config: Configuration;
    private openai: OpenAIApi;

    constructor(){
        this.config = new Configuration(
            {
                apiKey: process.env.OPENAI_API_KEY,
                organization: process.env.OPENAI_ORG
            }
        );
    }

    public async gpt_initialize(){
        this.openai = new OpenAIApi(this.config);
    }

    public async generateresponse(p: string) {
        const responseConfig: CreateChatCompletionRequest = {
            model:"gpt-3.5-turbo",
            messages:[{"content":p,"role":"user"}],
            temperature: 0.7,
        };

        const response = await this.openai.createChatCompletion(responseConfig);
        return response.data.choices[0].message?.content;
    }
}

export default Chat;