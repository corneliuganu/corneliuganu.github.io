import { Helmet } from "react-helmet-async";
import { useBrandingSettings } from "@/hooks/use-site-content";

const Favicon = () => {
  const branding = useBrandingSettings();
  const href = branding.favicon || "/favicon.ico";

  return (
    <Helmet>
      <link rel="icon" href={href} />
    </Helmet>
  );
};

export default Favicon;

