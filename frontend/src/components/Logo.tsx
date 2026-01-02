import type { SVGProps } from "react";

export const PromptLabLogo = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width="160"
    height="40"
    viewBox="0 0 160 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <circle cx="20" cy="20" r="16" fill="#ED745A" />
    <path
      d="M12 12H18C20.2091 12 22 13.7909 22 16V20C22 22.2091 20.2091 24 18 24H12V12Z"
      fill="white"
    />
    <text
      x="38"
      y="26"
      fontFamily="Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
      fontWeight="700"
      fontSize="20"
      fill="#000000"
      dominantBaseline="middle"
    >
      PromptLab
    </text>
  </svg>
);
