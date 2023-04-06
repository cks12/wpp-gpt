import { isValidNumber, parsePhoneNumber } from 'libphonenumber-js';
import * as venom from 'venom-bot';
import Chat from './gpt';

export type Qrcode ={
    base64Qrimg: string, 
    asciiQR: string, 
    attempts: number, 
    urlCode: string | undefined
}

class Sender extends Chat {
    client: venom.Whatsapp;
    private isConnected: boolean;

    constructor(){
        super();
        this.isConnected = false
    }

    private async onMessage(msg:any) {
        console.log(msg);
        const client = msg.from;


        if (msg.wavForm || msg.hasReaction) return this.sendMsg(client,"> Audios não são surpotados ainda!");

        if (msg.from == "status@broadcast") return this.sendMsg(client,"> status@broadcast");

        
        const GPT_prompt = msg.body;
        
        if (typeof(GPT_prompt) !== "string") return this.sendMsg(client,"> Formato não suportado");
        
        this.client.startTyping(client);
        
        const GPT_Response = await this.generateresponse(GPT_prompt) as string;

        await this.sendMsg(client, GPT_Response);

        this.client.stopTyping(client);
    }

    async sendMsg(to: string, body: string): Promise<void> {
        await this.client.sendText(to, body); 
    }

    private WppStatus(statusSession: string) {
        /* isLogged or notLogged or browserClose or qrReadSuccess or qrReadFail or autocloseCalled or 
            desconnectedMobile or deleteToken or chatsAvailable or deviceNotConnected or serverWssNotConnected 
            or noOpenBrowser or initBrowser or openBrowser or connectBrowserWs or initWhatsapp or erroPageWhatsapp 
            or successPageWhatsapp or waitForLogin or waitChat or successChat or 
            Create session wss return "serverClose" case server for close */ 
        if (!statusSession) return;
        this.isConnected = ["isLogged", "qrReadSuccess","chatsAvailable"].includes(statusSession);
    }

    private WppStart(client: venom.Whatsapp){
        this.client = client;
        
        //inicialização do chat gpt 
        this.gpt_initialize();
        this.client.onMessage((e) => this.onMessage(e));
    }

    public WPPinitialize(): void {
        venom.create('gpt-sender-ws', 
            () => null, 
            e => this.WppStatus(e))
                .then(client => this.WppStart(client))
                .catch(err=> console.error(err));
        
    }
}

export default Sender;