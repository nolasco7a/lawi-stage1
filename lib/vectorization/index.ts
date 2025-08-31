// Vectorization utilities for file processing
// Using modular approach to easily switch between different vectorization providers

export interface VectorProvider {
  name: string;
  vectorize: (text: string) => Promise<number[]>;
  extractText: (file: File) => Promise<string>;
}

export interface VectorizedDocument {
  text: string;
  vectors: number[];
  chunks: VectorChunk[];
}

export interface VectorChunk {
  text: string;
  vector: number[];
  startIndex: number;
  endIndex: number;
}

// Xenova/Transformers provider implementation
class XenovaProvider implements VectorProvider {
  name = 'xenova';

  async vectorize(text: string): Promise<number[]> {
    // TODO: Implement xenova/transformers vectorization
    // For now, return placeholder
    console.log('Vectorizing text with Xenova:', text.substring(0, 100));
    return new Array(384).fill(0).map(() => Math.random());
  }

  async extractText(file: File): Promise<string> {
    const supportedTypes = [
      'text/plain',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];

    if (!supportedTypes.includes(file.type)) {
      throw new Error(`Unsupported file type: ${file.type}`);
    }

    if (file.type === 'text/plain') {
      return await file.text();
    }

    // TODO: Implement PDF and Word document text extraction
    // For now, return placeholder
    return `Extracted text from ${file.name} (${file.type})`;
  }
}

// Default provider instance
const defaultProvider = new XenovaProvider();

// Public API functions
export async function vectorizeDocument(file: File): Promise<VectorizedDocument> {
  try {
    const text = await defaultProvider.extractText(file);
    const chunks = chunkText(text);
    
    const vectorizedChunks = await Promise.all(
      chunks.map(async (chunk) => ({
        ...chunk,
        vector: await defaultProvider.vectorize(chunk.text),
      }))
    );

    const fullVector = await defaultProvider.vectorize(text);

    return {
      text,
      vectors: fullVector,
      chunks: vectorizedChunks,
    };
  } catch (error) {
    console.error('Error vectorizing document:', error);
    throw new Error('Failed to vectorize document');
  }
}

// Text chunking utility
function chunkText(text: string, chunkSize = 1000, overlap = 200): Omit<VectorChunk, 'vector'>[] {
  const chunks: Omit<VectorChunk, 'vector'>[] = [];
  let startIndex = 0;

  while (startIndex < text.length) {
    const endIndex = Math.min(startIndex + chunkSize, text.length);
    const chunkText = text.substring(startIndex, endIndex);

    chunks.push({
      text: chunkText,
      startIndex,
      endIndex,
    });

    startIndex = endIndex - overlap;
    if (startIndex >= text.length) break;
  }

  return chunks;
}

// Utility to validate file types
export function validateFileType(file: File): boolean {
  const allowedTypes = [
    'text/plain',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/markdown',
    'text/csv',
  ];

  return allowedTypes.includes(file.type);
}

// Utility to validate file size (max 10MB)
export function validateFileSize(file: File, maxSizeMB = 10): boolean {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return file.size <= maxSizeBytes;
}

// Export provider for potential switching
export { XenovaProvider };