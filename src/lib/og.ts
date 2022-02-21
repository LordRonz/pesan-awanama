export type OpenGraphType = {
  siteName: string;
  description: string;
  templateTitle?: string;
  logo?: string;
};

export const openGraph = ({
  siteName,
  templateTitle,
  description,
  logo = 'https://lr-anon.vercel.app/fujiwara_fan.jpg',
}: OpenGraphType): string => {
  const ogLogo = encodeURIComponent(logo.trim());
  const ogSiteName = encodeURIComponent(siteName.trim());
  const ogTemplateTitle = templateTitle
    ? encodeURIComponent(templateTitle.trim())
    : undefined;
  const ogDesc = encodeURIComponent(description.trim());

  return `https://lr-og.vercel.app/api/general?siteName=${ogSiteName}&description=${ogDesc}&logo=${ogLogo}${
    ogTemplateTitle ? `&templateTitle=${ogTemplateTitle}` : ''
  }`;
};

export default openGraph;
