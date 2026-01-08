import { useEffect } from "react";
import mermaid from "mermaid";

const THEME_CONFIG = {
  light: {
    theme: "default" as const,
    themeVariables: {
      primaryColor: "#ffffff",
      primaryTextColor: "#1e1e1e",
      primaryBorderColor: "#e5e5e5",
      lineColor: "#525252",
      secondaryColor: "#f5f5f5",
      tertiaryColor: "#fafafa",
      background: "#ffffff",
      mainBkg: "#f5f5f5",
      nodeBorder: "#e5e5e5",
      clusterBkg: "#fafafa",
      clusterBorder: "#e5e5e5",
      titleColor: "#1e1e1e",
      edgeLabelBackground: "#ffffff",
      actorBkg: "#f5f5f5",
      actorBorder: "#e5e5e5",
      actorTextColor: "#1e1e1e",
      actorLineColor: "#525252",
      signalColor: "#525252",
      signalTextColor: "#1e1e1e",
      labelBoxBkgColor: "#f5f5f5",
      labelBoxBorderColor: "#e5e5e5",
      labelTextColor: "#1e1e1e",
      loopTextColor: "#737373",
      noteBorderColor: "#e5e5e5",
      noteBkgColor: "#fafafa",
      noteTextColor: "#1e1e1e",
      activationBorderColor: "#e5e5e5",
      activationBkgColor: "#f5f5f5",
      sequenceNumberColor: "#1e1e1e",
    },
  },
  dark: {
    theme: "dark" as const,
    themeVariables: {
      primaryColor: "#171717",
      primaryTextColor: "#e5e5e5",
      primaryBorderColor: "#2a2a2a",
      lineColor: "#525252",
      secondaryColor: "#262626",
      tertiaryColor: "#1f1f1f",
      background: "#0a0a0a",
      mainBkg: "#262626",
      nodeBorder: "#404040",
      clusterBkg: "#1a1a1a",
      clusterBorder: "#2a2a2a",
      titleColor: "#e5e5e5",
      edgeLabelBackground: "#171717",
      actorBkg: "#262626",
      actorBorder: "#404040",
      actorTextColor: "#e5e5e5",
      actorLineColor: "#525252",
      signalColor: "#525252",
      signalTextColor: "#e5e5e5",
      labelBoxBkgColor: "#262626",
      labelBoxBorderColor: "#404040",
      labelTextColor: "#e5e5e5",
      loopTextColor: "#a3a3a3",
      noteBorderColor: "#404040",
      noteBkgColor: "#1a1a1a",
      noteTextColor: "#e5e5e5",
      activationBorderColor: "#404040",
      activationBkgColor: "#262626",
      sequenceNumberColor: "#e5e5e5",
    },
  },
} as const;

export default function MermaidClient() {
  useEffect(() => {
    const isDarkMode = () =>
      document.documentElement.classList.contains("dark");

    const initMermaid = () => {
      const config = isDarkMode() ? THEME_CONFIG.dark : THEME_CONFIG.light;
      mermaid.initialize({
        startOnLoad: false,
        securityLevel: "loose",
        ...config,
      });
    };

    const renderCharts = async () => {
      const containers = document.querySelectorAll(
        ".mermaid-container:not([data-rendered])"
      );

      for (const container of containers) {
        const code = container.getAttribute("data-chart");
        const id = container.getAttribute("data-chart-id");
        if (!code || !id) continue;

        try {
          const { svg } = await mermaid.render(id, code);
          container.innerHTML = svg;
          container.setAttribute("data-rendered", "true");
        } catch (err) {
          console.error("Mermaid render error:", err);
          container.innerHTML = `<p class="text-destructive">图表渲染失败</p>`;
        }
      }
    };

    const handleThemeChange = () => {
      // 清除已渲染标记，重新渲染
      document.querySelectorAll(".mermaid-container[data-rendered]").forEach((el) => {
        el.removeAttribute("data-rendered");
        el.innerHTML = "";
      });
      initMermaid();
      renderCharts();
    };

    // 初始化
    initMermaid();
    renderCharts();

    // 监听主题变化
    const observer = new MutationObserver((mutations) => {
      if (mutations.some((m) => m.attributeName === "class")) {
        handleThemeChange();
      }
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  return null;
}
