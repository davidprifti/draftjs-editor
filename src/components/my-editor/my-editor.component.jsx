import React from "react";
import Editor, { composeDecorators } from "draft-js-plugins-editor";
import {
  EditorState,
  RichUtils,
  convertToRaw,
  convertFromRaw,
  ContentState,
  ContentBlock,
} from "draft-js";
import createStyles from "draft-js-custom-styles";
import axios from "axios";

import StylingHeader from "../styling-header/styling-header.component";
import createAlignmentPlugin from "draft-js-alignment-plugin";
import createImagePlugin from "draft-js-image-plugin";
import createResizeablePlugin from "draft-js-resizeable-plugin";
import createBlockDndPlugin from "draft-js-drag-n-drop-plugin";
import createFocusPlugin from "draft-js-focus-plugin";
import createVideoPlugin from "draft-js-video-plugin";
import createLinkifyPlugin from "draft-js-linkify-plugin";
import { stateToHTML } from "draft-js-export-html";
import { options } from "./htmlOptions";

import AddMedia from "../add-media/add-media.component";
import { blockRenderMap } from "../../utils/blockRenderMap";
import { blockStyleFn } from "../../utils/blockStyleFn";
import SwipeableTemporaryDrawer from "../sidebar/sidebar.component";
import DropdownMedia from "../dropdown-media/dropdown-media.component";
import {
  fontSizeOptions,
  fontFamilyOptions,
  lineHeightOptions,
} from "../dropdown-media/options";
import { faFont } from "@fortawesome/free-solid-svg-icons";
import { faTextHeight } from "@fortawesome/free-solid-svg-icons";
import { faExpandAlt } from "@fortawesome/free-solid-svg-icons";

import Footer from "../footer/footer.component";

import "./my-editor.styles.css";
import "draft-js-image-plugin/lib/plugin.css";
import "draft-js-focus-plugin/lib/plugin.css";
import "draft-js-alignment-plugin/lib/plugin.css";
import "draft-js-linkify-plugin/lib/plugin.css";
import { getCookie, setCookie } from "../../utils/cookie/cookie";
import ScrollDialog from "../scroll-dialog/scroll-dialog.component";

const { styles, customStyleFn } = createStyles([
  "font-size",
  "font-family",
  "text-align",
  "line-height",
]);

const focusPlugin = createFocusPlugin();
const resizeablePlugin = createResizeablePlugin();
const blockDndPlugin = createBlockDndPlugin();
const alignmentPlugin = createAlignmentPlugin();
const linkifyPlugin = createLinkifyPlugin({ target: "_blank" });
const { AlignmentTool } = alignmentPlugin;

const decorator = composeDecorators(
  resizeablePlugin.decorator,
  alignmentPlugin.decorator,
  focusPlugin.decorator,
  blockDndPlugin.decorator
);
const imagePlugin = createImagePlugin({ decorator });
const videoPlugin = createVideoPlugin({ decorator });

const plugins = [
  blockDndPlugin,
  focusPlugin,
  alignmentPlugin,
  resizeablePlugin,
  imagePlugin,
  videoPlugin,
  linkifyPlugin,
];

