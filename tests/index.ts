import { expect } from 'chai'

import { CustomUploadAdapter as CustomUploadAdapterDll, ImageUploadAdapter as ImageUploadAdapterDll } from '../src/index.js'
import ImageUploadAdapter from '../src/imageUploadAdapter.js'
import CustomUploadAdapter from '../src/customUploadAdapter.js'

describe('CKEditor5 UploadAdapter DLL', () => {
  it('exports ImageUploadAdapter', () => {
    expect(ImageUploadAdapterDll).to.equal(ImageUploadAdapter)
  })

  it('exports CustomUploadAdapter', () => {
    expect(CustomUploadAdapterDll).to.equal(CustomUploadAdapter)
  })
})
