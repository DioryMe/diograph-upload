import { DioryFactory } from '../app/lib/diory-factory'
import { Diory, DiographStore } from 'diograph-store'

// new Promise() requires this to work
declare var Promise: any;

describe('DioryFactory', () => {

  let genericPromise = (content={}) => {
    return new Promise(resolve => { resolve(content) })
  }

  let file = {name: "New Diory from Image file"}
  let token = "cat4321"
  let uploadUrlResponseObject, exifData
  let createDiorySpy, getFromEndpointSpy, extractEXIFDataSpy, uploadToS3Spy
  let createDioryFromFilePromise

  beforeEach(() => {
    // Stub all the dependencies:

    // 1. DiographStore
    spyOn(DiographStore, "setAuthToken")
    createDiorySpy = spyOn(DiographStore, "createDiory").and.returnValue(genericPromise())

    // 2. DiographServer presigned-upload-url endpoint
    uploadUrlResponseObject = {
      "data": {
        "upload-url": "http://upload.url/",
        "public-url": "http://public.url/"
      }
    }
    getFromEndpointSpy = spyOn(DioryFactory, "getFromEndpoint").and.returnValue(genericPromise(uploadUrlResponseObject))

    // 3. EXIF data extraction
    exifData = {
      "date": "123123",
      "latitude": "67.432",
      "longitude": "32.345"
    }
    extractEXIFDataSpy = spyOn(DioryFactory, "extractEXIFData").and.returnValue(genericPromise(exifData))

    // 4. S3 upload with PUT request
    let S3ResponseObject = { "ok": true }
    uploadToS3Spy = spyOn(DioryFactory, "uploadToS3").and.returnValue(genericPromise(S3ResponseObject))


    // Generic execution
    createDioryFromFilePromise = DioryFactory.createDioryFromFile(file, token)
  })

  describe('createDioryFromFile', () => {

    it('returns "jeejee"', done => {
      createDioryFromFilePromise.then(diory => {
        expect(diory).toEqual("jeejee")
        done()
      })
    })

    it('calls DiographStore.createDiory with correct arguments', done => {
      createDioryFromFilePromise.then(diory => {
        let expectedDioryData = exifData
        expectedDioryData["name"] = file.name
        expectedDioryData["type"] = "image"
        expectedDioryData["background"] = uploadUrlResponseObject.data["public-url"]
        expect(createDiorySpy.calls.argsFor(0)).toEqual([expectedDioryData])
        done()
      })
    })
  })


  // PRIVATE METHOD TESTS (should be unnecessary...)

  it('getBackground', done => {
    DioryFactory.getBackground("file", "token").then(background => {
      expect(background).toEqual(uploadUrlResponseObject.data["public-url"])
      done()
    })
  })

})
