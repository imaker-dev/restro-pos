// // Breadcrumb.jsx
// import React, { useEffect } from 'react';
// import { Link, useLocation } from 'react-router-dom';
// import { ChevronRight } from 'lucide-react';

// const Breadcrumb = () => {
//   const location = useLocation();

//   useEffect(() => {
//     if (location.search) {
//       const params = new URLSearchParams(location.search);
      
//       // Store current path's params
//       const currentData = {
//         timestamp: Date.now(),
//         path: location.pathname,
//         params: Object.fromEntries(params.entries())
//       };
      
//       // Get existing data
//       const existing = JSON.parse(sessionStorage.getItem('navHistory') || '[]');
      
//       // Add new entry
//       const updated = [...existing.filter(item => item.path !== location.pathname), currentData];
      
//       // Keep only last 5 entries
//       const trimmed = updated.slice(-5);
      
//       sessionStorage.setItem('navHistory', JSON.stringify(trimmed));
//     }
//   }, [location]);

//   const getBreadcrumbUrl = (targetPath) => {
//     const history = JSON.parse(sessionStorage.getItem('navHistory') || '[]');
    
//     // Find the most recent entry for this path
//     const entry = history
//       .filter(item => item.path === targetPath)
//       .sort((a, b) => b.timestamp - a.timestamp)[0];
    
//     if (entry && entry.params) {
//       const params = new URLSearchParams(entry.params);
      
//       // For floors route, we only want outletId
//       if (targetPath === '/outlets/floors') {
//         const outletId = params.get('outletId');
//         if (outletId) {
//           return `/outlets/floors?outletId=${outletId}`;
//         }
//       }
      
//       // For tables route, we want both floorId and outletId
//       if (targetPath === '/outlets/floors/tables') {
//         const floorId = params.get('floorId');
//         const outletId = params.get('outletId');
//         if (floorId) {
//           if (outletId) {
//             return `/outlets/floors/tables?floorId=${floorId}&outletId=${outletId}`;
//           }
//           return `/outlets/floors/tables?floorId=${floorId}`;
//         }
//       }
      
//       // For other routes, use all stored params
//       return `${targetPath}?${params.toString()}`;
//     }
    
//     return targetPath;
//   };

//   const generateBreadcrumbs = () => {
//     const paths = location.pathname.split("/").filter(Boolean);

//     return (
//       <nav className="flex items-center flex-wrap text-sm text-gray-500 gap-1">
//         <Link
//           to="/"
//           className="hover:text-primary-600 transition-colors font-medium"
//         >
//           Dashboard
//         </Link>

//         {paths.map((segment, index) => {
//           const basePath = "/" + paths.slice(0, index + 1).join("/");
//           const isLast = index === paths.length - 1;
//           const fullPath = getBreadcrumbUrl(basePath);

//           const label =
//             segment.charAt(0).toUpperCase() +
//             segment.slice(1).replace(/-/g, " ");

//           return (
//             <React.Fragment key={fullPath}>
//               <ChevronRight className="w-4 h-4 text-gray-400 mx-1" />

//               {isLast ? (
//                 <span className="font-semibold text-gray-800 truncate max-w-[150px]">
//                   {label}
//                 </span>
//               ) : (
//                 <Link
//                   to={fullPath}
//                   className="hover:text-primary-600 transition-colors truncate max-w-[140px]"
//                 >
//                   {label}
//                 </Link>
//               )}
//             </React.Fragment>
//           );
//         })}
//       </nav>
//     );
//   };

//   return generateBreadcrumbs();
// };

// export default Breadcrumb;


// Breadcrumb.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const Breadcrumb = () => {
  const location = useLocation();

  const getBreadcrumbUrl = (targetPath) => {
    const currentParams = new URLSearchParams(location.search);
    
    // When on /outlets/floors/tables?floorId=1
    if (location.pathname === '/outlets/floors/tables') {
      const floorId = currentParams.get('floorId');
      const outletId = currentParams.get('outletId');
      
      // If clicking "Floors" breadcrumb
      if (targetPath === '/outlets/floors') {
        // Need outletId for floors route
        if (outletId) {
          return `/outlets/floors?outletId=${outletId}`;
        }
        // If outletId is not in current URL but floors need it,
        // we might need to keep it from some other source
        // For now, just return without params
        return targetPath;
      }
      
      // If clicking "Outlets" breadcrumb
      if (targetPath === '/outlets') {
        return targetPath; // No params needed for outlets list
      }
    }
    
    // When on /outlets/floors?outletId=4
    if (location.pathname === '/outlets/floors') {
      const outletId = currentParams.get('outletId');
      
      // If clicking "Outlets" breadcrumb
      if (targetPath === '/outlets') {
        return targetPath; // No params needed
      }
    }
    
    // For current page or other cases
    return targetPath;
  };

  const generateBreadcrumbs = () => {
    const paths = location.pathname.split("/").filter(Boolean);

    return (
      <nav className="flex items-center flex-wrap text-sm text-gray-500 gap-1">
        <Link
          to="/"
          className="hover:text-primary-600 transition-colors font-medium"
        >
          Dashboard
        </Link>

        {paths.map((segment, index) => {
          const basePath = "/" + paths.slice(0, index + 1).join("/");
          const isLast = index === paths.length - 1;
          const routeTo = getBreadcrumbUrl(basePath);

          const label =
            segment.charAt(0).toUpperCase() +
            segment.slice(1).replace(/-/g, " ");

          return (
            <React.Fragment key={routeTo}>
              <ChevronRight className="w-4 h-4 text-gray-400 mx-1" />

              {isLast ? (
                <span className="font-semibold text-gray-800 truncate max-w-[150px]">
                  {label}
                </span>
              ) : (
                <Link
                  to={routeTo}
                  className="hover:text-primary-600 transition-colors truncate max-w-[140px]"
                >
                  {label}
                </Link>
              )}
            </React.Fragment>
          );
        })}
      </nav>
    );
  };

  return generateBreadcrumbs();
};

export default Breadcrumb;