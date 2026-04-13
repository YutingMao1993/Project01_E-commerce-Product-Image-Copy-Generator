import { useRef, useState, type ChangeEvent, type PointerEvent as ReactPointerEvent } from "react";

interface ResizableTextareaProps {
  rows: number;
  value: string;
  placeholder?: string;
  onChange: (event: ChangeEvent<HTMLTextAreaElement>) => void;
}

export function ResizableTextarea({ rows, value, placeholder, onChange }: ResizableTextareaProps) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [height, setHeight] = useState<number | null>(null);

  const handleResizeStart = (event: ReactPointerEvent<HTMLButtonElement>) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    event.preventDefault();

    const startY = event.clientY;
    const startHeight = textarea.getBoundingClientRect().height;

    const handlePointerMove = (moveEvent: PointerEvent) => {
      const nextHeight = Math.max(124, startHeight + moveEvent.clientY - startY);
      setHeight(nextHeight);
    };

    const handlePointerUp = () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
  };

  return (
    <div className="textarea-shell">
      <textarea
        ref={textareaRef}
        rows={rows}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        style={height ? { height: `${height}px` } : undefined}
      />
      <div className="textarea-corner">
        <button
          type="button"
          className="textarea-resize-handle"
          aria-label="Resize text area"
          onPointerDown={handleResizeStart}
        >
          <span />
          <span />
          <span />
        </button>
      </div>
    </div>
  );
}
