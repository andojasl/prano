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
export const layoutConfig = {
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
};



export const createPatternLayout = (products: Product[], config: typeof layoutConfig) => {
  const layout: any[] = [];
  let productIndex = 0;
  
  for (let rowIndex = 0; rowIndex < config.rows.length; rowIndex++) {
    const rowPattern = config.rows[rowIndex].split(' ');
    
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
