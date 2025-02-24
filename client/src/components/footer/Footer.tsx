'use client';


import { FOOTER_LINKS } from '@/Constants';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';


const Footer = () => {
  const pathname = usePathname();

  return (
    <footer className="bg-white py-8 md:py-12 border-t border-gray-200">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {FOOTER_LINKS.map((item, idx) => (
            <div key={idx} className="md:text-left">
              <h4 className="font-semibold text-lg mb-4">{item.title}</h4>
              <ul className="space-y-2">
                {item.subMenuItems?.map((subItem, subIdx) => (
                  <li key={subIdx}>
                    <Link
                      href={subItem.path}
                      className={cn(
                        "text-gray-600 hover:text-gray-800 transition-colors duration-300",
                        subItem.path === pathname ? "font-bold" : ""
                      )}
                    >
                      {subItem.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-8 text-center text-gray-500">
          &copy; {new Date().getFullYear()} Assume Breach. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;