import { useNavigate, useParams, useLocation } from "react-router-dom";

export const UseAppNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { slug } = useParams();

  const getUrlInfo = () => {
    const pathParts = location.pathname.split("/").filter(Boolean);

    let currentSlug = slug;
    if (!currentSlug && pathParts.length >= 2) {
      currentSlug = pathParts[1];
    }

    const isLED = location.pathname.includes("/led-display");

    return { currentSlug, isLED };
  };

  const { currentSlug, isLED } = getUrlInfo();

  return {
    currentSlug,
    isLED,
    navigate,
    location,
  };
};
