export const blockStyleFn = (contentBlock) => {
  const type = contentBlock.getType();

  if (type === "paragraph-left") {
    return "align-left";
  } else if (type === "paragraph-center") {
    return "align-center";
  } else if (type === "paragraph-right") {
    return "align-right";
  } else if (type === "paragraph-justify") {
    return "align-justify";
  } else if (type === "header-one-left") {
    return "align-left header-one";
  }

  return "";
};
