import DesktopHeader from "./desktop-header";
import MobileHeader from "./mobile-header";

const Header = () => {
  return (
    <div className="print:hidden w-full flex justify-center px-5">
      <DesktopHeader></DesktopHeader>
      <MobileHeader></MobileHeader>
    </div>
  );
};

export default Header;
