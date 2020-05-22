import { EditorState, genKey, ContentBlock, CharacterMetadata } from "draft-js";
import { List, Repeat } from "immutable";

export const addEmptyBlock = (type, text, editorState, styles) => {
  const selection = editorState.getSelection();
  const contentState = editorState.getCurrentContent();
  const currentBlock = contentState.getBlockForKey(selection.getEndKey());

  const blockMap = contentState.getBlockMap();
  const blocksBefore = blockMap.toSeq().takeUntil(function (v) {
    return v === currentBlock;
  });
  const blocksAfter = blockMap
    .toSeq()
    .skipUntil(function (v) {
      return v === currentBlock;
    })
    .rest();

  const newBlockKey = genKey();
  let newBlocks = [
    [
      newBlockKey,
      new ContentBlock({
        key: newBlockKey,
        type,
        text,
        characterList: List(
          Repeat(
            styles.reduce((acc, style) => {
              return CharacterMetadata.applyStyle(acc, style);
            }, CharacterMetadata.applyStyle(CharacterMetadata.create(), "")),

            text.length
          )
        ),
      }),
    ],
    [currentBlock.getKey(), currentBlock],
  ];

  const newBlockMap = blocksBefore
    .concat(newBlocks, blocksAfter)
    .toOrderedMap();

  const newContentState = contentState.merge({
    blockMap: newBlockMap,
    selectionBefore: selection,
    selectionAfter: selection,
  });

  return EditorState.push(editorState, newContentState, "insert-fragment");
};

// export const addEmptyBlock = (type, editorState, props = {}) => {
//   const contentState = editorState.getCurrentContent();

//   const contentStateWithEntity = contentState.createEntity(type, "MUTABLE", {
//     ...props,
//   });

//   const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
//   const newEditorState = EditorState.set(editorState, {
//     currentContent: contentStateWithEntity,
//   });

//   return AtomicBlockUtils.insertAtomicBlock(newEditorState, entityKey, "H111");
// };
