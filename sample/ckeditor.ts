import {
  Autoformat,
  // Base64UploadAdapter,
  BlockQuote,
  Bold,
  ClassicEditor,
  Code,
  CodeBlock,
  Essentials,
  Heading,
  Image,
  ImageCaption,
  ImageStyle,
  ImageToolbar,
  ImageUpload,
  Indent,
  Italic,
  Link,
  List,
  MediaEmbed,
  Paragraph,
  Table,
  TableToolbar,
} from 'ckeditor5'

import CKEditorInspector from '@ckeditor/ckeditor5-inspector'

import { CustomUploadAdapter, ImageUploadAdapter } from '../src/index.js'

import 'ckeditor5/ckeditor5.css'

declare global {
  interface Window {
    editor: ClassicEditor
  }
}

ClassicEditor
  .create(document.getElementById('editor')!, {
    plugins: [
      // CustomUploadAdapter,
      ImageUploadAdapter,
      // Base64UploadAdapter,

      Essentials,
      Autoformat,
      BlockQuote,
      Bold,
      Heading,
      Image,
      ImageCaption,
      ImageStyle,
      ImageToolbar,
      ImageUpload,
      Indent,
      Italic,
      Link,
      List,
      MediaEmbed,
      Paragraph,
      Table,
      TableToolbar,
      CodeBlock,
      Code,
    ],
    toolbar: [
      'undo',
      'redo',
      '|',
      'heading',
      '|',
      'bold',
      'italic',
      'link',
      'code',
      'bulletedList',
      'numberedList',
      '|',
      'outdent',
      'indent',
      '|',
      'uploadImage',
      'blockQuote',
      'insertTable',
      'mediaEmbed',
      'codeBlock',
    ],
    imageUpload: {
      uploadUrl: 'https://localhost:8081/upload',
    },
    // customUpload: {
    //   onUpload: (_file) => {
    //     console.log(_file)
    //     // do any upload stuff here with the JS-File-Object
    //     return Promise.resolve({ url: 'http://server/default-size.image.png' })
    //   },
    //   onAbort: () => {
    //     // abort the upload here. The promise from onImageUpload should be rejected after that.
    //   },
    // },
    image: {
      toolbar: [
        'imageStyle:inline',
        'imageStyle:block',
        'imageStyle:side',
        '|',
        'imageTextAlternative',
      ],
    },
    table: {
      contentToolbar: [
        'tableColumn',
        'tableRow',
        'mergeTableCells',
      ],
    },
  })
  .then((editor) => {
    window.editor = editor
    CKEditorInspector.attach(editor)
    window.console.log('CKEditor 5 is ready.', editor)
  })
  .catch((err) => {
    window.console.error(err.stack)
  })
