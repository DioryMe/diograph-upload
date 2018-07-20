import { DioryFactory } from '../app/lib/diory-factory'
import { Diory, DiographStore } from 'diograph-store'

describe('DioryFactory', () => {

  it('createDioryFromFile', done => {
    DioryFactory.createDioryFromFile("file", "token").then(diory => {
      expect(diory).toEqual(jasmine.any(Diory))
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
