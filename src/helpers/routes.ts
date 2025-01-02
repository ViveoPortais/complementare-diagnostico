import { HiOutlineDocumentReport } from "react-icons/hi";
import { MdOutlinePhotoLibrary } from "react-icons/md";
import { LuClipboardList } from "react-icons/lu";
import { HiOutlineDocumentAdd } from "react-icons/hi";
import { TbBuildingHospital, TbReport } from "react-icons/tb";
import { IconType } from "react-icons/lib";
import { IoHomeOutline, IoStopwatchOutline, IoPeopleCircleOutline, IoAddCircleOutline } from "react-icons/io5";

interface IProfileProps {
  route: string;
  text: string;
  icon: IconType;
}

interface IRouteProps {
  [key: string]: IProfileProps[];
}

export const routes: IRouteProps = {
};
