import { v0 } from 'v0-sdk';

// Note: Ensure V0_API_KEY is available in your environment variables.
// In a Vite environment, you might need to prefix it with VITE_ or access it differently
// depending on how the SDK reads it. 
// If the SDK is strictly Node.js, this might fail in the browser without a proxy.
// However, assuming it works or uses a fetch polyfill:

export interface V0ChatResponse {
    id: string;
    demo?: string; // URL for iframe
    files?: Array<{
        name: string;
        content: string;
    }>;
}

export const generateComponent = async (prompt: string): Promise<V0ChatResponse> => {
    try {
        // Attempt to create a chat
        // The SDK should pick up the key from process.env.V0_API_KEY or similar.
        // If it fails in browser, we might need to pass it explicitly if the SDK supports it.
        // Currently relying on "No initialization needed" per docs.

        const chat = await v0.chats.create({
            message: prompt
        });

        return chat as unknown as V0ChatResponse;
    } catch (error) {
        console.error('Error generating component with V0:', error);
        throw error;
    }
};
