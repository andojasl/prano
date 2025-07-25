interface Product {
  id: string;
  image: string;
  hover_image: string | null;
  title: string;
  slug: string;
  price: number;
  category: number;
  description: string | null;
  ready: boolean | null;
  available_sizes: any;
  images: string[] | null;
  categories?: {
    slug: string;
  };
}

// Layout configuration using pattern-based system
export const layoutConfigs = {
  // Desktop layout (4 columns)
  desktop: {
    rows: [
      'S P P S', 
      'P S P P', 
      'S P P S', 
      'P P S P', 
    ],
    productSize: {
      width: 80, 
      height: 48, 
    },
    fixedGap: 30, 
    betweenRows: 16,
    columns: 4,
  },
  
  // Tablet layout (2 columns)
  tablet: {
    rows: [
      'P P',
      'S P',
      'P S',
      'P P',
      'P S',
      'P P',
    ],
    productSize: {
      width: 80, 
      height: 48, 
    },
    fixedGap: 24, 
    betweenRows: 16,
    columns: 2,
  },
  
  // Mobile layout (1 column)
  mobile: {
    rows: ['P'], // This will be repeated for each product
    productSize: {
      width: 80, 
      height: 48, 
    },
    fixedGap: 16, 
    betweenRows: 16,
    columns: 1,
  }
};

// Backward compatibility
export const layoutConfig = layoutConfigs.desktop;



export const createPatternLayout = (products: Product[], config: typeof layoutConfig) => {
  const layout: any[] = [];
  let productIndex = 0;
  
  // For mobile layout, create a simple single-column layout
  if (config.columns === 1) {
    return products.map((product, index) => ({
      type: 'product',
      product,
      gridColumn: 1,
      gridRow: index + 1,
    }));
  }
  
  // For desktop and tablet layouts, use the pattern system
  const maxRows = Math.ceil(products.length / config.columns) + config.rows.length;
  
  for (let rowIndex = 0; rowIndex < maxRows && productIndex < products.length; rowIndex++) {
    const patternRowIndex = rowIndex % config.rows.length;
    const rowPattern = config.rows[patternRowIndex].split(' ');
    
    for (let colIndex = 0; colIndex < rowPattern.length; colIndex++) {
      const cellType = rowPattern[colIndex];
      
      if (cellType === 'P' && productIndex < products.length) {
        layout.push({
          type: 'product',
          product: products[productIndex],
          gridColumn: colIndex + 1,
          gridRow: rowIndex + 1,
        });
        productIndex++;
      } else if (cellType === 'S') {
        layout.push({
          type: 'spacer',
          gridColumn: colIndex + 1,
          gridRow: rowIndex + 1,
        });
      }
    }
  }
  
  return layout;
};
