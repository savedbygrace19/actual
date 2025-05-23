import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ComponentProps,
  type ReactNode,
} from 'react';
import { Tooltip as AriaTooltip, TooltipTrigger } from 'react-aria-components';

import { styles } from './styles';
import { View } from './View';

type TooltipProps = Partial<ComponentProps<typeof AriaTooltip>> & {
  children: ReactNode;
  content: ReactNode;
  triggerProps?: Partial<ComponentProps<typeof TooltipTrigger>>;
};

export const Tooltip = ({
  children,
  content,
  triggerProps = {},
  ...props
}: TooltipProps) => {
  const triggerRef = useRef(null);
  const [isHovered, setIsHover] = useState(false);

  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout>>(null);

  const handlePointerEnter = useCallback(() => {
    const timeout = setTimeout(() => {
      setIsHover(true);
    }, triggerProps.delay ?? 300);

    hoverTimeoutRef.current = timeout;
  }, [triggerProps.delay]);

  const handlePointerLeave = useCallback(() => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }

    setIsHover(false);
  }, []);

  // Force closing the tooltip whenever the disablement state changes
  useEffect(() => {
    setIsHover(false);
  }, [triggerProps.isDisabled]);

  return (
    <View
      style={{ minHeight: 'auto', flexShrink: 0, maxWidth: '100%' }}
      ref={triggerRef}
      onMouseEnter={handlePointerEnter}
      onMouseLeave={handlePointerLeave}
    >
      <TooltipTrigger
        isOpen={isHovered && !triggerProps.isDisabled}
        {...triggerProps}
      >
        {children}

        <AriaTooltip triggerRef={triggerRef} style={styles.tooltip} {...props}>
          {content}
        </AriaTooltip>
      </TooltipTrigger>
    </View>
  );
};
