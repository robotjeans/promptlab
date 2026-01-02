import type { SVGProps } from "react";

export const LogoIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" {...props}>
    <circle cx="20" cy="20" r="16" fill="#ED745A" />
    <path
      d="M12 12H18C20.2091 12 22 13.7909 22 16V20C22 22.2091 20.2091 24 18 24H12V12Z"
      fill="white"
    />
  </svg>
);
