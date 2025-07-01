export interface ValidationErrorPayload {
    message: string;
    errors: Record<string, string[]>; // field → messages[]
}
