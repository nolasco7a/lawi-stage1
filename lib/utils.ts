import type {
  CoreAssistantMessage,
  CoreToolMessage,
  UIMessage,
  UIMessagePart,
} from 'ai';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { DBMessage, Document } from '@/lib/db/schema';
import { ChatSDKError, type ErrorCode } from './errors';
import type { ChatMessage, ChatTools, CustomUIDataTypes } from './types';
import { formatISO } from 'date-fns';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const fetcher = async (url: string) => {
  const response = await fetch(url);

  if (!response.ok) {
    const { code, cause } = await response.json();
    throw new ChatSDKError(code as ErrorCode, cause);
  }

  return response.json();
};

export async function fetchWithErrorHandlers(
  input: RequestInfo | URL,
  init?: RequestInit,
) {
  try {
    const response = await fetch(input, init);

    if (!response.ok) {
      const { code, cause } = await response.json();
      throw new ChatSDKError(code as ErrorCode, cause);
    }

    return response;
  } catch (error: unknown) {
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      throw new ChatSDKError('offline:chat');
    }

    throw error;
  }
}

export function getLocalStorage(key: string) {
  if (typeof window !== 'undefined') {
    return JSON.parse(localStorage.getItem(key) || '[]');
  }
  return [];
}

export function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

type ResponseMessageWithoutId = CoreToolMessage | CoreAssistantMessage;
type ResponseMessage = ResponseMessageWithoutId & { id: string };

export function getMostRecentUserMessage(messages: Array<UIMessage>) {
  const userMessages = messages.filter((message) => message.role === 'user');
  return userMessages.at(-1);
}

export function getDocumentTimestampByIndex(
  documents: Array<Document>,
  index: number,
) {
  if (!documents) return new Date();
  if (index > documents.length) return new Date();

  return documents[index].createdAt;
}

export function getTrailingMessageId({
  messages,
}: {
  messages: Array<ResponseMessage>;
}): string | null {
  const trailingMessage = messages.at(-1);

  if (!trailingMessage) return null;

  return trailingMessage.id;
}

export function sanitizeText(text: string) {
  return text.replace('<has_function_call>', '');
}

export function convertToUIMessages(messages: DBMessage[]): ChatMessage[] {
  return messages.map((message) => ({
    id: message.id,
    role: message.role as 'user' | 'assistant' | 'system',
    parts: message.parts as UIMessagePart<CustomUIDataTypes, ChatTools>[],
    metadata: {
      createdAt: formatISO(message.createdAt),
    },
  }));
}

export function getTextFromMessage(message: ChatMessage): string {
  return message.parts
    .filter((part) => part.type === 'text')
    .map((part) => part.text)
    .join('');
}

export function setToLocalStorage(key: string, value: unknown) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(key, JSON.stringify(value));
    }
}


export function removeFromLocalStorage(key: string) {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(key);
  }
}

export function getFromLocalStorage<T>(key: string): T | null {
  if (typeof window !== 'undefined') {
    const item = localStorage.getItem(key);
    return item ? (JSON.parse(item) as T) : null;
  }
  return null;
}

export function clearLocalStorage() {
    if (typeof window !== 'undefined') {
        localStorage.clear();
    }
}

export function capitalizeWords(str: string): string {
  if(!str) return null
  return str
    .split(' ')
    .map(word =>
      word.length > 0
        ? word[0].toUpperCase() + word.slice(1).toLowerCase()
        : ''
    )
    .join(' ');
}

export const getInitialsFromName = (name: string = "", lastname: string = ""): string => {
    const nameWords = name.trim().split(' ');
    const lastnameWord = lastname.trim().split(' ');
    if (nameWords.length >= 1 && lastnameWord.length >= 1) {
        return `${nameWords[0].charAt(0).toUpperCase()} ${lastnameWord[0].charAt(0).toUpperCase()}`;
    } else {
        return "NA";
    }
}

export const copyToClipboard = async (text: string, toast: any, successMessage = 'Texto copiado al portapapeles') => {
  try {
    if (text.trim() === '') {
      throw new Error('El texto no puede estar vacío');
    }

    if (!navigator.clipboard) {
      throw new Error('Clipboard API no está disponible');
    }

    await navigator.clipboard.writeText(text);
    toast.success(successMessage);

    return true;
  } catch (error) {
    console.error('Error al copiar al portapapeles:', error);
    toast.error('Error al copiar al portapapeles');
    return false;
  }
};


export const getCountriesOptions = (countries) => {
    return countries.map(country => ({label: country.name, value: country.id}));
}

export const getDeptoStatesOptions = (states) => {
    return states.map(state => ({label: state.name, value: state.id}));
}

export const getCityMunicipalitiesOptions = (cities, deptoStateId) => {
    const citiesByState = cities.filter(city => city.depto_state_id === deptoStateId)
    return citiesByState.map(city => ({label: city.name, value: city.id}));
}
