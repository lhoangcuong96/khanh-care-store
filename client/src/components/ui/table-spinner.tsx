import styles from "./table-spinner.module.css";

export default function TableSpinner({ className }: { className?: string }) {
  return <span className={`${styles.loader} ${className}`}></span>;
}
