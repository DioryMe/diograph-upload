import { DioryFactory } from '../app/lib/diory-factory'
import { Diory, DiographStore } from 'diograph-store'

// new Promise() requires this to work
declare var Promise: any;

describe('DioryFactory', () => {

  fit('createDioryFromFile', done => {
    // Stub three dependencies
    spyOn(DiographStore, "setAuthToken")
    spyOn(DioryFactory, "generateDioryDataFromImageFile").and.returnValue(new Promise(resolve => { resolve({ "name": "Diory name"}) }))
    spyOn(DiographStore, "createDiory").and.returnValue(new Promise(resolve => { resolve("diory") }))

    // Execute function and assert the return value
    DioryFactory.createDioryFromFile("file", "token").then(diory => {
      expect(diory).toEqual("jeejee")
      done()
    })
  })

  it('generateDioryDataFromImageFile', done => {
    DioryFactory.generateDioryDataFromImageFile("file", "token").then(dioryData => {
      expect(dioryData).toEqual({})
      done()
    })
  })

  it('getBackground', done => {
    DioryFactory.getBackground("file", "token").then(background => {
      expect(background).toEqual("http://s3.amazon.com/diory/aienmgosf2og3.jpg")
      done()
    })
  })

})
