@rickx/ckeditor5-upload-adapter
============================

This package was created by the [ckeditor5-package-generator](https://www.npmjs.com/package/ckeditor5-package-generator) package.
# ckeditor5-upload-adapter

The upload adapter plugin for ckeditor5.

## Quick start

First, install the build from npm:

```bash
pnpm i @rickx/ckeditor5-upload-adapter
# or
yarn add @rickx/ckeditor5-upload-adapter
# or
npm i @rickx/ckeditor5-upload-adapter
```

### [How to use your plugin in new installation methods?](https://ckeditor.com/docs/ckeditor5/latest/updating/nim-migration/custom-plugins.html#how-to-use-your-plugin-in-new-installation-methods)

Use ImageUploadAdapter in your application:

```js
import { ImageUploadAdapter } from '@rickx/ckeditor5-upload-adapter'
```

Add ImageUploadAdapter to your editor:

```js
ClassicEditor
  .create(document.querySelector('#editor'), {
    plugins: [
      /* ..., */
      ImageUploadAdapter, // add it to your plugins array
    ],
    imageUpload: {
      // The URL that the images are uploaded to.
      uploadUrl: 'http://example.com',
      // Enable the XMLHttpRequest.withCredentials property.
      withCredentials: true,
      // Headers sent along with the XMLHttpRequest to the upload server.
      headers: {
        'X-CSRF-TOKEN': 'CSRF-Token',
        'Authorization': 'Bearer <JSON Web Token>',
      },
      // Params sent along with the XMLHttpRequest to the upload server.
      params: {
        foo: 'bar',
      }
    },
  })
  .then(/* ... */)
  .catch(/* ... */)
```

Use CustomUploadAdapter in your application:

```js
import { CustomUploadAdapter } from '@rickx/ckeditor5-upload-adapter'
```

Add CustomUploadAdapter to your editor:

```js
ClassicEditor
  .create(document.querySelector('#editor'), {
    plugins: [
      /* ..., */
      CustomUploadAdapter, // add it to your plugins array
    ],
    customUpload: {
      onUpload: (file) => {
        return Promise.resolve({ url: 'http://server/default-size.image.png' })
      },
      onAbort: () => {
        console.log('Upload abort')
      }
    }
  })
  .then(/* ... */)
  .catch(/* ... */)
```

## License

The `@rickx/ckeditor5-upload-adapter` package is available under [MIT license](https://opensource.org/licenses/MIT).
