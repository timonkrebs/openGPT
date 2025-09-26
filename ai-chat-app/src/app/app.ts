import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { ChatContainerComponent } from './components/chat-container/chat-container.component';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [CommonModule, RouterOutlet, ChatContainerComponent],
    template: `
        <app-chat-container />
    `,
    styles: [`
        :host {
            display: block;
            height: 100vh;
        }
    `]
})
export class App {}
