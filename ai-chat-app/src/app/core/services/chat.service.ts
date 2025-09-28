import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ChatMessage, ModelRunnerRequest, ModelRunnerResponse, ModelList } from '../interfaces/chat.interface';

@Injectable({
    providedIn: 'root'
})
export class ChatService {
    private apiUrl = environment.modelRunnerUrl;

    constructor(private http: HttpClient) {}

    sendMessage(messages: ChatMessage[], model: string): Observable<ModelRunnerResponse> {
        const request: ModelRunnerRequest = {
            messages: messages.map(msg => ({
                role: msg.role,
                content: msg.content
            })),
            model
        };

        return this.http.post<ModelRunnerResponse>(`${this.apiUrl}/v1/chat/completions`, request);
    }

    sendStreamMessage(messages: ChatMessage[], model: string): Observable<ModelRunnerResponse> {
        const request: ModelRunnerRequest = {
            messages: messages.map(msg => ({
                role: msg.role,
                content: msg.content
            })),
            model,
            stream: true
        };

        return this.http.post<ModelRunnerResponse>(`${this.apiUrl}/v1/chat/completions`, request);
    }

    getModels(): Observable<ModelList> {
        return this.http.get<ModelList>(`${this.apiUrl}/v1/models`);
    }
}