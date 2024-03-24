import { Plugin } from '@ckeditor/ckeditor5-core';
import { FileRepository } from 'ckeditor5/src/upload';
/**
 * The Upload adapter allows uploading images to an application running on your server using
 *
 * ```ts
 * ClassicEditor
 *   .create(document.querySelector('#editor'), {
 *     customUpload: {
 *       onUpload: (file) => {
 *         // do any upload stuff here with the JS-File-Object
 *         return Promise.resolve('http://server/default-size.image.png')
 *       },
 *       obAbort: () => {
 *         // abort the upload here. The promise from onImageUpload should be rejected after that.
 *       }
 *     }
 *   })
 *   .then( ... )
 *   .catch( ... );
 * ```
 */
export default class CustomUploadAdapter extends Plugin {
    static get requires(): readonly [typeof FileRepository];
    static get pluginName(): "CustomUploadAdapter";
    init(): void;
}