export default class MyEditor extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      editorState: EditorState.createEmpty(),
      styles: {
        isBold: false,
        isItalic: false,
        isUnderline: false,
        differentFontFamily: "Arial",
        differentFontSize: "15",
        textAlign: "left",
        lineHeight: 1.2,
      },
      savedAt: "Not saved!",
      file: null,
      zoom: 1,
      isSavingJSON: false,
      isSavingPDF: false,
      newUserModal: false,
    };
    this.setDomEditorRef = (ref) => (this.domEditor = ref);
    this.focus = () => this.domEditor.focus();
  }

  componentDidMount() {
    const cookie = getCookie("myEditorCookie");

    if (cookie === null) {
      console.log(true);
      setCookie("myEditorCookie", "test", 7);
      this.setState({ newUserModal: true });
    }
    this.domEditor.focus();
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevState.file !== this.state.file ||
      prevState.newUserModal !== this.state.newUserModal
    ) {
      this.forceUpdate();
    }
  }

  handleChange = (editorState) => {
    this.setState({ editorState, savedAt: "Not saved!" });
    this.handleClick();
  };

  onBoldClick = (e) => {
    e.preventDefault();
    this.handleChange(
      RichUtils.toggleInlineStyle(this.state.editorState, "BOLD")
    );

    const styles = {
      ...this.state.styles,
      isBold: !this.state.styles.isBold,
    };

    this.setState({ styles });
  };

  onItalicClick = (e) => {
    e.preventDefault();
    this.handleChange(
      RichUtils.toggleInlineStyle(this.state.editorState, "ITALIC")
    );

    const styles = {
      ...this.state.styles,
      isItalic: !this.state.styles.isItalic,
    };

    this.setState({ styles });
  };

  onUnderlineClick = (e) => {
    e.preventDefault();
    this.handleChange(
      RichUtils.toggleInlineStyle(this.state.editorState, "UNDERLINE")
    );

    const styles = {
      ...this.state.styles,
      isUnderline: !this.state.styles.isUnderline,
    };

    this.setState({ styles });
  };

  setLabel = (label) => {
    const styles = {
      ...this.state.styles,
      differentFontSize: label,
    };

    this.setState({ styles });
  };

  setFontLabel = (label) => {
    const styles = {
      ...this.state.styles,
      differentFontFamily: label,
    };

    this.setState({ styles });
  };

  setLineHeightLabel = (label) => {
    const styles = {
      ...this.state.styles,
      lineHeight: label,
    };

    this.setState({ styles });
  };

  setEditorState = (editorState) => {
    this.setState({ editorState });
  };

  undoEditorState = () => {
    this.setState({
      editorState: EditorState.undo(this.state.editorState),
    });
  };

  redoEditorState = () => {
    this.setState({
      editorState: EditorState.redo(this.state.editorState),
    });
  };

  saveContents = () => {
    this.setState({ isSavingJSON: true });
    const rawDraftContentState = JSON.stringify(
      convertToRaw(this.state.editorState.getCurrentContent())
    );

    axios
      .post("http://localhost:5000/convert", {
        content: rawDraftContentState,
        filename: Date.now,
      })
      .then((res) => {
        axios.get("http://localhost:5000/download").then((res) => {
          window.location.href = "http://localhost:5000/download";
          this.setState({ savedAt: "Saved!", isSavingJSON: false });
          axios
            .post("http://localhost:5000/delete", {
              filename: "newFile.json",
            })
            .then((res) => console.log(res));
        });
      })
      .catch((err) => console.log(err));
  };

  convertToPdf = () => {
    this.setState({ isSavingPDF: true });
    const { editorState } = this.state;

    const markup = stateToHTML(editorState.getCurrentContent(), options);

    axios
      .post("http://localhost:5000/create-pdf", { markup })
      .then((res) => {
        axios.get("http://localhost:5000/download-pdf").then((res) => {
          window.location.href = "http://localhost:5000/download-pdf";
          this.setState({ isSavingPDF: false });
          axios
            .post("http://localhost:5000/delete", {
              filename: "file.pdf",
            })
            .then((res) => console.log(res));
        });
      })
      .catch((err) => console.log(err));
  };

  onChangeHandler = (event) => {
    if (event.target.files[0]) {
      const promise = new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = function () {
          resolve(reader.result);
        };
        reader.readAsText(event.target.files[0]);
      });

      promise.then((data) => {
        const editorState = convertFromRaw(JSON.parse(data));
        this.setState({
          editorState: EditorState.createWithContent(editorState),
        });
      });
    }
  };

  handleClick = () => {
    const { editorState } = this.state;
    const selectionState = editorState.getSelection();
    const currentFocus = selectionState.getFocusKey();
    const inlineStyle = editorState.getCurrentInlineStyle(currentFocus);
    const anchorKey = selectionState.getAnchorKey();
    const currentContent = editorState.getCurrentContent();
    const currentContentBlock = currentContent.getBlockForKey(anchorKey);
    const currentBlockType = currentContentBlock.getType();

    const isBold = inlineStyle.has("BOLD");
    const isItalic = inlineStyle.has("ITALIC");
    const isUnderline = inlineStyle.has("UNDERLINE");

    let differentFontFamily = inlineStyle.find((a) =>
      a.includes("CUSTOM_FONT_FAMILY")
    );

    let differentFontSize = inlineStyle.find((a) =>
      a.includes("CUSTOM_FONT_SIZE")
    );

    let differentLineHeight = inlineStyle.find((a) =>
      a.includes("CUSTOM_LINE_HEIGHT")
    );

    if (differentFontSize !== undefined) {
      differentFontSize = parseInt(
        differentFontSize
          .split("CUSTOM_FONT_SIZE_")
          .join("")
          .split("_")
          .join("")
      );
    } else {
      differentFontSize = 15;
    }

    if (differentFontFamily !== undefined) {
      differentFontFamily = differentFontFamily
        .split("CUSTOM_FONT_FAMILY_")
        .join("")
        .split("_")
        .join("");
    } else {
      differentFontFamily = "Arial";
    }

    const differentTextAlignment = currentBlockType
      .split(new RegExp("paragraph-"))
      .join("");

    if (differentLineHeight !== undefined) {
      differentLineHeight = differentLineHeight
        .split("CUSTOM_LINE_HEIGHT_")
        .join("")
        .split("_")
        .join("");
    } else {
      differentLineHeight = 1.2;
    }

    const styles = {
      isBold,
      isItalic,
      isUnderline,
      differentFontFamily,
      differentFontSize,
      textAlign: differentTextAlignment,
      lineHeight: differentLineHeight,
    };

    this.setState({ styles });
  };

  setTextAlign = (e, value) => {
    e.preventDefault();
    const newStyles = {
      ...this.state.styles,
      textAlign: value,
    };

    const { editorState } = this.state;

    const selectionState = editorState.getSelection();
    const anchorKey = selectionState.getAnchorKey();
    const currentContent = editorState.getCurrentContent();
    const currentContentBlock = currentContent.getBlockForKey(anchorKey);

    const currentContentBlockKey = currentContentBlock.getKey();
    const currentContentBlockText = currentContentBlock.getText();
    const currentContentBlockData = currentContentBlock.getData();
    const currentContentBlockCharacterList = currentContentBlock.getCharacterList();

    const newBlock = new ContentBlock({
      key: currentContentBlockKey,
      type: `paragraph-${value}`,
      text: currentContentBlockText,
      data: currentContentBlockData,
      characterList: currentContentBlockCharacterList,
    });

    const contentState = this.state.editorState.getCurrentContent();
    const newBlockMap = contentState
      .getBlockMap()
      .set(newBlock.getKey(), newBlock);

    const newEditorState = EditorState.push(
      this.state.editorState,
      ContentState.createFromBlockArray(newBlockMap.toArray()).set(
        "selectionAfter",
        contentState.getSelectionAfter().merge({
          anchorKey: newBlock.getKey(),
          anchorOffset: 0,
          focusKey: newBlock.getKey(),
          focusOffset: 0,
          isBackward: false,
        })
      ),
      "change-block-type"
    );

    this.setEditorState(newEditorState);
    this.setState({ styles: newStyles });
  };

  setEditorZoom = (zoom) => {
    this.setState({ zoom });
  };

  render() {
    return (
      <div>
        {this.state.newUserModal ? (
          <ScrollDialog newUserModal={this.state.newUserModal} />
        ) : null}

        <div className="wrapper">
          <StylingHeader
            onBoldClick={this.onBoldClick}
            onItalicClick={this.onItalicClick}
            onUnderlineClick={this.onUnderlineClick}
            undoEditorState={this.undoEditorState}
            redoEditorState={this.redoEditorState}
            saveContents={this.saveContents}
            onChangeHandler={this.onChangeHandler}
            convertToPdf={this.convertToPdf}
            setTextAlign={this.setTextAlign}
            savedAt={this.state.savedAt}
            styles={this.state.styles}
          />

          <DropdownMedia
            editorState={this.state.editorState}
            setEditorState={this.setEditorState}
            styles={styles}
            otherStyles={this.state.styles}
            setLabel={this.setLabel}
            styleOption="fontSize"
            options={fontSizeOptions}
            currentOption={this.state.styles.differentFontSize}
            icon={faExpandAlt}
            style={{ width: "35px" }}
          />

          <DropdownMedia
            editorState={this.state.editorState}
            setEditorState={this.setEditorState}
            styles={styles}
            otherStyles={this.state.styles}
            setLabel={this.setFontLabel}
            styleOption="fontFamily"
            options={fontFamilyOptions}
            currentOption={this.state.styles.differentFontFamily}
            icon={faFont}
            style={{ width: "150px" }}
          />

          <DropdownMedia
            editorState={this.state.editorState}
            setEditorState={this.setEditorState}
            styles={styles}
            otherStyles={this.state.styles}
            setLabel={this.setLineHeightLabel}
            styleOption="lineHeight"
            options={lineHeightOptions}
            currentOption={this.state.styles.lineHeight}
            icon={faTextHeight}
            style={{ width: "35px" }}
          />

          <AddMedia
            type="image"
            editorState={this.state.editorState}
            addMedia={imagePlugin.addImage}
            setEditorState={this.setEditorState}
          />

          <AddMedia
            type="video"
            editorState={this.state.editorState}
            addMedia={videoPlugin.addVideo}
            setEditorState={this.setEditorState}
          />
        </div>
        <div
          onClick={() => {
            this.focus();
            this.handleClick();
          }}
        >
          <div style={{ zoom: this.state.zoom }}>
            <Editor
              editorState={this.state.editorState}
              onChange={this.handleChange}
              spellCheck={true}
              ref={this.setDomEditorRef}
              customStyleFn={customStyleFn}
              blockStyleFn={blockStyleFn}
              blockRenderMap={blockRenderMap}
              plugins={plugins}
            />
          </div>
          <SwipeableTemporaryDrawer
            editorState={this.state.editorState}
            setEditorState={this.setEditorState}
          />
          <AlignmentTool />
          <Footer
            editorState={this.state.editorState}
            setEditorZoom={this.setEditorZoom}
            isSavingJSON={this.state.isSavingJSON}
            isSavingPDF={this.state.isSavingPDF}
          />
        </div>
      </div>
    );
  }
}
