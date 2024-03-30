import classes from "./paragraph.module.css";

export function Paragraph({ children }: { children: string }) {
  return <p className={classes.paragraph}>{children}</p>;
}
