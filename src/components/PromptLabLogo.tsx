import PromptLabLogoImg from "../assets/logo.png";

export const PromptLabLogo = ({ className = "", ...props }) => (
  <div className={`flex items-center ${className} w-auto`} {...props}>
    <img src={PromptLabLogoImg} alt="PromptLab Logo" className="h-18 w-18" />
    <span className="ml-2 font-bold text-xl text-primary">PromptLab</span>
  </div>
);
