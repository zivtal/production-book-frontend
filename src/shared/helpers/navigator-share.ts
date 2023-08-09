export const navigatorShare = async (data: ShareData): Promise<void> => {
  if (!navigator.share && (!data.files || !navigator.canShare({ files: data.files }))) {
    return;
  }

  await navigator.share(data);
};
