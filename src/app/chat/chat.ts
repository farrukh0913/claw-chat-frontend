import { Component, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

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
export class ChatComponent {
  userMessage: string = '';
  messages: Message[] = [];
  whatsappResponses: Message[] = [];

  constructor(private cd: ChangeDetectorRef) {}

  // Send message handler
  sendMessage() {
    if (!this.userMessage.trim()) return;

    // Add user message
    this.messages.push({ from: 'User', text: this.userMessage });

    // Send to backend or handle locally
    this.sendToBackend(this.userMessage);

    // Clear input
    this.userMessage = '';
  }

  // Handle backend or local bot logic
  async sendToBackend(message: string) {
    try {
      let botReply = '';

      // Local check for 2+2
      if (message.trim() === '2+2') {
        botReply = 'The answer to 2+2 is... (drumroll please)... 4!';
      } else {
        // Send message to backend
        const res = await fetch('http://localhost:3000/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message })
        });
        const data = await res.json();
        console.log('Backend response:', data);
        botReply = data.reply || 'No reply from backend.';
      }

      // Add bot reply with optional delay (simulate thinking)
      setTimeout(() => {
        this.messages.push({ from: 'Bot', text: botReply });
        this.cd.detectChanges(); // Force UI update
      }, 500);

    } catch (err) {
      console.error(err);
      setTimeout(() => {
        this.messages.push({ from: 'Bot', text: 'Error sending message.' });
        this.cd.detectChanges();
      }, 0);
    }
  }

  // Start WhatsApp bot
  async startWhatsApp() {
    try {
      const res = await fetch('http://localhost:3000/api/whatsapp/start', {
        method: 'POST'
      });
      const data = await res.json();

      // Display system message
      this.whatsappResponses.push({ from: 'System', text: data.message });
      this.cd.detectChanges();
    } catch (err) {
      console.error(err);
      this.whatsappResponses.push({ from: 'System', text: 'Failed to start WhatsApp bot.' });
      this.cd.detectChanges();
    }
  }
}