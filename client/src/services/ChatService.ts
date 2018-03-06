import { Injectable } from "@angular/core";
import * as io from "socket.io-client";
let img = false;

interface Message {
  mensaje: string;
  type: string;
  isImage: boolean;
}

@Injectable()
export class ChatService {
  public mensajes: Array<Message> = [];
  socket: any;
  constructor() {
    this.socket = io("http://localhost:3000/");
    this.socket.on("connect", () => console.log("Connected to WS"));
    this.socket.on("chat", m => {
      //console.log(m)
      this.mensajes.push({
        mensaje: m.mensaje,
        type: "other",
        isImage: m.isImage
      });
      //console.log(this.mensajes)
      img = this.mensajes[this.mensajes.length - 1].isImage;
      if(this.mensajes[this.mensajes.length - 1].mensaje == 'no' && this.mensajes[this.mensajes.length - 2].mensaje== 'si' ||
      this.mensajes[this.mensajes.length - 1].mensaje == 'no' && this.mensajes[this.mensajes.length - 2].mensaje== 'no'){
        this.mensajes.pop()
      }
    });
  }

  sendMessage(m: string) {
    if (img == true) {
      this.socket.emit("chat-ready", {
        status: "Mensaje recibido",
        mensaje: "ris " + m
      });
    } else {
      this.socket.emit("chat-ready", {
        status: "Mensaje recibido",
        mensaje: m
      });
    }
    this.mensajes.push({
      mensaje: m,
      type: "me",
      isImage: false
    });
  }
}
