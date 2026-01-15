"use client";

import { useCallback } from "react";

export interface ValidationRule {
  selector: string;
  property: string;
  expected: string;
  hint: string;
}

export interface ValidationResult {
  passed: boolean;
  failedRule?: ValidationRule;
}

export const useChallengeValidation = () => {
  const validate = useCallback(
    (iframe: HTMLIFrameElement | null, rules: ValidationRule[]): ValidationResult => {
      if (!iframe || !iframe.contentWindow) {
        return { passed: false };
      }

      const doc = iframe.contentWindow.document;

      for (const rule of rules) {
        const element = doc.querySelector(rule.selector);
        if (!element) {
          return {
            passed: false,
            failedRule: { ...rule, hint: `Element "${rule.selector}" not found.` },
          };
        }

        const computedStyle = iframe.contentWindow.getComputedStyle(element);
        const actualValue = computedStyle.getPropertyValue(rule.property);

        // Basic normalization for comparison (e.g., removing spaces in rgb strings)
        const normalize = (val: string | null) => (val || "").toLowerCase().replace(/\s+/g, "");

        if (normalize(actualValue) !== normalize(rule.expected)) {
          return {
            passed: false,
            failedRule: rule,
          };
        }
      }

      return { passed: true };
    },
    [],
  );

  return { validate };
};
