import DOMPurify from "dompurify";

type Props = {
  html: string;
  className?: string;
};

const ALLOWED_TAGS = [
  "p",
  "br",
  "strong",
  "em",
  "u",
  "code",
  "pre",
  "ul",
  "ol",
  "li",
  "a",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "hr",
  "blockquote",
];

const ALLOWED_ATTR = ["href", "target", "rel"];

export function QnaRichContent({ html, className }: Props) {
  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{
        __html: DOMPurify.sanitize(html, {
          ALLOWED_TAGS,
          ALLOWED_ATTR,
        }),
      }}
    />
  );
}
