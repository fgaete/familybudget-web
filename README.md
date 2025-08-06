# Family Order - Aplicación Web de Gestión Familiar

## 📱 Descripción

Family Order es una aplicación web completa para la gestión familiar que incluye:

- **Gestión de Menús**: Planifica comidas familiares con búsqueda de productos y precios
- **Rutinas Familiares**: Organiza actividades y tareas del hogar
- **Control de Presupuesto**: Monitorea gastos familiares
- **Lista de Compras**: Gestiona compras con categorización
- **Búsqueda de Productos**: Encuentra productos del supermercado Líder
- **Precios de Supermercados**: Datos de precios de Líder (simulados)

## 🚀 Características Principales

### Búsqueda de Productos
- Búsqueda de productos del **Supermercado Líder** (simulado)
- Control de cantidades por producto
- Información detallada de productos (marca, categoría, precio)
- Cálculo automático de costos de menús

### Información de Precios
- Base de datos de productos simulados de **Líder Supermercado**
- Precios actualizados por producto
- Cálculo automático de totales por menú
- Formateo de precios en pesos chilenos

### Gestión Completa
- Interfaz moderna y responsiva
- Navegación por pestañas intuitiva
- Almacenamiento local de datos
- Diseño optimizado para móviles

## 🛠️ Configuración

### Prerrequisitos
- Node.js (versión 14 o superior)
- npm o yarn

### Instalación

1. **Clona el repositorio**
   ```bash
   git clone <repository-url>
   cd family-order-web
   ```

2. **Instala las dependencias**
   ```bash
   npm install
   ```

3. **Inicia el servidor de desarrollo**
   ```bash
   npm start
   ```

   La aplicación estará disponible en [http://localhost:3000](http://localhost:3000)

## 🔧 Funcionalidades de Productos

### Búsqueda de Productos Líder
- **Búsqueda por nombre**: Encuentra productos escribiendo su nombre
- **Productos simulados**: Base de datos con productos comunes del supermercado
- **Precios en pesos chilenos**: Precios formateados correctamente
- **Información completa**: Nombre, marca, categoría, precio por unidad
- **Control de cantidades**: Ajusta cantidades antes de agregar al menú

## 📊 Funcionalidades de la API

### Líder Scraper (Simulado)
- `searchLiderProducts()`: Busca productos por nombre
- `getCheapestPrice()`: Encuentra el precio más bajo
- `calculateShoppingListCost()`: Calcula costo total de compras
- `formatChileanPrice()`: Formatea precios en CLP
- `getProductDetails()`: Obtiene información detallada del producto

## 🏗️ Estructura del Proyecto

```
src/
├── components/
│   ├── ProductSearch.tsx           # Componente de búsqueda de productos
│   └── ProductSearch.css           # Estilos del componente
├── services/
│   └── liderScraper.ts             # Simulador de productos Líder
├── App.tsx                         # Componente principal
├── App.css                         # Estilos principales
└── index.tsx                       # Punto de entrada
```

## 🎨 Tecnologías Utilizadas

- **React 18** con TypeScript
- **CSS3** con diseño responsivo
- **Simulador de productos** para datos de Líder
- **Create React App** como base

## 📱 Uso de la Aplicación

### Búsqueda de Productos
1. Ve a la pestaña "🛒 Búsqueda de Productos"
2. Escribe el nombre de un producto
3. Selecciona de los resultados disponibles
4. Ajusta la cantidad deseada
5. Agrega al menú familiar

### Gestión de Menús
- Los menús agregados muestran productos y cantidades
- Información completa de cada producto (marca, categoría)
- Precios actualizados de supermercados
- Cálculo automático de costos totales

## 🚧 Desarrollo Futuro

### Implementación Real de Web Scraping
Para una versión de producción con scraping real de Líder:

```javascript
// Ejemplo conceptual - requiere backend
async function scrapeLiderProducts(query) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  await page.goto(`https://www.lider.cl/supermercado/search?query=${query}`);
  
  const products = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('.product-item')).map(item => ({
      name: item.querySelector('.product-name')?.textContent,
      price: parseFloat(item.querySelector('.price')?.textContent?.replace(/[^0-9]/g, '')),
      brand: item.querySelector('.brand')?.textContent,
      category: item.querySelector('.category')?.textContent
    }));
  });
  
  await browser.close();
  return products;
}
```

### Mejoras Planificadas
- Backend con Node.js para web scraping real
- API de productos en tiempo real
- Base de datos para almacenamiento persistente
- Autenticación de usuarios
- Sincronización entre dispositivos
- Comparador de precios entre supermercados
- Exportación de listas de compras

## 📄 Scripts Disponibles

### `npm start`
Inicia el servidor de desarrollo en [http://localhost:3000](http://localhost:3000)

### `npm test`
Ejecuta las pruebas en modo interactivo

### `npm run build`
Construye la aplicación para producción en la carpeta `build/`

### `npm run eject`
⚠️ **Operación irreversible**: Expone la configuración de webpack

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📞 Soporte

Para soporte técnico o preguntas:
- Crea un issue en GitHub
- Consulta la documentación de [Create React App](https://facebook.github.io/create-react-app/docs/getting-started)

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

---

**Family Order** - Simplificando la gestión familiar con tecnología moderna 🏠✨
