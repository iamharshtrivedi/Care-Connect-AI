import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

// Mock the external Google Generative AI dependency entirely to prevent network requests during tests
vi.mock('@google/generative-ai', () => {
  return {
    GoogleGenerativeAI: vi.fn().mockImplementation(() => {
      return {
        getGenerativeModel: vi.fn().mockImplementation(() => {
          return {
            generateContent: vi.fn().mockRejectedValue(new Error('Network offline in test runner')),
          };
        }),
      };
    }),
    SchemaType: {
      OBJECT: 'OBJECT',
      ARRAY: 'ARRAY',
      STRING: 'STRING',
      NUMBER: 'NUMBER',
    },
  };
});

import { fetchAIDiagnosis } from './geminiService';

describe('Gemini AI Diagnosis Service', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should fall back to simulated headache diagnosis when headache symptoms are provided', async () => {
    const diagnosisPromise = fetchAIDiagnosis('I have a severe headache and migraine pain');
    
    // Fast-forward simulated latency timers
    await vi.runAllTimersAsync();
    
    const result = await diagnosisPromise;
    expect(result).toBeDefined();
    expect(result.urgency).toBe('moderate');
    expect(result.differential[0].condition).toBe('Migraine');
    expect(result.remedies.length).toBeGreaterThan(0);
  });

  it('should fall back to emergency chest pain response when chest/cardiac symptoms are provided', async () => {
    const diagnosisPromise = fetchAIDiagnosis('Sharp chest pain and heart flutter');
    
    await vi.runAllTimersAsync();
    
    const result = await diagnosisPromise;
    expect(result).toBeDefined();
    expect(result.urgency).toBe('emergency');
    expect(result.differential[0].condition).toBe('Acute Coronary Syndrome');
  });

  it('should return a generic diagnosis for random symptoms', async () => {
    const diagnosisPromise = fetchAIDiagnosis('Unexplained muscle tick in pinky');
    
    await vi.runAllTimersAsync();
    
    const result = await diagnosisPromise;
    expect(result).toBeDefined();
    expect(result.urgency).toBe('moderate');
    expect(result.differential).toBeDefined();
  });
});
