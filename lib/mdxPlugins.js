import { visit } from 'unist-util-visit'

export function inlineStylePlugin() {
  return (tree) => {
    visit(tree, 'element', (node) => {
      if (node.properties && typeof node.properties.style === 'string') {
        try {
          const styleObject = JSON.parse(node.properties.style.replace(/'/g, '"'));
          node.properties.style = styleObject;
        } catch (error) {
          console.error('Failed to parse style string:', node.properties.style);
          delete node.properties.style;
        }
      }
    });
  };
}
