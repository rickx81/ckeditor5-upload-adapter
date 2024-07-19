import { expect } from 'chai'
import { ClassicEditor } from 'ckeditor5'

import { ImageUploadAdapter } from '../src/index.js'

describe('ImageUploadAdapter', () => {
  it('should be named', () => {
    expect(ImageUploadAdapter.pluginName).to.equal('ImageUploadAdapter')
  })

  describe('init()', () => {
    let domElement: HTMLElement, editor: ClassicEditor

    beforeEach(async () => {
      domElement = document.createElement('div')
      document.body.appendChild(domElement)

      editor = await ClassicEditor.create(domElement, {
        plugins: [
          ImageUploadAdapter,
        ],
      })
    })

    afterEach(() => {
      domElement.remove()
      return editor.destroy()
    })

    it('should load ImageUploadAdapter', () => {
      const myPlugin = editor.plugins.get('ImageUploadAdapter')

      expect(myPlugin).to.be.an.instanceof(ImageUploadAdapter)
    })
  })
})
