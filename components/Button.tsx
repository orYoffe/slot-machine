import styles from "./Button.module.css";

interface Props {
  onClick: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  disabled?: boolean;
  children: string;
  style?: React.CSSProperties;
}
export default function Button({
  children,
  onClick,
  disabled,
  onMouseEnter,
  onMouseLeave,
  style = {},
}: Props) {
  return (
    <button
      onMouseLeave={onMouseLeave}
      disabled={disabled}
      style={{ backgroundColor: disabled ? "#aaa" : "", ...style }}
      className={styles.button}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
    >
      {children}
    </button>
  );
}
