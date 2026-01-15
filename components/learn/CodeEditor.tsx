"use client";

import React from "react";
import dynamic from "next/dynamic";

// Dynamically import Monaco Editor with SSR disabled
const Editor = dynamic(() => import("@monaco-editor/react"), { ssr: false });

interface CodeEditorProps {
  files: {
    html: string;
    css: string;
    js?: string;
  };
  activeTab: "html" | "css" | "js";
  onTabChange: (tab: "html" | "css" | "js") => void;
  onChange: (value: string | undefined) => void;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  files,
  activeTab,
  onTabChange,
  onChange,
}) => {
  const languageMap = {
    html: "html",
    css: "css",
    js: "javascript",
  };

  return (
    <div className="flex flex-col h-full rounded-xl overflow-hidden glass border border-white/10">
      {/* Tab Bar */}
      <div className="flex bg-black/40 px-2 pt-2 gap-1 border-b border-white/5">
        {(["html", "css", "js"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => onTabChange(tab)}
            className={`px-4 py-2 text-xs font-mono transition-all rounded-t-lg ${
              activeTab === tab
                ? "bg-[#1e1e1e] text-primary border-t border-x border-white/10"
                : "text-muted-foreground hover:bg-white/5"
            }`}
          >
            {tab.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Editor Area */}
      <div className="flex-1 relative">
        <Editor
          height="100%"
          theme="vs-dark"
          path={activeTab}
          defaultLanguage={languageMap[activeTab]}
          value={files[activeTab]}
          onChange={onChange}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: "on",
            roundedSelection: false,
            scrollBeyondLastLine: false,
            readOnly: false,
            automaticLayout: true,
            padding: { top: 16 },
            fontFamily: "var(--font-geist-mono)",
            suggestOnTriggerCharacters: true,
            quickSuggestions: true,
          }}
        />
      </div>
    </div>
  );
};
