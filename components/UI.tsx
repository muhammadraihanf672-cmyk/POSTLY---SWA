
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'outline';
  isLoading?: boolean;
  icon?: LucideIcon;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  className = '', 
  isLoading,
  icon: Icon,
  ...props 
}) => {
  const baseStyle = "inline-flex items-center justify-center px-6 py-3.5 text-sm font-bold rounded-2xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]";
  
  const variants = {
    primary: "text-white bg-blue-600 hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/25 focus:ring-blue-500 dark:bg-blue-600 dark:hover:bg-blue-500 shadow-md shadow-blue-500/10",
    secondary: "text-slate-700 bg-slate-100 hover:bg-slate-200 focus:ring-slate-500 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700",
    success: "text-white bg-emerald-600 hover:bg-emerald-700 hover:shadow-lg hover:shadow-emerald-500/25 focus:ring-emerald-500 dark:bg-emerald-600 dark:hover:bg-emerald-500 shadow-md shadow-emerald-500/10",
    outline: "border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 focus:ring-blue-500 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-200 dark:hover:bg-slate-800 shadow-sm",
  };

  return (
    <button className={`${baseStyle} ${variants[variant]} ${className}`} disabled={isLoading || props.disabled} {...props}>
      {isLoading ? (
        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : Icon ? (
        <Icon className="mr-2.5 h-4 w-4" />
      ) : null}
      {children}
    </button>
  );
};

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const Input: React.FC<InputProps> = ({ label, id, className = '', ...props }) => (
  <div className="w-full">
    <label htmlFor={id} className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 ml-1">{label}</label>
    <input
      id={id}
      className={`appearance-none block w-full px-4 py-3 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 sm:text-sm bg-white dark:bg-slate-900 dark:text-white transition-all ${className}`}
      {...props}
    />
  </div>
);

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
}

export const TextArea: React.FC<TextAreaProps> = ({ label, id, className = '', ...props }) => (
  <div className="w-full">
    <label htmlFor={id} className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 ml-1">{label}</label>
    <textarea
      id={id}
      rows={4}
      className={`appearance-none block w-full px-4 py-3 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 sm:text-sm bg-white dark:bg-slate-900 dark:text-white transition-all ${className}`}
      {...props}
    />
  </div>
);

interface SelectOption {
  value: string;
  label: string;
}

export interface SelectGroup {
  label: string;
  options: SelectOption[];
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options?: SelectOption[];
  groups?: SelectGroup[];
}

export const Select: React.FC<SelectProps> = ({ label, id, options, groups, className = '', ...props }) => (
  <div className="w-full">
    <label htmlFor={id} className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 ml-1">{label}</label>
    <div className="relative">
      <select
        id={id}
        className={`block w-full pl-4 pr-10 py-3 text-base border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 sm:text-sm rounded-2xl bg-white dark:bg-slate-900 dark:text-white appearance-none transition-all ${className}`}
        {...props}
      >
        {groups ? (
          groups.map((group, idx) => (
            <optgroup key={idx} label={group.label} className="dark:bg-slate-900 dark:text-slate-500 font-bold">
              {group.options.map((opt) => (
                <option key={opt.value} value={opt.value} className="dark:bg-slate-900 dark:text-white text-slate-900 font-normal">
                  {opt.label}
                </option>
              ))}
            </optgroup>
          ))
        ) : (
          options?.map((opt) => (
            <option key={opt.value} value={opt.value} className="dark:bg-slate-900 dark:text-white">
              {opt.label}
            </option>
          ))
        )}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
        <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
        </svg>
      </div>
    </div>
  </div>
);
