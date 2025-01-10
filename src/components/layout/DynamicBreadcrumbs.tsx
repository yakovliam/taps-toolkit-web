import { useLocation, useNavigate } from "react-router";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";

const capitalize = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const DynamicBreadcrumbs = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { pathname } = location;

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {pathname
          .split("/")
          .filter((part) => part !== "")
          .map((part, index, parts) => {
            const isLast = index === parts.length - 1;
            const link = parts.slice(0, index + 1).join("/");
            return isLast ? (
              <BreadcrumbItem key={part}>
                <BreadcrumbPage>{capitalize(part)}</BreadcrumbPage>
              </BreadcrumbItem>
            ) : (
              <div key={part} className="flex items-center space-x-2 cursor-pointer">
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink onClick={() => navigate(link)}>
                    {capitalize(part)}
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
              </div>
            );
          })}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default DynamicBreadcrumbs;
