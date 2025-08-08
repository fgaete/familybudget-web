import { Category } from '../services/userService';

/**
 * Palabras clave para cada categoría con sus variaciones y sinónimos
 */
const categoryKeywords: Record<string, string[]> = {
  'Alimentación': [
    'almuerzo', 'desayuno', 'cena', 'comida', 'restaurant', 'restaurante',
    'pizza', 'hamburguesa', 'sushi', 'empanada', 'sandwich', 'café', 'te', 'té',
    'supermercado', 'verduras', 'frutas', 'carne', 'pollo', 'pescado',
    'pan', 'leche', 'huevos', 'arroz', 'pasta', 'fideos', 'cocina',
    'delivery', 'pedidos', 'uber eats', 'rappi', 'dominos', 'mcdonalds',
    'kfc', 'subway', 'starbucks', 'dunkin', 'burger king', 'taco bell',
    'mercado', 'feria', 'carnicería', 'panadería', 'pastelería',
    'once', 'merienda', 'colación', 'snack', 'aperitivo',
    'bebida', 'jugo', 'gaseosa', 'agua', 'cerveza', 'vino',
    'compras comida', 'compras supermercado', 'compras mercado',
    'lider', 'jumbo', 'santa isabel', 'unimarc', 'tottus'
   ],
   'Transporte': [
    'uber', 'taxi', 'metro', 'bus', 'micro', 'colectivo', 'bencina',
    'gasolina', 'combustible', 'peaje', 'estacionamiento', 'parking',
    'mecánico', 'taller', 'neumáticos', 'ruedas', 'aceite', 'revisión',
    'permiso', 'circulación', 'seguro auto', 'auto', 'coche', 'vehículo',
    'viaje', 'pasaje', 'boleto', 'ticket', 'transporte público',
    'cabify', 'didi', 'beat', 'lyft', 'transantiago', 'red metropolitana',
    'tarjeta bip', 'bip', 'recarga bip', 'locomoción', 'movilización',
    'mantención auto', 'reparación auto', 'lavado auto', 'car wash',
    'autopista', 'tag', 'telepeaje', 'copec', 'shell', 'petrobras',
    'esso', 'terpel', 'enex', 'estación de servicio', 'bencinera',
    'diesel', 'petróleo', 'lubricante', 'filtro', 'batería auto',
    'frenos', 'embrague', 'transmisión', 'motor', 'radiador',
    'parabrisas', 'limpia parabrisas', 'luces auto', 'faro', 'baliza',
    'matricula', 'patente', 'registro', 'inspección técnica', 'planta',
    'grúa', 'remolque', 'auxilio mecánico', 'seguro obligatorio',
    'soap', 'revisión técnica', 'emisión de gases', 'smog',
    'transporte escolar', 'furgón escolar', 'colectivo escolar',
    'avión', 'vuelo', 'aeropuerto', 'pasaje aéreo', 'equipaje',
    'tren', 'ferrocarril', 'efe', 'metrotren', 'biotren',
    'barco', 'ferry', 'lancha', 'transporte marítimo',
    'bicicleta', 'bike', 'ciclovía', 'repuestos bici', 'neumático bici',
    'scooter', 'patineta', 'skateboard', 'patines', 'monopatín',
    'moto', 'motocicleta', 'scooter eléctrico', 'bici eléctrica'
   ],
   'Entretenimiento': [
    'cine', 'película', 'teatro', 'concierto', 'show', 'espectáculo',
    'bar', 'pub', 'discoteca', 'club', 'fiesta', 'cumpleaños',
    'netflix', 'spotify', 'disney', 'amazon prime', 'hbo', 'streaming',
    'videojuegos', 'juegos', 'playstation', 'xbox', 'nintendo',
    'parque', 'diversiones', 'bowling', 'karaoke', 'escape room',
    'museo', 'exposición', 'evento', 'festival', 'carrete',
    'salida', 'panorama', 'recreación', 'ocio', 'diversión',
    'youtube premium', 'apple music', 'paramount', 'crunchyroll',
    'steam', 'epic games', 'app store', 'google play',
    'parque de diversiones', 'fantasilandia', 'mall sport',
    'paintball', 'go kart', 'minigolf', 'piscina', 'gimnasio'
   ],
   'Salud': [
    'médico', 'doctor', 'dentista', 'hospital', 'clínica', 'consulta',
    'consulta médica', 'consulta dental', 'consulta psicológica',
    'medicamentos', 'remedios', 'farmacia', 'pastillas', 'jarabe',
    'medicina', 'medicamento', 'fármaco', 'antibiótico', 'analgésico',
    'vitaminas', 'suplementos', 'examen', 'análisis', 'radiografía',
    'ecografía', 'resonancia', 'operación', 'cirugía', 'terapia',
    'psicólogo', 'psiquiatra', 'psicología', 'psiquiatría', 'sicología', 'siquiatría',
    'kinesiólogo', 'kinesiología', 'fisioterapia', 'nutricionista', 'nutrición',
    'oftalmólogo', 'oftalmología', 'dermatólogo', 'dermatología',
    'ginecólogo', 'ginecología', 'pediatra', 'pediatría',
    'cardiólogo', 'cardiología', 'neurólogo', 'neurología',
    'traumatólogo', 'traumatología', 'urólogo', 'urología',
    'endocrinólogo', 'endocrinología', 'gastroenterólogo',
    'salud mental', 'terapia psicológica', 'sesión psicológica',
    'control médico', 'chequeo médico', 'revisión médica',
    'vacuna', 'vacunación', 'inmunización', 'inyección',
    'laboratorio', 'laboratorio clínico', 'exámenes de sangre',
    'receta médica', 'prescripción médica', 'tratamiento médico'
   ],
   'Educación': [
    'colegio', 'escuela', 'universidad', 'instituto', 'curso', 'clase',
    'matrícula', 'mensualidad', 'libros', 'cuadernos', 'útiles',
    'materiales', 'uniforme', 'mochila', 'calculadora', 'computador',
    'laptop', 'tablet', 'software', 'licencia', 'certificación',
    'capacitación', 'seminario', 'taller', 'diplomado', 'maestría'
  ],
  'Ropa': [
    'ropa', 'camisa', 'pantalón', 'vestido', 'falda', 'blusa',
    'zapatos', 'zapatillas', 'botas', 'sandalias', 'calcetines',
    'ropa interior', 'sostén', 'calzoncillos', 'chaqueta', 'abrigo',
    'polera', 'jeans', 'shorts', 'pijama', 'traje', 'corbata',
    'tienda', 'mall', 'centro comercial', 'boutique', 'outlet'
  ],
  'Hogar': [
    'casa', 'hogar', 'muebles', 'decoración', 'electrodomésticos',
    'refrigerador', 'lavadora', 'secadora', 'microondas', 'horno',
    'aspiradora', 'plancha', 'televisor', 'sofá', 'cama', 'mesa',
    'silla', 'escritorio', 'lámpara', 'cortinas', 'alfombra',
    'pintura', 'herramientas', 'ferretería', 'jardín', 'plantas',
    'limpieza', 'detergente', 'jabón', 'shampoo', 'papel higiénico'
  ],
  'Servicios': [
    'luz', 'agua', 'gas', 'internet', 'teléfono', 'cable', 'tv',
    'electricidad', 'cuenta', 'factura', 'servicio', 'mantención',
    'reparación', 'técnico', 'instalación', 'wifi', 'fibra óptica'
  ],
  'Mascotas': [
    'perro', 'gato', 'mascota', 'veterinario', 'vacuna', 'alimento',
    'comida para perro', 'comida para gato', 'collar', 'correa',
    'juguete', 'cama para mascota', 'arena', 'shampoo para mascota'
  ],
  'Belleza': [
    'peluquería', 'salón', 'corte', 'peinado', 'tinte', 'manicure',
    'pedicure', 'spa', 'masaje', 'facial', 'depilación', 'maquillaje',
    'perfume', 'crema', 'loción', 'cosmético', 'belleza'
  ]
};

