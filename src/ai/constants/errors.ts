// src/gemini/constants/gemini-errors.ts

import { HttpStatus } from '@nestjs/common';
import { FinishReasonDetail, FinishReasonKey } from '../interface/finishReason';

/**
 * Đối tượng ánh xạ các FinishReason của Gemini API sang thông báo và mã HTTP chuẩn.
 */
export const GEMINI_FINISH_REASONS: Record<FinishReasonKey, FinishReasonDetail> = {
    // --- THÀNH CÔNG ---
    STOP: {
        code: 'SUCCESS',
        message: 'Nội dung được tạo thành công.',
        
    },

    // --- LỖI TẠO SINH ---
    MAX_TOKENS: {
        code: 'MAX_TOKENS_EXCEEDED',
        message: 'Yêu cầu quá dài hoặc cấu hình giới hạn token đầu ra quá thấp.',
         // 400
    },

    SAFETY: {
        code: 'SAFETY_VIOLATION',
        message: 'Nội dung bị chặn do vi phạm chính sách an toàn của AI.',
         // 403
    },

    RECITATION: {
        code: 'RECITATION_STOPPED',
        message: 'Mô hình bị dừng do có thể đang nhắc lại dữ liệu huấn luyện.',
         // 500 (Coi là lỗi nội bộ)
    },

    TOOMANYREQUEST: {
        code: 'TOO_MANY_REQUESTS',
        message: 'Đã hết giới hạn sử dụng. Vui lòng thử lại sau 24 giờ.',
        // 500 (Coi là lỗi nội bộ)
    },

    RESOURCEEXHAUSTED: {
        code: 'RESOURCE_EXHAUSTED',
        message: 'Đã hết giới hạn sử dụng. Vui lòng thử lại sau 24 giờ.',
        // 500 (Coi là lỗi nội bộ)
    },

    UNAVAILABLE: {
        code: 'UNAVAILABLE',
        message: 'Dịch vụ tạm thời không khả dụng. Vui lòng thử lại sau.',
        // 500 (Coi là lỗi nội bộ)
    },

    OTHER: {
        code: 'GENERATION_ERROR_OTHER',
        message: 'Lỗi tạo sinh nội dung không xác định.',
         // 500
    },
};