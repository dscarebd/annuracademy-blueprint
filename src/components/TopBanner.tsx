import { useSiteContent } from "@/hooks/useSiteContent";

const TopBanner = () => {
  const { data: content } = useSiteContent("top_banner_text");
  
  const bannerText = content?.value || '২০% ডিসকাউন্ট পেতে কুপন কোড "GIFT20"';

  return (
    <div className="gradient-purple text-white py-2 text-center text-sm font-medium">
      {bannerText}
    </div>
  );
};

export default TopBanner;
