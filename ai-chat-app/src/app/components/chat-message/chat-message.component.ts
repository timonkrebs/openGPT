import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatMessage } from '../../core/interfaces/chat.interface';

@Component({
    selector: 'app-chat-message',
    standalone: true,
    imports: [CommonModule],
    template: `
        <div class="message" [ngClass]="message.role">
            <div class="avatar">
                {{ message.role === 'user' ? '👤' : '🤖' }}
            </div>
            <div class="content">
                <div class="text">{{ message.content }}</div>
                <div class="timestamp">{{ message.timestamp | date:'short' }}</div>
            </div>
        </div>
    `,
    styles: [`
        .message {
            display: flex;
            margin: 1rem 0;
            gap: 1rem;
            
            &.user {
                flex-direction: row-reverse;
                .content {
                    background-color: #007bff;
                    color: white;
                    border-radius: 1rem 0 1rem 1rem;
                }
            }
            
            &.assistant {
                .content {
                    background-color: #f0f0f0;
                    border-radius: 0 1rem 1rem 1rem;
                }
            }
        }

        .avatar {
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.5rem;
        }

        .content {
            padding: 1rem;
            max-width: 70%;
        }

        .text {
            margin-bottom: 0.5rem;
            white-space: pre-wrap;
        }

        .timestamp {
            font-size: 0.8rem;
            opacity: 0.7;
        }
    `]
})
export class ChatMessageComponent {
    @Input() message!: ChatMessage;
}