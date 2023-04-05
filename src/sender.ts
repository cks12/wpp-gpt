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

    private async onMessage(msg: venom.Message) {
        const client = msg.from;
        if(msg.isMMS) return await this.sendMsg(client, "> Bem vindo a assistente desenvolvida pelo Caio Caik Fresneda de Souza faça a sua pergunta e logo ela sera respondida");
        if(msg.isMedia) return await this.sendMsg(client, "> Suporte a media não fornecido ainda");
        if(msg.isNotification) return;
        if(!msg.isNewMsg || msg.isPSA) return this.sendMsg(client, "> a gente não trabalha com isso ainda");
        const GPT_prompt = msg.body;
        await this.sendMsg(client, "> Estou processando a sua msg");
        
        const GPT_Response = await this.generateresponse(GPT_prompt) as string;

        await this.sendMsg(client,GPT_Response);
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