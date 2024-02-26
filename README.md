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
        text: new Blob(['Another text'], { type: 'text/plain' })
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
        return Promise.resolve('http://server/default-size.image.png')
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

Licensed under the terms of [GNU General Public License Version 2 or later](http://www.gnu.org/licenses/gpl.html).
