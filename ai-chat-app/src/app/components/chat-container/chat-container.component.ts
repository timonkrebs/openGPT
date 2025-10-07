import { Component, effect, ElementRef, OnInit, signal, ViewChild, WritableSignal } from '@angular/core';
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
                @for (message of messages(); track message.timestamp) {
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
export class ChatContainerComponent implements OnInit {
    @ViewChild('messagesContainer') private messagesContainer!: ElementRef;
    messages: WritableSignal<ChatMessage[]> = signal([]);
    models: Model[] = [];
    selectedModel: string = environment.modelName;

    ngOnInit() {

        this.chatService.getModels().subscribe({
            next: (modelList) => {
                this.models = modelList.data;
            },
            error: (error) => {
                console.error('Error getting models:', error);
            }
        });
    }

    constructor(private chatService: ChatService) {
        effect(() => {
            if (this.messages()) {
                setTimeout(() => {
                    this.scrollToBottom();
                }, 100);
            }
        });
    }

    private scrollToBottom(): void {
        try {
            this.messagesContainer?.nativeElement.scroll({
                top: this.messagesContainer.nativeElement.scrollHeight - this.messagesContainer.nativeElement.lastElementChild?.offsetHeight - 100,
                left: 0,
                behavior: 'smooth'
            });
        } catch (err) {
            console.error(err);
        }
    }

    sendMessage(content: string) {
        // Add user message
        const userMessage: ChatMessage = {
            role: 'user',
            content,
            timestamp: new Date()
        };
        this.messages.set([...this.messages(), userMessage]);

        // Get response from API
        this.chatService.sendMessage([{
            role: 'system',
            content: 'You are a helpful assistant.',
            timestamp: new Date()
        }, ...this.messages()], this.selectedModel).subscribe({
            next: (response) => {
                if (response.choices && response.choices.length > 0) {
                    const assistantMessage: ChatMessage = {
                        role: 'assistant',
                        content: response.choices[0].message.content,
                        timestamp: new Date()
                    };
                    this.messages.set([...this.messages(), assistantMessage]);
                }
            },
            error: (error) => {
                console.error('Error getting response:', error);
                this.messages.set([...this.messages(), {
                    role: 'assistant',
                    content: 'Sorry, I encountered an error. Please try again.',
                    timestamp: new Date()
                }]);
            }
        });
    }
}