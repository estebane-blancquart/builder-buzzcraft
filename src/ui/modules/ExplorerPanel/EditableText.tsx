// =============================================================================
// EDITABLE TEXT - COMPOSANT RÉUTILISABLE
// =============================================================================
import { forwardRef, useImperativeHandle } from 'react';
import { useInlineEdit } from '../../../core/hooks/useInlineEdit';

interface EditableTextProps {
  value: string;
  onSave: (newValue: string) => void;
  className?: string;
  inputClassName?: string;
  placeholder?: string;
  disabled?: boolean;
}

export interface EditableTextRef {
  startEdit: () => void;
}

export const EditableText = forwardRef<EditableTextRef, EditableTextProps>(({
  value,
  onSave,
  className = '',
  inputClassName = '',
  placeholder,
  disabled = false,
}, ref) => {
  const {
    isEditing,
    inputProps,
    actions,
  } = useInlineEdit({
    initialValue: value,
    onSave,
  });

  useImperativeHandle(ref, () => ({
    startEdit: actions.startEdit,
  }));

  if (disabled) {
    return (
      <span className={className}>
        {value}
      </span>
    );
  }

  if (isEditing) {
    // Cast inputProps.ref to the correct type for <input>
    const { ref: inputRef, ...restInputProps } = inputProps;
    return (
      <input
        {...restInputProps}
        ref={inputRef as React.Ref<HTMLInputElement>}
        className={inputClassName}
        placeholder={placeholder}
      />
    );
  }

  return (
    <span
      className={`${className} editable-text`}
    >
      {value}
    </span>
  );
});