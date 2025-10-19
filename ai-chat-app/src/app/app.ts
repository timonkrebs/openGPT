import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatContainerComponent } from './components/chat-container/chat-container.component';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [CommonModule, ChatContainerComponent],
    template: `
        <app-chat-container />
    `,
})
export class App {}