/**
 * Función para detectar automáticamente la categoría basada en la descripción
 * @param description - Descripción del gasto
 * @param userCategories - Categorías definidas por el usuario
 * @returns La categoría detectada o null si no se encuentra coincidencia
 */
export function detectCategory(description: string, userCategories: Category[]): string | null {
  if (!description) return null;
  
  const normalizedDescription = description.toLowerCase().trim();
  
  // Si hay categorías de usuario, buscar coincidencias con ellas
  if (userCategories && userCategories.length > 0) {
    for (const category of userCategories) {
      const categoryNameLower = category.name.toLowerCase();
      
      // Buscar palabras clave para esta categoría
      const keywords = categoryKeywords[category.name] || [];
      
      // Agregar el nombre de la categoría como palabra clave
      const allKeywords = [categoryNameLower, ...keywords.map(k => k.toLowerCase())];
      
      // Buscar coincidencias exactas de palabras
      for (const keyword of allKeywords) {
        // Crear expresión regular para buscar la palabra completa
        const regex = new RegExp(`\\b${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
        
        if (regex.test(normalizedDescription)) {
          return category.name;
        }
      }
      
      // Buscar coincidencias parciales para palabras más largas
      for (const keyword of allKeywords) {
        if (keyword.length > 4 && normalizedDescription.includes(keyword)) {
          return category.name;
        }
      }
    }
  }
  
  // Si no hay categorías de usuario o no se encontró coincidencia,
  // buscar en todas las categorías predefinidas del sistema
  for (const [categoryName, keywords] of Object.entries(categoryKeywords)) {
    const allKeywords = [categoryName.toLowerCase(), ...keywords.map(k => k.toLowerCase())];
    
    // Buscar coincidencias exactas de palabras
    for (const keyword of allKeywords) {
      // Crear expresión regular para buscar la palabra completa
      const regex = new RegExp(`\\b${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
      
      if (regex.test(normalizedDescription)) {
        return categoryName;
      }
    }
    
    // Buscar coincidencias parciales para palabras más largas
    for (const keyword of allKeywords) {
      if (keyword.length > 4 && normalizedDescription.includes(keyword)) {
        return categoryName;
      }
    }
  }
  
  return null;
}

/**
 * Función para sugerir categorías basadas en la descripción
 * @param description - Descripción del gasto
 * @param userCategories - Categorías definidas por el usuario
 * @returns Array de categorías sugeridas ordenadas por relevancia
 */
export function suggestCategories(description: string, userCategories: Category[]): string[] {
  if (!description || !userCategories.length) return [];
  
  const normalizedDescription = description.toLowerCase().trim();
  const suggestions: { category: string; score: number }[] = [];
  
  for (const category of userCategories) {
    const categoryNameLower = category.name.toLowerCase();
    const keywords = categoryKeywords[category.name] || [];
    const allKeywords = [categoryNameLower, ...keywords.map(k => k.toLowerCase())];
    
    let score = 0;
    
    for (const keyword of allKeywords) {
      const regex = new RegExp(`\\b${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
      
      if (regex.test(normalizedDescription)) {
        score += keyword === categoryNameLower ? 10 : 5; // Mayor peso para el nombre de la categoría
      } else if (keyword.length > 4 && normalizedDescription.includes(keyword)) {
        score += 2;
      }
    }
    
    if (score > 0) {
      suggestions.push({ category: category.name, score });
    }
  }
  
  // Ordenar por puntuación descendente y retornar solo los nombres
  return suggestions
    .sort((a, b) => b.score - a.score)
    .map(s => s.category)
    .slice(0, 3); // Máximo 3 sugerencias
}

/**
 * Función para agregar nuevas palabras clave a una categoría
 * @param categoryName - Nombre de la categoría
 * @param keywords - Nuevas palabras clave a agregar
 */
export function addKeywordsToCategory(categoryName: string, keywords: string[]): void {
  if (!categoryKeywords[categoryName]) {
    categoryKeywords[categoryName] = [];
  }
  
  const normalizedKeywords = keywords.map(k => k.toLowerCase().trim());
  const existingKeywords = categoryKeywords[categoryName].map(k => k.toLowerCase());
  
  for (const keyword of normalizedKeywords) {
    if (!existingKeywords.includes(keyword)) {
      categoryKeywords[categoryName].push(keyword);
    }
  }
}

/**
 * Función para obtener todas las palabras clave de una categoría
 * @param categoryName - Nombre de la categoría
 * @returns Array de palabras clave
 */
export function getCategoryKeywords(categoryName: string): string[] {
  return categoryKeywords[categoryName] || [];
}

/**
 * Función para aprender de las categorizaciones manuales del usuario
 * @param description - Descripción del gasto
 * @param selectedCategory - Categoría seleccionada manualmente por el usuario
 */
export function learnFromUserSelection(description: string, selectedCategory: string): void {
  if (!description || !selectedCategory) return;
  
  const words = description.toLowerCase()
    .replace(/[^a-záéíóúñü\s]/g, ' ') // Remover puntuación
    .split(/\s+/)
    .filter(word => word.length > 2); // Solo palabras de más de 2 caracteres
  
  // Agregar palabras relevantes como palabras clave
  const relevantWords = words.filter(word => 
    !['con', 'para', 'por', 'del', 'las', 'los', 'una', 'uno', 'que', 'muy', 'más'].includes(word)
  );
  
  if (relevantWords.length > 0) {
    addKeywordsToCategory(selectedCategory, relevantWords);
  }
}