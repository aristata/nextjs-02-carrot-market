import React from "react";
import {cls} from "../libs/utils";

interface LayoutProps {
  title?: string;
  canGoBack?: boolean;
  hasTabBar?: boolean;
  children: React.ReactNode;
}

export default function Layout({
                                 title,
                                 canGoBack,
                                 hasTabBar,
                                 children
                               }: LayoutProps) {
  return (
    <div>
      <div
        className="py-3 w-full bg-white text-lg font-medium text-gray-800 fixed border-b top-0 flex justify-center items-center">
        {title
          ? <span>{title}</span>
          : null
        }
      </div>
      <div className={cls(
        "pt-16",
        hasTabBar ? "pb-16" : ""
      )}>
        {children}
      </div>
      {hasTabBar
        ? (<nav
          className="bg-blue-300 text-gray-800 border-t fixed bottom-0 pb-10 pt-3 flex justify-between items-center"></nav>)
        : null
      }
    </div>
  )
}
