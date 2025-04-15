import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { ClassicEditor } from 'ckeditor5'

import { CustomUploadAdapter } from '../src/index.js'

describe('CustomUploadAdapter', () => {
  it('should be named', () => {
    expect(CustomUploadAdapter.pluginName).to.equal('CustomUploadAdapter')
  })

  describe('init()', () => {
    let domElement: HTMLElement, editor: ClassicEditor

    beforeEach(async () => {
      domElement = document.createElement('div')
      document.body.appendChild(domElement)

      editor = await ClassicEditor.create(domElement, {
        licenseKey: 'GPL',
        plugins: [
          CustomUploadAdapter,
        ],
      })
    })

    afterEach(() => {
      domElement.remove()
      return editor.destroy()
    })

    it('should load CustomUploadAdapter', () => {
      const myPlugin = editor.plugins.get('CustomUploadAdapter')

      expect(myPlugin).to.be.an.instanceof(CustomUploadAdapter)
    })
  })
})
