import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";

type CreateQnaEditorExtensionsParams = {
  placeholder: string;
};

export function createQnaEditorExtensions({
  placeholder,
}: CreateQnaEditorExtensionsParams) {
  return [
    StarterKit.configure({
      heading: { levels: [1, 2, 3, 4] },
      codeBlock: {
        HTMLAttributes: {
          class: "qna-codeblock",
        },
      },
      horizontalRule: {
        HTMLAttributes: {
          class: "qna-hr",
        },
      },
    }),
    Placeholder.configure({
      placeholder,
      emptyEditorClass:
        "is-editor-empty before:content-[attr(data-placeholder)] before:float-left before:text-zinc-500 before:pointer-events-none before:h-0",
    }),
  ];
}

type QnaEditorAttributesParams = {
  ariaLabel: string;
};

export function getQnaEditorAttributes({ ariaLabel }: QnaEditorAttributesParams) {
  return {
    class:
      "qna-content qna-editor max-w-full focus:outline-none text-sm whitespace-pre-wrap break-words",
    spellCheck: "true",
    "aria-label": ariaLabel,
  } as const;
}
