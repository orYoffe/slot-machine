import Image from "next/image";
import resultsMapping from "../utils/resultsMapping";
import styles from "./Spinner.module.css";

const Spinner = (
  <div className={styles.loader} data-testid="spinner">
    <div className={styles.column}>
      {resultsMapping.map((result, index) => (
        <Image
          key={`resultsMapping_${index}`}
          src={result}
          width={200}
          height={200}
        />
      ))}
    </div>
    <div className={styles.column}>
      {resultsMapping
        .slice()
        .reverse()
        .map((result, index) => (
          <Image
            key={`resultsMapping2_${index}`}
            src={result}
            width={200}
            height={200}
          />
        ))}
    </div>
    <div className={styles.column}>
      {resultsMapping.map((result, index) => (
        <Image
          key={`resultsMapping3_${index}`}
          src={result}
          width={200}
          height={200}
        />
      ))}
    </div>
  </div>
);
export default Spinner;
