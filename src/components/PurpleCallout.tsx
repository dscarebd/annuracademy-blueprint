import { ReactNode } from "react";

interface PurpleCalloutProps {
  children: ReactNode;
  className?: string;
}

const PurpleCallout = ({ children, className = "" }: PurpleCalloutProps) => {
  return (
    <section className={`gradient-purple text-white py-16 md:py-24 ${className}`}>
      <div className="container mx-auto px-4 text-center">
        {children}
      </div>
    </section>
  );
};

export default PurpleCallout;
