export const  generateTitleFromPrompt = (prompt: string): string => {
    // Cắt gọn 10 từ đầu tiên làm tiêu đề
    const words = prompt.split(' ');
    const shortTitle = words.slice(0, 10).join(' ');
    return shortTitle + (words.length > 10 ? '...' : '');
}