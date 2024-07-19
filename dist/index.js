import { Plugin, FileRepository } from 'ckeditor5';

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
 *       }
 *     }
 *   } )
 *   .then( ... )
 *   .catch( ... );
 * ```
 */ class ImageUploadAdapter extends Plugin {
    static get requires() {
        return [
            FileRepository
        ];
    }
    static get pluginName() {
        return 'ImageUploadAdapter';
    }
    init() {
        const options = this.editor.config.get('imageUpload');
        if (!options) return;
        if (!options.uploadUrl) {
            console.warn('image-upload-adapter-missing-uploadurl');
            return;
        }
        this.editor.plugins.get(FileRepository).createUploadAdapter = (loader)=>{
            return new Adapter$1(loader, options);
        };
    }
}
/**
 * Upload adapter.
 */ let Adapter$1 = class Adapter {
    /**
   * FileLoader instance to use during the upload.
   */ loader;
    /**
   * The configuration of the adapter.
   */ options;
    xhr;
    /**
   * Creates a new adapter instance.
   */ constructor(loader, options){
        this.loader = loader;
        this.options = options;
    }
    /**
   * Starts the upload process.
   */ async upload() {
        const file = await this.loader.file;
        return new Promise((resolve, reject)=>{
            this._initRequest();
            this._initListeners(resolve, reject, file);
            this._sendRequest(file);
        });
    }
    /**
   * Aborts the upload process.
   */ abort() {
        if (this.xhr) this.xhr.abort();
    }
    /**
   * Initializes the `XMLHttpRequest` object using the URL specified as
   * uploadUrl in the editor's configuration.
   */ _initRequest() {
        const xhr = this.xhr = new XMLHttpRequest();
        xhr.open('POST', this.options.uploadUrl, true);
        xhr.responseType = 'json';
    }
    /**
   * Initializes XMLHttpRequest listeners
   *
   * @param resolve Callback function to be called when the request is successful.
   * @param reject Callback function to be called when the request cannot be completed.
   * @param file Native File object.
   */ _initListeners(resolve, reject, file) {
        const xhr = this.xhr;
        const loader = this.loader;
        const genericErrorText = `Couldn't upload file: ${file.name}.`;
        xhr.addEventListener('error', ()=>reject(genericErrorText));
        xhr.addEventListener('abort', ()=>reject());
        xhr.addEventListener('load', ()=>{
            const response = xhr.response;
            if (!response || response.error) return reject(response && response.error && response.error.message ? response.error.message : genericErrorText);
            const urls = response.url ? {
                default: response.url
            } : response.urls;
            // Resolve with the normalized `urls` property and pass the rest of the response
            // to allow customizing the behavior of features relying on the upload adapters.
            resolve({
                ...response,
                urls
            });
        });
        // Upload progress when it is supported.
        if (xhr.upload) {
            xhr.upload.addEventListener('progress', (evt)=>{
                if (evt.lengthComputable) {
                    loader.uploadTotal = evt.total;
                    loader.uploaded = evt.loaded;
                }
            });
        }
    }
    /**
   * Prepares the data and sends the request.
   *
   * @param file File instance to be uploaded.
   */ _sendRequest(file) {
        // Set headers if specified.
        const headers = this.options.headers || {};
        // Set FormData is specified.
        const params = this.options.params || {};
        // Use the withCredentials flag if specified.
        const withCredentials = this.options.withCredentials || false;
        for (const headerName of Object.keys(headers))this.xhr.setRequestHeader(headerName, headers[headerName]);
        this.xhr.withCredentials = withCredentials;
        // Prepare the form data.
        const data = new FormData();
        data.append('upload', file);
        // Append custom FormData
        for (const paramName of Object.keys(params)){
            if (params[paramName]) data.append(paramName, params[paramName]);
        }
        // Send the request.
        this.xhr.send(data);
    }
};

/**
 * The Upload adapter allows uploading images to an application running on your server using
 *
 * ```ts
 * ClassicEditor
 *   .create(document.querySelector('#editor'), {
 *     customUpload: {
 *       onUpload: (file) => {
 *         // do any upload stuff here with the JS-File-Object
 *         return Promise.resolve({ url: 'http://server/default-size.image.png' })
 *       },
 *       onAbort: () => {
 *         // abort the upload here. The promise from onImageUpload should be rejected after that.
 *       }
 *     }
 *   })
 *   .then( ... )
 *   .catch( ... );
 * ```
 */ class CustomUploadAdapter extends Plugin {
    static get requires() {
        return [
            FileRepository
        ];
    }
    static get pluginName() {
        return 'CustomUploadAdapter';
    }
    init() {
        const options = this.editor.config.get('customUpload');
        if (!options) return;
        if (!options.onUpload) {
            console.warn('custom-upload-adapter-missing-onupload');
            return;
        }
        this.editor.plugins.get(FileRepository).createUploadAdapter = (loader)=>{
            return new Adapter(loader, options);
        };
    }
}
/**
 * Upload adapter.
 */ class Adapter {
    /**
   * FileLoader instance to use during the upload.
   */ loader;
    /**
   * The configuration of the adapter.
   */ options;
    /**
   * Creates a new adapter instance.
   */ constructor(loader, options){
        this.loader = loader;
        this.options = options;
    }
    /**
   * Executes the upload process.
   * This method should return a promise that will resolve when data will be uploaded to server. Promise should be
   * resolved with an object containing information about uploaded file:
   *
   * ```json
   * {
   *   default: 'http://server/default-size.image.png'
   * }
   * ```
   *
   * Additionally, other image sizes can be provided:
   *
   * ```json
   * {
   *   default: 'http://server/default-size.image.png',
   *   '160': 'http://server/size-160.image.png',
   *   '500': 'http://server/size-500.image.png',
   *   '1000': 'http://server/size-1000.image.png',
   *   '1052': 'http://server/default-size.image.png'
   * }
   * ```
   *
   * You can also pass additional properties from the server. In this case you need to wrap URLs
   * in the `urls` object and pass additional properties along the `urls` property.
   *
   * ```json
   * {
   *   myCustomProperty: 'foo',
   *   urls: {
   *     default: 'http://server/default-size.image.png',
   *     '160': 'http://server/size-160.image.png',
   *     '500': 'http://server/size-500.image.png',
   *     '1000': 'http://server/size-1000.image.png',
   *     '1052': 'http://server/default-size.image.png'
   *   }
   * }
   * ```
   *
   * NOTE: When returning multiple images, the widest returned one should equal the default one. It is essential to
   * correctly set `width` attribute of the image. See this discussion:
   * https://github.com/ckeditor/ckeditor5-easy-image/issues/4 for more information.
   *
   * @returns Promise that should be resolved when data is uploaded.
   */ async upload() {
        const file = await this.loader.file;
        const response = await this.options.onUpload(file);
        const urls = response.url ? {
            default: response.url
        } : response.urls;
        return {
            ...response,
            urls
        };
    }
    /**
   * Aborts the upload process.
   */ abort() {
        if (this.options.onAbort) this.options.onAbort();
    }
}

export { CustomUploadAdapter, ImageUploadAdapter };
//# sourceMappingURL=index.js.map
