import * as dotenv from 'dotenv'
dotenv.config();
import qrcode from 'qrcode';
import express, { Request, Response } from 'express';
import Sender from './sender';

class Server extends Sender{
    app: express.Application;
    constructor(){
        super();
        this.app = express();
        this.app.use(express.json());
        this.app.get('/',this.getQrcode);
        this.init();

        this.gpt_initialize();

        this.WPPinitialize();
    }

    private init(){
        this.app.listen(3000, () => {
            console.log("server listening on 3000")
        })
    }

    async getQrcode(req: Request, res: Response){
      if(typeof(this.client) == "undefined") return res.status(405);
        const qrcodeUrl = (await this.client.getQrCode()).urlCode;
        const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>QR Code do WhatsApp</title>
      </head>
      <body>
        <img src="${qrcodeUrl}" alt="QR Code do WhatsApp" />
      </body>
    </html>
  `;
    res.send(html);

    }

}

export default Server;

new Server()