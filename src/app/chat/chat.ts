import { Component, ChangeDetectorRef, AfterViewChecked, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { UserService } from '../services/user.service';
import { Environment } from '../environment';

interface Message {
  from: string;
  text: string;
}

@Component({
  selector: 'app-chat',
  templateUrl: './chat.html',
  styleUrls: ['./chat.css'],
  standalone: true,
  imports: [FormsModule, HttpClientModule, CommonModule]
})

export class ChatComponent implements AfterViewChecked {
  userMessage: string = '';
  messages: Message[] = [];
  whatsappResponses: Message[] = [];

  @ViewChild('chatBox') chatBox!: ElementRef<HTMLDivElement>;

  constructor(private cd: ChangeDetectorRef, private userService: UserService) {}

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  ngOnInit() {
    this.userService.test$.subscribe((value) => {
      console.log('test value: in ChatComponent', value);
    });
  }

  scrollToBottom() {
    if (this.chatBox) {
      this.chatBox.nativeElement.scrollTop = this.chatBox.nativeElement.scrollHeight;
    }
  }

  sendMessage() {
    if (!this.userMessage.trim()) return;

    this.messages.push({ from: 'User', text: this.userMessage });
    this.sendToBackend(this.userMessage);
    this.userMessage = '';
  }

  async sendToBackend(message: string) {
    try {
      let botReply = '';

      if (message.trim() === '2+2') {
        botReply = 'The answer to 2+2 is... (drumroll please)... 4!';
      } else {
        const res = await fetch(Environment.API_URL + 'chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message })
        });
        const data = await res.json();
        botReply = data.reply || 'No reply from backend.';
      }

      setTimeout(() => {
        this.messages.push({ from: 'Bot', text: botReply });
        this.cd.detectChanges();
        this.scrollToBottom(); // ensure scroll on bot message
      }, 500);

    } catch (err) {
      console.error(err);
      setTimeout(() => {
        this.messages.push({ from: 'Bot', text: 'Error sending message.' });
        this.cd.detectChanges();
        this.scrollToBottom();
      }, 0);
    }
  }

  async startWhatsApp() {
    try {
      const res = await fetch(Environment.API_URL + 'whatsapp/start', { method: 'POST' });
      const data = await res.json();
      this.whatsappResponses.push({ from: 'System', text: data.message });
      this.cd.detectChanges();
      this.scrollToBottom(); // scroll even for system messages
    } catch (err) {
      console.error(err);
      this.whatsappResponses.push({ from: 'System', text: 'Failed to start WhatsApp bot.' });
      this.cd.detectChanges();
      this.scrollToBottom();
    }
  }
}