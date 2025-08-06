// Servicio para obtener precios de productos desde múltiples supermercados
// Nota: Este es un ejemplo conceptual. En producción se necesitaría un backend
// para evitar problemas de CORS y para manejar el scraping de manera más robusta.

export interface LiderProduct {
  name: string;
  price: number;
  unit: string;
  imageUrl?: string;
  brand?: string;
  category?: string;
  availability: boolean;
  store: string; // Nuevo campo para identificar el supermercado
}

// Simulación de datos de múltiples supermercados (en producción esto vendría del scraping real)
const MOCK_SUPERMARKET_DATA: Record<string, LiderProduct[]> = {
  'pollo': [
    {
      name: 'Pechuga de Pollo Sin Hueso',
      price: 6990,
      unit: 'kg',
      brand: 'Agrosuper',
      category: 'Carnes y Aves',
      availability: true,
      imageUrl: '/api/placeholder/150/150',
      store: 'Líder'
    },
    {
      name: 'Pollo Entero',
      price: 2990,
      unit: 'kg',
      brand: 'Agrosuper',
      category: 'Carnes y Aves',
      availability: true,
      imageUrl: '/api/placeholder/150/150',
      store: 'Líder'
    },
    {
      name: 'Pechuga de Pollo Deshuesada',
      price: 7490,
      unit: 'kg',
      brand: 'Don Pollo',
      category: 'Carnes y Aves',
      availability: true,
      imageUrl: '/api/placeholder/150/150',
      store: 'Jumbo'
    },
    {
      name: 'Pollo Trozado',
      price: 2490,
      unit: 'kg',
      brand: 'Ariztía',
      category: 'Carnes y Aves',
      availability: true,
      imageUrl: '/api/placeholder/150/150',
      store: 'Santa Isabel'
    }
  ],
  'arroz': [
    {
      name: 'Arroz Grado 1',
      price: 1290,
      unit: 'kg',
      brand: 'Tucapel',
      category: 'Despensa',
      availability: true,
      imageUrl: '/api/placeholder/150/150',
      store: 'Líder'
    },
    {
      name: 'Arroz Integral',
      price: 1890,
      unit: 'kg',
      brand: 'Miraflores',
      category: 'Despensa',
      availability: true,
      imageUrl: '/api/placeholder/150/150',
      store: 'Líder'
    },
    {
      name: 'Arroz Basmati',
      price: 2490,
      unit: 'kg',
      brand: 'Gourmet',
      category: 'Despensa',
      availability: true,
      imageUrl: '/api/placeholder/150/150',
      store: 'Jumbo'
    }
  ],
  'pan': [
    {
      name: 'Pan de Molde Integral',
      price: 1390,
      unit: 'unidad',
      brand: 'Ideal',
      category: 'Panadería',
      availability: true,
      imageUrl: '/api/placeholder/150/150',
      store: 'Líder'
    },
    {
      name: 'Pan Hallulla',
      price: 150,
      unit: 'unidad',
      brand: 'Líder',
      category: 'Panadería',
      availability: true,
      imageUrl: '/api/placeholder/150/150',
      store: 'Líder'
    },
    {
      name: 'Pan Pita',
      price: 1190,
      unit: 'paquete',
      brand: 'Bimbo',
      category: 'Panadería',
      availability: true,
      imageUrl: '/api/placeholder/150/150',
      store: 'Santa Isabel'
    }
  ],
  'leche': [
    {
      name: 'Leche Entera 1L',
      price: 890,
      unit: 'litro',
      brand: 'Soprole',
      category: 'Lácteos',
      availability: true,
      imageUrl: '/api/placeholder/150/150',
      store: 'Líder'
    },
    {
      name: 'Leche Descremada 1L',
      price: 920,
      unit: 'litro',
      brand: 'Colun',
      category: 'Lácteos',
      availability: true,
      imageUrl: '/api/placeholder/150/150',
      store: 'Líder'
    },
    {
      name: 'Leche Sin Lactosa 1L',
      price: 1190,
      unit: 'litro',
      brand: 'Loncoleche',
      category: 'Lácteos',
      availability: true,
      imageUrl: '/api/placeholder/150/150',
      store: 'Unimarc'
    }
  ],
  'huevos': [
    {
      name: 'Huevos Rojos Docena',
      price: 1790,
      unit: 'docena',
      brand: 'Codorniz',
      category: 'Lácteos y Huevos',
      availability: true,
      imageUrl: '/api/placeholder/150/150',
      store: 'Líder'
    },
    {
      name: 'Huevos Blancos Docena',
      price: 1690,
      unit: 'docena',
      brand: 'Huevos Dorados',
      category: 'Lácteos y Huevos',
      availability: true,
      imageUrl: '/api/placeholder/150/150',
      store: 'Jumbo'
    }
  ],
  'queso': [
    {
      name: 'Queso Gauda Laminado',
      price: 11990,
      unit: 'kg',
      brand: 'Colun',
      category: 'Lácteos',
      availability: true,
      imageUrl: '/api/placeholder/150/150',
      store: 'Líder'
    },
    {
      name: 'Queso Mantecoso',
      price: 9990,
      unit: 'kg',
      brand: 'Soprole',
      category: 'Lácteos',
      availability: true,
      imageUrl: '/api/placeholder/150/150',
      store: 'Santa Isabel'
    },
    {
      name: 'Queso Chanco',
      price: 13400,
      unit: 'kg',
      brand: 'Quillayes',
      category: 'Lácteos',
      availability: true,
      imageUrl: '/api/placeholder/150/150',
      store: 'Jumbo'
    },
    {
      name: 'Queso Parmesano Rallado',
      price: 4990,
      unit: '200g',
      brand: 'Lider',
      category: 'Lácteos',
      availability: true,
      imageUrl: '/api/placeholder/150/150',
      store: 'Líder'
    }
  ],
  'jamón': [
    {
      name: 'Jamón de Pavo Laminado',
      price: 8990,
      unit: 'kg',
      brand: 'PF',
      category: 'Fiambres',
      availability: true,
      imageUrl: '/api/placeholder/150/150',
      store: 'Líder'
    },
    {
      name: 'Jamón de Cerdo',
      price: 9990,
      unit: 'kg',
      brand: 'San Jorge',
      category: 'Fiambres',
      availability: true,
      imageUrl: '/api/placeholder/150/150',
      store: 'Jumbo'
    },
    {
      name: 'Jamón Serrano',
      price: 15990,
      unit: 'kg',
      brand: 'Ibérico',
      category: 'Fiambres',
      availability: true,
      imageUrl: '/api/placeholder/150/150',
      store: 'Santa Isabel'
    }
  ],
  'jugo': [
    {
      name: 'Jugo de Naranja 1L',
      price: 1290,
      unit: 'litro',
      brand: 'Watts',
      category: 'Bebidas',
      availability: true,
      imageUrl: '/api/placeholder/150/150',
      store: 'Líder'
    },
    {
      name: 'Jugo de Manzana 1L',
      price: 1190,
      unit: 'litro',
      brand: 'Andina',
      category: 'Bebidas',
      availability: true,
      imageUrl: '/api/placeholder/150/150',
      store: 'Unimarc'
    },
    {
      name: 'Jugo Multivitamínico 1L',
      price: 1490,
      unit: 'litro',
      brand: 'Jumex',
      category: 'Bebidas',
      availability: true,
      imageUrl: '/api/placeholder/150/150',
      store: 'Jumbo'
    },
    {
      name: 'Jugo de Piña 1L',
      price: 1390,
      unit: 'litro',
      brand: 'Watt\'s',
      category: 'Bebidas',
      availability: true,
      imageUrl: '/api/placeholder/150/150',
      store: 'Santa Isabel'
    }
  ],
  'yogurt': [
    {
      name: 'Yogurt Natural 1L',
      price: 1590,
      unit: 'litro',
      brand: 'Soprole',
      category: 'Lácteos',
      availability: true,
      imageUrl: '/api/placeholder/150/150',
      store: 'Líder'
    },
    {
      name: 'Yogurt Griego',
      price: 890,
      unit: '150g',
      brand: 'Danone',
      category: 'Lácteos',
      availability: true,
      imageUrl: '/api/placeholder/150/150',
      store: 'Jumbo'
    }
  ],
  'mantequilla': [
    {
      name: 'Mantequilla con Sal',
      price: 2290,
      unit: '250g',
      brand: 'Colun',
      category: 'Lácteos',
      availability: true,
      imageUrl: '/api/placeholder/150/150',
      store: 'Líder'
    },
    {
      name: 'Mantequilla Sin Sal',
      price: 2390,
      unit: '250g',
      brand: 'Soprole',
      category: 'Lácteos',
      availability: true,
      imageUrl: '/api/placeholder/150/150',
      store: 'Santa Isabel'
    }
  ],
  'tomate': [
    {
      name: 'Tomate',
      price: 1190,
      unit: 'kg',
      category: 'Frutas y Verduras',
      availability: true,
      imageUrl: '/api/placeholder/150/150',
      store: 'Líder'
    },
    {
      name: 'Tomate Cherry',
      price: 2490,
      unit: 'kg',
      category: 'Frutas y Verduras',
      availability: true,
      imageUrl: '/api/placeholder/150/150',
      store: 'Jumbo'
    }
  ],
  'cebolla': [
    {
      name: 'Cebolla',
      price: 890,
      unit: 'kg',
      category: 'Frutas y Verduras',
      availability: true,
      imageUrl: '/api/placeholder/150/150',
      store: 'Líder'
    },
    {
      name: 'Cebolla Morada',
      price: 1290,
      unit: 'kg',
      category: 'Frutas y Verduras',
      availability: true,
      imageUrl: '/api/placeholder/150/150',
      store: 'Unimarc'
    }
  ],
  'papa': [
    {
      name: 'Papa',
      price: 690,
      unit: 'kg',
      category: 'Frutas y Verduras',
      availability: true,
      imageUrl: '/api/placeholder/150/150',
      store: 'Líder'
    },
    {
      name: 'Papa Rosada',
      price: 890,
      unit: 'kg',
      category: 'Frutas y Verduras',
      availability: true,
      imageUrl: '/api/placeholder/150/150',
      store: 'Santa Isabel'
    }
  ],
  'aceite': [
    {
      name: 'Aceite Vegetal 1L',
      price: 1590,
      unit: 'litro',
      brand: 'Chef',
      category: 'Despensa',
      availability: true,
      imageUrl: '/api/placeholder/150/150',
      store: 'Líder'
    },
    {
      name: 'Aceite de Oliva 500ml',
      price: 2890,
      unit: '500ml',
      brand: 'Carbonell',
      category: 'Despensa',
      availability: true,
      imageUrl: '/api/placeholder/150/150',
      store: 'Jumbo'
    }
  ],
  'sal': [
    {
      name: 'Sal de Mesa',
      price: 490,
      unit: 'kg',
      brand: 'Lobos',
      category: 'Despensa',
      availability: true,
      imageUrl: '/api/placeholder/150/150',
      store: 'Líder'
    }
  ],
  'pasta': [
    {
      name: 'Fideos Espagueti',
      price: 890,
      unit: '400g',
      brand: 'Carozzi',
      category: 'Despensa',
      availability: true,
      imageUrl: '/api/placeholder/150/150',
      store: 'Líder'
    },
    {
      name: 'Fideos Penne',
      price: 990,
      unit: '400g',
      brand: 'Barilla',
      category: 'Despensa',
      availability: true,
      imageUrl: '/api/placeholder/150/150',
      store: 'Jumbo'
    }
  ],
  'carne': [
    {
      name: 'Carne Molida',
      price: 6990,
      unit: 'kg',
      brand: 'Carnes Ñuble',
      category: 'Carnes',
      availability: true,
      imageUrl: '/api/placeholder/150/150',
      store: 'Líder'
    },
    {
      name: 'Lomo Liso',
      price: 12990,
      unit: 'kg',
      brand: 'Premium',
      category: 'Carnes',
      availability: true,
      imageUrl: '/api/placeholder/150/150',
      store: 'Santa Isabel'
    }
  ],
  'pescado': [
    {
      name: 'Salmón Fresco',
      price: 5990,
      unit: 'kg',
      category: 'Pescados y Mariscos',
      availability: true,
      imageUrl: '/api/placeholder/150/150',
      store: 'Jumbo'
    },
    {
      name: 'Merluza',
      price: 2990,
      unit: 'kg',
      category: 'Pescados y Mariscos',
      availability: true,
      imageUrl: '/api/placeholder/150/150',
      store: 'Líder'
    }
  ]
};

