import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatMessageComponent } from '../chat-message/chat-message.component';
import { ChatInputComponent } from '../chat-input/chat-input.component';
import { ChatService } from '../../core/services/chat.service';
import { ChatMessage } from '../../core/interfaces/chat.interface';

@Component({
    selector: 'app-chat-container',
    standalone: true,
    imports: [CommonModule, ChatMessageComponent, ChatInputComponent],
    template: `
        <div class="chat-container">
            <div class="messages" #messagesContainer>
                @for (message of messages; track message.timestamp) {
                    <app-chat-message [message]="message" />
                }
            </div>
            <app-chat-input (sendMessage)="sendMessage($event)" />
        </div>
    `,
    styles: [`
        .chat-container {
            display: flex;
            flex-direction: column;
            height: 100vh;
            background-color: white;
        }

        .messages {
            flex: 1;
            overflow-y: auto;
            padding: 1rem;
        }
    `]
})
export class ChatContainerComponent implements OnInit {
    messages: ChatMessage[] = [];

    constructor(private chatService: ChatService) {}

    ngOnInit() {
        // Add a welcome message
        this.messages.push({
            role: 'system',
            content: 'You are a helpful assistant.',
            timestamp: new Date()
        });
    }

    sendMessage(content: string) {
        // Add user message
        const userMessage: ChatMessage = {
            role: 'user',
            content,
            timestamp: new Date()
        };
        this.messages.push(userMessage);

        // Get response from API
        this.chatService.sendMessage(this.messages).subscribe({
            next: (response) => {
                if (response.choices && response.choices.length > 0) {
                    const assistantMessage: ChatMessage = {
                        role: 'assistant',
                        content: response.choices[0].message.content,
                        timestamp: new Date()
                    };
                    this.messages.push(assistantMessage);
                }
            },
            error: (error) => {
                console.error('Error getting response:', error);
                this.messages.push({
                    role: 'assistant',
                    content: 'Sorry, I encountered an error. Please try again.',
                    timestamp: new Date()
                });
            }
        });
    }
}