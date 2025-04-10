import styles from "./spinner.module.scss";

export default function Spinner({ className }: { className?: string }) {
  return (
    <span className={`${styles.loader} ${className}`}>Đang xử lý ...</span>
  );
}