// Función para buscar productos en Líder
export async function searchLiderProducts(query: string): Promise<LiderProduct[]> {
  // Simular delay de red
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const normalizedQuery = query.toLowerCase().trim();
  
  // Buscar en datos mock
  const results: LiderProduct[] = [];
  
  Object.keys(MOCK_SUPERMARKET_DATA).forEach(key => {
    if (key.includes(normalizedQuery) || normalizedQuery.includes(key)) {
      results.push(...MOCK_SUPERMARKET_DATA[key]);
    }
  });
  
  // También buscar por nombre de producto
  Object.values(MOCK_SUPERMARKET_DATA).flat().forEach(product => {
    if (product.name.toLowerCase().includes(normalizedQuery) && 
        !results.some(r => r.name === product.name)) {
      results.push(product);
    }
  });
  
  return results;
}

// Función para obtener el precio más barato de un producto
export async function getCheapestPrice(productName: string): Promise<LiderProduct | null> {
  const products = await searchLiderProducts(productName);
  
  if (products.length === 0) {
    return null;
  }
  
  // Encontrar el producto más barato
  return products.reduce((cheapest, current) => {
    return current.price < cheapest.price ? current : cheapest;
  });
}

// Función para calcular el costo total de una lista de compras
export async function calculateShoppingListCost(items: Array<{ name: string; quantity: number }>): Promise<{
  items: Array<{
    name: string;
    quantity: number;
    product: LiderProduct | null;
    totalPrice: number;
  }>;
  totalCost: number;
}> {
  const results = [];
  let totalCost = 0;
  
  for (const item of items) {
    const product = await getCheapestPrice(item.name);
    const itemTotalPrice = product ? (product.price * item.quantity) : 0;
    
    results.push({
      name: item.name,
      quantity: item.quantity,
      product,
      totalPrice: itemTotalPrice
    });
    
    totalCost += itemTotalPrice;
  }
  
  return {
    items: results,
    totalCost
  };
}

