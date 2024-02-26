import { Plugin } from '@ckeditor/ckeditor5-core'
import { type FileLoader, FileRepository, type UploadAdapter, type UploadResponse } from 'ckeditor5/src/upload'
import type { CustomUploadConfig } from './config.js'

/**
 * The Upload adapter allows uploading images to an application running on your server using
 *
 * ```ts
 * ClassicEditor
 *   .create(document.querySelector('#editor'), {
 *     hookUpload: {
 *       onUpload: (file) => {
 *         // do any upload stuff here with the JS-File-Object
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
  public static get requires() {
    return [FileRepository] as const
  }

  public static get pluginName() {
    return 'CustomUploadAdapter' as const
  }

  public init(): void {
    const options = this.editor.config.get('customUpload')

    if (!options)
      return

    if (!options.onUpload) {
      console.warn('hook-upload-adapter-missing-uploadurl')

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
  public options: CustomUploadConfig

  /**
   * Creates a new adapter instance.
   */
  constructor(loader: FileLoader, options: CustomUploadConfig) {
    this.loader = loader
    this.options = options
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
   */
  public async upload(): Promise<UploadResponse> {
    const file = await this.loader.file
    const response = await this.options.onUpload(file!)

    const urls = response.url ? { default: response.url } : response.urls
    return {
      ...response,
      urls,
    }
  }

  /**
   * Aborts the upload process.
   */
  public abort(): void {
    if (this.options.onAbort)
      this.options.onAbort()
  }
}
