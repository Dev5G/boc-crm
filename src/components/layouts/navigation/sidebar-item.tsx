import Link from '@/components/ui/link';
import { getIcon } from '@/utils/get-icon';
import * as sidebarIcons from '@/components/icons/sidebar';
import { useUI } from '@/contexts/ui.context';
import {IconType} from 'react-icons'

const SidebarItem = ({ href, icon: Icon, label }: {href: string, icon:IconType, label: string}) => {
  const { closeSidebar } = useUI();
  return (
    <Link
      href={href}
      className="text-start flex w-full items-center text-base text-body-dark focus:text-accent"
    >
      <Icon className='w-5 h-5 me-4'/>
      <span onClick={() => closeSidebar()}>{label}</span>
    </Link>
  );
};

export default SidebarItem;
