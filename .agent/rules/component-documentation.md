---
description: Ensure all components are well-documented.
---

# Component Documentation

- Every exported React component must have a JSDoc block.
- Describe the component's purpose and its props.
- Use `@param` for props and `@example` for common usage patterns.
- Example:

  ```tsx
  /**
   * Renders a mathematical formula using KaTeX.
   * @param {string} formula - The LaTeX formula string.
   * @param {boolean} block - Whether to render as a display block.
   * @example
   * <MathRenderer formula="E=mc^2" block />
   */
  export const MathRenderer = ({ formula, block }: MathProps) => { ... }
  ```
