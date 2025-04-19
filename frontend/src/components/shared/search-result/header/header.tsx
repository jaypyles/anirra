import styles from "./header.module.css";

export type SearchHeaderProps = {
  children?: React.ReactNode;
};

export const SearchHeader = ({ children }: SearchHeaderProps) => {
  return <div className={styles.header}>{children}</div>;
};
