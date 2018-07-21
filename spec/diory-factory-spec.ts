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
  let setAuthTokenSpy, createDiorySpy, getFromEndpointSpy, extractEXIFDataSpy, uploadToS3Spy
  let createDioryFromFilePromise

  describe('createDioryFromFile', () => {

    beforeEach(() => {
      // Stub all the dependencies:

      // 1. DiographStore
      setAuthTokenSpy = spyOn(DiographStore, "setAuthToken")
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

    it('returns "jeejee"', done => {
      createDioryFromFilePromise.then(diory => {
        expect(diory).toEqual("jeejee")
        done()
      })
    })

    it('calls DiographStore.setAuthtoken with correct arguments', done => {
      createDioryFromFilePromise.then(diory => {
        expect(setAuthTokenSpy.calls.count()).toEqual(1)
        expect(setAuthTokenSpy.calls.argsFor(0)).toEqual([token])
        done()
      })
    })

    it('calls DiographStore.createDiory with correct arguments', done => {
      createDioryFromFilePromise.then(diory => {
        let expectedDioryData = exifData
        expectedDioryData["name"] = file.name
        expectedDioryData["type"] = "image"
        expectedDioryData["background"] = uploadUrlResponseObject.data["public-url"]

        expect(createDiorySpy.calls.count()).toEqual(1)
        expect(createDiorySpy.calls.argsFor(0)).toEqual([expectedDioryData])

        done()
      })
    })

    it('calls DioryFactory.getFromEndpoint with correct arguments', done => {
      createDioryFromFilePromise.then(diory => {
        expect(getFromEndpointSpy.calls.count()).toEqual(1)
        let endpoint = "http://localhost:3000/v1/presigned-upload-url"
        expect(getFromEndpointSpy.calls.argsFor(0)).toEqual([endpoint, token])
        done()
      })
    })

    it('calls DioryFactory.extractEXIFData with correct arguments', done => {
      createDioryFromFilePromise.then(diory => {
        expect(extractEXIFDataSpy.calls.count()).toEqual(1)
        expect(extractEXIFDataSpy.calls.argsFor(0)).toEqual([file])
        done()
      })
    })

    it('calls DioryFactory.uploadToS3 with correct arguments', done => {
      createDioryFromFilePromise.then(diory => {
        expect(uploadToS3Spy.calls.count()).toEqual(1)
        expect(uploadToS3Spy.calls.argsFor(0)).toEqual([uploadUrlResponseObject.data["upload-url"], file])
        done()
      })
    })


  })


  // extractEXIFData tests
  describe('DioryFactory.extractEXIFData', () => {

    it('returns empty object {} if no EXIFData available', done => {
      let file = {name: "filename.jpg"}
      DioryFactory.extractEXIFData(file).then(exifData => {
        expect(exifData).toEqual({})
        done()
      })
    })

  })

})
