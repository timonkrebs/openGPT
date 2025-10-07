import { Component, EventEmitter, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'app-chat-input',
    standalone: true,
    imports: [CommonModule, FormsModule, MatIconModule, MatButtonModule],
    template: `
        <div class="chat-input">
            <textarea
                [(ngModel)]="message"
                (keydown.enter)="onSubmit($event)"
                placeholder="Type your message here..."
                rows="1"
                [style.height]="textareaHeight"
            ></textarea>
            <button mat-icon-button color="primary" (click)="onSubmit()">
                <mat-icon>send</mat-icon>
            </button>
        </div>
    `,
    styles: [`
        .chat-input {
            display: flex;
            align-items: flex-end;
            gap: 1rem;
            padding: 1rem;
            background-color: white;
            border-top: 1px solid #e0e0e0;
            
            textarea {
                flex: 1;
                resize: none;
                border: none;
                border-radius: 0.5rem;
                padding: 0.75rem;
                font-family: inherit;
                font-size: 1rem;
                background-color: #f5f5f5;
                outline: none;
                min-height: 24px;
                max-height: 200px;
                
                &:focus {
                    background-color: #f0f0f0;
                }
            }
        }
    `]
})
export class ChatInputComponent {
    @Output() sendMessage = new EventEmitter<string>();
    
    message = signal('');
    textareaHeight = '24px';

    onSubmit(event?: Event) {
        if (event instanceof KeyboardEvent) {
            if (event.shiftKey) {
                event.preventDefault();
                return;
            }
            event.preventDefault();
        }

        if (this.message().trim()) {
            this.sendMessage.emit(this.message().trim());
            this.message.set('');
            this.textareaHeight = '24px';
        }
    }
}