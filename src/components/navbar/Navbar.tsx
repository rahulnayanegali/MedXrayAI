'use client'; // Required for client-side interactions

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { MdDashboard } from "react-icons/md";
import { TbReportMedical } from "react-icons/tb";
import Medexericon from "./medex-w";
import Logo from '../../img/Logo.png';

const Navbar = () => {
  const pathname = usePathname(); // Get current route path

  // Next.js handles active states through path matching
  const isDashboardActive = pathname === '/';
  const isMedexerActive = pathname === '/medexer';
  const isReportActive = pathname === '/reportgall';

  // Type definitions for style classes
  const activeClassName = 'text-white';
  const normalLink = 'text-customBasewhite-30';
  const iconactive = 'white';
  const icon = 'rgba(255, 255, 255, 0.3)';

  return (
    <div className="h-full w-fit p-5 bg-primary flex-col justify-start items-start gap-2.5 inline-flex rounded-r-[10px]">
      <div className="self-stretch h-full flex-col justify-between items-center flex gap-9">
        <div className="flex-col justify-start items-center gap-2.5 flex">
          <div className="w-[180px] h-[180px] justify-center items-center inline-flex">
            <Image 
              src={Logo} 
              alt="Logo" 
              width={180}
              height={180}
              priority
            />
          </div>
        </div>
        
        <div className="self-stretch grow shrink basis-0 flex-col justify-start items-center flex p-6">
          <div className="self-stretch flex-col justify-between items-start flex gap-5">
            {/* Dashboard Link
            <div className="w-fit justify-start items-center gap-3 inline-flex">
              <MdDashboard className={`${isDashboardActive ? activeClassName : normalLink} w-[20px] h-[20px]`} />
              <Link 
                href="/"
                className={isDashboardActive ? activeClassName : normalLink}
              >
                Dashboard
              </Link>
            </div> */}

            {/* Medexer Link */}
            <div className="w-fit justify-start items-center gap-3 inline-flex">
              <Medexericon fill={isMedexerActive ? iconactive : icon} />
              <Link 
                href="/medexer"
                className={isMedexerActive ? activeClassName : normalLink}
              >
                Medexer
              </Link>
            </div>

            {/* Report Link */}
            <div className="w-fit justify-start items-center gap-3 inline-flex">
              <TbReportMedical className={`${isReportActive ? activeClassName : normalLink} w-[20px] h-[20px]`} />
              <Link 
                href="/reportgall"
                className={isReportActive ? activeClassName : normalLink}
              >
                Report
              </Link>
            </div>

            {/* Future Profile Link (commented out) */}
            {/* <div className="w-fit justify-start items-center gap-3 inline-flex">
              <IoMdPerson className={`${pathname === '/profile' ? activeClassName : normalLink} w-[20px] h-[20px]`} />
              <Link
                href="/profile"
                className={pathname === '/profile' ? activeClassName : normalLink}
              >
                Profile
              </Link>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
