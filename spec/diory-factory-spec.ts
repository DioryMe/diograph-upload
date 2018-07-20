import { DioryFactory } from '../app/lib/diory-factory'
import { Diory, DiographStore } from 'diograph-store'

// new Promise() requires this to work
declare var Promise: any;

describe('DioryFactory', () => {

  let genericPromise = (content={}) => {
    return new Promise(resolve => { resolve(content) })
  }

  let uploadUrlResponseObject, exifData

  beforeEach(() => {
    // Stub all the dependencies:

    // 1. DiographStore
    spyOn(DiographStore, "setAuthToken")
    spyOn(DiographStore, "createDiory").and.returnValue(genericPromise())

    // 2. DiographServer presigned-upload-url endpoint
    uploadUrlResponseObject = {
      "data": {
        "upload-url": "http://upload.url/",
        "public-url": "http://public.url/"
      }
    }
    spyOn(DioryFactory, "getFromEndpoint").and.returnValue(genericPromise(uploadUrlResponseObject))

    // 3. EXIF data extraction
    exifData = {
      "date": "123123",
      "latitude": "67.432",
      "longitude": "32.345"
    }
    spyOn(DioryFactory, "extractEXIFData").and.returnValue(genericPromise(exifData))

    // 4. S3 upload with PUT request
    let S3ResponseObject = { "ok": true }
    spyOn(DioryFactory, "uploadToS3").and.returnValue(genericPromise(S3ResponseObject))
  })

  it('createDioryFromFile', done => {
    // Execute function and assert the return value
    DioryFactory.createDioryFromFile("file", "token").then(diory => {
      expect(diory).toEqual("jeejee")
      done()
    })
  })




  // PRIVATE METHOD TESTS (should be unnecessary...)

  it('generateDioryDataFromImageFile', done => {
    let file = {name: "New Diory from Image file"}
    DioryFactory.generateDioryDataFromImageFile(file, "token").then(dioryData => {
      let expectedDioryData = exifData
      expectedDioryData["name"] = file.name
      expectedDioryData["type"] = "image"
      expectedDioryData["background"] = uploadUrlResponseObject.data["public-url"]
      expect(dioryData).toEqual(expectedDioryData)
      done()
    })
  })

  it('getBackground', done => {
    DioryFactory.getBackground("file", "token").then(background => {
      expect(background).toEqual(uploadUrlResponseObject.data["public-url"])
      done()
    })
  })

})
