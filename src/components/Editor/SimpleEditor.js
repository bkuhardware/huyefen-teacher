import React, { useRef } from 'react';
import classNames from 'classnames';
import { Button, Tooltip, Icon } from 'antd';
import { Editor, RichUtils } from 'draft-js';
import styles from './index.less';

const SimpleEditor = ({ placeholder, editorState, onChange }) => {
    const editorRef = useRef(null);
    const handleFocus = () => editorRef.current.focus();
    const handleKeyCommand = command => {
        if (command !== 'bold' && command !== 'italic') return 'not-handled';
        const newState = RichUtils.handleKeyCommand(editorState, command);
        if (newState) {
            onChange(newState);
            return 'handled';
        }
        return 'not-handled';
    };
    const handleInlineStyle = inlineStyle => e => {
        e.preventDefault();
        onChange(RichUtils.toggleInlineStyle(editorState, inlineStyle));
    };
    const inlineStyleBtnClass = inlineStyle => {
        const currentInlineStyle = editorState.getCurrentInlineStyle();
        if (currentInlineStyle.has(inlineStyle)) return classNames(styles.btn, styles.btnActive);
        return styles.btn;
    };
    return (
        <div className={styles.simpleEditor}>
            <div className={styles.buttons}>
                <Tooltip placement="top" title="Bold | Cmd+B">
                    <span className={inlineStyleBtnClass('BOLD')} onMouseDown={handleInlineStyle('BOLD')}><Icon type="bold" /></span>
                </Tooltip>
                <Tooltip placement="top" title="Italic | Cmd+I">
                    <span className={inlineStyleBtnClass('ITALIC')} onMouseDown={handleInlineStyle('ITALIC')}><Icon type="italic" /></span>
                </Tooltip>
            </div>
            <div className={styles.editor} onClick={handleFocus}>
                <Editor
                    onChange={onChange}
                    editorState={editorState}
                    placeholder={placeholder}
                    handleKeyCommand={handleKeyCommand}
                    ref={editorRef}
                />
            </div>
        </div>
    );
};

export default SimpleEditor;