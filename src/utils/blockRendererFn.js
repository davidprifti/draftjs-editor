import AtomicBlock from "../components/mutable-components/atomic-block/atomic-block.component";

export const blockRendererFn = (contentBlock) => {
  const type = contentBlock.getType();

  if (type === "header-one") {
    return {
      component: AtomicBlock,
      editable: true,
      props: { plainText: contentBlock.getText() },
    };
  }
};
