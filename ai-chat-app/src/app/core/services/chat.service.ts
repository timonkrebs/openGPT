import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ChatMessage, ModelRunnerRequest, ModelRunnerResponse } from '../interfaces/chat.interface';

@Injectable({
    providedIn: 'root'
})
export class ChatService {
    private apiUrl = environment.modelRunnerUrl;

    constructor(private http: HttpClient) {}

    sendMessage(messages: ChatMessage[]): Observable<ModelRunnerResponse> {
        const request: ModelRunnerRequest = {
            messages: messages.map(msg => ({
                role: msg.role,
                content: msg.content
            })),
            model: environment.modelName
        };

        return this.http.post<ModelRunnerResponse>(`${this.apiUrl}/v1/chat/completions`, request);
    }

    sendStreamMessage(messages: ChatMessage[]): Observable<ModelRunnerResponse> {
        const request: ModelRunnerRequest = {
            messages: messages.map(msg => ({
                role: msg.role,
                content: msg.content
            })),
            model: environment.modelName,
            stream: true
        };

        return this.http.post<ModelRunnerResponse>(`${this.apiUrl}/v1/chat/completions`, request);
    }
}