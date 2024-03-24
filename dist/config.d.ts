import type { UploadResponse } from 'ckeditor5/src/upload';
/**
 * The configuration of the UploadAdapter
 *
 * ```ts
 * ClassicEditor
 *   .create(editorElement, {
 *     imageUpload: {
 *       // The URL the images are uploaded to.
 *       uploadUrl: 'http://example.com',
 *
 *       // Headers sent along with the XMLHttpRequest to the upload server.
 *       headers: {
 *         ...
 *       }
 *     }
 *   } );
 *   .then( ... )
 *   .catch( ... );
 * ```
 */
export interface ImageUploadConfig {
    /**
     * The path (URL) to the server (application) which handles the file upload. When specified, enables the automatic
     * upload of resources (images) inserted into the editor content.
     */
    uploadUrl: string;
    /**
     * An object that defines additional [headers](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers) sent with
     * the request to the server during the upload. This is the right place to implement security mechanisms like
     * authentication and [CSRF](https://developer.mozilla.org/en-US/docs/Glossary/CSRF) protection.
     *
     * ```ts
     * ClassicEditor
     *   .create(editorElement, {
     *     imageUpload: {
     *       headers: {
     *         'X-CSRF-TOKEN': 'CSRF-Token',
     *         Authorization: 'Bearer <JSON Web Token>'
     *       }
     *     }
     *   });
     *   .then( ... )
     *   .catch( ... );
     * ```
     */
    headers?: Record<string, string>;
    /**
     * An object that defines additional parameters sent with the request to the server during the upload.
     *
     * ```ts
     * ClassicEditor
     *   .create(editorElement, {
     *     imageUpload: {
     *       params: {
     *         foo: 'bar',
     *         text: new Blob(["Another text"], { type: "text/plain" })
     *       }
     *     }
     *   });
     *   .then( ... )
     *   .catch( ... );
     * ```
     */
    params?: Record<string, string | Blob>;
    /**
     * This flag enables the
     * [`withCredentials`](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/withCredentials)
     * property of the request sent to the server during the upload. It affects cross-site requests only and, for instance,
     * allows credentials such as cookies to be sent along with the request.
     *
     * ```ts
     * ClassicEditor
     *   .create(editorElement, {
     *     imageUpload: {
     *       withCredentials: true
     *     }
     *   });
     *   .then( ... )
     *   .catch( ... );
     * ```
     *
     * @default false
     */
    withCredentials?: boolean;
}
/**
 * The configuration of the CustomUploadAdapter
 *
 * ```ts
 * ClassicEditor
 *   .create(editorElement, {
 *     customUpload: {
 *       onUpload: (file) => {
 *         // do any upload stuff here with the JS-File-Object
 *       },
 *       obAbort: () => {
 *         // abort the upload here. The promise from onImageUpload should be rejected after that.
 *       }
 *     }
 *   } );
 *   .then( ... )
 *   .catch( ... );
 * ```
 */
export interface CustomUploadConfig {
    /**
     * The function that is called when the file is ready to be uploaded. It should return a promise that resolves to the
     * `UploadResponse` object.
     *
     * ```ts
     * ClassicEditor
     *   .create(editorElement, {
     *     onUpload: (file) => {
     *       return Promise.resolve('http://server/default-size.image.png')
     *     }
     *   });
     *   .then( ... )
     *   .catch( ... );
     * ```
     */
    onUpload: (file: File) => Promise<UploadResponse>;
    /**
     * The function that is called when the upload process should be aborted.
     *
     * ```ts
     * ClassicEditor
     *   .create(editorElement, {
     *     obAbort: {
     *       console.log('Upload abort');
     *     }
     *   });
     *   .then( ... )
     *   .catch( ... );
     * ```
     */
    onAbort?: () => void;
}
