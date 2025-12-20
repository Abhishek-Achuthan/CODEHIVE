export function htmlToPlainText(html: string): string {
  const doc = new DOMParser().parseFromString(html, "text/html");

  doc.querySelectorAll("code").forEach((el) => {
    el.textContent = `\`${el.textContent}\``;
  });

  return doc.body.textContent?.replace(/\s+/g, " ").trim() ?? "";
}
