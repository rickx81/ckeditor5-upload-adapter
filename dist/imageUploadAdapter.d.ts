import { Plugin } from '@ckeditor/ckeditor5-core';
import { FileRepository } from 'ckeditor5/src/upload';
/**
 * The Upload adapter allows uploading images to an application running on your server using
 * the [`XMLHttpRequest`](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest) API with a
 * minimal ImageUploadConfig
 *
 * ```ts
 * ClassicEditor
 *   .create(document.querySelector('#editor'), {
 *     imageUpload: {
 *       uploadUrl: 'http://example.com',
 *       withCredentials: true,
 *       headers: {
 *         'X-CSRF-TOKEN': 'CSRF-Token',
 *         'Authorization': 'Bearer <JSON Web Token>',
 *       },
 *       params: {
 *         foo: 'bar',
 *         text: new Blob(['Another text'], { type: 'text/plain' })
 *       }
 *     }
 *   } )
 *   .then( ... )
 *   .catch( ... );
 * ```
 */
export default class ImageUploadAdapter extends Plugin {
    static get requires(): readonly [typeof FileRepository];
    static get pluginName(): "ImageUploadAdapter";
    init(): void;
}
