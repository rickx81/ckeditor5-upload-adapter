import type { CustomUploadAdapter, CustomUploadConfig, ImageUploadAdapter, ImageUploadConfig } from './index.js'

declare module '@ckeditor/ckeditor5-core' {
  interface EditorConfig {
    /**
     * The configuration of the ImageUploadConfig
     */
    imageUpload?: ImageUploadConfig

    /**
     * The configuration of the CustomUploadConfig
     */
    customUpload?: CustomUploadConfig
  }

  interface PluginsMap {
    [ImageUploadAdapter.pluginName]: ImageUploadConfig
    [CustomUploadAdapter.pluginName]: CustomUploadConfig
  }
}
