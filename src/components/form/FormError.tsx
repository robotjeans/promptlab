interface FormErrorProps {
  message: string;
  className?: string;
}

export const FormError = ({ message, className = "" }: FormErrorProps) => {
  if (!message) return null;

  return (
    <div
      className={`mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm ${className}`}
    >
      {message}
    </div>
  );
};
