import {
  createElement,
  useEffect,
  useRef,
  type ElementType,
  type ReactNode,
} from 'react';
import { usePortfolio } from '../../content/PortfolioContext';

interface EditableProps {
  /** Dot-path into portfolio data, e.g. "profile.name". */
  field: string;
  as?: ElementType;
  className?: string;
  /** When true, renders an editable <img> whose src is the field value. */
  image?: boolean;
  alt?: string;
  children?: ReactNode;
  multiline?: boolean;
}

/**
 * Inline-editable node. In admin edit mode:
 *  - text: double-click → contentEditable, saves on blur.
 *  - image: double-click → file picker, stored as data URL.
 * For non-admins it renders plain, read-only content.
 */
export function Editable({
  field,
  as = 'span',
  className,
  image = false,
  alt = '',
  children,
  multiline = false,
}: EditableProps) {
  const { isAdmin, editing, getField, setField, showToast } = usePortfolio();
  const ref = useRef<HTMLElement>(null);
  const value = getField(field);
  const active = isAdmin && editing;

  // Keep DOM text in sync when not actively editing (avoids caret jumps).
  useEffect(() => {
    const el = ref.current;
    if (el && !image && el.getAttribute('contenteditable') !== 'true') {
      if (el.textContent !== (value ?? '')) el.textContent = value ?? '';
    }
  }, [value, image]);

  if (image) {
    const onPick = () => {
      if (!active) return;
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = () => {
        const f = input.files?.[0];
        if (!f) return;
        const reader = new FileReader();
        reader.onload = (e) => {
          setField(field, e.target?.result as string);
          showToast('Image replaced ✓');
        };
        reader.readAsDataURL(f);
      };
      input.click();
    };
    return (
      <img
        ref={ref as any}
        src={value}
        alt={alt}
        className={className}
        data-editable-image={active ? '' : undefined}
        onDoubleClick={onPick}
        draggable={false}
      />
    );
  }

  const startEdit = () => {
    if (!active) return;
    const el = ref.current;
    if (!el) return;
    el.setAttribute('contenteditable', 'true');
    el.focus();
    const range = document.createRange();
    range.selectNodeContents(el);
    const sel = window.getSelection();
    sel?.removeAllRanges();
    sel?.addRange(range);
  };

  const save = () => {
    const el = ref.current;
    if (!el) return;
    el.removeAttribute('contenteditable');
    const text = el.textContent?.trim() ?? '';
    if (text !== (value ?? '')) {
      setField(field, text);
      showToast('Saved ✓');
    }
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (!multiline && e.key === 'Enter') {
      e.preventDefault();
      (ref.current as HTMLElement)?.blur();
    }
    if (e.key === 'Escape') {
      const el = ref.current;
      if (el) el.textContent = value ?? '';
      (ref.current as HTMLElement)?.blur();
    }
  };

  return createElement(
    as,
    {
      ref,
      className,
      'data-editable': active ? '' : undefined,
      suppressContentEditableWarning: true,
      onDoubleClick: startEdit,
      onBlur: active ? save : undefined,
      onKeyDown: active ? onKeyDown : undefined,
    },
    children ?? value,
  );
}
