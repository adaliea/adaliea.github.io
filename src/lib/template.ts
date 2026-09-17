export function templateKeys(template: string): string[] {
  return [
    ...new Set(
      [...template.matchAll(/(?<!\\)\[([^\]]+)\]/g)].map((match) => match[1].toLowerCase()),
    ),
  ];
}

export function fillTemplate(template: string, values: Record<string, string>) {
  return template
    .replace(/(?<!\\)\[([^\]]+)\]/g, (_, key: string) => {
      const value = values[key.toLowerCase()] || "";
      return key.charAt(0) !== key.charAt(0).toLowerCase()
        ? value.charAt(0).toUpperCase() + value.slice(1)
        : value;
    })
    .replace(/\\\[/g, "[");
}
