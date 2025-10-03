export interface ChatMessage {
    role: 'user' | 'assistant' | 'system';
    content: string;
    timestamp: Date;
}

export interface ChatConversation {
    id: string;
    messages: ChatMessage[];
    title?: string;
}

export interface ModelRunnerRequest {
    messages: {
        role: string;
        content: string;
    }[];
    model: string;
    stream?: boolean;
}

export interface ModelRunnerResponse {
    choices: {
        message: {
            role: string;
            content: string;
        };
        finish_reason: string;
    }[];
}

export interface Model {
    id: string;
    object: string;
    owned_by: string;
    permission: any[];
}

export interface ModelList {
    object: string;
    data: Model[];
}