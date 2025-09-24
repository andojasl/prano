interface Text {
  id: string;
  text: string;
}

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
  available_sizes: Array<{ size: string; quantity: number }>;
  images: string[] | null;
  categories?: {
    slug: string;
  };
}

// Layout configuration using pattern-based system
export const layoutConfigs = {
  // Desktop layout (4 columns)
  desktop: {
    rows: ["S P P S", "P S P P", "S P P S", "P P S P"],
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
    rows: ["P P", "S P", "P S", "P P", "P S", "P P"],
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
    rows: ["P P"], // This will be repeated for each product
    productSize: {
      width: 80,
      height: 48,
    },
    fixedGap: 16,
    betweenRows: 16,
    columns: 2,
  },
};

// Backward compatibility
export const layoutConfig = layoutConfigs.desktop;

export const createPatternLayout = (
  products: Product[],
  texts: Text[],
  config: typeof layoutConfig,
) => {
  const layout: Array<{ type: 'product'; product: Product; gridColumn: number; gridRow: number } | { type: 'text'; text: Text; gridColumn: number; gridRow: number }> = [];
  let productIndex = 0;
  let textIndex = 0;

  // For mobile layout only (simple P P pattern), create a simple two-column layout
  if (config.columns === 2 && config.rows.length === 1 && config.rows[0] === "P P") {
    return products.map((product, index) => ({
      type: "product",
      product,
      gridColumn: (index % 2) + 1,
      gridRow: Math.floor(index / 2) + 1,
    }));
  }

  // For desktop and tablet layouts, use the pattern system
  const productsPerPattern = config.rows.reduce((sum, row) =>
    sum + row.split(" ").filter(cell => cell === "P").length, 0
  );
  const maxRows = Math.ceil(products.length / productsPerPattern) * config.rows.length;

  for (let rowIndex = 0; rowIndex < maxRows; rowIndex++) {
    const patternRowIndex = rowIndex % config.rows.length;
    const rowPattern = config.rows[patternRowIndex].split(" ");

    // Check if this row would have any products
    const wouldHaveProducts = productIndex < products.length;

    if (!wouldHaveProducts) break;

    for (let colIndex = 0; colIndex < rowPattern.length; colIndex++) {
      const cellType = rowPattern[colIndex];

      if (cellType === "P" && productIndex < products.length) {
        layout.push({
          type: "product",
          product: products[productIndex],
          gridColumn: colIndex + 1,
          gridRow: rowIndex + 1,
        });
        productIndex++;
      } else if (cellType === "S" && textIndex < texts.length) {
        layout.push({
          type: "text",
          text: texts[textIndex],
          gridColumn: colIndex + 1,
          gridRow: rowIndex + 1,
        });
        textIndex++;
      }
    }
  }

  return layout;
};
