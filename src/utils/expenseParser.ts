import { detectCategory } from './smartCategorization';

interface ParsedExpense {
  description: string;
  amount: number;
  category: string;
}

/**
 * Parsea un texto de entrada para extraer descripción, monto y categoría
 * Ejemplos de entrada válidos:
 * - "Almuerzo 15000"
 * - "Uber al trabajo $8500"
 * - "Compra supermercado 45000 alimentación"
 * - "Doctor consulta 35000"
 * - "15000 almuerzo"
 * - "$25000 cena restaurante"
 */
export function parseExpenseInput(input: string, userCategories: any[] = []): ParsedExpense | null {
  if (!input || input.trim().length === 0) {
    return null;
  }

  const cleanInput = input.trim();
  
  // Patrones para detectar montos
  const amountPatterns = [
    /\$([\d,]+)/g,           // $15000 o $15,000
    /([\d,]+)\s*pesos?/gi,   // 15000 pesos
    /([\d,]+)\s*clp/gi,      // 15000 clp
    /\b([\d,]+)\b/g          // cualquier número
  ];

  let detectedAmount: number | null = null;
  let amountMatch: RegExpMatchArray | null = null;

  // Buscar el monto usando los patrones
  for (const pattern of amountPatterns) {
    const matches = Array.from(cleanInput.matchAll(pattern));
    if (matches.length > 0) {
      // Tomar la primera coincidencia válida
      for (const match of matches) {
        const numberStr = match[1] || match[0].replace(/[^\d,]/g, '');
        const number = parseInt(numberStr.replace(/,/g, ''));
        
        // Validar que sea un monto razonable (entre 100 y 10,000,000)
        if (!isNaN(number) && number >= 100 && number <= 10000000) {
          detectedAmount = number;
          amountMatch = match;
          break;
        }
      }
      if (detectedAmount) break;
    }
  }

  if (!detectedAmount || !amountMatch) {
    return null;
  }

  // Remover el monto del texto para obtener la descripción
  let description = cleanInput.replace(amountMatch[0], '').trim();
  
  // Limpiar caracteres extra de la descripción
  description = description.replace(/^[\s$,.-]+|[\s$,.-]+$/g, '').trim();
  
  // Si la descripción está vacía, usar un valor por defecto
  if (!description) {
    description = 'Gasto';
  }

  // Detectar categoría automáticamente basada en la descripción
  const detectedCategory = detectCategory(description, userCategories);
  const category = detectedCategory || 'Otros';

  return {
    description: capitalizeFirstLetter(description),
    amount: detectedAmount,
    category
  };
}

/**
 * Capitaliza la primera letra de una cadena
 */
function capitalizeFirstLetter(str: string): string {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * Valida si un texto parece contener información de gasto
 */
export function isValidExpenseInput(input: string): boolean {
  if (!input || input.trim().length === 0) {
    return false;
  }

  // Debe contener al menos un número que parezca un monto
  const hasAmount = /\b\d{3,}\b/.test(input);
  
  // Debe tener al menos 3 caracteres
  const hasMinLength = input.trim().length >= 3;
  
  return hasAmount && hasMinLength;
}

/**
 * Ejemplos de uso y testing
 */
export function getParsingExamples(): string[] {
  return [
    'Almuerzo 15000',
    'Uber al trabajo $8500',
    'Compra supermercado 45000',
    'Doctor consulta 35000',
    '15000 almuerzo',
    '$25000 cena restaurante',
    'Medicamentos farmacia 12000',
    'Bencina auto 30000',
    'Cine con amigos 8000'
  ];
}