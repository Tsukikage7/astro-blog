import { visit } from "unist-util-visit";
import type { Parent } from "unist";

export function remarkMermaid() {
  return (tree: Parent) => {
    visit(tree, "code", (node: any) => {
      if (node.lang === "mermaid") {
        const chartCode = node.value || "";
        const chartId = `mermaid-${Math.random().toString(36).substring(7)}`;

        // 转换为 HTML 节点，避免 Shiki 处理
        (node as any).type = "html";
        (node as any).value = `<div class="mermaid-container" data-chart-id="${chartId}" data-chart="${escapeHtmlAttr(chartCode)}"></div>`;
      }
    });
  };
}

function escapeHtmlAttr(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\n/g, "&#10;");
}
