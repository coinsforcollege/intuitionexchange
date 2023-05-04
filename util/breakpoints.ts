const breakpoints = {
  xs: "0px",
  sm: "576px",
  md: "768px",
  lg: "992px",
  xl: "1200px",
  xxl: "1600px",
} as const;

const mq = {
  xs: `@media (min-width: ${breakpoints["xs"]})`,
  sm: `@media (min-width: ${breakpoints["sm"]})`,
  md: `@media (min-width: ${breakpoints["md"]})`,
  lg: `@media (min-width: ${breakpoints["lg"]})`,
  xl: `@media (min-width: ${breakpoints["xl"]})`,
  xxl: `@media (min-width: ${breakpoints["xxl"]})`,
};

export default mq;
