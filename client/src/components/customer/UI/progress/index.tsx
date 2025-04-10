import { Progress } from "antd";
import styles from "./progress.module.scss";

export function AppProgress() {
  return (
    <div className={styles.customProgress}>
      <Progress percent={70} showInfo={false} />
    </div>
  );
}
