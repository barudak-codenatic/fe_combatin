'use client'
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React from 'react';
import { IoArrowBackOutline } from "react-icons/io5";

export interface Crumb {
  label: string;
  href: string;
}

interface BreadcrumbProps {
  crumbs: Crumb[];
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ crumbs }) => {
  const router = useRouter()
  return (
    <nav className="text-lg py-3" aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center">
      <li className="flex items-center gap-2 rounded-md py-1">
        <button
          className="p-2 hover:bg-gray-200 rounded-full flex items-center justify-center"
          onClick={() => router.back()}
        >
          <IoArrowBackOutline color="black" />
        </button>
        <Link
          href="/module"
          className="hover:bg-gray-200 px-3 py-1 rounded-full"
        >
          Dashboard
        </Link>
        {crumbs.length > 0 && <span className="mx-[1px]">/</span>}
      </li>
        {crumbs.map((crumb, index) => {
          const isLast = index === crumbs.length - 1;
          return (
            <li key={index} className="flex items-center">
              {!isLast ? (
                <>
                  <Link href={crumb.href} className="px-3 py-1 rounded-full hover:bg-gray-200 ">{crumb.label}</Link>
                  <span className="mx-1">/</span>
                </>
              ) : (
                <span className="text-gray-500 px-3 py-1 rounded-full" aria-current="page">{crumb.label}</span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
