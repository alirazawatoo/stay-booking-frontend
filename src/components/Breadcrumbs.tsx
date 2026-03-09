import React from 'react';
import { Link } from 'react-router-dom';

export interface Crumb {
  label: string;
  to?: string;
}

// Every trail starts at the dashboard; the last item is the current page.
const Breadcrumbs: React.FC<{ items: Crumb[] }> = ({ items }) => {
  const trail: Crumb[] = [{ label: 'Home', to: '/dashboard' }, ...items];
  return (
    <nav aria-label="Breadcrumb" className="text-sm text-stone-500">
      <ol className="flex flex-wrap">
        {trail.map((crumb, index) => {
          const isLast = index === trail.length - 1;
          return (
            <li key={`${crumb.label}-${index}`} className="flex items-center">
              {isLast || !crumb.to ? (
                <span className="font-bold" aria-current={isLast ? 'page' : undefined}>
                  {crumb.label}
                </span>
              ) : (
                <Link to={crumb.to} className="hover:underline">
                  {crumb.label}
                </Link>
              )}
              {!isLast && <span className="mx-1" aria-hidden="true">/</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
