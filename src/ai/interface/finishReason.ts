export interface FinishReasonDetail {
    code: string; // Mã lỗi nội bộ (Ví dụ: 'MAX_TOKENS_EXCEEDED')
    message: string; // Thông báo lỗi chi tiết để trả về client
}

export type FinishReasonKey =
    | 'STOP'
    | 'MAX_TOKENS'
    | 'SAFETY'
    | 'RECITATION'
    | 'OTHER'
    | string;