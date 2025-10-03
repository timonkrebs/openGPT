import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { ChatMessageComponent } from '../chat-message/chat-message.component';
import { ChatInputComponent } from '../chat-input/chat-input.component';
import { ChatService } from '../../core/services/chat.service';
import { ChatMessage, Model } from '../../core/interfaces/chat.interface';
import { environment } from '../../../environments/environment';

@Component({
    selector: 'app-chat-container',
    standalone: true,
    imports: [CommonModule, FormsModule, MatFormFieldModule, MatSelectModule, ChatMessageComponent, ChatInputComponent],
    template: `
        <div class="chat-container">
            <div class="header">
                <mat-form-field>
                    <mat-label>Select a model</mat-label>
                    <mat-select [(ngModel)]="selectedModel">
                        @for (model of models; track model.id) {
                            <mat-option [value]="model.id">{{ model.id }}</mat-option>
                        }
                    </mat-select>
                </mat-form-field>
            </div>
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

        .header {
            padding: 1rem;
            border-bottom: 1px solid #ccc;
        }

        .messages {
            flex: 1;
            overflow-y: auto;
            padding: 1rem;
        }
    `]
})
export class ChatContainerComponent {
    messages: ChatMessage[] = [];
    models: Model[] = [];
    selectedModel: string = environment.modelName;

    constructor(private chatService: ChatService) { }

    sendMessage(content: string) {
        // Add user message
        const userMessage: ChatMessage = {
            role: 'user',
            content,
            timestamp: new Date()
        };
        this.messages.push(userMessage);

        // Get response from API
        this.chatService.sendMessage([{
            role: 'system',
            content: 'You are a helpful assistant.',
            timestamp: new Date()
        }, ...this.messages]).subscribe({
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