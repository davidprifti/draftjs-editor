module.exports.options = {
  inlineStyles: {
    CUSTOM_FONT_SIZE_8px: { style: { fontSize: "8px" } },
    CUSTOM_FONT_SIZE_12px: { style: { fontSize: "12px" } },
    CUSTOM_FONT_SIZE_14px: { style: { fontSize: "14px" } },
    CUSTOM_FONT_SIZE_16px: { style: { fontSize: "16px" } },
    CUSTOM_FONT_SIZE_18px: { style: { fontSize: "18px" } },
    CUSTOM_FONT_SIZE_20px: { style: { fontSize: "20px" } },
    CUSTOM_FONT_SIZE_24px: { style: { fontSize: "24px" } },
    CUSTOM_FONT_SIZE_28px: { style: { fontSize: "28px" } },
    CUSTOM_FONT_SIZE_32px: { style: { fontSize: "32px" } },
    CUSTOM_FONT_SIZE_38px: { style: { fontSize: "38px" } },
    CUSTOM_FONT_SIZE_46px: { style: { fontSize: "46px" } },
    CUSTOM_FONT_SIZE_54px: { style: { fontSize: "54px" } },
    CUSTOM_FONT_SIZE_62px: { style: { fontSize: "62px" } },
    CUSTOM_FONT_SIZE_72px: { style: { fontSize: "72px" } },
    "CUSTOM_LINE_HEIGHT_1.2": { style: { lineHeight: "1.2" } },
    "CUSTOM_LINE_HEIGHT_1.4": { style: { lineHeight: "1.4" } },
    "CUSTOM_LINE_HEIGHT_1.6": { style: { lineHeight: "1.6" } },
    "CUSTOM_LINE_HEIGHT_1.8": { style: { lineHeight: "1.8" } },
    CUSTOM_LINE_HEIGHT_2: { style: { lineHeight: "2" } },
    "CUSTOM_LINE_HEIGHT_2.2": { style: { lineHeight: "2.2" } },
    "CUSTOM_LINE_HEIGHT_2.5": { style: { lineHeight: "2.5" } },
    CUSTOM_LINE_HEIGHT_3: { style: { lineHeight: "3" } },
    CUSTOM_FONT_FAMILY_Monospace: { style: { fontFamily: "Monospace" } },
    "CUSTOM_FONT_FAMILY_Times New Roman": {
      style: { fontFamily: "Times New Roman" },
    },
    CUSTOM_FONT_FAMILY_Arial: { style: { fontFamily: "Arial" } },
    "CUSTOM_FONT_FAMILY_Lucida Console": {
      style: { fontFamily: "Lucida Console" },
    },
  },

  entityStyleFn: (entity) => {
    const entityType = entity.get("type").toLowerCase();
    if (entityType === "image") {
      const data = entity.getData();
      return {
        element: "img",
        attributes: {
          src: data.src,
        },
        style: {
          width: `${data.width}%`,
          alignContent: `${data.alignment}`,
        },
      };
    }
  },

  blockStyleFn: (block) => {
    if (
      block.getType() === "paragraph-left" ||
      block.getType() === "paragraph-center" ||
      block.getType() === "paragraph-right" ||
      block.getType() === "paragraph-justify"
    ) {
      return {
        style: {
          textAlign: block.getType().split(new RegExp("paragraph-")).join(""),
        },
      };
    }
  },
};