// Función para formatear precio chileno
export function formatChileanPrice(price: number): string {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0
  }).format(price);
}

// Función para obtener categorías disponibles
export function getAvailableCategories(): string[] {
  const categories = new Set<string>();
  
  Object.values(MOCK_SUPERMARKET_DATA).flat().forEach(product => {
    if (product.category) {
      categories.add(product.category);
    }
  });
  
  return Array.from(categories).sort();
}

// Función para obtener productos por categoría
export async function getProductsByCategory(category: string): Promise<LiderProduct[]> {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return Object.values(MOCK_SUPERMARKET_DATA)
    .flat()
    .filter(product => product.category === category);
}

/* 
 * NOTA IMPORTANTE PARA IMPLEMENTACIÓN EN PRODUCCIÓN:
 * 
 * Este archivo contiene datos simulados. Para una implementación real con web scraping
 * de Líder, necesitarías:
 * 
 * 1. Un backend (Node.js/Python) que maneje el scraping
 * 2. Usar librerías como Puppeteer, Playwright o Selenium
 * 3. Manejar rate limiting y proxies para evitar bloqueos
 * 4. Implementar cache para reducir requests
 * 5. Manejar cambios en la estructura del sitio web
 * 
 * Ejemplo de estructura de scraping real:
 * 
 * async function scrapeLiderProducts(query: string): Promise<LiderProduct[]> {
 *   const browser = await puppeteer.launch();
 *   const page = await browser.newPage();
 *   
 *   await page.goto(`https://www.lider.cl/supermercado/search?query=${encodeURIComponent(query)}`);
 *   
 *   const products = await page.evaluate(() => {
 *     // Extraer datos de productos del DOM
 *     return Array.from(document.querySelectorAll('.product-item')).map(item => ({
 *       name: item.querySelector('.product-name')?.textContent || '',
 *       price: parseFloat(item.querySelector('.price')?.textContent?.replace(/[^0-9]/g, '') || '0'),
 *       // ... más campos
 *     }));
 *   });
 *   
 *   await browser.close();
 *   return products;
 * }
 */