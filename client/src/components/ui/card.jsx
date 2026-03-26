import React from 'react';

export function Card({ className = '', children }) {
  return (
    <div className={`rounded-xl border border-slate-200 bg-white shadow-sm ${className}`}>
      {children}
    </div>
  );
}

export function CardHeader({ className = '', children }) {
  return <div className={`px-6 pt-6 ${className}`}>{children}</div>;
}

export function CardTitle({ className = '', children }) {
  return <h3 className={`text-lg font-semibold text-slate-900 ${className}`}>{children}</h3>;
}

export function CardDescription({ className = '', children }) {
  return <p className={`text-sm text-slate-600 ${className}`}>{children}</p>;
}

export function CardContent({ className = '', children }) {
  return <div className={`px-6 py-6 ${className}`}>{children}</div>;
}
