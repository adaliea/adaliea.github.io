"use client";

import { useEffect, useState } from "react";
import { fillTemplate, templateKeys } from "@/lib/template";

export function BlankFiller() {
  const [template, setTemplate] = useState("");
  const [values, setValues] = useState<Record<string, string>>({});
  const [storageMessage, setStorageMessage] = useState("Your template is saved in this browser.");
  const [copyMessage, setCopyMessage] = useState("");
  useEffect(() => {
    // Hydrate the existing browser-only template after the server markup mounts.
    try {
      const saved = localStorage.getItem("blankfiller.templateText");
      if (saved) setTemplate(saved);
    } catch {
      setStorageMessage("Browser storage is unavailable. You can still use the template here.");
    }
  }, []);
  const keys = templateKeys(template);
  const output = fillTemplate(template, values);
  function changeTemplate(value: string) {
    setTemplate(value);
    setCopyMessage("");
    try {
      localStorage.setItem("blankfiller.templateText", value);
    } catch {
      setStorageMessage("Your template could not be saved in this browser.");
    }
  }
  async function copy() {
    try {
      await navigator.clipboard.writeText(output);
      setCopyMessage("Copied!");
    } catch {
      setCopyMessage("Select the output below to copy it manually.");
    }
  }
  return (
    <div className="space-y-8">
      <section>
        <label htmlFor="template" className="mb-3 block text-2xl font-semibold">
          Template
        </label>
        <p className="mb-3">
          Add fillable elements with <code>[label]</code>. Capitalize a label’s first letter to
          capitalize its value. Write <code>{"\\["}</code> for a literal opening bracket.
        </p>
        <textarea
          id="template"
          className="field"
          placeholder="Hello [Name], thank you for [reason]!"
          value={template}
          onChange={(event) => changeTemplate(event.target.value)}
        />
        <p className="mt-2 text-sm text-[var(--muted)]" role="status">
          {storageMessage}
        </p>
      </section>
      <section>
        <h2 className="mb-4 text-2xl font-semibold">Fill out the template</h2>
        {keys.length ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {keys.map((key, index) => (
              <div key={key}>
                <label htmlFor={`fill-${index}`} className="field-label">
                  {key}
                </label>
                <input
                  id={`fill-${index}`}
                  className="field"
                  value={values[key] || ""}
                  onChange={(event) => {
                    setValues({ ...values, [key]: event.target.value });
                    setCopyMessage("");
                  }}
                />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-[var(--muted)]">
            Your fields will appear here when you add labels to the template.
          </p>
        )}
      </section>
      <section>
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <label htmlFor="output" className="text-2xl font-semibold">
            Output
          </label>
          <button type="button" className="button" disabled={!output} onClick={copy}>
            Copy output
          </button>
        </div>
        <textarea id="output" className="field" value={output} readOnly />
        <p role="status" className="mt-2 min-h-6 text-sm text-[var(--muted)]">
          {copyMessage}
        </p>
      </section>
    </div>
  );
}
