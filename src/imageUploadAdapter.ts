import { Plugin } from 'ckeditor5'
import { type FileLoader, FileRepository, type UploadAdapter, type UploadResponse } from 'ckeditor5'

import type { ImageUploadConfig } from './config.js'

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
 */
export default class ImageUploadAdapter extends Plugin {
  public static get requires() {
    return [FileRepository] as const
  }

  public static get pluginName() {
    return 'ImageUploadAdapter' as const
  }

  public init(): void {
    const options = this.editor.config.get('imageUpload')

    if (!options)
      return

    if (!options.uploadUrl) {
      console.warn('image-upload-adapter-missing-uploadurl')

      return
    }

    this.editor.plugins.get(FileRepository).createUploadAdapter = (loader) => {
      return new Adapter(loader, options)
    }
  }
}

/**
 * Upload adapter.
 */
class Adapter implements UploadAdapter {
  /**
   * FileLoader instance to use during the upload.
   */
  public loader: FileLoader

  /**
   * The configuration of the adapter.
   */
  public options: ImageUploadConfig

  private xhr?: XMLHttpRequest

  /**
   * Creates a new adapter instance.
   */
  constructor(loader: FileLoader, options: ImageUploadConfig) {
    this.loader = loader
    this.options = options
  }

  /**
   * Starts the upload process.
   */
  public async upload(): Promise<UploadResponse> {
    const file = await this.loader.file
    return new Promise<UploadResponse>((resolve, reject) => {
      this._initRequest()
      this._initListeners(resolve, reject, file!)
      this._sendRequest(file!)
    })
  }

  /**
   * Aborts the upload process.
   */
  public abort(): void {
    if (this.xhr)
      this.xhr.abort()
  }

  /**
   * Initializes the `XMLHttpRequest` object using the URL specified as
   * uploadUrl in the editor's configuration.
   */
  private _initRequest(): void {
    const xhr = this.xhr = new XMLHttpRequest()

    xhr.open('POST', this.options.uploadUrl, true)
    xhr.responseType = 'json'
  }

  /**
   * Initializes XMLHttpRequest listeners
   *
   * @param resolve Callback function to be called when the request is successful.
   * @param reject Callback function to be called when the request cannot be completed.
   * @param file Native File object.
   */
  private _initListeners(
    resolve: (result: UploadResponse) => void,
    reject: (message?: string) => void,
    file: File,
  ): void {
    const xhr = this.xhr!
    const loader = this.loader
    const genericErrorText = `Couldn't upload file: ${file.name}.`

    xhr.addEventListener('error', () => reject(genericErrorText))
    xhr.addEventListener('abort', () => reject())
    xhr.addEventListener('load', () => {
      const response = xhr.response

      if (!response || response.error)
        return reject(response && response.error && response.error.message ? response.error.message : genericErrorText)

      const urls = response.url ? { default: response.url } : response.urls

      // Resolve with the normalized `urls` property and pass the rest of the response
      // to allow customizing the behavior of features relying on the upload adapters.
      resolve({
        ...response,
        urls,
      })
    })

    // Upload progress when it is supported.
    if (xhr.upload) {
      xhr.upload.addEventListener('progress', (evt) => {
        if (evt.lengthComputable) {
          loader.uploadTotal = evt.total
          loader.uploaded = evt.loaded
        }
      })
    }
  }

  /**
   * Prepares the data and sends the request.
   *
   * @param file File instance to be uploaded.
   */
  private _sendRequest(file: File): void {
    // Set headers if specified.
    const headers = this.options.headers || {}

    // Set FormData is specified.
    const params = this.options.params || {}

    // Use the withCredentials flag if specified.
    const withCredentials = this.options.withCredentials || false

    for (const headerName of Object.keys(headers))
      this.xhr!.setRequestHeader(headerName, headers[headerName])

    this.xhr!.withCredentials = withCredentials

    // Prepare the form data.
    const data = new FormData()

    data.append('upload', file)
    // Append custom FormData
    for (const paramName of Object.keys(params)) {
      if (params[paramName])
        data.append(paramName, params[paramName])
    }

    // Send the request.
    this.xhr!.send(data)
  }
}
