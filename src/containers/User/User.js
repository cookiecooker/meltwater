import React, { Component } from 'react';
import { Upload, Button, Icon, Input, message } from 'antd';
import { 
    SIZE, 
    TEXT_PLAIN , 
    NUMBER_LIMIT, 
    SIZE_LIMIT,
    REPLACE_WORDS,
    UPLOADING,
    checkSplit, 
    checkEnclose 
} from '../../constants/constants';
import { withRouter } from 'react-router';

import styles from "./styles";

class User extends Component {

    state = {
        value: '',
        text: '',
        name: '',
        type: '',
        keyWords: '',
        totalNum: 0,
        fileList: []
    }

    onPressEnter = this.onPressEnter.bind(this);
    onTextChange = this.onTextChange.bind(this);
    onChange = this.onChange.bind(this);
    onRemove = this.onRemove.bind(this);
    onClick = this.onClick.bind(this);
    splitKeyWords = this.splitKeyWord.bind(this);
    beforeUpload = this.beforeUpload.bind(this);
    readFile = this.readFile.bind(this);

    beforeUpload(file, fileList) {

        const { size = 0} = file;
        const totalNum = this.state.totalNum + 1;

        if (totalNum > 3) {
            message.info(NUMBER_LIMIT);
            return Promise.reject();
        } 

        if (size > SIZE) {
            message.info(SIZE_LIMIT);
            return Promise.reject();
        }

        this.setState({ totalNum });
    }

    onChange(info) {
        if (info.file.status !== UPLOADING) {
             const { fileList = {} } =  info;
             this.setState({ fileList });
        }
    }

    onRemove(file) {
        const totalNum = this.state.totalNum - 1;
        this.setState({ totalNum });
    }

    readFile(file) {

        let reader = new FileReader();
        reader.readAsText(file.originFileObj);
        reader.onload = (event) => this.splitKeyWord(event, file.name, file.type);
    }

    splitKeyWord(event, name, type) {

        const { target: { result = '' } } = event;

        const list = [];
        let split = 0;
        let isEnclose = false;
        let text = result;
        const words = this.state.keyWords;

        for (let i = 0; i < words.length; i++) {
            const char = words.charAt(i);

            if (checkEnclose.hasOwnProperty(char)) {

                if (isEnclose && i - split > 1) list.push(words.substring(split, i));
                isEnclose = !isEnclose;
                split = i + 1;

            } else if (!isEnclose && checkSplit.hasOwnProperty(char)) {
                if (i - split > 1) list.push(words.substring(split, i));
                split = i + 1;
            }
        }

        if (split < words.length)
            list.push(words.substring(split, words.length));
 
        for (let keyword of list) {
            text = text.replace(keyword,REPLACE_WORDS);
        }

        const element = document.createElement("a");
        const file = new Blob([text], { type });
        element.href = URL.createObjectURL(file);
        element.download = name;
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    }


    onPressEnter(event) {

        const { target: { value = '' } } = event;
        this.setState({ keyWords: value });
        this.state.fileList.forEach(this.readFile);
    }

    onTextChange(event) {
        const { target: { value = '' } } = event;
        this.setState({ keyWords: value });
    }

    onClick() {
        this.state.fileList.forEach(this.readFile);
    }


    render() {

        const {
            app,
            upload,
            input,
            button
        } = styles;

        return (
            <div style={app}>
                
                <Upload
                    style={upload}
                    accept={[TEXT_PLAIN]}
                    onChange={this.onChange}
                    beforeUpload={this.beforeUpload}
                    onRemove={this.onRemove}
                >
                    <Button>
                        <Icon type="upload" /> Click to Upload
                    </Button>
                </Upload>
                
                <Input 
                    style={input}
                    onPressEnter={this.onPressEnter} 
                    onChange={this.onTextChange}
                />
                <Button 
                    style={button}
                    onClick={this.onClick}
                >
                    process
                </Button>
            </div>
        );
    }
}

export default withRouter(User);
