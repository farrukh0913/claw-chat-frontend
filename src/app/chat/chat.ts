import { Component } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.html',
  styleUrls: ['./chat.css'],
  imports: [FormsModule, HttpClientModule, CommonModule,
    FormsModule,
    HttpClientModule]  
})
export class ChatComponent {
  messages: { from: string, text: string }[] = [];
  userMessage: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.sendMessage();
  }

  sendMessage() {
    if (!this.userMessage.trim()) return;

    this.messages.push({ from: 'user', text: this.userMessage });

    this.http.post<{ reply: string }>('http://localhost:3000/api/chat', { message: this.userMessage })
      .subscribe(res => {
        console.log('response from backend', res);
        this.messages.push({ from: 'bot', text: res.reply });
      });

    this.userMessage = '';
  }
}